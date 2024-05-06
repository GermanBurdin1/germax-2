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
	// if ($modelName == NULL && $typeName == NULL && $statusName == NULL) {
	// 	$goodsController->getAll();
	// }
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	// Возвращаем успешный статус
	http_response_code(200);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);
