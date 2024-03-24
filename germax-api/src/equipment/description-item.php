<?php
require_once './models/EquipmentModel.php';

$equipmentModel = new EquipmentModel();
$id_model = $_GET['id'] ?? 0; // ID модели должен поступать из запроса
$description = $equipmentModel->loadDescription($id_model);

echo json_encode($description);
