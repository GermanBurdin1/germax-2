<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/render-success.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/sql-requests.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/goods.service.php');

class RentalService
{
	private $pdo;
	private $goodsService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->goodsService = new GoodsService();
	}

	public function checkAndReserveGoods($modelName, $quantity)
	{
		$availability = $this->goodsService->checkQuantityAvailableGoods($modelName, $quantity);

		if (!$availability['success']) {
			return ['success' => false, 'message' => 'Model not found or insufficient quantity'];
		}

		$reservedGoods = $this->goodsService->reserveGoods($availability['model_id'], $quantity);

		foreach ($reservedGoods as $good) {
			if (!$this->goodsService->updateGoodStatus($good['id_good'], 4)) {
				return ['success' => false, 'message' => 'Failed to reserve goods'];
			}
		}

		return ['success' => true, 'reservedGoods' => $reservedGoods];
	}

	public function addRental($data, $userId)
	{
		if (!$data['formInfo']['quantity'] || !$data['formInfo']['dateStart'] || !$data['formInfo']['dateEnd'] || !$data['idGood'] || !$userId) {
			return ['success' => false, 'message' => 'All fields including good ID, rental dates, and user ID are required'];
		}

		$modelName = $this->getModelNameByGoodId($data['idGood']);
		if (!$modelName) {
			return ['success' => false, 'message' => 'Model name not found'];
		}

		$this->pdo->beginTransaction();

		try {
			// Проверка и резервирование необходимого количества оборудования
			$reservation = $this->checkAndReserveGoods($modelName, $data['formInfo']['quantity']);

			if (!$reservation['success']) {
				$this->pdo->rollBack();
				return $reservation;
			}

			// Добавление каждой единицы оборудования в таблицу `loan`
			foreach ($reservation['reservedGoods'] as $good) {
				if (!$this->requestLoan([
					'dateStart' => $data['formInfo']['dateStart'],
					'dateEnd' => $data['formInfo']['dateEnd'],
					'id_user' => $userId,
					'goodId' => $good['id_good'],
					'comments' => $data['formInfo']['comments']
				])) {
					$this->pdo->rollBack();
					return ['success' => false, 'message' => 'Failed to record the loan'];
				}
			}

			$this->pdo->commit();
			return ['success' => true, 'message' => 'Rental requested and loan recorded successfully'];
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			error_log("Error during loan request: " . $e->getMessage(), 3, "../debug.php");
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}

	private function requestLoan($data)
	{
		$insertLoanSql = "INSERT INTO loan (request_date, date_start, date_end, id_user, id_good, accord, comment, loan_status, notification_sent) VALUES (CURDATE(), ?, ?, ?, ?, false, ?, 'loan_request', 0);";
		$stmtLoan = $this->pdo->prepare($insertLoanSql);
		$stmtLoan->execute([$data['dateStart'], $data['dateEnd'], $data['id_user'], $data['goodId'], $data['comments']]);
		return $stmtLoan->rowCount() > 0;
	}

	private function getModelNameByGoodId($goodId)
	{
		$sql = "SELECT model.name FROM good JOIN model ON good.id_model = model.id_model WHERE good.id_good = :goodId";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['goodId' => $goodId]);
		return $stmt->fetchColumn();
	}

	public function fetchRentals($page, $limit)
	{
		$offset = ($page - 1) * $limit;
		try {
			// Основной запрос для выборки данных с учетом пагинации
			$stmt = $this->pdo->prepare("
            SELECT g.id_good, g.id_status, g.serial_number, u.lastname AS user_name, u.firstname AS user_surname, u.id_user,
                   l.id_loan, l.date_start, l.date_end, l.comment, l.loan_status, m.name AS model_name
            FROM loan l
            JOIN good g ON l.id_good = g.id_good
            JOIN model m ON g.id_model = m.id_model
            JOIN user u ON l.id_user = u.id_user
            WHERE g.id_status IN (3, 4)
            OR (l.loan_status = 'cancelled' AND g.id_status = 1)
						OR (l.loan_status = 'returned' AND g.id_status = 1)
            LIMIT :limit OFFSET :offset;
        ");

			// Привязка параметров лимита и смещения
			$stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
			$stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
			$stmt->execute();
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// Запрос для подсчета общего количества элементов
			$countStmt = $this->pdo->prepare("
            SELECT COUNT(*)
            FROM loan l
            JOIN good g ON l.id_good = g.id_good
            JOIN model m ON g.id_model = m.id_model
            JOIN user u ON l.id_user = u.id_user
            WHERE g.id_status IN (3, 4)
        ");
			$countStmt->execute();
			$totalItems = $countStmt->fetchColumn();

			// Логирование результатов для отладки
			if (!$result) {
				error_log("fetchRentals query returned empty result.");
			} else {
				error_log("fetchRentals query result: " . print_r($result, true));
			}

			return [
				'data' => $result,
				'totalItems' => $totalItems
			];
		} catch (PDOException $e) {
			error_log("Error in fetchRentals: " . $e->getMessage());
			return [
				'data' => [],
				'totalItems' => 0
			];
		}
	}



	public function fetchRentalsByUser($userId)
	{
		error_log("fetchRentalsByUser called with userId: " . $userId);
		$sql = "
            SELECT
                l.id_loan AS id,
                l.date_start,
                l.date_end,
								l.return_date,
                l.accord,
                l.date_accord,
								l.loan_status,
                g.serial_number,
                m.name AS model_name,
								m.photo,
                s.name AS status_name,
                g.id_status
            FROM
                loan l
                JOIN good g ON l.id_good = g.id_good
                JOIN model m ON g.id_model = m.id_model
                JOIN status s ON g.id_status = s.id_status
            WHERE
                l.id_user = :userId
        ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['userId' => $userId]);

		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function updateRentalStatus($loanId, $newStatus, $newAccord)
	{
		$this->pdo->beginTransaction();
		try {
			$sql = "UPDATE loan SET id_status = ?, accord = ?, date_accord = CURDATE() WHERE id_loan = ?";
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

	public function addNewItemRental($data, $userId)
	{
		if (!$data['formInfo']['dateStart'] || !$data['formInfo']['dateEnd'] || !$data['idGood'] || !$userId) {
			return ['success' => false, 'message' => 'All fields including good ID, rental dates, and user ID are required'];
		}

		$this->pdo->beginTransaction();

		try {
			$loanData = [
				'date_start' => $data['formInfo']['dateStart'],
				'date_end' => $data['formInfo']['dateEnd'],
				'id_user' => $userId,
				'id_good' => $data['idGood'],
				'loan_status' => isset($data['formInfo']['loanStatus']) ? $data['formInfo']['loanStatus'] : 'loaned',
				'comment' => isset($data['formInfo']['comment']) ? $data['formInfo']['comment'] : ''
			];

			// Вставка данных в таблицу `loan`
			$sql = "INSERT INTO loan (request_date, date_start, date_end, id_user, id_good, accord, loan_status, comment) VALUES (CURDATE(),:date_start, :date_end, :id_user, :id_good, 1, :loan_status, :comment)";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute($loanData);

			$this->pdo->commit();
			return ['success' => true, 'message' => 'Rental requested and loan recorded successfully'];
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			error_log("Error during loan request: " . $e->getMessage(), 3, "../debug.php");
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}

	public function approveRental($loanId)
	{
		$this->pdo->beginTransaction();
		try {
			// Get the good ID associated with this loan
			$sql = "SELECT id_good FROM loan WHERE id_loan = :loanId";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['loanId' => $loanId]);
			$idGood = $stmt->fetchColumn();

			if (!$idGood) {
				$this->pdo->rollBack();
				error_log("Loan not found for Loan ID: " . $loanId);
				return ['success' => false, 'message' => 'Loan not found'];
			}

			// Update the good's status to loaned (assuming 3 is the loaned status)
			$sql = "UPDATE good SET id_status = 3 WHERE id_good = :idGood";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['idGood' => $idGood]);

			if ($stmt->rowCount() == 0) {
				$this->pdo->rollBack();
				return ['success' => false, 'message' => 'Failed to update good status'];
			}

			// Update the loan status to 'approved' and set accord and date_accord
			$sql = "UPDATE loan SET loan_status = 'approved', accord = 1, date_accord = CURDATE() WHERE id_loan = :loanId";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['loanId' => $loanId]);

			if ($stmt->rowCount() == 0) {
				$this->pdo->rollBack();
				return ['success' => false, 'message' => 'Failed to approve loan'];
			}

			// Check if there's an entry in equipment_request for this loan
			$sql = "SELECT COUNT(*) FROM equipment_request WHERE id_request = :loanId";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['loanId' => $loanId]);
			$requestCount = $stmt->fetchColumn();

			if ($requestCount > 0) {
				// Update the equipment_request table if there's an entry
				$sql = "UPDATE equipment_request SET treatment_status = 'treated_manager_user', equipment_status = 'not_sent' WHERE id_request = :loanId";
				$stmt = $this->pdo->prepare($sql);
				$stmt->execute(['loanId' => $loanId]);

				if ($stmt->rowCount() == 0) {
					$this->pdo->rollBack();
					return ['success' => false, 'message' => 'Failed to update equipment request status'];
				}
			}

			$this->pdo->commit();
			return ['success' => true, 'message' => 'Loan approved successfully'];
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}

	public function cancelRental($loanId)
	{
		$this->pdo->beginTransaction();
		try {
			// Get the good ID associated with this loan
			$sql = "SELECT id_good FROM loan WHERE id_loan = :loanId";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['loanId' => $loanId]);
			$idGood = $stmt->fetchColumn();

			if (!$idGood) {
				$this->pdo->rollBack();
				return ['success' => false, 'message' => 'Loan not found'];
			}

			// Update the good's status to available (assuming 1 is the available status)
			$sql = "UPDATE good SET id_status = 1 WHERE id_good = :idGood";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['idGood' => $idGood]);

			if ($stmt->rowCount() == 0) {
				$this->pdo->rollBack();
				return ['success' => false, 'message' => 'Failed to update good status'];
			}

			// Update the loan status to 'cancelled'
			$sql = "UPDATE loan SET loan_status = 'cancelled', accord = 0, date_accord = CURDATE()   WHERE id_loan = :loanId";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute(['loanId' => $loanId]);

			if ($stmt->rowCount() > 0) {
				$this->pdo->commit();
				return ['success' => true, 'message' => 'Loan cancelled successfully'];
			} else {
				$this->pdo->rollBack();
				return ['success' => false, 'message' => 'Failed to cancel loan'];
			}
		} catch (PDOException $e) {
			$this->pdo->rollBack();
			error_log("Error during loan cancellation: " . $e->getMessage(), 3, "../debug.php");
			return ['success' => false, 'message' => 'Database error: ' . $e->getMessage()];
		}
	}

	public function fetchLoanRequests()
	{
		try {
			$stmt = $this->pdo->prepare("
            SELECT l.id_loan, l.request_date, l.date_start, l.date_end, l.comment, u.lastname, u.firstname, g.serial_number, m.name as model_name
            FROM loan l
            JOIN user u ON l.id_user = u.id_user
            JOIN good g ON l.id_good = g.id_good
            JOIN model m ON g.id_model = m.id_model
            WHERE l.loan_status = 'loan_request' AND l.notification_sent = 0
        ");
			$stmt->execute();
			$result = $stmt->fetchAll(PDO::FETCH_ASSOC);

			// Обновление поля notification_sent
			$updateStmt = $this->pdo->prepare("UPDATE loan SET notification_sent = 1 WHERE id_loan = :id_loan");
			foreach ($result as $loan) {
				$updateStmt->execute(['id_loan' => $loan['id_loan']]);
			}

			return $result;
		} catch (PDOException $e) {
			error_log("Error fetching loan requests: " . $e->getMessage());
			return [];
		}
	}

	public function fetchRecentRentals($userId, $limit = 3)
	{
		try {
			$sql = "
				SELECT l.id_loan, l.date_start, l.date_end, g.serial_number, m.name as model_name
				FROM loan l
				JOIN good g ON l.id_good = g.id_good
				JOIN model m ON g.id_model = m.id_model
				WHERE l.id_user = :userId AND l.loan_status = 'loaned'
				ORDER BY l.date_start DESC
				LIMIT :limit
			";
			$stmt = $this->pdo->prepare($sql);
			$stmt->bindValue(':userId', $userId, PDO::PARAM_INT);
			$stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
			$stmt->execute();

			return $stmt->fetchAll(PDO::FETCH_ASSOC);
		} catch (PDOException $e) {
			error_log("Error fetching recent rentals: " . $e->getMessage());
			return [];
		}
	}
}
