<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/rental-controller.php';

$rentalController = new RentalController();

// Обработка POST запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $rentalController->createRental($data);
} else {
    // Если метод не поддерживается
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
