<?php
require_once '../utils/database.php';

class CategoryModel {
    private $db;

    public function __construct() {
        $this->db = Database::connect();
    }

    public function addCategory($name) {
        $stmt = $this->db->prepare("INSERT INTO `type` (`name`) VALUES (:name)");
        $stmt->bindParam(':name', $name);
        $stmt->execute();
        return $this->db->lastInsertId(); // Возвращает ID добавленной категории
    }

    public function getAllCategories() {
        $stmt = $this->db->query("SELECT * FROM `type`");
        return $stmt->fetchAll();
    }

    public function getCategoryById($id) {
        $stmt = $this->db->prepare("SELECT * FROM `type` WHERE `Id_type` = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
        return $stmt->fetch();
    }

    public function updateCategory($id, $name) {
        $stmt = $this->db->prepare("UPDATE `type` SET `name` = :name WHERE `Id_type` = :id");
        $stmt->bindParam(':name', $name);
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }

    public function deleteCategory($id) {
        $stmt = $this->db->prepare("DELETE FROM `type` WHERE `Id_type` = :id");
        $stmt->bindParam(':id', $id);
        $stmt->execute();
    }
}
?>
