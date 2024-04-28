<?php

// AuthController.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

// AuthService.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

class AuthController
{
	private $pdo;
	private $authService;

	public function __construct()
	{
		$this->pdo = Database::connect();
		$this->authService = new AuthService();
	}

	public function login($email, $password)
	{
		// $authService->login();
		// $stmt = $this->pdo->prepare("SELECT user.*, permission.name AS permission_name FROM user JOIN permission ON user.id_permission = permission.id_permission WHERE email = :email LIMIT 1");
		// $stmt->bindParam(':email', $email, PDO::PARAM_STR);
		// $stmt->execute();

		// if ($user = $stmt->fetch()) {
		// 	if (password_verify($password, $user['password'])) {
		// 		$_SESSION['user_id'] = $user['id_user'];
		// 		$_SESSION['user_email'] = $user['email'];
		// 		$_SESSION['user_type'] = $user['permission_name'];
		// 		echo json_encode([
		// 			'status' => 'success',
		// 			'message' => 'Logged in successfully',
		// 			'user_type' => $user['permission_name'],
		// 			'user_email' => $user['email']
		// 		]);
		// 	} else {
		// 		echo json_encode(['status' => 'error', 'message' => 'Invalid login credentials']);
		// 	}
		// } else {
		// 	echo json_encode(['status' => 'error', 'message' => 'User not found']);
		// }
		// exit(); // Добавьте exit() чтобы гарантировать прекращение скрипта после отправки ответа.

	}



	public function register($lastname, $firstname, $phone, $mail, $password, $type)
	{
		// Получаем id_permission для данного типа пользователя
		$permissionStmt = $this->pdo->prepare("SELECT id_permission FROM permission WHERE name = :type");
		$permissionStmt->bindParam(':type', $type, PDO::PARAM_STR); // Привязываем параметр перед вызовом execute
		$permissionStmt->execute(); // Теперь выполняем запрос

		$permission = $permissionStmt->fetch();
		if (!$permission) {
			return ['status' => 'error', 'message' => 'Permission type not found'];
		}

		$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

		// Теперь у нас есть id_permission, и мы можем вставить нового пользователя
		$stmt = $this->pdo->prepare("INSERT INTO user (lastname, firstname, phone, password, email, id_permission) VALUES (:lastname, :firstname, :phone, :password, :mail, :id_permission)");
		$stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
		$stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
		$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
		$stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
		$stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
		$stmt->bindParam(':id_permission', $permission['id_permission'], PDO::PARAM_INT);
		$stmt->execute();

		return ['status' => 'success', 'message' => 'User registered successfully'];
	}
}
