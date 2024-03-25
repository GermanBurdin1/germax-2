<?php

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
require_once '../models/category-model.php';

$categoryModel = new CategoryModel();

function addCategory($categoryName, $categoryModel) {
    if (!empty($categoryName)) {
        $categoryModel->addCategory($categoryName);

        // Возвращаем успешный ответ
        echo json_encode(["success" => true, "message" => "Catégorie ajoutée avec succès"]);
    } else {
        // Возвращаем ошибку, если имя категории не предоставлено
        echo json_encode(["success" => false, "message" => "Le nom de la catégorie ne peut pas être vide"]);
    }
}

// Проверяем, что запрос является POST запросом
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'] ?? ''; // Получаем данные из POST запроса
    addCategory($name, $categoryModel); // Вызываем функцию добавления категории
} else {
    // Возвращаем ошибку, если запрос не является POST запросом
    echo json_encode(["success" => false, "message" => "Requête invalide"]);
}
?>

