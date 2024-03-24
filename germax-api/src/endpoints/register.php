<?php
require_once '../controllers/auth-controller.php';

session_start();

$authController = new AuthController();

$lastname = $_POST['lastname'] ?? '';
$firstname = $_POST['firstname'] ?? '';
$phone = $_POST['phone'] ?? '';
$mail = $_POST['mail'] ?? '';
$password = $_POST['password'] ?? '';
$type = $_POST['type'] ?? '';

$response = $authController->register($lastname, $firstname, $phone, $mail, $password, $type);

header('Content-Type: application/json');
echo json_encode($response);
?>

