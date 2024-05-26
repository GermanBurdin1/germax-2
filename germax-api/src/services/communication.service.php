<?php
// В разработке
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class CommunicationService
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->connect();
    }

    public function sendMessage($userId, $userType, $message)
    {
        $sql = "INSERT INTO message (Id_user, user_type, message, date_sent) VALUES (:Id_user, :user_type, :message, NOW())";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([
            'Id_user' => $userId,
            'user_type' => $userType,
            'message' => $message
        ]);
    }

    public function getMessagesByUserType($userType)
    {
        $sql = "SELECT * FROM message WHERE user_type = :user_type ORDER BY date_sent DESC";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['user_type' => $userType]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
?>
