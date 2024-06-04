<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/token.php');

class EquipmentRequestService
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function createFirstRequestFromUser($data)
	{
		// Убедитесь, что $data содержит нужную структуру
		$info = $data['formRequestItemInfo'];

		$sql = "INSERT INTO equipment_request (request_date, id_user, id_type, equipment_name, quantity, date_start, date_end, comment, treatment_status, equipment_status) VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?, 'pending_manager', 'equipment_availability_pending')";
		$stmt = $this->pdo->prepare($sql);
		// Передаем данные из $info, а не напрямую из $data
		$stmt->execute([
			$data['id_user'], // id_user из основного массива $data
			$info['id_type'], // Теперь это правильно, мы обращаемся к $info
			$info['modelName'],
			$info['quantity'],
			$info['dateStart'],
			$info['dateEnd'],
			$info['comments']
		]);
		return ['success' => true, 'message' => 'Request created successfully'];
	}

	public function createFirstRequestFromManager($data)
	{
		// Убедитесь, что $data содержит нужную структуру
		$info = $data['formRequestItemInfo'];

		$sql = "INSERT INTO equipment_request (request_date, id_user, id_type, equipment_name, quantity, comment, treatment_status, equipment_status) VALUES (CURDATE(), ?, ?, ?, ?, ?, 'pending_stockman', 'equipment_availability_pending')";
		$stmt = $this->pdo->prepare($sql);
		// Передаем данные из $info, а не напрямую из $data
		$stmt->execute([
			$data['id_user'],
			$info['id_type'],
			$info['modelName'],
			$info['quantity'],
			$info['comments']
		]);
		return ['success' => true, 'message' => 'Request created successfully'];
	}

	public function getAllRequests()
	{
		$sql = "
        SELECT
            er.id_request,
            er.request_date,
            er.date_start,
            er.date_end,
            er.equipment_name,
            er.quantity,
            er.treatment_status,
            er.response_date,
            er.comment,
            er.id_type,
            er.id_user,
            er.equipment_status,
            er.id_good,
            m.photo
        FROM
            equipment_request er
        LEFT JOIN
            good g ON er.id_good = g.id_good
        LEFT JOIN
            model m ON g.id_model = m.id_model
    ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function getAllRequestsByUser($id)
	{
		$sql = "
        SELECT
            er.id_request,
            er.request_date,
            er.date_start,
            er.date_end,
            er.equipment_name,
            er.quantity,
            er.treatment_status,
            er.response_date,
            er.comment,
            er.id_type,
            er.id_user,
            er.equipment_status,
            er.id_good,
            m.photo
        FROM
						user u
				LEFT JOIN
            equipment_request er ON er.id_user = u.id_user
        LEFT JOIN
            good g ON er.id_good = g.id_good
        LEFT JOIN
            model m ON g.id_model = m.id_model
				WHERE u.id_user = ?
    ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$id]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}



	public function updateRequest($data)
	{
		$fieldsToUpdate = [];
		$values = [];

		// Добавьте проверку существования записи перед обновлением
		$sqlCheck = "SELECT * FROM equipment_request WHERE id_request = ?";
		$stmtCheck = $this->pdo->prepare($sqlCheck);
		$stmtCheck->execute([$data['id_request']]);
		$existingData = $stmtCheck->fetch(PDO::FETCH_ASSOC);

		if (!$existingData) {
			error_log("No record found with id_request: " . $data['id_request']);
			return ['success' => false, 'message' => 'Record not found'];
		}

		error_log("Existing data: " . json_encode($existingData));
		error_log("Update data: " . json_encode($data));


		if (isset($data['equipment_name'])) {
			$fieldsToUpdate[] = 'equipment_name = ?';
			$values[] = $data['equipment_name'];
		}

		if (isset($data['quantity'])) {
			$fieldsToUpdate[] = 'quantity = ?';
			$values[] = $data['quantity'];
		}

		if (isset($data['date_start'])) {
			$fieldsToUpdate[] = 'date_start = ?';
			$values[] = $data['date_start'];
		}

		if (isset($data['date_end'])) {
			$fieldsToUpdate[] = 'date_end = ?';
			$values[] = $data['date_end'];
		}

		if (isset($data['comment'])) {
			$fieldsToUpdate[] = 'comment = ?';
			$values[] = $data['comment'];
		}

		if (isset($data['treatment_status'])) {
			$fieldsToUpdate[] = 'treatment_status = ?';
			$values[] = $data['treatment_status'];
		}

		if (isset($data['equipment_status'])) {
			$fieldsToUpdate[] = 'equipment_status = ?';
			$values[] = $data['equipment_status'];
		}

		if (isset($data['id_type'])) {
			$fieldsToUpdate[] = 'id_type = ?';
			$values[] = $data['id_type'];
		}

		if (isset($data['id_user'])) {
			$fieldsToUpdate[] = 'id_user = ?';
			$values[] = $data['id_user'];
		}

		if (isset($data['id_good'])) {
			$fieldsToUpdate[] = 'id_good = ?';
			$values[] = $data['id_good'];
		}

		$values[] = $data['id_request'];

		$sql = "UPDATE equipment_request SET " . implode(', ', $fieldsToUpdate) . " WHERE id_request = ?";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute($values);

		error_log("SQL Query: $sql");
		error_log("Values: " . implode(', ', $values));

		if ($stmt->rowCount() > 0) {
			// Получаем обновленную запись, чтобы вернуть её клиенту
			$sql = "SELECT * FROM equipment_request WHERE id_request = ?";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute([$data['id_request']]);
			$updatedRequest = $stmt->fetch(PDO::FETCH_ASSOC);
			return ['success' => true, 'data' => $updatedRequest];
		} else {
			return ['success' => false, 'message' => 'No rows updated'];
		}
	}



	public function sendUpdatedDataToUser($data)
	{
		// Логика отправки данных пользователю
		// Например, обновление записи в базе данных и уведомление пользователя
		$sql = "UPDATE equipment_request SET treatment_status = 'rental_details_discussion_manager_user' WHERE id_request = ?";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$data['id_request']]);

		if ($stmt->rowCount() > 0) {
			$sql = "SELECT * FROM equipment_request WHERE id_request = ?";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute([$data['id_request']]);
			$updatedRequest = $stmt->fetch(PDO::FETCH_ASSOC);

			return ['success' => true, 'data' => $updatedRequest];
		} else {
			return ['success' => false, 'message' => 'No rows updated'];
		}
	}

	public function confirmApproval($data)
	{
		$sql = "UPDATE equipment_request SET treatment_status = ?, equipment_status = ? WHERE id_request = ?";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([
			$data['treatment_status'],
			$data['equipment_status'],
			$data['id_request']
		]);

		if ($stmt->rowCount() > 0) {
			$sql = "SELECT * FROM equipment_request WHERE id_request = ?";
			$stmt = $this->pdo->prepare($sql);
			$stmt->execute([$data['id_request']]);
			$updatedRequest = $stmt->fetch(PDO::FETCH_ASSOC);

			return ['success' => true, 'data' => $updatedRequest];
		} else {
			return ['success' => false, 'message' => 'No rows updated'];
		}
	}

	public function createRequest($data)
	{
		if (
			!isset($data['id_request']) ||
			!isset($data['equipment_name']) ||
			!isset($data['quantity']) ||
			!isset($data['date_start']) ||
			!isset($data['date_end']) ||
			!isset($data['treatment_status']) ||
			!isset($data['equipment_status']) ||
			!isset($data['id_type']) ||
			!isset($data['id_good']) ||
			!isset($data['request_date'])
		) {
			return ['success' => false, 'message' => 'Missing required fields'];
		}
		error_log('dataInCreateRequest: ' . print_r($data, true));
		$sql = "INSERT INTO equipment_request
            (id_request, equipment_name, quantity, date_start, date_end, treatment_status, equipment_status, id_type, id_user, id_good, request_date)
            VALUES (:id_request, :equipment_name, :quantity, :date_start, :date_end, :treatment_status, :equipment_status, :id_type, :id_user, :id_good, :request_date)";
		$stmt = $this->pdo->prepare($sql);

		try {
			$stmt->execute([
				'id_request' => $data['id_request'],
				'equipment_name' => $data['equipment_name'],
				'quantity' => $data['quantity'],
				'date_start' => $data['date_start'],
				'date_end' => $data['date_end'],
				'treatment_status' => $data['treatment_status'],
				'equipment_status' => $data['equipment_status'],
				'id_user' => $data['id_user'],
				'id_type' => $data['id_type'],
				'id_good' => $data['id_good'],
				'request_date' => $data['request_date']
			]);
			error_log('Executed query: ' . $sql);
			error_log('Executed with parameters: ' . print_r($data, true));
			return ['success' => true, 'id_request' => $this->pdo->lastInsertId()];
		} catch (PDOException $e) {
			return ['success' => false, 'message' => 'SQL query error', 'error' => $e->getMessage()];
		}
	}

	public function getRequestById($id)
	{
		$sql = "SELECT * FROM equipment_request WHERE id_request = ?";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$id]);
		$request = $stmt->fetch(PDO::FETCH_ASSOC);

		if ($request) {
			return ['success' => true, 'data' => $request];
		} else {
			return ['success' => false, 'message' => 'Request not found'];
		}
	}

	public function cancelRequest($id_request)
	{
		error_log("Cancelling request with ID: $id_request");
		$sql = "UPDATE equipment_request SET treatment_status = 'closed_by_user', equipment_status = 'canceled' WHERE id_request = ?";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([$id_request]);

		if ($stmt->rowCount() > 0) {
			return ['success' => true];
		} else {
			error_log("No rows updated for request ID: $id_request");
			return ['success' => false, 'message' => 'No rows updated'];
		}
	}
}
