<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/equipment.request.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

class EquipmentRequestController
{
	private $equipmentRequestService;
	private $authService;

	public function __construct($equipmentRequestService, $authService)
	{
		$this->equipmentRequestService = $equipmentRequestService;
		$this->authService = $authService;
	}

	public function createFirstRequestFromUser($requestData, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
			return;
		}

		// Включите id_user в ваш запрос, если он нужен для createFirstRequestFromUser
		$requestData['id_user'] = $user['id_user'];

		$response = $this->equipmentRequestService->createFirstRequestFromUser($requestData);
		echo json_encode($response);
	}

	public function getAllRequests()
	{
		return $this->equipmentRequestService->getAllRequests();
	}

	public function updateRequest($requestData, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			return ['success' => false, 'message' => 'Invalid token or user not found'];
		}

		$response = $this->equipmentRequestService->updateRequest($requestData);
		return $response;
	}
	// Можно добавить другие методы, например, изменение или удаление запроса
}
