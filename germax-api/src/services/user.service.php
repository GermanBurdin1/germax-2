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

		public function updateUser($userId, $data)
{
    $sql = "
        UPDATE user
        SET lastname = :lastname, firstname = :firstname, phone = :phone, email = :email, date_birth = :date_birth
        WHERE id_user = :id_user
    ";

    $stmt = $this->pdo->prepare($sql);
    return $stmt->execute([
        'lastname' => $data['lastname'],
        'firstname' => $data['firstname'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'date_birth' => $data['date_birth'],
        'id_user' => $userId
    ]);
}

}
