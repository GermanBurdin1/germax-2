<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/goods.controller.php';


$goodsController = new GoodsController();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	$modelName = isset($_GET['modelName']) ? $_GET['modelName'] : NULL;
	$typeName = isset($_GET['typeName']) ? $_GET['typeName'] : NULL;
	$statusName = isset($_GET['statusName']) ? $_GET['statusName'] : NULL;

	$goodsController->getAllByParams($modelName, $typeName, $statusName);
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
	// Получение данных из тела запроса
	$input = json_decode(file_get_contents('php://input'), true);

	// Проверка наличия необходимых полей
	if (!isset($input['modelName']) || !isset($input['statusId']) || !isset($input['serialNumber'])) {
		renderErrorAndExit(['Missing required fields'], 400);
	}

	// Вызов метода createGood контроллера
	$goodsController->createGood($input['modelName'], $input['statusId'], $input['serialNumber']);
	exit;
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	// Возвращаем успешный статус
	http_response_code(204);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);
