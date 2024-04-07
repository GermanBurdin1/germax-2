<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php');

header("Content-Type: application/json; charset=UTF-8");

$authService = new AuthService();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$requestBody = file_get_contents("php://input");
	$body = json_decode($requestBody, true);
	$userRegistered = $authService->register($body);

	echo json_encode($userRegistered);
	exit();
}

echo json_encode(['auth/register']);
exit();

?>
