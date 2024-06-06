<?php

class PermissionsService {
	private $pdo;

	public function __construct() {
		$this->pdo = (new Database())->connect();
	}

	public function getAll() {
		$stmt = $this->pdo->prepare("SELECT * FROM permission");
		$stmt->execute(); // Теперь выполняем запрос

		$permission = $stmt->fetch();

		return $permission;
	}

	public function getByName($name) {
		$stmt = $this->pdo->prepare("SELECT id_permission FROM permission WHERE name = :name");
		$stmt->bindParam(':name', $name, PDO::PARAM_STR); // Привязываем параметр перед вызовом execute
		$stmt->execute(); // Теперь выполняем запрос

		$permission = $stmt->fetch();

		return $permission;
	}

	public function getById($id) {
		$stmt = $this->pdo->prepare("SELECT * FROM permission WHERE id_permission = :id");
		$stmt->bindParam(':id', $id, PDO::PARAM_STR); // Привязываем параметр перед вызовом execute
		$stmt->execute(); // Теперь выполняем запрос

		$permission = $stmt->fetch();

		return $permission;
	}


}

?>
