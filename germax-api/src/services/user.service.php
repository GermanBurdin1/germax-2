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
		$sql = "
        UPDATE user
        SET lastname = :lastname, firstname = :firstname, phone = :phone, email = :email, date_birth = :date_birth, picture = :picture
        WHERE id_user = :id_user
    ";

		$stmt = $this->pdo->prepare($sql);
		return $stmt->execute([
			'lastname' => $data['lastname'],
			'firstname' => $data['firstname'],
			'phone' => $data['phone'],
			'email' => $data['email'],
			'date_birth' => $data['date_birth'],
			'picture' => $data['picture'],
			'id_user' => $userId
		]);
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
}
