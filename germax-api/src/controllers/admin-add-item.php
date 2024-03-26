<?php
require_once '../models/admin-item-model.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");

$adminItemModel = new AdminItemModel();

function addItem($name, $description, $category, $adminItemModel) {
    // Используйте фильтрацию и валидацию для входных данных перед вставкой в БД
    if (!empty($name) && !empty($description) && !empty($category)) {
        $adminItemModel->addItem($name, $description, $category);
        echo json_encode(["success" => true, "message" => "Équipement ajouté avec succès"]);
    } else {
        echo json_encode(["success" => false, "message" => "Tous les champs doivent être remplis"]);
    }
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Данные приходят не в виде JSON, а как обычные POST данные
    addItem($_POST['name'], $_POST['description'], $_POST['category'], $adminItemModel);
} else {
    echo json_encode(["success" => false, "message" => "Requête invalide"]);
}
?>

