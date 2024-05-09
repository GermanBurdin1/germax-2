<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/goods.service.php';
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');

class GoodsController {
	private $goodsService;

	public function __construct()
	{
		$this->goodsService = new GoodsService();
	}

	public function getAllByParams($modelName, $typeName, $statusName) {
		$goods = $this->goodsService->getAllByParams(
			$modelName, $typeName, $statusName
		);

		return renderSuccessAndExit(['Goods found'], 200, $goods);
	}
}
