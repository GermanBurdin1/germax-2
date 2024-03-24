<?php
// src/models/EquipmentModel.php
require_once '../utils/database.php';

class EquipmentModel {
    private $pdo;

    public function __construct() {
        $this->pdo = Database::connect();
    }

    public function loadDescription($id_model) {
        $stmt = $this->pdo->prepare("SELECT * FROM model WHERE id_model = :id_model");
        $stmt->bindParam(':id_model', $id_model, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
?>
