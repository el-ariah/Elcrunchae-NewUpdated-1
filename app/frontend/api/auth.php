<?php
/**
 * Authentication API — El Crunchae
 * Endpoints: POST /api/auth.php?action=register|login|me
 */
require_once __DIR__ . '/config.php';

$action = $_GET['action'] ?? '';

switch ($action) {
    case 'register':
        handleRegister();
        break;
    case 'login':
        handleLogin();
        break;
    case 'me':
        handleMe();
        break;
    default:
        jsonResponse(['error' => 'Invalid action'], 400);
}

function handleRegister(): void {
    $body = getRequestBody();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';
    $name = trim($body['name'] ?? '');

    if (!$email || !$password) {
        jsonResponse(['error' => 'Email and password are required'], 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['error' => 'Invalid email format'], 400);
    }

    if (strlen($password) < 6) {
        jsonResponse(['error' => 'Password must be at least 6 characters'], 400);
    }

    $db = getDB();

    // Check if email already exists
    $stmt = $db->prepare("SELECT id FROM users WHERE email = ?");
    $stmt->execute([$email]);
    if ($stmt->fetch()) {
        jsonResponse(['error' => 'Email already registered'], 409);
    }

    // Create user
    $hash = password_hash($password, PASSWORD_BCRYPT);
    $stmt = $db->prepare("INSERT INTO users (email, password_hash, name, role) VALUES (?, ?, ?, 'user')");
    $stmt->execute([$email, $hash, $name ?: explode('@', $email)[0]]);

    $userId = (int)$db->lastInsertId();

    // Generate token
    $token = jwt_encode([
        'user_id' => $userId,
        'email' => $email,
        'name' => $name ?: explode('@', $email)[0],
        'role' => 'user',
    ]);

    jsonResponse([
        'token' => $token,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'name' => $name ?: explode('@', $email)[0],
            'role' => 'user',
        ],
    ], 201);
}

function handleLogin(): void {
    $body = getRequestBody();
    $email = trim($body['email'] ?? '');
    $password = $body['password'] ?? '';

    if (!$email || !$password) {
        jsonResponse(['error' => 'Email and password are required'], 400);
    }

    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, password_hash, name, role FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $user = $stmt->fetch();

    if (!$user || !password_hash_verify($password, $user['password_hash'])) {
        jsonResponse(['error' => 'Invalid email or password'], 401);
    }

    // Update last login
    $stmt = $db->prepare("UPDATE users SET last_login = NOW() WHERE id = ?");
    $stmt->execute([$user['id']]);

    // Generate token
    $token = jwt_encode([
        'user_id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role'],
    ]);

    jsonResponse([
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
        ],
    ]);
}

function password_hash_verify(string $password, string $hash): bool {
    return password_verify($password, $hash);
}

function handleMe(): void {
    $user = requireAuth();
    $db = getDB();
    $stmt = $db->prepare("SELECT id, email, name, role, last_login FROM users WHERE id = ?");
    $stmt->execute([$user['user_id']]);
    $userData = $stmt->fetch();

    if (!$userData) {
        jsonResponse(['error' => 'User not found'], 404);
    }

    jsonResponse([
        'user' => [
            'id' => (int)$userData['id'],
            'email' => $userData['email'],
            'name' => $userData['name'],
            'role' => $userData['role'],
            'last_login' => $userData['last_login'],
        ],
    ]);
}