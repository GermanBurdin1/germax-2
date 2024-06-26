<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/user.service.php';

class UserController
{
	private $pdo;
	private $userService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->userService = new UserService();
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
    return $this->userService->updateUser($userId, $data);
}

	public function getUserById($userId)
	{
		return $this->userService->getUserById($userId);
	}

	public function getUserInformationById($userId)
	{
		return $this->userService->getUserInformationById($userId);
	}

	public function updateUserStatus($data)
	{
		if (!isset($data['id_user']) || !isset($data['connexion_permission'])) {
			echo json_encode(['success' => false, 'message' => 'Missing required fields']);
			return;
		}

		$result = $this->userService->updateUserStatus($data['id_user'], $data['connexion_permission']);
		if ($result) {
			echo json_encode(['success' => true, 'message' => 'User status updated successfully']);
		} else {
			echo json_encode(['success' => false, 'message' => 'Failed to update user status']);
		}
	}
}
