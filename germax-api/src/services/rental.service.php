<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/render-success.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/sql-requests.php');

class RentalService
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function addRental($data)
	{
		if (!$data['quantity'] || !$data['rentalDates'] || !isset($data['modelId'])) {
			return ['success' => false, 'message' => 'All fields including model ID are required'];
		}

		$updateStatusSql = "UPDATE good
                        JOIN model ON good.id_model = model.id_model
                        SET good.id_status = 4
                        WHERE good.id_status = 1 AND model.id_model = ?;";

		$stmtUpdate = $this->pdo->prepare($updateStatusSql);
		$stmtUpdate->execute([$data['modelId']]); // Используем modelId для определения конкретной модели

		if ($stmtUpdate->rowCount() > 0) {
			return ['success' => true, 'message' => 'Rental added and status updated successfully'];
		} else {
			return ['success' => false, 'message' => 'Failed to update status or no such model found'];
		}
	}
}
