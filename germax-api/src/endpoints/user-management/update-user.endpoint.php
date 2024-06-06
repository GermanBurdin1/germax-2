<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/user.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$userController = new UserController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$headers = getallheaders();
	$token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;

	error_log("Token: " . $token);

	if ($token === null) {
		echo json_encode(['success' => false, 'message' => 'Token is missing']);
		exit;
	}

	$user = $authService->getUserByToken($token);
	if ($user === false) {  // Проверяем на false вместо null
		echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
		exit;
	}

	$input = json_decode(file_get_contents("php://input"), true);
	$updated = $userController->updateUser($user['id_user'], $input);

	if ($updated) {
		echo json_encode(['success' => true, 'message' => 'User updated successfully']);
	} else {
		echo json_encode(['success' => false, 'message' => 'Failed to update user']);
	}
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	http_response_code(204); // No Content for preflight
	exit;
} else {
	http_response_code(405); // Method Not Allowed
	echo json_encode(['error' => 'Method not allowed']);
}
