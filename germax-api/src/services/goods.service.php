<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/render-success.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/sql-requests.php');

class GoodsService
{
	private $pdo;
	private $sqlRequests;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->sqlRequests = new SqlRequests();
	}

	public function getAll()
	{
		$stmt = $this->pdo->prepare("
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
				brand brand ON model.id_brand = brand.id_brand;
		");
		$stmt->execute();

		$goods = $stmt->fetchAll();
		$formatedGoods = array_map(function ($good) {
			return $this->formatGood($good);
		}, $goods);

		return renderSuccessAndExit(['User found'], 200, $formatedGoods);
	}

	public function getModelsByName($modelName)
	{
		if (!isset($modelName)) {
			return renderErrorAndExit('Model name is required', 400);
		}

		$modelNameWithWildcard = "%" . $modelName . "%";
		$sql = $this->sqlRequests->returnRequestForGetModelByName();
		$stmt = $this->pdo->prepare($sql);
		$stmt->bindParam(':modelName', $modelNameWithWildcard);
		$stmt->execute();

		$models = $stmt->fetchAll();

		if ($models) {
			return renderSuccessAndExit(['Models found'], 200, $models);
		} else {
			return renderErrorAndExit('No models found', 404);
		}
	}


	public function getLaptops()
	{
		$sql = $this->sqlRequests->returnRequestForGetLaptopsByCategories();
		return $this->executeQuery($sql);
	}

	public function getSmartphones()
	{
		$sql = $this->sqlRequests->returnRequestForGetSmartphonesByCategories();
		return $this->executeQuery($sql);
	}

	public function getTablets()
	{
		$sql = $this->sqlRequests->returnRequestForGetTabletsByCategories();
		return $this->executeQuery($sql);
	}

	public function getVRHeadsets()
	{
		$sql = $this->sqlRequests->returnRequestForGetVR_headsetsByCategories();
		return $this->executeQuery($sql);
	}

	private function executeQuery($sql)
	{
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute();
		$results = $stmt->fetchAll();

		if ($results) {
			$formattedResults = array_map([$this, 'formatGood'], $results);
			return renderSuccessAndExit(['Items found'], 200, $formattedResults);
		} else {
			return renderErrorAndExit('No items found', 404);
		}
	}

	private function formatGood($good)
	{
		$formattedGood = [
			"id" => isset($good["id_good"]) ? $good["id_good"] : null,
			"serial_number" => isset($good["serial_number"]) ? $good["serial_number"] : null,
			"model" => [
				"id" => isset($good["id_model"]) ? $good["id_model"] : null,
				"name" => isset($good["model_name"]) ? $good["model_name"] : null,
				"description" => isset($good["model_description"]) ? $good["model_description"] : null,
				"photo" => isset($good["model_photo"]) ? $good["model_photo"] : null,
				"type" => [
					"id" => isset($good["model_id_type"]) ? $good["model_id_type"] : null,
					"name" => isset($good["model_type_name"]) ? $good["model_type_name"] : null
				],
				"brand" => [
					"id" => isset($good["model_id_brand"]) ? $good["model_id_brand"] : null,
					"name" => isset($good["model_brand_name"]) ? $good["model_brand_name"] : null
				]
			],
			"status" => [
				"id" => isset($good["id_status"]) ? $good["id_status"] : null,
				"name" => isset($good["status_name"]) ? $good["status_name"] : null
			],
		];

		// Убираем пустые поля, если они не содержат данных
		array_walk_recursive($formattedGood, function (&$item, $key) {
			$item = $item === null ? 'Unknown' : $item;
		});

		return $formattedGood;
	}
}
