<?php

header("Access-Control-Allow-Origin: http://germaloc-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, PUT, OPTIONS");
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

		case 'getGoodById':
			$id_good = isset($_GET['id_good']) ? intval($_GET['id_good']) : null;
			if ($id_good) {
				$goodsController->getGoodById($id_good);
			} else {
				echo json_encode(['success' => false, 'message' => 'Good ID is required']);
			}
			break;

		case 'default':
		default:
			$modelName = isset($_GET['modelName']) ? $_GET['modelName'] : NULL;
			$typeName = isset($_GET['typeName']) ? $_GET['typeName'] : NULL;
			$statusNames = isset($_GET['statusNames']) ? explode(",", $_GET['statusNames']) : ["available"];
			$shippingStatus = isset($_GET['shippingStatus']) ? $_GET['shippingStatus'] : NULL;
			$page = isset($_GET['page']) ? intval($_GET['page']) : 1;
			$limit = isset($_GET['limit']) ? intval($_GET['limit']) : 20;

			$goodsController->getAllByParams($modelName, $typeName, $statusNames, $shippingStatus, $page, $limit);
			break;
	}
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
	$input = json_decode(file_get_contents('php://input'), true);

	if (isset($input['action']) && isset($input['id_good'])) {
		$id_good = $input['id_good'];
		$action = $input['action'];

		if ($action == 'send') {
			$result = $goodsController->sendEquipment($id_good);
			echo json_encode($result);
		} elseif ($action == 'receive') {
			$result = $goodsController->confirmReceiving($id_good);
		} elseif ($action == 'handOver') {
			$id_loan = $input['id_loan'];
			$id_good = $input['id_good'];
			error_log("Hand over action called with id_loan: " . $id_loan . " and id_good: " . $id_good);
			$result = $goodsController->confirmHandOver($id_loan, $id_good);
			error_log("Hand over result: " . json_encode($result));
		} elseif ($action == 'return') {
			$id_loan = $input['id_loan'];
			$id_good = $input['id_good'];
			error_log("Return action called with id_loan: " . $id_loan . " and id_good: " . $id_good);
			$result = $goodsController->reportReturn($id_loan, $id_good);
			error_log("Return result: " . json_encode($result));
		}
		echo json_encode($result);
	} else {
		$modelName = $input['modelName'] ?? null;
		$statusId = $input['statusId'] ?? 4;
		$serialNumbers = $input['serialNumbers'] ?? null;
		$idType = $input['id_type'] ?? null;
		$brandName = $input['brandName'] ?? null;
		$description = $input['description'] ?? '';
		$photo = $input['photo'] ?? '';
		$location = $input['location'] ?? 'stock_stockman';
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
	}
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
	$input = json_decode(file_get_contents('php://input'), true);
	$id_good = $input['id_good'] ?? null;
	$modelName = $input['modelName'] ?? null;
	$idType = $input['id_type'] ?? null;
	$brandName = $input['brandName'] ?? null;
	$photo = $input['photo'] ?? '';

	if ($id_good && $modelName && $idType && $brandName) {
		$result = $goodsController->updateGood($id_good, $modelName, $idType, $brandName, $photo);
		echo json_encode($result);
	} else {
		echo json_encode(['success' => false, 'message' => 'ID, Model name, type, and brand are required']);
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
