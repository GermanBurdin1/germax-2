<?php
require_once '../controllers/auth-controller.php';

session_start();

header("Access-Control-Allow-Origin: http://germax-frontend"); // Разрешить запросы только с этого домена
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST"); // Разрешить только POST-методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешить только необходимые заголовки

$authController = new AuthController();

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

$response = $authController->login($email, $password);

header('Content-Type: application/json');
echo json_encode($response);
?>
