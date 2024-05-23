<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php';
class BrandService
{
	private $pdo;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
	}

	public function getOrCreateBrand($brandName)
	{
		error_log("getOrCreateBrand called with: " . $brandName);

		// Проверяем, существует ли бренд
		$sql = "SELECT id_brand FROM brand WHERE name = :brandName";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['brandName' => $brandName]);
		$brand = $stmt->fetch(PDO::FETCH_ASSOC);

		if ($brand) {
			error_log("Brand found: " . $brandName . " with ID: " . $brand['id_brand']);
			return $brand['id_brand'];
		}

		error_log("Brand not found, creating new brand: " . $brandName);

		// Если бренд не существует, создаем новый
		$sql = "INSERT INTO brand (name) VALUES (:name)";
		$stmt = $this->pdo->prepare($sql);

		try {
			$stmt->execute(['name' => $brandName]);
			$newBrandId = $this->pdo->lastInsertId();
			error_log("Created new brand with ID: " . $newBrandId);
			return $newBrandId;
		} catch (PDOException $e) {
			error_log("Error creating brand: " . $e->getMessage());
			return null;
		}
	}

	public function searchBrands($query)
	{
		$sql = "SELECT id_brand, name FROM brand WHERE name LIKE :query";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['query' => '%' . $query . '%']);
		return $stmt->fetchAll(PDO::FETCH_ASSOC);
	}
}
