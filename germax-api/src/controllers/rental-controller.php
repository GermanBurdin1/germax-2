<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/rental.service.php';
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/auth.service.php';

class RentalController
{
	private $rentalService;
	private $authService;

	public function __construct($rentalService, $authService)
	{
		$this->rentalService = $rentalService;
		$this->authService = $authService;
	}

	public function createRental($data, $token)
	{
		$user = $this->authService->getUserByToken($token);

		if ($user === null) {
			echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
			return;
		}

		$response = $this->rentalService->addRental($data, $user['id_user']);
		echo json_encode($response);
	}

	public function fetchRentals()
	{
		$rentals = $this->rentalService->fetchRentals();
		echo json_encode(['success' => true, 'data' => $rentals]);
	}

	public function fetchRentalsByUser($token)
	{
		$user = $this->authService->getUserByToken($token);

		if ($user === null) {
			echo json_encode(['success' => false, 'message' => 'Invalid token or user not found']);
			return;
		}

		$rentals = $this->rentalService->fetchRentalsByUser($user['id_user']);
		echo json_encode(['success' => true, 'data' => $rentals]);
	}

	public function approveRental($data, $token)
	{
		$response = $this->rentalService->updateRentalStatus($data['loanId'], 3, 2);
		echo json_encode($response);
	}

	public function cancelRental($data)
	{
		$response = $this->rentalService->updateRentalStatus($data['loanId'], 1, 3);
		echo json_encode($response);
	}
}
