<?php
/**
 * Reviews API — El Crunchae
 * GET  /api/reviews.php?product_id=xxx  — List reviews for a product
 * POST /api/reviews.php                 — Create a review (auth required)
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        listReviews();
        break;
    case 'POST':
        createReview();
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listReviews(): void {
    $productId = (int)($_GET['product_id'] ?? 0);
    if (!$productId) {
        jsonResponse(['error' => 'product_id is required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC LIMIT 50");
    $stmt->execute([$productId]);
    $reviews = $stmt->fetchAll();

    foreach ($reviews as &$r) {
        $r['id'] = (int)$r['id'];
        $r['user_id'] = (int)$r['user_id'];
        $r['product_id'] = (int)$r['product_id'];
        $r['rating'] = (int)$r['rating'];
    }

    jsonResponse(['reviews' => $reviews]);
}

function createReview(): void {
    $user = requireAuth();
    $body = getRequestBody();

    $productId = (int)($body['product_id'] ?? 0);
    $rating = (int)($body['rating'] ?? 0);
    $reviewText = trim($body['review_text'] ?? '');
    $reviewerName = trim($body['reviewer_name'] ?? 'Anonymous');

    if (!$productId || $rating < 1 || $rating > 5) {
        jsonResponse(['error' => 'Valid product_id and rating (1-5) are required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("INSERT INTO reviews (user_id, product_id, rating, review_text, reviewer_name) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute([$user['user_id'], $productId, $rating, $reviewText, $reviewerName]);

    $id = (int)$db->lastInsertId();
    jsonResponse([
        'review' => [
            'id' => $id,
            'user_id' => $user['user_id'],
            'product_id' => $productId,
            'rating' => $rating,
            'review_text' => $reviewText,
            'reviewer_name' => $reviewerName,
        ],
    ], 201);
}