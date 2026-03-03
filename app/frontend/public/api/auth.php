<?php
/**
 * Authentication API — login, register, me
 * Usage:
 *   POST /api/auth.php?action=login    { email, password }
 *   POST /api/auth.php?action=register { email, password, name }
 *   GET  /api/auth.php?action=me       (requires Bearer token)
 */
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        handleLogin();
        break;
    case 'register':
        handleRegister();
        break;
    case 'me':
        handleMe();
        break;
    default:
        http_response_code(400);
        echo json_encode(['error' => 'Invalid action. Use: login, register, or me']);
}

function handleLogin() {
    $data = getRequestBody();
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, name, role, password_hash FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email or password']);
        return;
    }

    $token = generateJWT(['user_id' => $user['id'], 'role' => $user['role']]);

    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
        ],
    ]);
}

function handleRegister() {
    $data = getRequestBody();
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $name = trim($data['name'] ?? '');

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email and password are required']);
        return;
    }

    if (strlen($password) < 6) {
        http_response_code(400);
        echo json_encode(['error' => 'Password must be at least 6 characters']);
        return;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid email format']);
        return;
    }

    $db = getDB();

    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        http_response_code(409);
        echo json_encode(['error' => 'An account with this email already exists']);
        return;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $db->prepare("INSERT INTO users (email, password_hash, name, role, created_at) VALUES (?, ?, ?, 'customer', NOW())");
    $stmt->execute([$email, $passwordHash, $name ?: 'Customer']);

    $userId = (int)$db->lastInsertId();
    $token = generateJWT(['user_id' => $userId, 'role' => 'customer']);

    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'name' => $name ?: 'Customer',
            'role' => 'customer',
        ],
    ]);
}

function handleMe() {
    $user = requireAuth();
    echo json_encode([
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
        ],
    ]);
}