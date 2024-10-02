<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');

class SettingsService
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function saveSettings($data)
	{
		if (!isset($data['id_permission']) || !isset($data['id_functionality']) || !isset($data['max_reservations'])) {
			return ['success' => false, 'message' => 'Missing required fields'];
		}

		// Получаем текущее значение
		$sqlSelect = "SELECT * FROM functionnality_permission WHERE id_permission = ? AND id_functionality = ?";
		$stmtSelect = $this->pdo->prepare($sqlSelect);
		$stmtSelect->execute([$data['id_permission'], $data['id_functionality']]);
		$existingSetting = $stmtSelect->fetch(PDO::FETCH_ASSOC);

		if ($existingSetting) {
			// Если новое значение не введено, сохраняем старое
			$maxReservations = $data['max_reservations'] ?: $existingSetting['max_reservations'];
			// Обновляем значение
			$sqlUpdate = "UPDATE functionnality_permission SET max_reservations = ? WHERE id_permission = ? AND id_functionality = ?";
			$stmtUpdate = $this->pdo->prepare($sqlUpdate);
			$stmtUpdate->execute([
				$maxReservations,
				$data['id_permission'],
				$data['id_functionality']
			]);
		} else {
			// Вставляем новое значение, если оно не существует
			$sqlInsert = "INSERT INTO functionnality_permission (id_permission, id_functionality, max_reservations) VALUES (?, ?, ?)";
			$stmtInsert = $this->pdo->prepare($sqlInsert);
			$stmtInsert->execute([
				$data['id_permission'],
				$data['id_functionality'],
				$data['max_reservations']
			]);
		}

		if ($stmtSelect->rowCount() > 0) {
			return ['success' => true, 'message' => 'Settings saved successfully'];
		} else {
			return ['success' => false, 'message' => 'Failed to save settings'];
		}
	}

	public function getSettings()
	{
		$sql = "SELECT fp.id_permission, fp.id_functionality, fp.max_reservations, p.name AS permission_name, f.name AS functionality_name
                FROM functionnality_permission fp
                JOIN permission p ON fp.id_permission = p.id_permission
                JOIN functionality f ON fp.id_functionality = f.id_functionality";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute();

		$settings = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if ($settings) {
			error_log("Settings fetched: " . json_encode($settings)); // Add this line
			return ['success' => true, 'data' => $settings];
		} else {
			error_log("No settings found"); // Add this line
			return ['success' => false, 'message' => 'No settings found'];
		}
	}
}
