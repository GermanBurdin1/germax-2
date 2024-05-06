<?php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/rental.service.php';

class RentalController
{
	private $rentalService;

	public function __construct()
	{
		$this->rentalService = new RentalService();
	}

	public function createRental($data)
	{
		$response = $this->rentalService->addRental($data);
		echo json_encode($response);
	}

	public function fetchRentals()
    {
        $rentals = $this->rentalService->fetchRentals();
        echo json_encode(['success' => true, 'data' => $rentals]);
    }
}
