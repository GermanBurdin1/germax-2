<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
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
		$lastname, $firstname, $phone, $email, $password, $typePermission, $faculty
	)
	{
		if (empty($email)) return renderErrorAndExit(["email does not exist"], 400);
		if (empty($password)) return renderErrorAndExit(["password does not exist"], 400);
		if (empty($phone)) return renderErrorAndExit(["phone does not exist"], 400);
		if (empty($password)) return renderErrorAndExit(["password does not exist"], 400);
		if (empty($typePermission)) return renderErrorAndExit(["typePermission does not exist"], 400);

		return $this->authService->register(
			$lastname, $firstname, $phone, $email, $password, $typePermission, $faculty
		);
	}

	public function me($token) {
		if (empty($token)) return renderErrorAndExit(["token does not exist"], 400);

		return $this->authService->me($token);
	}

	public function get_pending_users() {
		return $this->authService->get_pending_users();
	}

	public function get_processed_users() {
		return $this->authService->get_processed_users();
	}

	public function update_user_status($user_id, $status, $authorization) {
		return $this->authService->update_user_status($user_id, $status, $authorization);
	}

	public function getUserByToken($token) {
		return $this->authService->getUserByToken($token);
}

public function getUserPermission($userId) {
		return $this->authService->getUserPermission($userId);
}
}
