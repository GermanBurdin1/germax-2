<?php
header("Access-Control-Allow-Origin: http://germaloc-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/user.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$userController = new UserController();

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['permissionName'])) {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? null;

    if ($token === null) {
        echo json_encode(['success' => false, 'message' => 'Token is missing']);
        exit;
    }

    $user = $authService->getUserByToken($token);
    if ($user === null) {
        echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
        exit;
    }

    $permissionName = $_GET['permissionName'];
    $users = $userController->getUsersByPermission($permissionName);
    echo json_encode(['success' => true, 'data' => $users]);
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content for preflight
    exit;
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
}