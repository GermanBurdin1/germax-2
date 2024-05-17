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
			$info['category'], // Теперь это правильно, мы обращаемся к $info
			$info['modelName'],
			$info['quantity'],
			$info['dateStart'],
			$info['dateEnd'],
			$info['comments']
		]);
		return ['success' => true, 'message' => 'Request created successfully'];
	}


	public function getAllRequests()
	{
		$sql = "SELECT * FROM Equipment_request";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute();
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function updateRequest($data)
{
    $fieldsToUpdate = [];
    $values = [];

		error_log("Received Data: " . print_r($data, true));

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

				error_log("Updated Request Data: " . print_r($updatedRequest, true));
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
}
