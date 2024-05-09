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

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'PATCH') {
	$headers = getallheaders();
	$headerToken = $headers['token'];
	// Обработка GET запроса для получения текущих аренд
	$rentalController->approveRental($data, $token);
}

renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>
