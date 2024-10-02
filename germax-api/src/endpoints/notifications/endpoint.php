<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");


require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/notification.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$notificationController = new NotificationController();

if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET['action']) && $_GET['action'] == 'getNotifications') {
	$userId = $_GET['userId'];
	try {
		$notifications = $notificationController->getNotifications($userId);
		echo json_encode(['success' => true, 'data' => $notifications]);
	} catch (Exception $e) {
		http_response_code(401);
		echo json_encode(['success' => false, 'message' => $e->getMessage()]);
	}
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	http_response_code(204);
	exit;
} else {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
}
