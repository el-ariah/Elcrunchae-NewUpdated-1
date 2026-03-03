<?php
/**
 * Reviews API
 * GET  /api/reviews.php?product_id=123  — list reviews for a product
 * POST /api/reviews.php                 — create a review (auth required)
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetReviews();
        break;
    case 'POST':
        handleCreateReview();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGetReviews() {
    $productId = (int)($_GET['product_id'] ?? 0);
    if (!$productId) {
        http_response_code(400);
        echo json_encode(['error' => 'product_id is required']);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 50");
    $stmt->execute([$productId]);
    $reviews = $stmt->fetchAll();

    echo json_encode(['reviews' => $reviews]);
}

function handleCreateReview() {
    $user = requireAuth();
    $data = getRequestBody();

    $productId = (int)($data['product_id'] ?? 0);
    $rating = (int)($data['rating'] ?? 0);
    $reviewText = trim($data['review_text'] ?? '');
    $reviewerName = trim($data['reviewer_name'] ?? '');

    if (!$productId || $rating < 1 || $rating > 5 || !$reviewerName) {
        http_response_code(400);
        echo json_encode(['error' => 'product_id, rating (1-5), and reviewer_name are required']);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare("
        INSERT INTO reviews (user_id, product_id, rating, review_text, reviewer_name, created_at)
        VALUES (?, ?, ?, ?, ?, NOW())
    ");
    $stmt->execute([$user['id'], $productId, $rating, $reviewText, $reviewerName]);

    $id = (int)$db->lastInsertId();
    $stmt = $db->prepare("SELECT * FROM reviews WHERE id = ?");
    $stmt->execute([$id]);
    $review = $stmt->fetch();

    echo json_encode(['review' => $review]);
}