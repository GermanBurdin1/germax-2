<?php
session_start();

$host = 'localhost';
$dbname = 'version2';
$user = 'root';
$pass = '';
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

$dsn = "mysql:host=$host;dbname=$dbname";

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    die("Could not connect to the database $dbname :" . $e->getMessage());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['mail'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($email) || empty($password)) {
        echo json_encode(['status' => 'error', 'message' => 'All fields are required.']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT * FROM customer WHERE mail = :email LIMIT 1");
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    if ($user = $stmt->fetch()) {
        if (password_verify($password, $user['password'])) {
            $_SESSION['user_id'] = $user['Id_customer'];
            $_SESSION['user_email'] = $user['mail'];
            header("Location: ../views/equipment/list.html.php");
            exit;
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Invalid login credentials.']);
            exit;
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not found.']);
        exit;
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
    exit;
}
?>
