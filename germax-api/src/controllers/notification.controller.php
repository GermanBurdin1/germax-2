<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/category.service.php';

class NotificationController
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function getNotifications($userId)
	{
		$sql = "
        SELECT n.id_notification, n.title, n.message, n.date_notification
        FROM notification n
        JOIN user_notification un ON n.id_notification = un.id_notification
        WHERE un.id_user = :userId AND un.is_read = 0
        ORDER BY n.date_notification DESC
    ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['userId' => $userId]);
		$notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $notifications ? $notifications : [];
	}

	public function markNotificationsAsRead($userId)
	{
		$sql = "
        UPDATE user_notification
        SET is_read = 1
        WHERE id_user = :userId
    ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['userId' => $userId]);
	}
}
