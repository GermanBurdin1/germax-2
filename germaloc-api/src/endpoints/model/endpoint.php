<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/controllers/model.controller.php');

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

$modelController = new ModelController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $input = json_decode(file_get_contents('php://input'), true);
    $modelName = $input['name'] ?? null;
    $idType = $input['id_type'] ?? null;
    $idBrand = $input['id_brand'] ?? null;
    $description = $input['description'] ?? '';
    $photo = $input['photo'] ?? '';

    if ($modelName && $idType && $idBrand) {
        $modelId = $modelController->getOrCreateModel($modelName, $idType, $idBrand, $description, $photo);
        echo json_encode(['success' => true, 'id_model' => $modelId]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Model name, type, and brand are required']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
