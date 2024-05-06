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

	public function getAllByParams($modelName, $typeName, $statusName) {
		return $this->goodsService->getAllByParams(
			$modelName, $typeName, $statusName
		);
	}
}
