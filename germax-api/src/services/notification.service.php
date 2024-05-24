<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/user.service.php';

class NotificationService
{
	private $pdo;
	private $userService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->userService = new UserService();
	}

	public function createNotification($userId, $title, $message)
	{
		$sql = "INSERT INTO notification (title, message, date_notification) VALUES (:title, :message, NOW())";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['title' => $title, 'message' => $message]);
		$notificationId = $this->pdo->lastInsertId();

		$this->linkNotificationToUser($userId, $notificationId);
	}

	public function linkNotificationToUser($userId, $notificationId)
	{
		$sql = "INSERT INTO user_notification (id_user, id_notification, is_read) VALUES (:userId, :notificationId, 0)";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['userId' => $userId, 'notificationId' => $notificationId]);
	}

	public function markNotificationsAsRead($userId)
	{
		$sql = "UPDATE user_notification SET is_read = 1 WHERE id_user = :userId";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['userId' => $userId]);
	}

	public function getManagers()
	{
		return $this->userService->getUsersByPermission('rental-manager');
	}
}
