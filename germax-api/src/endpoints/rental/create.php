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
	http_response_code(204);
	exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$headers = getallheaders();
	$token = $headers['token'] ?? null;

	if ($token === null) {
		echo json_encode(['success' => false, 'message' => 'Token is missing']);
		exit;
	}

	$rentalController->createRental($data, $token);
} else {
	echo json_encode(['success' => false, 'message' => 'This route does not support this HTTP method']);
	exit;
}
