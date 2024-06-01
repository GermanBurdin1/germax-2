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
        SET lastname = :lastname, firstname = :firstname, phone = :phone, email = :email, date_birth = :date_birth, picture = :picture
        WHERE id_user = :id_user
    ";

    $stmt = $this->pdo->prepare($sql);
    return $stmt->execute([
        'lastname' => $data['lastname'],
        'firstname' => $data['firstname'],
        'phone' => $data['phone'],
        'email' => $data['email'],
        'date_birth' => $data['date_birth'],
				'picture' => $data['picture'],
        'id_user' => $userId
    ]);
}

public function getUserById($userId)
    {
        $sql = "
            SELECT firstname, lastname, picture
            FROM user
            WHERE id_user = :id_user
        ";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['id_user' => $userId]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

}
