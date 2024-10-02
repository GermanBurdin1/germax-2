<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/controllers/settings.controller.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

$authService = new AuthService();
$settingsService = new SettingsService();
$settingsController = new SettingsController($settingsService, $authService);

if ($_SERVER['REQUEST_METHOD'] == 'GET') {
    $headers = getallheaders();
    $authorizationHeader = $headers['Authorization'] ?? null;

    if ($authorizationHeader === null) {
        echo json_encode(['success' => false, 'message' => 'Authorization header is missing']);
        exit;
    }

    if (preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
        $token = $matches[1];
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid Authorization header format']);
        exit;
    }

    error_log("Received token: " . $token);

    $settingsController->getSettings($token);

} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
