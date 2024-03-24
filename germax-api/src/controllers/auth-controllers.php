<?php
// AuthController.php
require_once './utils/database.php';

class AuthController {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function login($email, $password) {
        $stmt = $this->pdo->prepare("SELECT * FROM customer WHERE mail = :email LIMIT 1");
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        if ($user = $stmt->fetch()) {
            if (password_verify($password, $user['password'])) {
                $_SESSION['user_id'] = $user['Id_customer'];
                $_SESSION['user_email'] = $user['mail'];
                return ['status' => 'success', 'message' => 'Logged in successfully'];
            } else {
                return ['status' => 'error', 'message' => 'Invalid login credentials'];
            }
        } else {
            return ['status' => 'error', 'message' => 'User not found'];
        }
    }

    public function register($lastname, $firstname, $phone, $mail, $password) {
        $stmt = $this->pdo->prepare("INSERT INTO customer (lastname, firstname, phone, password, mail) VALUES (:lastname, :firstname, :phone, :password, :mail)");
        $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
        $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
        $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt->bindParam(':password', $hashedPassword, PDO::PARAM_STR);
        $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);
        $stmt->execute();

        return ['status' => 'success', 'message' => 'User registered successfully'];
    }
}
?>
