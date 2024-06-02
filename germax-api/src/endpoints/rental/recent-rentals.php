<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/user.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/rental.service.php';

$authService = new AuthService();
$rentalService = new RentalService();

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    $headers = getallheaders();
		error_log("Headers received: " . print_r($headers, true));
    $token = isset($headers['Authorization']) ? str_replace('Bearer ', '', $headers['Authorization']) : null;
		error_log("Token received: " . $token);
    if ($token === null) {
        echo json_encode(['success' => false, 'message' => 'Token is missing']);
        exit;
    }

    $user = $authService->getUserByToken($token);
    if ($user === false) {
        echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
        exit;
    }

    $userId = $user['id_user'];
		error_log("id_user: " . $userId);
    $recentRentals = $rentalService->fetchRecentRentals($userId);

    echo json_encode(['success' => true, 'data' => $recentRentals]);
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>
