<?php
require_once '../controllers/auth-controller.php';

session_start();

$authController = new AuthController();

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$response = $authController->login($email, $password);

header('Content-Type: application/json');
echo json_encode($response);
?>
