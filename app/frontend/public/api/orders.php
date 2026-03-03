<?php
/**
 * Orders API
 * GET /api/orders.php          — list user's orders
 * GET /api/orders.php?id=123   — get order items for a specific order
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$user = requireAuth();
$orderId = (int)($_GET['id'] ?? 0);

$db = getDB();

if ($orderId) {
    // Get order items
    $stmt = $db->prepare("
        SELECT oi.* FROM order_items oi
        JOIN orders o ON o.id = oi.order_id
        WHERE oi.order_id = ? AND o.user_id = ?
    ");
    $stmt->execute([$orderId, $user['id']]);
    $items = $stmt->fetchAll();
    echo json_encode(['items' => $items]);
} else {
    // List orders
    $stmt = $db->prepare("
        SELECT id, status, total_amount as total, shipping_fee, shipping_name, shipping_city,
               payment_status, razorpay_order_id, created_at
        FROM orders
        WHERE user_id = ?
        ORDER BY created_at DESC
        LIMIT 50
    ");
    $stmt->execute([$user['id']]);
    $orders = $stmt->fetchAll();
    echo json_encode(['orders' => $orders]);
}