<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class UserService
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function getUsersByPermission($permissionName)
	{
		$sql = "
            SELECT id_user
            FROM _user
            WHERE id_permission = (
                SELECT id_permission FROM permission WHERE name = :permissionName
            )
        ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['permissionName' => $permissionName]);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}

	public function updateUser($userId, $data)
	{
		$fields = [];
		$params = ['id_user' => $userId];

		error_log("Received data: " . print_r($data, true));

		if (isset($data['lastname'])) {
			$fields[] = 'lastname = :lastname';
			$params['lastname'] = $data['lastname'];
		}
		if (isset($data['firstname'])) {
			$fields[] = 'firstname = :firstname';
			$params['firstname'] = $data['firstname'];
		}
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
		if (isset($data['picture'])) {
			$fields[] = 'picture = :picture';
			$params['picture'] = $data['picture'];
		}
		if (isset($data['connexion_permission'])) {
			$fields[] = 'connexion_permission = :connexion_permission';
			$params['connexion_permission'] = $data['connexion_permission'];
		}
		if (isset($data['authorization_permission'])) {
			$fields[] = 'authorization_permission = :authorization_permission';
			$params['authorization_permission'] = $data['authorization_permission'];
		}

		// Always update the creation_date field
		$fields[] = 'creation_date = CURDATE()';

		if (empty($fields)) {
			error_log("No fields to update");
			return false;
		}

		$sql = "UPDATE user SET " . implode(', ', $fields) . " WHERE id_user = :id_user";

		$stmt = $this->pdo->prepare($sql);
		error_log("SQL: " . $sql);
		error_log("Params: " . print_r($params, true));

		$result = $stmt->execute($params);

		if (!$result) {
			$errorInfo = $stmt->errorInfo();
			error_log("SQL Error: " . $errorInfo[2]);
		} else {
			error_log("Update successful for user ID: " . $userId);
		}

		return $result;
	}

	public function getUserById($userId)
	{
		$sql = "
            SELECT firstname, lastname, picture
            FROM user
            WHERE id_user = :id_user
        ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['id_user' => $userId]);
		return $stmt->fetch(PDO::FETCH_ASSOC);
	}

	public function getUserInformationById($userId)
	{
		$sql = "
        SELECT
            u.email,
            u.phone,
            u.picture,
            l.date_start,
            l.date_end,
            l.return_date,
            l.loan_status,
            g.state
        FROM user u
        JOIN loan l ON u.id_user = l.id_user
        JOIN good g ON l.id_good = g.id_good
        WHERE u.id_user = :id_user
    ";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['id_user' => $userId]);
		$data = $stmt->fetchAll(PDO::FETCH_ASSOC);

		if (!$data) {
			return null;
		}

		$userInfo = [
			'email' => $data[0]['email'],
			'phone' => $data[0]['phone'],
			'picture' => $data[0]['picture'],
			'rentals' => []
		];

		foreach ($data as $row) {
			$userInfo['rentals'][] = [
				'date_start' => $row['date_start'],
				'date_end' => $row['date_end'],
				'return_date' => $row['return_date'],
				'loan_status' => $row['loan_status'],
				'state' => $row['state']
			];
		}

		return $userInfo;
	}

	public function updateUserStatus($userId, $connexion_permission)
	{
		$sql = "
            UPDATE user
            SET connexion_permission = :connexion_permission,
						creation_date = CURDATE()
            WHERE id_user = :id_user
        ";

		$stmt = $this->pdo->prepare($sql);
		return $stmt->execute([
			'connexion_permission' => $connexion_permission,
			'id_user' => $userId
		]);
	}
}
