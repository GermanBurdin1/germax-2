<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class UserService
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->connect();
    }

    public function getUsersByPermission($permissionName)
    {
        $sql = "
            SELECT id_user
            FROM _user
            WHERE id_permission = (
                SELECT id_permission FROM permission WHERE name = :permissionName
            )
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['permissionName' => $permissionName]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
