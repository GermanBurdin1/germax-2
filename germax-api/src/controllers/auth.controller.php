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
	}

	public function me($token) {
		if (empty($token)) return renderErrorAndExit(["token does not exist"], 400);

		return $this->authService->me($token);
	}
}
