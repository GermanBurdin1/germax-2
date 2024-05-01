<?php

// AuthController.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';

header("Access-Control-Allow-Origin: http://germax-frontend"); // Разрешить запросы только с этого домена
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST"); // Разрешить только POST-методы
header("Access-Control-Allow-Headers: Content-Type, Authorization, *"); // Разрешить только необходимые заголовки

$authController = new AuthController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$_POST = json_decode(file_get_contents("php://input"), true);
	// Извлекаем переменные из массива
	$lastname = $_POST['lastname'] ?? null;
	$firstname = $_POST['firstname'] ?? null;
	$phone = $_POST['phone'] ?? null;
	$email = $_POST['email'] ?? null;
	$password = $_POST['password'] ?? null;
	$typePermission = $_POST['type-permission'] ?? null;

	// Вызываем метод register и передаем ему необходимые параметры
	$authController->register($lastname, $firstname, $phone, $email, $password, $type);
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	// Возвращаем успешный статус
	http_response_code(200);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>

