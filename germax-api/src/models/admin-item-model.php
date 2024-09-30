<?php
require_once '../utils/database.php';

class AdminItemModel {
    private $db;

    public function __construct() {
        $this->db = Database::connect();
    }

    public function addItem($name, $description, $categoryId) {
        $stmt = $this->db->prepare("INSERT INTO `model` (`name`, `description`, `Id_type`) VALUES (:name, :description, :categoryId)");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':description', $description);
        $stmt->bindParam(':categoryId', $categoryId);
        $stmt->execute();
        return $this->db->lastInsertId(); // Возвращает ID добавленной записи
    }

}
?>
