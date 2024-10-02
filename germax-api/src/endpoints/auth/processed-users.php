<?php

// AuthController.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';

header("Access-Control-Allow-Origin: http://germax-frontend"); // Разрешить запросы только с этого домена
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST"); // Разрешить только POST-методы
header("Access-Control-Allow-Headers: Content-Type, Authorization, *"); // Разрешить только необходимые заголовки

$authController = new AuthController();
if ($_SERVER["REQUEST_METHOD"] == "GET") {
	$authController->get_processed_users();
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	// Возвращаем успешный статус
	http_response_code(204);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>
