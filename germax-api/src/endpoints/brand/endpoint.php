<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/controllers/brand.controller.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$brandController = new BrandController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $brandName = $input['name'] ?? null;

    if ($brandName) {
        $brandId = $brandController->getOrCreateBrand($brandName);
        echo json_encode(['success' => true, 'id_brand' => $brandId]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Brand name is required']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
