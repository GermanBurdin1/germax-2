<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class UserController
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->connect();
    }

    public function getUsersByPermission($permissionName)
    {
        $sql = "
            SELECT u.id_user, u.lastname, u.firstname, u.email
            FROM user u
            JOIN permission p ON u.id_permission = p.id_permission
            WHERE p.name = :permissionName
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['permissionName' => $permissionName]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
