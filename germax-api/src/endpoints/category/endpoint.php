<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/category.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$categoryController = new CategoryController($authService);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$headers = getallheaders();
	$token = $headers['token'] ?? null;

	if ($token === null) {
		echo json_encode(['success' => false, 'message' => 'Token is missing']);
		exit;
	}

	$data = json_decode(file_get_contents('php://input'), true);
	$name = $data['name'] ?? '';
	$response = $categoryController->addCategory($name, $token);
	echo json_encode($response);
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
	$response = $categoryController->getCategories();
	echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	http_response_code(204);
	exit;
} else {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
}
