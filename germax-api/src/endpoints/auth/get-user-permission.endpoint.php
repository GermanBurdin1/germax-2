<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';

$authController = new AuthController();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $headers = getallheaders();
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

    if ($token === null) {
        echo json_encode(['success' => false, 'message' => 'Token is missing']);
        exit;
    }

    $user = $authController->getUserByToken($token);
    if ($user === false) {
        echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
        exit;
    }

    $userId = $user['id_user'];
    $userData = $authController->getUserPermission($userId);

    echo json_encode(['success' => true, 'data' => $userData]);
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
