<?php
/**
 * Orders API — El Crunchae
 * GET  /api/orders.php              — List user's orders
 * GET  /api/orders.php?id=xxx       — Get order details with items
 * POST /api/orders.php              — Create order (auth required)
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $orderId = $_GET['id'] ?? null;
        if ($orderId) {
            getOrderDetails((int)$orderId);
        } else {
            listOrders();
        }
        break;
    case 'POST':
        createOrder();
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listOrders(): void {
    $user = requireAuth();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50");
    $stmt->execute([$user['user_id']]);
    $orders = $stmt->fetchAll();

    foreach ($orders as &$o) {
        $o['id'] = (int)$o['id'];
        $o['user_id'] = (int)$o['user_id'];
        $o['subtotal'] = (float)$o['subtotal'];
        $o['shipping_fee'] = (float)$o['shipping_fee'];
        $o['total'] = (float)$o['total'];
    }

    jsonResponse(['orders' => $orders]);
}

function getOrderDetails(int $orderId): void {
    $user = requireAuth();
    $db = getDB();

    $stmt = $db->prepare("SELECT * FROM orders WHERE id = ? AND user_id = ?");
    $stmt->execute([$orderId, $user['user_id']]);
    $order = $stmt->fetch();

    if (!$order) {
        jsonResponse(['error' => 'Order not found'], 404);
    }

    $stmt = $db->prepare("SELECT * FROM order_items WHERE order_id = ?");
    $stmt->execute([$orderId]);
    $items = $stmt->fetchAll();

    foreach ($items as &$i) {
        $i['id'] = (int)$i['id'];
        $i['order_id'] = (int)$i['order_id'];
        $i['product_id'] = $i['product_id'] ? (int)$i['product_id'] : null;
        $i['quantity'] = (int)$i['quantity'];
        $i['unit_price'] = (float)$i['unit_price'];
        $i['total_price'] = (float)$i['total_price'];
    }

    $order['id'] = (int)$order['id'];
    $order['subtotal'] = (float)$order['subtotal'];
    $order['shipping_fee'] = (float)$order['shipping_fee'];
    $order['total'] = (float)$order['total'];

    jsonResponse(['order' => $order, 'items' => $items]);
}

function createOrder(): void {
    $user = requireAuth();
    $body = getRequestBody();
    $db = getDB();

    $items = $body['items'] ?? [];
    if (empty($items)) {
        jsonResponse(['error' => 'Order must contain at least one item'], 400);
    }

    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1);
    }

    $shippingFee = $subtotal >= 500 ? 0 : 50;
    $total = $subtotal + $shippingFee;

    $db->beginTransaction();

    try {
        $stmt = $db->prepare("
            INSERT INTO orders (user_id, status, payment_status, subtotal, shipping_fee, total, shipping_name, shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_phone)
            VALUES (?, 'pending', 'pending', ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $user['user_id'],
            $subtotal,
            $shippingFee,
            $total,
            $body['shipping_name'] ?? '',
            $body['shipping_address'] ?? '',
            $body['shipping_city'] ?? '',
            $body['shipping_state'] ?? '',
            $body['shipping_pincode'] ?? '',
            $body['shipping_phone'] ?? '',
        ]);

        $orderId = (int)$db->lastInsertId();

        $stmtItem = $db->prepare("
            INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price, total_price)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");

        foreach ($items as $item) {
            $qty = (int)($item['quantity'] ?? 1);
            $unitPrice = (float)($item['unit_price'] ?? 0);
            $stmtItem->execute([
                $orderId,
                $item['product_id'] ?? null,
                $item['product_name'] ?? '',
                $item['product_image'] ?? '',
                $qty,
                $unitPrice,
                $unitPrice * $qty,
            ]);
        }

        $db->commit();

        jsonResponse([
            'order' => [
                'id' => $orderId,
                'total' => $total,
                'status' => 'pending',
            ],
        ], 201);
    } catch (Exception $e) {
        $db->rollBack();
        jsonResponse(['error' => 'Failed to create order'], 500);
    }
}