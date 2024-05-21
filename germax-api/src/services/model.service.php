<?php
class ModelService
{
	private $pdo;
	private $brandService;

	public function __construct()
	{
		$this->pdo = (new Database())->connect();
		$this->brandService = new BrandService();
	}

	public function getOrCreateModel($modelName, $id_type, $id_brand, $brandName, $description = '', $photo = '')
	{
		error_log("getOrCreateModel called with modelName: " . $modelName . ", brandName: " . $brandName);

		$modelName = trim($modelName);
		$brandName = trim($brandName);
		$description = trim($description);
		$photo = trim($photo);

		// Проверяем, существует ли модель
		$sql = "SELECT id_model FROM model WHERE name = :modelName";
		$stmt = $this->pdo->prepare($sql);
		$stmt->execute(['modelName' => $modelName]);
		$model = $stmt->fetch(PDO::FETCH_ASSOC);

		if ($model) {
			error_log("Model found: " . $modelName . " with ID: " . $model['id_model']);
			return $model['id_model'];
		}

		// Если модель не существует, создаем новую
		$sql = "INSERT INTO model (name, description, id_type, id_brand, photo) VALUES (:name, :description, :id_type, :id_brand, :photo)";
		$stmt = $this->pdo->prepare($sql);

		try {
			$stmt->execute([
				'name' => $modelName,
				'description' => $description,
				'id_type' => $id_type,
				'id_brand' => $id_brand,
				'photo' => $photo
			]);
			$newModelId = $this->pdo->lastInsertId();
			error_log("Created new model with ID: " . $newModelId);
			return $newModelId;
		} catch (PDOException $e) {
			error_log("Failed to create model: " . $e->getMessage());
			return null;
		}
	}
}
