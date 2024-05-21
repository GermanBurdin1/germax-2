<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/render-success.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/sql-requests.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/remove-special-characters.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/model.service.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/brand.service.php');

class GoodsService
{
	private $pdo;
	private $modelService;
	private $brandService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->modelService = new ModelService();
		$this->brandService = new BrandService();
	}

	public function getAllByParams($modelName, $typeName, $statusName)
	{
		$sql = "
			SELECT
				good.id_good,
				good.serial_number,
				good.id_model,
				model.name AS model_name,
				model.description AS model_description,
				model.photo AS model_photo,
				good.id_status,
				statu.name AS status_name,
				model.id_type AS model_id_type,
				typ.name AS model_type_name,
				model.id_brand AS model_id_brand,
				brand.name AS model_brand_name
			FROM
				good good
			JOIN
				status statu ON good.id_status = statu.id_status
			JOIN
				model model ON good.id_model = model.id_model
			JOIN
				type typ ON model.id_type = typ.id_type
			JOIN
				brand brand ON model.id_brand = brand.id_brand
		";

		$params = [
			"modelName" => [
				"exists" => $modelName != NULL,
				"sql" => "model.name LIKE :modelName ",
				"matches" => true,
				"value" => $modelName
			],
			"typeName" => [
				"exists" => $typeName != NULL,
				"sql" => "typ.name LIKE :typeName ",
				"matches" => true,
				"value" => $typeName
			],
			"statusName" => [
				"exists" => $statusName != NULL,
				"sql" => "statu.name LIKE :statusName ",
				"matches" => false,
				"value" => $statusName
			]
		];

		$whereSql = $this->generateWhereClause($params);
		$sql .= $whereSql;
		$sql .= ";";

		try {
			$stmt = $this->pdo->prepare($sql);

			foreach ($params as $paramName => $param) {
				if ($param["exists"] == true) {
					$value = $param["matches"] === true ? "%$param[value]%" : $param["value"];
					$stmt->bindValue(":" . $paramName, $value);
				}
			}

			$stmt->execute();
			$goods = $stmt->fetchAll();
			$formatedGoods = $this->formatArrGoods($goods);

			// return renderSuccessAndExit([
			// 	'Goods found', removeSpecialCharacters($sql)
			// ], 200, $formatedGoods);
			return $formatedGoods;
		} catch (PDOException $e) {
			return renderErrorAndExit('sql query error', 404, [
				"error" => $e,
				"sql" => removeSpecialCharacters($sql),
				"params" => $params
			]);
		}
	}

	private function generateWhereClause($params)
	{
		$whereClause = '';
		$firstParam = true;

		foreach ($params as $key => $param) {
			if ($param['exists']) {
				if (!$firstParam) {
					$whereClause .= ' AND ';
				} else {
					$firstParam = false;
				}
				$whereClause .= "$param[sql]";
			}
		}

		return $whereClause ? "WHERE $whereClause" : '';
	}

	private function formatArrGoods($goods)
	{
		return array_map(function ($good) {
			return $this->formatGood($good);
		}, $goods);
	}

	private function formatGood($good)
	{
		$formattedGood = [
			"id" => $good["id_good"],
			"serial_number" => $good["serial_number"],
			"model" => [
				"id" => $good["id_model"],
				"name" => $good["model_name"],
				"description" => $good["model_description"],
				"photo" => $good["model_photo"],
				"type" => [
					"id" => $good["model_id_type"],
					"name" => $good["model_type_name"]
				],
				"brand" => [
					"id" => $good["model_id_brand"],
					"name" => $good["model_brand_name"]
				]
			],
			"status" => [
				"id" => $good["id_status"],
				"name" => $good["status_name"]
			],
		];

		return $formattedGood;
	}

	public function checkQuantityAvailableGoods($modelName, $quantity)
	{
		$sql = "
            SELECT
                model.id_model,
                model.name AS model_name,
                (SELECT COUNT(g.id_good)
                 FROM good g
                 WHERE g.id_model = model.id_model AND g.id_status = 1
                ) AS available_count
            FROM
                model
            WHERE
                model.name = :modelName
        ";

		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['modelName' => $modelName]);
		$result = $stmt->fetch(PDO::FETCH_ASSOC);

		if (!$result) {
			return ['success' => false, 'message' => 'Model not found'];
		}

		$availableCount = $result['available_count'];

		return [
			'success' => $availableCount >= $quantity,
			'available_count' => $availableCount,
			'model_id' => $result['id_model']
		];
	}

	public function reserveGoods($modelId, $quantity)
	{
		$sql = "
            SELECT id_good
            FROM good
            WHERE id_model = :modelId AND id_status = 1
            LIMIT :quantity
        ";

		$stmt = $this->pdo->prepare($sql);
		$stmt->bindParam(':modelId', $modelId, PDO::PARAM_INT);
		$stmt->bindValue(':quantity', $quantity, PDO::PARAM_INT);
		$stmt->execute();

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function updateGoodStatus($goodId, $statusId)
	{
		$sql = "UPDATE good SET id_status = :statusId WHERE id_good = :goodId";
		$stmt = $this->pdo->prepare($sql);
		return $stmt->execute(['statusId' => $statusId, 'goodId' => $goodId]);
	}

	public function createGood($modelName, $statusId, $serialNumber, $idType, $brandName, $description = '', $photo = '')
	{
		// Проверка обязательных параметров
		if (empty($modelName) || empty($serialNumber) || empty($idType) || empty($brandName)) {
			return ['success' => false, 'message' => 'Model name, serial number, type, and brand are required'];
		}
		// Создаем или находим бренд
		error_log("Request to get or create brand: " . $brandName);
		$brandId = $this->brandService->getOrCreateBrand($brandName);
		error_log("Result from getOrCreateBrand: " . $brandId);

		if ($brandId === null) {
			return renderErrorAndExit('Failed to create or find brand', 500);
		}

		error_log("Brand ID: " . $brandId);
		// Создаем или находим модель
		$modelId = $this->modelService->getOrCreateModel($modelName, $idType, $brandId, $description, $photo);

		if ($modelId === null) {
			return renderErrorAndExit('Failed to create or find model', 500);
		}

		error_log("Model ID: " . $modelId);
		// Создаем товар
		$sql = "INSERT INTO good (id_model, id_status, serial_number) VALUES (:modelId, :statusId, :serialNumber)";
		$stmt = $this->pdo->prepare($sql);

		try {
			$stmt->execute(['modelId' => $modelId, 'statusId' => $statusId, 'serialNumber' => $serialNumber]);
			$id_good = $this->pdo->lastInsertId();
			return [
				'success' => true,
				'id_good' => $id_good,
				'brandName' => $brandName,
				'modelName' => $modelName,
				'id_model' => $modelId,
			];
		} catch (PDOException $e) {
			return renderErrorAndExit('sql query error', 404, [
				"error" => $e->getMessage(),
				"sql" => removeSpecialCharacters($sql)
			]);
		}
	}

	public function createGoods($modelName, $statusId, $serialNumbers, $idType, $brandName, $description = '', $photo = '')
	{
    error_log("createGoods__Parameters: " . print_r(compact('modelName', 'statusId', 'serialNumbers', 'idType', 'brandName', 'description', 'photo'), true));
		$results = [];

		foreach ($serialNumbers as $serialNumber) {
			$good = $this->createGood($modelName, $statusId, $serialNumber, $idType, $brandName, $description, $photo);
			if ($good['success']) {
				$results[] = $good;
				error_log("createGoods__Successfully created good: " . print_r($good, true));
			} else {
				return ['success' => false, 'message' => 'Failed to create some goods', 'results' => $results];
			}
		}

		return ['success' => true, 'goods' => $results];
	}
}
