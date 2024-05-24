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

		$title = 'New Category Added';
		$message = 'A new category has been added: ' . $categoryName;
		$managers = $this->getManagers();
		foreach ($managers as $manager) {
			try {
				$this->notificationService->createNotification($manager['id_user'], $title, $message);
			} catch (Exception $e) {
				error_log("CategoryService::addCategory - Failed to create notification for user {$manager['id_user']}: " . $e->getMessage());
			}
		}
	}

	private function getManagers()
	{
		$sql = "SELECT id_user FROM user WHERE id_permission = (SELECT id_permission FROM permission WHERE name = 'rental-manager')";
		$stmt = $this->pdo->query($sql);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
