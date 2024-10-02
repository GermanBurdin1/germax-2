<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';

header("Access-Control-Allow-Origin: http://germaloc-frontend");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization, *");

$authController = new AuthController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$lastname = $_POST['lastname'] ?? NULL;
	$firstname = $_POST['firstname'] ?? NULL;
	$phone = $_POST['phone'] ?? NULL;
	$email = $_POST['email'] ?? NULL;
	$password = $_POST['password'] ?? NULL;
	$typePermission = $_POST['type-permission'] ?? NULL;
	$faculty = $_POST['faculty'] ?? NULL;

	error_log("Received email: " . $email);

	$authController->register($lastname, $firstname, $phone, $email, $password, $typePermission, $faculty);
}

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	$authController->get_pending_users();
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	http_response_code(204);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>

