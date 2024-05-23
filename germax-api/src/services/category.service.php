<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';

class CategoryService
{
    private $pdo;

    public function __construct()
    {
        $this->pdo = (new Database())->connect();
    }

    public function addCategory($categoryName)
    {
        $sql = "INSERT INTO type (name) VALUES (:name)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute(['name' => $categoryName]);
    }
}
