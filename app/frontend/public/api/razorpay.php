<?php
/**
 * Razorpay Payment API
 * POST /api/razorpay.php?action=create_order   — create Razorpay order
 * POST /api/razorpay.php?action=verify_payment  — verify payment signature
 */
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'create_order':
        handleCreateOrder();
        break;
    case 'verify_payment':
        handleVerifyPayment();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action. Use: create_order or verify_payment']);
}

function handleCreateOrder() {
    $user = requireAuth();
    $data = getRequestBody();

    $items = $data['items'] ?? [];
    if (empty($items)) {
        http_response_code(400);
        echo json_encode(['error' => 'Cart items are required']);
        return;
    }

    // Calculate total
    $subtotal = 0;
    foreach ($items as $item) {
        $subtotal += ($item['unit_price'] ?? 0) * ($item['quantity'] ?? 1);
    }
    $shippingFee = $subtotal >= 499 ? 0 : 49;
    $total = $subtotal + $shippingFee;
    $totalPaise = (int)($total * 100);

    $db = getDB();

    // Create order in database
    $stmt = $db->prepare("
        INSERT INTO orders (user_id, status, total_amount, shipping_fee, shipping_name,
            shipping_address, shipping_city, shipping_state, shipping_pincode, shipping_phone,
            payment_status, created_at, updated_at)
        VALUES (?, 'pending', ?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW(), NOW())
    ");
    $stmt->execute([
        $user['id'],
        $total,
        $shippingFee,
        $data['shipping_name'] ?? '',
        $data['shipping_address'] ?? '',
        $data['shipping_city'] ?? '',
        $data['shipping_state'] ?? '',
        $data['shipping_pincode'] ?? '',
        $data['shipping_phone'] ?? '',
    ]);
    $orderId = (int)$db->lastInsertId();

    // Insert order items
    $stmtItem = $db->prepare("
        INSERT INTO order_items (order_id, product_id, product_name, product_image, quantity, unit_price)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    foreach ($items as $item) {
        $stmtItem->execute([
            $orderId,
            $item['product_id'] ?? 0,
            $item['product_name'] ?? '',
            $item['product_image'] ?? '',
            $item['quantity'] ?? 1,
            $item['unit_price'] ?? 0,
        ]);
    }

    // Create Razorpay order via API
    $razorpayKeyId = RAZORPAY_KEY_ID;
    $razorpayKeySecret = RAZORPAY_KEY_SECRET;

    if (!$razorpayKeyId || !$razorpayKeySecret) {
        http_response_code(500);
        echo json_encode(['error' => 'Razorpay credentials not configured']);
        return;
    }

    $razorpayData = json_encode([
        'amount' => $totalPaise,
        'currency' => 'INR',
        'receipt' => "order_$orderId",
        'notes' => [
            'order_id' => (string)$orderId,
            'user_id' => (string)$user['id'],
        ],
    ]);

    $ch = curl_init('https://api.razorpay.com/v1/orders');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => $razorpayData,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_USERPWD => "$razorpayKeyId:$razorpayKeySecret",
        CURLOPT_TIMEOUT => 30,
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create Razorpay order', 'details' => $response]);
        return;
    }

    $razorpayOrder = json_decode($response, true);
    $razorpayOrderId = $razorpayOrder['id'] ?? '';

    // Save Razorpay order ID
    $stmt = $db->prepare("UPDATE orders SET razorpay_order_id = ?, updated_at = NOW() WHERE id = ?");
    $stmt->execute([$razorpayOrderId, $orderId]);

    echo json_encode([
        'order_id' => $orderId,
        'razorpay_order_id' => $razorpayOrderId,
        'razorpay_key_id' => $razorpayKeyId,
        'amount' => $totalPaise,
        'currency' => 'INR',
    ]);
}

function handleVerifyPayment() {
    $user = requireAuth();
    $data = getRequestBody();

    $razorpayOrderId = $data['razorpay_order_id'] ?? '';
    $razorpayPaymentId = $data['razorpay_payment_id'] ?? '';
    $razorpaySignature = $data['razorpay_signature'] ?? '';
    $orderId = (int)($data['order_id'] ?? 0);

    if (!$razorpayOrderId || !$razorpayPaymentId || !$razorpaySignature || !$orderId) {
        http_response_code(400);
        echo json_encode(['error' => 'All payment verification fields are required']);
        return;
    }

    // Verify signature
    $expectedSignature = hash_hmac('sha256', "$razorpayOrderId|$razorpayPaymentId", RAZORPAY_KEY_SECRET);

    if (!hash_equals($expectedSignature, $razorpaySignature)) {
        // Update order as failed
        $db = getDB();
        $stmt = $db->prepare("UPDATE orders SET payment_status = 'failed', updated_at = NOW() WHERE id = ? AND user_id = ?");
        $stmt->execute([$orderId, $user['id']]);

        http_response_code(400);
        echo json_encode([
            'status' => 'failed',
            'order_id' => $orderId,
            'payment_status' => 'failed',
            'message' => 'Payment signature verification failed',
        ]);
        return;
    }

    // Update order as paid
    $db = getDB();
    $stmt = $db->prepare("
        UPDATE orders SET status = 'paid', payment_status = 'paid',
            razorpay_payment_id = ?, updated_at = NOW()
        WHERE id = ? AND user_id = ?
    ");
    $stmt->execute([$razorpayPaymentId, $orderId, $user['id']]);

    echo json_encode([
        'status' => 'paid',
        'order_id' => $orderId,
        'payment_status' => 'paid',
        'message' => 'Payment verified successfully',
    ]);
}