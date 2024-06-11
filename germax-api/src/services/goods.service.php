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

	public function getAllByParams($modelName, $typeName, $statusNames, $shippingStatus, $page, $limit)
	{
		$offset = ($page - 1) * $limit;

		$sql = "
        SELECT
            good.id_good,
            good.serial_number,
            good.id_model,
            model.name AS model_name,
            model.description AS model_description,
            model.photo AS model_photo,
            good.id_status,
            good.location,
            good.date_sending,
            good.date_receiving,
            good.shipping_status,
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
				"sql" => "model.name LIKE :modelName",
				"matches" => true,
				"value" => $modelName
			],
			"typeName" => [
				"exists" => $typeName != NULL,
				"sql" => "typ.name LIKE :typeName",
				"matches" => true,
				"value" => $typeName
			],
			"statusNames" => [
				"exists" => !empty($statusNames),
				"sql" => "statu.name IN (" . implode(", ", array_map(function ($i) {
					return ":statusName$i";
				}, array_keys($statusNames))) . ")",
				"matches" => false,
				"value" => $statusNames
			],
			"shippingStatus" => [
				"exists" => $shippingStatus != NULL,
				"sql" => "good.shipping_status = :shippingStatus",
				"matches" => false,
				"value" => $shippingStatus
			]
		];

		$whereSql = $this->generateWhereClause($params);
		$sql .= $whereSql;
		$sql .= " LIMIT :limit OFFSET :offset;";

		// Запрос для подсчета общего количества элементов
		$countSql = "
        SELECT COUNT(*)
        FROM good good
        JOIN status statu ON good.id_status = statu.id_status
        JOIN model model ON good.id_model = model.id_model
        JOIN type typ ON model.id_type = typ.id_type
        JOIN brand brand ON model.id_brand = brand.id_brand
    ";
		$countSql .= $whereSql;

		try {
			$stmt = $this->pdo->prepare($sql);
			$countStmt = $this->pdo->prepare($countSql);

			foreach ($params as $paramName => $param) {
				if ($param["exists"] == true) {
					if ($paramName == "statusNames") {
						foreach ($param["value"] as $index => $value) {
							$stmt->bindValue(":statusName$index", $value, PDO::PARAM_STR);
							$countStmt->bindValue(":statusName$index", $value, PDO::PARAM_STR);
						}
					} else {
						$value = $param["matches"] === true ? "%" . $param["value"] . "%" : $param["value"];
						$stmt->bindValue(":" . $paramName, $value, PDO::PARAM_STR);
						$countStmt->bindValue(":" . $paramName, $value, PDO::PARAM_STR);
					}
				}
			}

			// Привязка параметров лимита и смещения
			$stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
			$stmt->bindValue(":offset", $offset, PDO::PARAM_INT);

			// Выполнение запросов
			$stmt->execute();
			$countStmt->execute();

			// Получение данных и общего количества элементов
			$goods = $stmt->fetchAll(PDO::FETCH_ASSOC);
			$totalItems = $countStmt->fetchColumn();
			$formatedGoods = $this->formatArrGoods($goods);

			return [
				'data' => $formatedGoods,
				'totalItems' => $totalItems
			];
		} catch (PDOException $e) {
			return renderErrorAndExit('sql query error', 404, [
				"error" => $e->getMessage(),
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
				$whereClause .= $param['sql'];
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
			"location" => $good["location"],
			"date_sending" => $good["date_sending"], // Добавлено поле date_sending
			"date_receiving" => $good["date_receiving"], // Добавлено поле date_receiving
			"shipping_status" => $good["shipping_status"]  // Добавлено поле location
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

	public function createGood($modelName, $statusId, $serialNumber, $idType, $brandName, $description = '', $photo = '', $location = 'stock_stockman')
	{
		// Проверка обязательных параметров
		if (empty($modelName) || empty($serialNumber) || empty($idType) || empty($brandName)) {
			return ['success' => false, 'message' => 'Model name, serial number, type, and brand are required'];
		}
		// Создаем или находим бренд
		$brandId = $this->brandService->getOrCreateBrand($brandName);

		if ($brandId === null) {
			return renderErrorAndExit('Failed to create or find brand', 500);
		}

		// Создаем или находим модель
		$modelId = $this->modelService->getOrCreateModel($modelName, $idType, $brandId, $description, $photo);

		if ($modelId === null) {
			return renderErrorAndExit('Failed to create or find model', 500);
		}

		// Создаем товар
		$sql = "INSERT INTO good (id_model, id_status, serial_number, location) VALUES (:modelId, :statusId, :serialNumber, :location)";
		$stmt = $this->pdo->prepare($sql);

		try {
			$stmt->execute(['modelId' => $modelId, 'statusId' => $statusId, 'serialNumber' => $serialNumber, 'location' => $location]);
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

	public function createGoods($modelName, $statusId, $serialNumbers, $idType, $brandName, $description = '', $photo = '', $location = 'stock_stockman')
	{
		$results = [];

		foreach ($serialNumbers as $serialNumber) {
			$good = $this->createGood($modelName, $statusId, $serialNumber, $idType, $brandName, $description, $photo, $location);
			if ($good['success']) {
				$results[] = $good;
			} else {
				return ['success' => false, 'message' => 'Failed to create some goods', 'results' => $results];
			}
		}

		return ['success' => true, 'goods' => $results];
	}


	public function getUnitsByModelId($modelId)
	{
		$sql = "
        SELECT
            good.id_good,
            good.serial_number,
            good.added_date,
            statu.name AS status_name
        FROM
            good
        JOIN
            status statu ON good.id_status = statu.id_status
        WHERE
            good.id_model = :modelId
    ";

		try {
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':modelId', $modelId, PDO::PARAM_INT);
			$stmt->execute();
			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error fetching units by model ID: " . $e->getMessage());
			return [];
		}
	}

	public function updateGood($goodId, $modelName, $idType, $brandName, $photo)
	{
		try {
			$this->pdo->beginTransaction();

			// Обновление модели
			$sqlModel = "UPDATE model SET name = :modelName, id_type = :idType, photo = :photo WHERE id_model = (SELECT id_model FROM good WHERE id_good = :goodId)";
			$stmtModel = $this->pdo->prepare($sqlModel);
			$stmtModel->execute([
				'modelName' => $modelName,
				'idType' => $idType,
				'photo' => $photo,
				'goodId' => $goodId
			]);

			// Обновление бренда
			$sqlBrand = "UPDATE brand SET name = :brandName WHERE id_brand = (SELECT id_brand FROM model WHERE id_model = (SELECT id_model FROM good WHERE id_good = :goodId))";
			$stmtBrand = $this->pdo->prepare($sqlBrand);
			$stmtBrand->execute([
				'brandName' => $brandName,
				'goodId' => $goodId
			]);

			$this->pdo->commit();

			return ['success' => true, 'message' => 'Good updated successfully'];
		} catch (Exception $e) {
			$this->pdo->rollBack();
			return ['success' => false, 'message' => $e->getMessage()];
		}
	}


	public function getGoodById($id_good)
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
						good.location,
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
        WHERE
            good.id_good = :id_good
    ";

		try {
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':id_good', $id_good, PDO::PARAM_INT);
			$stmt->execute();
			$good = $stmt->fetch(PDO::FETCH_ASSOC);
			return $good ? $this->formatGood($good) : null;
		} catch (PDOException $e) {
			return renderErrorAndExit('sql query error', 404, [
				"error" => $e->getMessage(),
				"sql" => removeSpecialCharacters($sql)
			]);
		}
	}

	public function sendEquipment($id_good)
	{
		$sql = "UPDATE good SET date_sending = CURDATE(), shipping_status = 'send_to_manager' WHERE id_good = :id_good";
		$stmt = $this->pdo->prepare($sql);
		try {
			$stmt->execute(['id_good' => $id_good]);
			return ['success' => true, 'message' => 'Date d\'envoi et statut d\'expédition mis à jour avec succès'];
		} catch (PDOException $e) {
			return ['success' => false, 'message' => $e->getMessage()];
		}
	}

	public function confirmReceiving($id_good)
	{
		$sql = "UPDATE good SET date_receiving = CURDATE(), shipping_status = 'received_by_manager', location = 'stock_manager' WHERE id_good = :id_good";
		$stmt = $this->pdo->prepare($sql);
		try {
			$stmt->execute(['id_good' => $id_good]);
			return ['success' => true, 'message' => 'Date de réception et statut d\'expédition mis à jour avec succès'];
		} catch (PDOException $e) {
			return ['success' => false, 'message' => $e->getMessage()];
		}
	}

	public function confirmHandOver($id_loan, $id_good)
	{
		$this->pdo->beginTransaction();
		try {
			// Обновление записи в таблице good
			$sqlGood = "UPDATE good SET shipping_status = 'handed_over', location = 'user' WHERE id_good = :id_good";
			$stmtGood = $this->pdo->prepare($sqlGood);
			$stmtGood->execute(['id_good' => $id_good]);

			if ($stmtGood->rowCount() == 0) {
				$this->pdo->rollBack();
				error_log("Failed to update good status or good not found for id_good: " . $id_good);
				return ['success' => false, 'message' => 'Failed to update good status or good not found'];
			}

			// Обновление записи в таблице loan
			$sqlLoan = "UPDATE loan SET loan_status = 'loaned', booking_date = CURDATE() WHERE id_loan = :id_loan";
			$stmtLoan = $this->pdo->prepare($sqlLoan);
			$stmtLoan->execute(['id_loan' => $id_loan]);

			if ($stmtLoan->rowCount() == 0) {
				$this->pdo->rollBack();
				error_log("Failed to update loan status or loan not found for id_loan: " . $id_loan);
				return ['success' => false, 'message' => 'Failed to update loan status or loan not found'];
			}

			$this->pdo->commit();
			return ['success' => true, 'message' => 'Goods handed over and loan updated successfully'];
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			error_log("Database error: " . $e->getMessage());
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}

	public function reportReturn($id_loan, $id_good)
	{
		$this->pdo->beginTransaction();
		try {
			// Обновление записи в таблице good
			$sqlGood = "UPDATE good SET id_status = 1, shipping_status = 'returned' WHERE id_good = :id_good";
			$stmtGood = $this->pdo->prepare($sqlGood);
			$stmtGood->execute(['id_good' => $id_good]);

			if ($stmtGood->rowCount() == 0) {
				$this->pdo->rollBack();
				error_log("Failed to update good status or good not found for id_good: " . $id_good);
				return ['success' => false, 'message' => 'Failed to update good status or good not found'];
			}

			// Обновление записи в таблице loan
			$sqlLoan = "UPDATE loan SET loan_status = 'returned', return_date = CURDATE() WHERE id_loan = :id_loan";
			$stmtLoan = $this->pdo->prepare($sqlLoan);
			$stmtLoan->execute(['id_loan' => $id_loan]);

			if ($stmtLoan->rowCount() == 0) {
				$this->pdo->rollBack();
				error_log("Failed to update loan status or loan not found for id_loan: " . $id_loan);
				return ['success' => false, 'message' => 'Failed to update loan status or loan not found'];
			}

			$this->pdo->commit();
			return ['success' => true, 'message' => 'Goods returned and loan updated successfully'];
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			error_log("Database error: " . $e->getMessage());
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}
}
