<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/goods.service.php';
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');

class GoodsController
{
	private $goodsService;

	public function __construct()
	{
		$this->goodsService = new GoodsService();
	}

	public function getAll()
	{
		return $this->goodsService->getAll();
	}

	public function getFirstModelByName()
	{
		// Проверяем, есть ли параметр 'modelName' в запросе
		if (!isset($_GET['modelName'])) {
			// Возвращаем ошибку, если параметр не найден
			return renderErrorAndExit('Model name is required', 400);
		}

		$modelName = $_GET['modelName'];
		$model = $this->goodsService->getFirstModelName($modelName);

		// Проверка, была ли модель найдена
		if ($model) {
			return renderSuccessAndExit(['Model found'], 200, $model);
		} else {
			return renderErrorAndExit('Model not found', 404);
		}
	}

	public function getLaptops()
	{
		return $this->goodsService->getLaptops();
	}

	public function getSmartphones()
	{
		return $this->goodsService->getSmartphones();
	}

	public function getTablets()
	{
		return $this->goodsService->getTablets();
	}

	public function getVRHeadsets()
	{
		return $this->goodsService->getVRHeadsets();
	}
}
