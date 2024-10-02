<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/auth.controller.php';

$authController = new AuthController();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
	$headers = getallheaders();
	$headerToken = $headers['token'];

	$authController->me($headerToken);
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

	http_response_code(204);
	exit;
}


renderErrorAndExit(['This route does not support this HTTP method'], 405);

?>
