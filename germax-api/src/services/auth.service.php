<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/render-success.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/token.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/permissions.service.php');

class AuthService {
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

		// var_dump($foundUser, "foundUser");

		if (empty($foundUser)) {
			return renderErrorAndExit(['There is no user with this email'], 401);
		}

		// Пользователь всегда существует ниже

		if (!password_verify($password, $foundUser['password'])) {
			return renderErrorAndExit(["The password for user $email is incorrect"], 401);
		}

		if ($foundUser["authorization_permission"] == 0) {
			return renderErrorAndExit(["No authorization permission from manager"], 401);
		}

		// Код ниже выполняется, только если пользователь существует и передали правильный пароль

		$token = generateToken($foundUser['email']);
		$permission = $this->permissionsService->getById($foundUser['id_permission']);

		return renderSuccessAndExit(['Token success created'], 200, [
			'token' => $token,
			'id_user' => $foundUser['id_user'],
			'role' => $permission['name']
		]);
	}

	/**
	 * Функция для обработки информации о пользователе
	 *
	 * @param string $lastName Фамилия пользователя
	 * @param string $firstName Имя пользователя
	 * @param string $phone Телефон пользователя
	 * @param string $email Email пользователя
	 * @param string $password Пароль пользователя
	 * @param string $typePermission Тип пользователя
	 * @param string | NULL $faculty Тип пользователя
	 * @return void
	 */
	public function register(
		$lastname,
		$firstname,
		$phone,
		$email,
		$password,
		$typePermission,
		$faculty
	) {
		$foundUser = $this->getUserByEmail($email);

		if (!empty($foundUser)) return renderErrorAndExit(
			["Пользователь с email {$email} уже существует"],
			401
		);

		$createdUser = $this->createUser(
			$lastname,
			$firstname,
			$phone,
			$email,
			$password,
			$typePermission,
			$faculty
		);

		return renderSuccessAndExit(['User registered'], 200, $createdUser);
	}

	public function me($token) {
		$userByToken = $this->getUserByToken($token);

		// если userByToken не существует
		if ($userByToken == false) return renderErrorAndExit(['Invalid token'], 401);
		if ($userByToken == null) return renderErrorAndExit(['There is no user with this email'], 401);

		// если userByToken существует
		return renderSuccessAndExit(['User found'], 200, $userByToken);
	}

	public function getUserByToken($token) {
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
		$namePermission,
		$faculty
	) {
		$permission = $this->permissionsService->getByName($namePermission);

		if (!isset($permission)) return renderErrorAndExit(
			["Permission by name {$namePermission} not exist"],
			401
		);

		$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
		$faculty = $faculty == NULL ? "default" : $faculty;

		// Теперь у нас есть id_permission, и мы можем вставить нового пользователя
		$stmt = $this->pdo->prepare("INSERT INTO user (lastname, firstname, phone, password, email, id_permission, faculty, authorization_permission, connexion_permission) VALUES (:lastname, :firstname, :phone, :password, :email, :id_permission, :faculty, :authorization_permission, :connexion_permission)");
		$stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
		$stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
		$stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
		$stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->bindParam(':id_permission', $permission['id_permission'],PDO::PARAM_INT);
		$stmt->bindParam(':faculty', $faculty, PDO::PARAM_STR);
		$stmt->bindValue(':authorization_permission', 0, PDO::PARAM_INT);
		$stmt->bindValue(':connexion_permission', 'pending', PDO::PARAM_STR);
		$stmt->execute();

		$createdUser = $stmt->fetch();
		$createdUser = $this->getUserByEmail($email);

		if (empty($createdUser)) {
			return renderErrorAndExit(['Error with created user'], 401, [
				"createdUser" => $createdUser
			]);
		}

		return renderSuccessAndExit(['User successfully registered'], 200, $createdUser);
	}

	private function getUserByEmail($email)
	{
		$stmt = $this->pdo->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");

		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->execute();

		$user = $stmt->fetch();
		// var_dump($user);

		if (empty($user)) return NULL;

		$permission = $this->permissionsService->getById($user['id_permission']);
		$user['name_permission'] = $permission['name'];

		return $user;
	}

	public function get_pending_users() {
		$stmt = $this->pdo->prepare("SELECT * FROM user WHERE connexion_permission = 'pending'");
		$stmt->execute();

		$users = $stmt->fetchAll(PDO::FETCH_ASSOC);
		if (empty($users)) {
			return renderErrorAndExit(['No pending users found'], 404);
		}

		return renderSuccessAndExit(['Pending users found'], 200, $users);
	}

	public function update_user_status($user_id, $status) {
		$stmt = $this->pdo->prepare("UPDATE user SET connexion_permission = :status WHERE id_user = :user_id");
		$stmt->bindParam(':status', $status, PDO::PARAM_STR);
		$stmt->bindParam(':user_id', $user_id, PDO::PARAM_INT);
		$stmt->execute();

		if ($stmt->rowCount() == 0) {
			return renderErrorAndExit(['User not found or status not changed'], 404);
		}

		return renderSuccessAndExit(['User status updated'], 200);
	}
}
