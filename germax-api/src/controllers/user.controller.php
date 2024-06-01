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

	public function updateUser($userId, $data)
	{
		$fields = [];
		$params = ['id_user' => $userId];

		if (isset($data['phone'])) {
			$fields[] = 'phone = :phone';
			$params['phone'] = $data['phone'];
		}
		if (isset($data['email'])) {
			$fields[] = 'email = :email';
			$params['email'] = $data['email'];
		}
		if (isset($data['date_birth'])) {
			$fields[] = 'date_birth = :date_birth';
			$params['date_birth'] = $data['date_birth'];
		}
		if (isset($data['useful_information'])) {
			$fields[] = 'useful_information = :useful_information';
			$params['useful_information'] = $data['useful_information'];
		}

		if (empty($fields)) {
			return false;
		}

		$sql = "UPDATE user SET " . implode(', ', $fields) . " WHERE id_user = :id_user";

		$stmt = $this->pdo->prepare($sql);
		return $stmt->execute($params);
	}
}
