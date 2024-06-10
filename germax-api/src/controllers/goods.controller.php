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

	public function getAllByParams($modelName, $typeName, $statusNames, $shippingStatus, $page, $limit)
	{
		$goods = $this->goodsService->getAllByParams(
			$modelName,
			$typeName,
			$statusNames,
			$shippingStatus,
			$page,
			$limit
		);

		return renderSuccessAndExit(['Goods found'], 200, $goods);
	}

	public function createGood($modelName, $statusId, $serialNumber, $idType, $brandName, $description = '', $photo = '', $location = 'stock_stockman')
	{
		return $this->goodsService->createGood($modelName, $statusId, $serialNumber, $idType, $brandName, $description, $photo, $location);
	}

	public function createGoods($modelName, $statusId, $serialNumbers, $idType, $brandName, $description = '', $photo = '', $location = 'stock_stockman')
	{
		return $this->goodsService->createGoods($modelName, $statusId, $serialNumbers, $idType, $brandName, $description, $photo, $location);
	}


	public function getUnitsByModelId($modelId)
	{
		$units = $this->goodsService->getUnitsByModelId($modelId);
		echo json_encode(['success' => true, 'data' => $units]);
	}

	public function updateGood($id_good, $modelName, $idType, $brandName, $photo)
	{
		return $this->goodsService->updateGood($id_good, $modelName, $idType, $brandName, $photo);
	}

	public function getGoodById($id_good)
	{
		$good = $this->goodsService->getGoodById($id_good);
		if ($good) {
			echo json_encode(['success' => true, 'data' => $good]);
		} else {
			echo json_encode(['success' => false, 'message' => 'Good not found']);
		}
	}

	public function sendEquipment($id_good)
	{
		return $this->goodsService->sendEquipment($id_good);
	}

	public function confirmReceiving($id_good)
	{
		return $this->goodsService->confirmReceiving($id_good);
	}

	public function confirmHandOver($id_loan, $id_good)
	{
		return $this->goodsService->confirmHandOver($id_loan, $id_good);
	}
}
