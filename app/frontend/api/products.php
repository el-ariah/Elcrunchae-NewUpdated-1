<?php
/**
 * Products API — El Crunchae
 * GET    /api/products.php              — List all active products
 * GET    /api/products.php?slug=xxx     — Get single product by slug
 * POST   /api/products.php              — Create product (admin only)
 * PUT    /api/products.php?id=xxx       — Update product (admin only)
 * DELETE /api/products.php?id=xxx       — Delete product (admin only)
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $slug = $_GET['slug'] ?? null;
        if ($slug) {
            getProductBySlug($slug);
        } else {
            listProducts();
        }
        break;
    case 'POST':
        createProduct();
        break;
    case 'PUT':
        updateProduct();
        break;
    case 'DELETE':
        deleteProduct();
        break;
    default:
        jsonResponse(['error' => 'Method not allowed'], 405);
}

function listProducts(): void {
    $db = getDB();
    $category = $_GET['category'] ?? null;

    if ($category) {
        $stmt = $db->prepare("SELECT * FROM products WHERE is_active = 1 AND category = ? ORDER BY sort_order ASC");
        $stmt->execute([$category]);
    } else {
        $stmt = $db->query("SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC");
    }

    $products = $stmt->fetchAll();

    // Parse JSON fields
    foreach ($products as &$p) {
        $p['id'] = (int)$p['id'];
        $p['price'] = (float)$p['price'];
        $p['original_price'] = $p['original_price'] ? (float)$p['original_price'] : null;
        $p['stock_quantity'] = (int)$p['stock_quantity'];
        $p['is_active'] = (bool)$p['is_active'];
        $p['sort_order'] = (int)$p['sort_order'];
        if (is_string($p['nutrition_highlights'])) {
            $p['nutrition_highlights'] = json_decode($p['nutrition_highlights'], true) ?? [];
        }
    }

    jsonResponse(['products' => $products]);
}

function getProductBySlug(string $slug): void {
    $db = getDB();
    $stmt = $db->prepare("SELECT * FROM products WHERE slug = ? LIMIT 1");
    $stmt->execute([$slug]);
    $product = $stmt->fetch();

    if (!$product) {
        jsonResponse(['error' => 'Product not found'], 404);
    }

    $product['id'] = (int)$product['id'];
    $product['price'] = (float)$product['price'];
    $product['original_price'] = $product['original_price'] ? (float)$product['original_price'] : null;
    $product['stock_quantity'] = (int)$product['stock_quantity'];
    $product['is_active'] = (bool)$product['is_active'];
    $product['sort_order'] = (int)$product['sort_order'];
    if (is_string($product['nutrition_highlights'])) {
        $product['nutrition_highlights'] = json_decode($product['nutrition_highlights'], true) ?? [];
    }

    jsonResponse(['product' => $product]);
}

function createProduct(): void {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        jsonResponse(['error' => 'Admin access required'], 403);
    }

    $body = getRequestBody();
    $db = getDB();

    $stmt = $db->prepare("
        INSERT INTO products (slug, name, category, category_label, description, long_description, weight, price, original_price, image, box_image, nutrition_highlights, shelf_life, how_to_use, badge, sku, stock_quantity, is_active, sort_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");

    $highlights = $body['nutrition_highlights'] ?? [];
    if (is_array($highlights)) {
        $highlights = json_encode($highlights);
    }

    $stmt->execute([
        $body['slug'] ?? '',
        $body['name'] ?? '',
        $body['category'] ?? '',
        $body['category_label'] ?? '',
        $body['description'] ?? '',
        $body['long_description'] ?? '',
        $body['weight'] ?? '',
        (float)($body['price'] ?? 0),
        isset($body['original_price']) ? (float)$body['original_price'] : null,
        $body['image'] ?? '',
        $body['box_image'] ?? '',
        $highlights,
        $body['shelf_life'] ?? '',
        $body['how_to_use'] ?? '',
        $body['badge'] ?? '',
        $body['sku'] ?? '',
        (int)($body['stock_quantity'] ?? 0),
        isset($body['is_active']) ? (int)$body['is_active'] : 1,
        (int)($body['sort_order'] ?? 0),
    ]);

    $id = (int)$db->lastInsertId();
    jsonResponse(['id' => $id, 'message' => 'Product created'], 201);
}

function updateProduct(): void {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        jsonResponse(['error' => 'Admin access required'], 403);
    }

    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        jsonResponse(['error' => 'Product ID required'], 400);
    }

    $body = getRequestBody();
    $db = getDB();

    $fields = [];
    $values = [];

    $allowedFields = ['slug', 'name', 'category', 'category_label', 'description', 'long_description', 'weight', 'price', 'original_price', 'image', 'box_image', 'nutrition_highlights', 'shelf_life', 'how_to_use', 'badge', 'sku', 'stock_quantity', 'is_active', 'sort_order'];

    foreach ($allowedFields as $field) {
        if (array_key_exists($field, $body)) {
            $val = $body[$field];
            if ($field === 'nutrition_highlights' && is_array($val)) {
                $val = json_encode($val);
            }
            $fields[] = "$field = ?";
            $values[] = $val;
        }
    }

    if (empty($fields)) {
        jsonResponse(['error' => 'No fields to update'], 400);
    }

    $values[] = $id;
    $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);

    jsonResponse(['message' => 'Product updated']);
}

function deleteProduct(): void {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        jsonResponse(['error' => 'Admin access required'], 403);
    }

    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        jsonResponse(['error' => 'Product ID required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['message' => 'Product deleted']);
}