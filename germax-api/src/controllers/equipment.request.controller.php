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

	public function createFirstRequestFromManager($requestData, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
			return;
		}

		// Включите id_user в ваш запрос, если он нужен для createFirstRequestFromUser
		$requestData['id_user'] = $user['id_user'];

		$response = $this->equipmentRequestService->createFirstRequestFromManager($requestData);
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

	public function confirmApproval($requestData, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			return ['success' => false, 'message' => 'Invalid token or user not found'];
		}

		$response = $this->equipmentRequestService->confirmApproval($requestData);
		return $response;
	}

	public function sendUpdatedDataToUser($requestData, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			return ['success' => false, 'message' => 'Invalid token or user not found'];
		}

		$response = $this->equipmentRequestService->sendUpdatedDataToUser($requestData);
		return $response;
	}

	public function createRequest($data, $token)
	{
		$user = $this->authService->getUserByToken($token);
		if ($user === null) {
			return ['success' => false, 'message' => 'Invalid token or user not found'];
		}

		$result = $this->equipmentRequestService->createRequest($data);
		echo json_encode($result);
	}

	public function getRequestById($id)
	{
		return $this->equipmentRequestService->getRequestById($id);
	}

	public function cancelRequest($data)
	{
		if (!isset($data['id_request'])) {
			return ['success' => false, 'message' => 'Missing required fields'];
		}

		return $this->equipmentRequestService->cancelRequest($data['id_request']);
	}
}
