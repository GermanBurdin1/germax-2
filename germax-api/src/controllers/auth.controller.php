<?php

// AuthController.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

// AuthService.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

// AuthService.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');

class AuthController
{
	private $authService;

	public function __construct()
	{
		$this->authService = new AuthService();
	}

	public function login($email, $password)
	{
		if (empty($email)) return renderErrorAndExit(["email does not exist"], 400);
		if (empty($password)) return renderErrorAndExit(["password does not exist"], 400);

		return $this->authService->login($email, $password);
	}



	public function register(
		$lastname, $firstname, $phone, $email, $password, $typePermission
	)
	{
		if (empty($email)) return renderErrorAndExit(["email does not exist"], 400);
		if (empty($password)) return renderErrorAndExit(["password does not exist"], 400);
		if (empty($phone)) return renderErrorAndExit(["phone does not exist"], 400);
		if (empty($password)) return renderErrorAndExit(["password does not exist"], 400);
		if (empty($typePermission)) return renderErrorAndExit(["typePermission does not exist"], 400);

		return $this->authService->register(
			$lastname, $firstname, $phone, $email, $password, $typePermission
		);
		// Получаем id_permission для данного типа пользователя
		// $permissionStmt = $this->pdo->prepare("SELECT id_permission FROM permission WHERE name = :type");
		// $permissionStmt->bindParam(':type', $type, PDO::PARAM_STR); // Привязываем параметр перед вызовом execute
		// $permissionStmt->execute(); // Теперь выполняем запрос

		// $permission = $permissionStmt->fetch();
		// if (!$permission) {
		// 	return ['status' => 'error', 'message' => 'Permission type not found'];
		// }

		// $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

		// // Теперь у нас есть id_permission, и мы можем вставить нового пользователя
		// $stmt = $this->pdo->prepare("INSERT INTO user (lastname, firstname, phone, password, email, id_permission) VALUES (:lastname, :firstname, :phone, :password, :mail, :id_permission)");
		// $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
		// $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
		// $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
		// $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
		// $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
		// $stmt->bindParam(':id_permission', $permission['id_permission'], PDO::PARAM_INT);
		// $stmt->execute();

		// return ['status' => 'success', 'message' => 'User registered successfully'];
	}
}
