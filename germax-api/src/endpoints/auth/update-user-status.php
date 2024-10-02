<?php

// AuthController.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization, *");

$authController = new AuthController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {

	$_POST = json_decode(file_get_contents("php://input"), true);

	$user_id = $_POST['user_id'] ?? NULL;
	$status = $_POST['connexion_permission'] ?? NULL;
	$authorization = $_POST['authorization_permission'] ?? NULL;

	if (empty($user_id) || empty($status) || empty($authorization)) {
		renderErrorAndExit(['Missing required fields'], 400);
	}

	$authController->update_user_status($user_id, $status, $authorization);
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	http_response_code(204);
	exit;
}

renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>
