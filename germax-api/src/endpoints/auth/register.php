<?php
require_once '../controllers/auth-controller.php';
session_start();

header("Access-Control-Allow-Origin: http://germax-frontend"); // Разрешить запросы только с этого домена
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST"); // Разрешить только POST-методы
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Разрешить только необходимые заголовки

// Создаем экземпляр AuthController
$authController = new AuthController();

// Извлекаем переменные из массива
$lastname = $_POST['lastname'] ?? '';
$firstname = $_POST['firstname'] ?? '';
$phone = $_POST['phone'] ?? '';
$mail = $_POST['mail'] ?? '';
$password = $_POST['password'] ?? '';
$type = $_POST['typeOfUser'] ?? '';

// Вызываем метод register и передаем ему необходимые параметры
$response = $authController->register($lastname, $firstname, $phone, $mail, $password, $type);

// Отправляем ответ клиенту в формате JSON
echo json_encode($response);
exit();
?>

