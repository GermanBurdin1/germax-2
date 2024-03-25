<?php
require_once './src/utils/database.php';
require_once './src/controllers/auth-controllers.php';

session_start();

$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

switch ($path) {
    case '/api/login':
        require 'src/endpoints/login.php';
        break;
    case '/api/register':
        require 'src/endpoints/register.php';
        break;
    default:
        http_response_code(404);
        echo json_encode(['error' => 'Endpoint not found']);
        break;
}
