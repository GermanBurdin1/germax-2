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
            WHERE un.Id_user = :userId
            ORDER BY n.date_notification DESC
        ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['userId' => $userId]);
		$notifications = $stmt->fetchAll(PDO::FETCH_ASSOC);
		return $notifications ? $notifications : [];
	}
}
