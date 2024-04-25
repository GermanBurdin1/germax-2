<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

require_once '../controllers/auth-controllers.php';

session_start();

$authController = new AuthController();

$email = $_POST['mail'] ?? ''; // Убедитесь, что ключ 'mail' соответствует имени поля в вашей форме
$password = $_POST['password'] ?? '';

$authController->login($email, $password); // Теперь метод login сам отправляет JSON и завершает выполнение скрипта
?>
