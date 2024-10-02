<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/category.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

class CategoryController
{
	private $categoryService;
	private $authService;

	public function __construct($authService)
	{
		$this->categoryService = new CategoryService();
		$this->authService = $authService;
	}

	public function addCategory($categoryName, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
			return;
		}
		if (!empty($categoryName)) {
			$this->categoryService->addCategory($categoryName);
			return ['success' => true, 'message' => 'Catégorie ajoutée avec succès'];
		} else {
			return ['success' => false, 'message' => 'Le nom de la catégorie ne peut pas être vide'];
		}
	}

	public function getCategories()
	{
		$categories = $this->categoryService->getCategories();
		return ['success' => true, 'categories' => $categories];
	}
}
