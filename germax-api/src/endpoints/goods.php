<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/goods.controller.php';


$goodsController = new GoodsController();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	$action = isset($_GET['action']) ? $_GET['action'] : 'default';

	switch ($action) {
		case 'getUnitsByModelId':
			$modelId = isset($_GET['modelId']) ? intval($_GET['modelId']) : null;
			if ($modelId) {
				$goodsController->getUnitsByModelId($modelId);
			} else {
				echo json_encode(['success' => false, 'message' => 'Model ID is required']);
			}
			break;

		case 'default':
		default:
			$modelName = isset($_GET['modelName']) ? $_GET['modelName'] : NULL;
			$typeName = isset($_GET['typeName']) ? $_GET['typeName'] : NULL;
			$statusNames = isset($_GET['statusNames']) ? explode(",", $_GET['statusNames']) : ["available"];
			$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
			$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;

			$goodsController->getAllByParams($modelName, $typeName, $statusNames, $page, $limit);
			break;
	}
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
	$input = json_decode(file_get_contents('php://input'), true);
	$modelName = $input['modelName'] ?? null;
	$statusId = $input['statusId'] ?? 4;
	$serialNumbers = $input['serialNumbers'] ?? null;
	$idType = $input['id_type'] ?? null;
	$brandName = $input['brandName'] ?? null;
	$description = $input['description'] ?? '';
	$photo = $input['photo'] ?? '';
	error_log("Received data: " . print_r($input, true));
	if ($modelName && $serialNumbers && $idType && $brandName) {
		if (is_array($serialNumbers)) {
			// Multiple serial numbers provided, call createGoods
			$goodId = $goodsController->createGoods($modelName, $statusId, $serialNumbers, $idType, $brandName, $description, $photo);
			echo json_encode(['success' => true, 'id_good' => $goodId]);
		} else {
			// Single serial number provided, call createGood
			$good = $goodsController->createGood($modelName, $statusId, $serialNumbers, $idType, $brandName, $description, $photo);
			echo json_encode($good);
		}
	} else {
		echo json_encode(['success' => false, 'message' => 'Model name, serial number, type, and brand are required']);
	}
	exit;
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	// Возвращаем успешный статус
	http_response_code(204);
	exit;
} else {
	echo json_encode(['success' => false, 'message' => 'Invalid request method']);
	exit;
}
