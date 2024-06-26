<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/rental-controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/rental.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$rentalService = new RentalService();
$authService = new AuthService();
$rentalController = new RentalController($rentalService, $authService);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
    header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, X-Requested-With, Authorization, *");
    http_response_code(204);
    exit;
}

$headers = getallheaders();
$token = $headers['token'] ?? null;

if ($token === null) {
    echo json_encode(['success' => false, 'message' => 'Token is missing']);
    exit;
}

// Получаем данные из POST
$data = json_decode(file_get_contents("php://input"), true);
$userId = $data['user_id'] ?? null;

if ($userId === null) {
    echo json_encode(['success' => false, 'message' => 'User ID is missing']);
    exit;
}

$rentalController->fetchRentalsByUserId($userId);
