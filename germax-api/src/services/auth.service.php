<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/render-success.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/token.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/permissions.service.php');

class AuthService
{
	private $pdo;
	private $permissionsService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->permissionsService = new PermissionsService();
	}

	public function login($email, $password)
	{
		$foundUser = $this->getUserByEmail($email);

		if (empty($foundUser)) {
			return renderErrorAndExit(['There is no user with this email'], 401);
		}

		// Пользователь всегда существует ниже

		if (!password_verify($password, $foundUser['password'])) {
			return renderErrorAndExit(["The password for user $email is incorrect"], 401);
		}

		// Код ниже выполняется, только если пользователь существует и передали правильный пароль

		$token = generateToken($foundUser['email']);

		return renderSuccessAndExit(['Token success created'], 200, [
			'token' => $token
		]);
	}

	/**
	 * Функция для обработки информации о пользователе.
	 *
	 * @param object $user Объект пользователя.
	 * @property string $user->lastName Фамилия пользователя.
	 * @property string $user->firstName Имя пользователя.
	 * @property string $user->phone Телефон пользователя.
	 * @property string $user->email Email пользователя.
	 * @property string $user->password Пароль пользователя.
	 * @return void
	 */
	public function register(
		$lastname,
		$firstname,
		$phone,
		$email,
		$password,
		$typePermission
	) {
		$foundUser = $this->getUserByEmail($email);

		if (empty($foundUser)) return renderErrorAndExit(
			["Пользователь с email {$email} уже существует"],
			401
		);

		$createdUser = $this->createUser(
			$lastname,
			$firstname,
			$phone,
			$email,
			$password,
			$typePermission
		);

		return renderSuccessAndExit(['User registered'], 200, $createdUser);
	}

	public function me($token)
	{
		$userByToken = $this->getUserByToken($token);

		// если userByToken не существует
		if ($userByToken == false) return renderErrorAndExit(['Invalid token'], 401);
		if ($userByToken == null) return renderErrorAndExit(['There is no user with this email'], 401);

		// если userByToken существует
		return renderSuccessAndExit(['User found'], 200, $userByToken);
	}

	private function getUserByToken($token)
	{
		// Декодируем токен
		$decodedToken = decrypt_token($token);  // Используем функцию для декодирования токена

		// Если токен недействителен или не может быть декодирован
		if ($decodedToken == false) return false;

		$user = $this->getUserByEmail($decodedToken['email']);

		if (empty($user)) return null;

		return $user;
	}


	// Создание пользователя, отдельная функция
	private function createUser(
		$lastname,
		$firstname,
		$phone,
		$email,
		$password,
		$namePermission
	) {
		$permission = $this->permissionsService->getByName($namePermission);

		if (!isset($permission)) return renderErrorAndExit(
			["Permission by name {$namePermission} not exist"],
			401
		);

		$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

		// Теперь у нас есть id_permission, и мы можем вставить нового пользователя
		$stmt = $this->pdo->prepare("INSERT INTO user (lastname, firstname, phone, password, email, id_permission) VALUES (:lastname, :firstname, :phone, :password, :email, :id_permission)");
		$stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
		$stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
		$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
		$stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->bindParam(':id_permission', $permission['id_permission'], PDO::PARAM_INT);
		$stmt->execute();

		$createdUser = $stmt->fetch();
		$createdUser['name_permission'] = $namePermission;

		return renderSuccessAndExit(['User successfully registered'], 200, $createdUser);
	}

	private function getUserByEmail($email)
	{
		$stmt = $this->pdo->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");

		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->execute();

		$user = $stmt->fetch();
		// var_dump($user);
		$permission = $this->permissionsService->getById($user['id_permission']);
		$user['name_permission'] = $permission['name'];

		return $user;
	}
}
