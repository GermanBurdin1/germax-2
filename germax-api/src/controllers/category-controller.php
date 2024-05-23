<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/category.service.php';

class CategoryController
{
    private $categoryService;
    public function __construct($authService)
    {
        $this->categoryService = new CategoryService();
    }

    public function addCategory($categoryName, $token)
    {
        if (!empty($categoryName)) {
            $this->categoryService->addCategory($categoryName);
            return ['success' => true, 'message' => 'Catégorie ajoutée avec succès'];
        } else {
            return ['success' => false, 'message' => 'Le nom de la catégorie ne peut pas être vide'];
        }
    }
}
