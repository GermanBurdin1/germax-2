<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/rental-controller.php';

$rentalController = new RentalController();

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	// Возвращаем статус 204 No Content
	http_response_code(204);
	exit;
}

// Обработка POST запроса
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
	$data = json_decode(file_get_contents('php://input'), true);
	// Различаем действия по ключу 'action' в переданных данных
	if (isset($data['action'])) {
			if ($data['action'] === 'approve') {
					$rentalController->approveRental($data);
			} elseif ($data['action'] === 'cancel') {
					$rentalController->cancelRental($data);
			} else {
					// Ответ на неподдерживаемое действие
					http_response_code(400);
					echo json_encode(['error' => 'Action not supported']);
			}
	} else {
			// Создаем новую аренду, если не указано действие
			$rentalController->createRental($data);
	}
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
	// Обработка GET запроса для получения текущих аренд
	$rentalController->fetchRentals();
} else {
	// Если метод не поддерживается
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
}
