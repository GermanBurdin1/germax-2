<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class StatisticsService
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function fetchManagerStatistics()
	{
		try {
			$currentMonth = date('Y-m');
			$newUsersStmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM user WHERE DATE_FORMAT(creation_date, '%Y-%m') = :currentMonth");
			$newUsersStmt->execute(['currentMonth' => $currentMonth]);
			$newUsersCount = $newUsersStmt->fetchColumn() ?: 0;

			$newLoanRequestsStmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM loan WHERE loan_status = 'loan_request' AND DATE_FORMAT(request_date, '%Y-%m') = :currentMonth");
			$newLoanRequestsStmt->execute(['currentMonth' => $currentMonth]);
			$newLoanRequestsCount = $newLoanRequestsStmt->fetchColumn() ?: 0;

			return [
				'newUsers' => (int)$newUsersCount,
				'newLoanRequests' => (int)$newLoanRequestsCount
			];
		} catch (PDOException $e) {
			error_log("Error fetching manager statistics: " . $e->getMessage());
			return [
				'newUsers' => 0,
				'newLoanRequests' => 0
			];
		}
	}

	public function fetchStockmanStatistics()
	{
		try {
			$currentMonth = date('Y-m');

			$newEquipmentStmt = $this->pdo->prepare("SELECT COUNT(*) as count FROM equipment_request WHERE treatment_status = 'pending_stockman' AND DATE_FORMAT(request_date, '%Y-%m') = :currentMonth");
			$newEquipmentStmt->execute(['currentMonth' => $currentMonth]);
			$newEquipmentCount = $newEquipmentStmt->fetchColumn() ?: 0;

			return [
				'newEquipment' => (int)$newEquipmentCount
			];
		} catch (PDOException $e) {
			error_log("Error fetching stockman statistics: " . $e->getMessage());
			return [
				'newLoanRequests' => 0,
				'newEquipment' => 0
			];
		}
	}
}
