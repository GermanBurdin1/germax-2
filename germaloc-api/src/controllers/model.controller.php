<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/model.service.php');

class ModelController
{
    private $modelService;

    public function __construct()
    {
        $this->modelService = new ModelService();
    }

    public function getOrCreateModel($modelName, $idType, $idBrand, $description = '', $photo = '')
    {
        return $this->modelService->getOrCreateModel($modelName, $idType, $idBrand, $description, $photo);
    }
}
