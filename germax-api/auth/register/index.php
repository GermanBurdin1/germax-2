<?php

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
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $lastname = $_POST['lastname'] ?? null;
    $firstname = $_POST['firstname'] ?? null;
    $phone = $_POST['phone'] ?? null;
    $password = $_POST['password'] ?? null;
    $mail = $_POST['mail'] ?? null;




    $stmt = $pdo->prepare("INSERT INTO customer (lastname, firstname, phone, password, mail) VALUES (:lastname, :firstname, :phone, :password, :mail)");
    $stmt->bindParam(':lastname', $lastname, PDO::PARAM_STR);
    $stmt->bindParam(':firstname', $firstname, PDO::PARAM_STR);
    $stmt->bindParam(':phone', $phone, PDO::PARAM_STR);
    $stmt->bindParam(':password', password_hash($password, PASSWORD_DEFAULT), PDO::PARAM_STR);
    $stmt->bindParam(':mail', $mail, PDO::PARAM_STR);


    $stmt->execute();


    echo json_encode(['status' => 'success', 'message' => 'User registered successfully']);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method']);
}
?>
