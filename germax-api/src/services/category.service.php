<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class CategoryService
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->connect();
    }

    public function addCategory($categoryName)
    {
        $sql = "INSERT INTO type (name) VALUES (:name)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['name' => $categoryName]);

				$notificationId = $this->createNotification('New Category Added', 'A new category has been added: ' . $categoryName);
        $managers = $this->getManagers();
        foreach ($managers as $manager) {
            $this->linkNotificationToUser($manager['id_user'], $notificationId);
        }
    }

		private function createNotification($title, $message)
    {
        $sql = "INSERT INTO notification (title, message, date_notification) VALUES (:title, :message, NOW())";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['title' => $title, 'message' => $message]);
        return $this->pdo->lastInsertId();

    }

    private function linkNotificationToUser($userId, $notificationId)
    {
        $sql = "INSERT INTO user_notification (id_user, id_notification) VALUES (:userId, :notificationId)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['userId' => $userId, 'notificationId' => $notificationId]);
    }

    private function getManagers()
    {
        $sql = "SELECT id_user FROM user WHERE id_permission = (SELECT id_permission FROM permission WHERE name = 'rental-manager')";
        $stmt = $this->pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
