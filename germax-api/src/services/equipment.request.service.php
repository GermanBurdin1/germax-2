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
}
