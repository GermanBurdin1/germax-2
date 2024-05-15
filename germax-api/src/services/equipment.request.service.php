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
		$sql = "UPDATE equipment_request SET equipment_name = ?, quantity = ?, date_start = ?, date_end = ?, comment = ?, treatment_status = ? WHERE id_request = ?";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute([
			$data['equipment_name'],
			$data['quantity'],
			$data['date_start'],
			$data['date_end'],
			$data['comment'],
			$data['treatment_status'],
			$data['id_request']
		]);

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
		$sql = "UPDATE equipment_request SET treatment_status = 'treated_manager_user' WHERE id_request = ?";
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
}
