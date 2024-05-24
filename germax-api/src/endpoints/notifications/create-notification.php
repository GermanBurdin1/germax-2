<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/notification.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$notificationService = new NotificationService();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$headers = getallheaders();
	$token = $headers['token'] ?? null;

	if ($token === null) {
		echo json_encode(['success' => false, 'message' => 'Token is missing']);
		exit;
	}

	$user = $authService->getUserByToken($token);
    if ($user === null) {
        echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
        exit;
    }

	$data = json_decode(file_get_contents('php://input'), true);
	$userId = $data['userId'] ?? null;
	$title = $data['title'] ?? '';
	$message = $data['message'] ?? '';

	if (empty($userId) || empty($title) || empty($message)) {
		http_response_code(400); // Bad Request
		echo json_encode(['success' => false, 'message' => 'Missing required fields']);
		exit;
	}

	try {
		$notificationId = $notificationService->createNotification($userId, $title, $message);
		echo json_encode(['success' => true, 'notificationId' => $notificationId]);
	} catch (Exception $e) {
		http_response_code(500); // Internal Server Error
		echo json_encode(['success' => false, 'message' => $e->getMessage()]);
	}
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	http_response_code(204); // No Content for preflight
	exit;
} else {
	http_response_code(405); // Method Not Allowed
	echo json_encode(['error' => 'Method not allowed']);
}
