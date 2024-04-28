<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';


$authController = new AuthController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$_POST = json_decode(file_get_contents("php://input"), true);

	$email = $_POST['email'] ?? null;
	$password = $_POST['password'] ?? null;

	$authController->login($email, $password);
	// Теперь метод login сам отправляет JSON и завершает выполнение скрипта
}

?>
