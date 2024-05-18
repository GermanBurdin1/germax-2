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
	$lastname = $_POST['lastname'] ?? NULL;
	$firstname = $_POST['firstname'] ?? NULL;
	$phone = $_POST['phone'] ?? NULL;
	$email = $_POST['email'] ?? NULL;
	$password = $_POST['password'] ?? NULL;
	$typePermission = $_POST['type-permission'] ?? NULL;
	$faculty = $_POST['faculty'] ?? NULL;

	// Вызываем метод register и передаем ему необходимые параметры
	$authController->register($lastname, $firstname, $phone, $email, $password, $typePermission, $faculty);
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	// Возвращаем успешный статус
	http_response_code(204);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>

