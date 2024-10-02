<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/communication.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$communicationService = new CommunicationService();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $headers = getallheaders();
    $token = $headers['Authorization'] ?? null;

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
    $message = $data['message'] ?? '';

    if (empty($message)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Message is required']);
        exit;
    }

    try {
        $communicationService->sendMessage($user['Id_user'], $user['type'], $message);
        echo json_encode(['success' => true]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
