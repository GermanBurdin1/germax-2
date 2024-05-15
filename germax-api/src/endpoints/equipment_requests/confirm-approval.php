<?php

header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/equipment.request.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$equipmentRequestService = new EquipmentRequestService();
$equipmentRequestController = new EquipmentRequestController($equipmentRequestService, $authService);

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $headers = getallheaders();
    $token = $headers['token'] ?? null;

    if ($token === null) {
        echo json_encode(['success' => false, 'message' => 'Token is missing']);
        exit;
    }

    $data = json_decode(file_get_contents('php://input'), true);
    $response = $equipmentRequestController->confirmApproval($data, $token);
    echo json_encode($response);

} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204); // No Content for preflight
    exit;
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['error' => 'Method not allowed']);
}
