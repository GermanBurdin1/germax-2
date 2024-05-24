<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/notification.service.php';

class CategoryService
{
	private $pdo;
	private $notificationService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->notificationService = new NotificationService();
	}

	public function addCategory($categoryName)
	{
		$sql = "INSERT INTO type (name) VALUES (:name)";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['name' => $categoryName]);

		$notificationId = $this->notificationService->createNotification(
			null,
			'New Category Added',
			'A new category has been added: ' . $categoryName
		);

		$managers = $this->getManagers();
		foreach ($managers as $manager) {
			$this->notificationService->linkNotificationToUser($manager['id_user'], $notificationId);
		}
	}

	private function getManagers()
	{
		$sql = "SELECT id_user FROM _user WHERE id_permission = (SELECT id_permission FROM permission WHERE name = 'rental-manager')";
		$stmt = $this->pdo->query($sql);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
