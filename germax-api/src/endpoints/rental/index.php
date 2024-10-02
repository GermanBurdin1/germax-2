<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/rental.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/rental.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$rentalService = new RentalService();
$authService = new AuthService();
$rentalController = new RentalController($rentalService, $authService);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	// Возвращаем статус 204 No Content
	http_response_code(204);
	exit;
}

$headers = getallheaders();
$token = $headers['token'] ?? null;

if ($token === null) {
	echo json_encode(['success' => false, 'message' => 'Token is missing']);
	exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
	// Обработка GET запроса для получения текущих аренд
	error_log("GET request received.");
	$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
	$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;
	$rentalController->fetchRentals($page, $limit);
} else {
	error_log("Invalid request method: " . $_SERVER['REQUEST_METHOD']);
	echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
