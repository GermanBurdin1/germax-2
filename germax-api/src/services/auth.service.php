<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/validate.php');

class AuthService {
	private static $pdo;

	public function __construct() {
		self::$pdo = Database::connect();
	}

	public function login($email, $password) {

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
	public function register($user) {
		$createdUser = $this->createUser($user);

		return $createdUser;
	}

	private function createUser($user) {
		validateArrAssoc([
			"data" => $user,
			"errorCode" => 400,
			"errors" => [
				"lastName" => "lastName не отправлен, обязательное поле",
				"firstName" => "firstName не отправлен, обязательное поле",
			]
		]);

		$foundUser = $this->getUserByEmail($user["email"]);

		if (isset($foundUser)) {
			renderErrorAndExit(
				["Пользователь с email {$user["email"]} уже существует"],
				409
			);
		}

		// Создание пользователя, отдельная функция

		return $foundUser;
	}

	private function getUserByEmail($email) {
		// $stmt = self::$pdo->prepare("SELECT user.*, permission.name AS permission_name FROM user JOIN permission ON user.id_permission = permission.id_permission WHERE mail = :email LIMIT 1");
		$stmt = self::$pdo->prepare("SELECT * FROM user WHERE email = :email LIMIT 1");

		$stmt->bindParam(':email', $email, PDO::PARAM_STR);
		$stmt->execute();

		$result = $stmt->fetch(PDO::FETCH_ASSOC);

		return $result;
	}
}

?>
