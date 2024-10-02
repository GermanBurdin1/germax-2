<?php
header("Access-Control-Allow-Origin: http://germaloc-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/equipment-request.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$equipmentRequestService = new EquipmentRequestService();
$equipmentRequestController = new EquipmentRequestController($equipmentRequestService, $authService);

if ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['id'])) {
	$requestId = $_GET['id'];
	$response = $equipmentRequestController->getRequestById($requestId);
	echo json_encode($response);
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	http_response_code(204);
	exit;
} else {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
}
