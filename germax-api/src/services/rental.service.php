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
		if (!$data['quantity'] || !$data['rentalDates'] || !isset($data['modelId']) || !isset($data['id_user'])) {
			return ['success' => false, 'message' => 'All fields including model ID and user ID are required'];
		}

		$this->pdo->beginTransaction();  // Начинаем транзакцию

		try {
			$updateStatusSql = "UPDATE good SET id_status = 4 WHERE id_good = ? AND id_status = 1;";
			$stmtUpdate = $this->pdo->prepare($updateStatusSql);
			$stmtUpdate->execute([$data['goodId']]);

			if ($stmtUpdate->rowCount() > 0) {
				// Добавляем запись в таблицу 'loan' с функцией requestLoan
				if ($this->requestLoan($data)) {
					$this->pdo->commit();  // Подтверждаем транзакцию
					return ['success' => true, 'message' => 'Rental requested and loan recorded successfully'];
				} else {
					$this->pdo->rollBack();  // Откатываем транзакцию
					return ['success' => false, 'message' => 'Failed to record the loan'];
				}
			} else {
				$this->pdo->rollBack();  // Откатываем транзакцию
				return ['success' => false, 'message' => 'No equipment found or already loaned'];
			}
		} catch (PDOException $e) {
			$this->pdo->rollBack();  // Откатываем транзакцию при ошибках
			error_log("Error during loan request: " . $e->getMessage(), 3, "../debug.php");
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}

	private function requestLoan($data)
	{
		// Добавляем запись в таблицу 'loan'
		$insertLoanSql = "INSERT INTO loan (request_date, date_start, date_end, id_user, id_good, accord, comment) VALUES (CURDATE(), ?, ?, ?, ?, 1, ?);";
		$stmtLoan = $this->pdo->prepare($insertLoanSql);
		$stmtLoan->execute([$data['rentalDates']['start'], $data['rentalDates']['end'], $data['id_user'], $data['modelId'], $data['comments']]);
		return $stmtLoan->rowCount() > 0;
	}

	public function fetchRentals() {
		$stmt = $this->pdo->prepare("SELECT g.id_good, g.id_status, g.serial_number, u.lastname AS user_name, u.firstname AS user_surname, l.date_start, l.date_end, l.comment, m.name AS model_name FROM loan l JOIN good g ON l.id_good = g.id_good JOIN model m ON g.id_model = m.id_model JOIN user u ON l.id_user = u.id_user WHERE g.id_status = 4;");
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function updateRentalStatus($loanId, $newStatus, $newAccord) {
		$this->pdo->beginTransaction();
		try {
			$sql = "UPDATE loan SET id_status = ?, accord = ?, date_response = CURDATE() WHERE id_loan = ?";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute([$newStatus, $newAccord, $loanId]);

			if ($stmt->rowCount() > 0) {
				$this->pdo->commit();
				return ['success' => true, 'message' => 'Rental status updated successfully'];
			} else {
				$this->pdo->rollBack();
				return ['success' => false, 'message' => 'No changes were made. Check the loan ID and try again.'];
			}
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			error_log("Error during rental status update: " . $e->getMessage(), 3, "../debug.php");
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}
}
