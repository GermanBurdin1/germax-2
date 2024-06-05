<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/user.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$userService = new UserService();
$userController = new UserController($userService, $authService);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? null;

    if ($token === null) {
        echo json_encode(['success' => false, 'message' => 'Token is missing']);
        exit;
    }

    // Verify the token
    $user = $authService->getUserByToken($token);
    if ($user === null) {
        echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
        exit;
    }

    $userController->updateUserStatus($data);

} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content for preflight
    exit;
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
}
