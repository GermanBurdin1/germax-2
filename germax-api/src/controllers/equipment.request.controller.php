<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/equipment.request.service.php';

class EquipmentRequestController {
    private $requestService;

    public function __construct() {
        $this->requestService = new EquipmentRequestService();
    }

    public function createRequest($requestData) {
        return $this->requestService->createRequest($requestData);
    }

    public function getAllRequests() {
        return $this->requestService->getAllRequests();
    }

    // Можно добавить другие методы, например, изменение или удаление запроса
}
