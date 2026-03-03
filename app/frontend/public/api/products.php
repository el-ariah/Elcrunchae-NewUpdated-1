<?php
/**
 * Products API
 * GET    /api/products.php              — list all active products
 * GET    /api/products.php?slug=xxx     — get single product by slug
 * POST   /api/products.php              — create product (admin)
 * PUT    /api/products.php?id=123       — update product (admin)
 * DELETE /api/products.php?id=123       — delete product (admin)
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGet();
        break;
    case 'POST':
        handleCreate();
        break;
    case 'PUT':
        handleUpdate();
        break;
    case 'DELETE':
        handleDelete();
        break;
    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
}

function handleGet() {
    $db = getDB();
    $slug = $_GET['slug'] ?? '';

    if ($slug) {
        $stmt = $db->prepare("SELECT * FROM products WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $product = $stmt->fetch();
        if (!$product) {
            http_response_code(404);
            echo json_encode(['error' => 'Product not found']);
            return;
        }
        $product['is_active'] = (bool)$product['is_active'];
        echo json_encode(['product' => $product]);
    } else {
        $stmt = $db->query("SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC, id ASC");
        $products = $stmt->fetchAll();
        foreach ($products as &$p) {
            $p['is_active'] = (bool)$p['is_active'];
        }
        echo json_encode(['products' => $products]);
    }
}

function handleCreate() {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        return;
    }

    $data = getRequestBody();
    $db = getDB();

    $stmt = $db->prepare("
        INSERT INTO products (slug, name, category, category_label, description, long_description,
            weight, price, original_price, image, box_image, nutrition_highlights, shelf_life,
            how_to_use, badge, sku, stock_quantity, is_active, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    $stmt->execute([
        $data['slug'] ?? '',
        $data['name'] ?? '',
        $data['category'] ?? 'fruits',
        $data['category_label'] ?? 'Fruits',
        $data['description'] ?? '',
        $data['long_description'] ?? '',
        $data['weight'] ?? '',
        $data['price'] ?? 0,
        $data['original_price'] ?? 0,
        $data['image'] ?? '',
        $data['box_image'] ?? '',
        $data['nutrition_highlights'] ?? '[]',
        $data['shelf_life'] ?? '',
        $data['how_to_use'] ?? '',
        $data['badge'] ?? '',
        $data['sku'] ?? '',
        $data['stock_quantity'] ?? 0,
        $data['is_active'] ?? true,
        $data['sort_order'] ?? 0,
    ]);

    $id = (int)$db->lastInsertId();
    echo json_encode(['id' => $id, 'message' => 'Product created']);
}

function handleUpdate() {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        return;
    }

    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID required']);
        return;
    }

    $data = getRequestBody();
    $db = getDB();

    $fields = [];
    $values = [];
    $allowed = ['slug', 'name', 'category', 'category_label', 'description', 'long_description',
        'weight', 'price', 'original_price', 'image', 'box_image', 'nutrition_highlights',
        'shelf_life', 'how_to_use', 'badge', 'sku', 'stock_quantity', 'is_active', 'sort_order'];

    foreach ($allowed as $field) {
        if (array_key_exists($field, $data)) {
            $fields[] = "$field = ?";
            $values[] = $data[$field];
        }
    }

    if (empty($fields)) {
        http_response_code(400);
        echo json_encode(['error' => 'No fields to update']);
        return;
    }

    $fields[] = "updated_at = NOW()";
    $values[] = $id;

    $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = ?";
    $stmt = $db->prepare($sql);
    $stmt->execute($values);

    echo json_encode(['message' => 'Product updated']);
}

function handleDelete() {
    $user = requireAuth();
    if ($user['role'] !== 'admin') {
        http_response_code(403);
        echo json_encode(['error' => 'Admin access required']);
        return;
    }

    $id = (int)($_GET['id'] ?? 0);
    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'Product ID required']);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode(['message' => 'Product deleted']);
}