<?php
require_once($_SERVER['DOCUMENT_ROOT'] . '/src/services/brand.service.php');

class BrandController
{
	private $brandService;

	public function __construct()
	{
		$this->brandService = new BrandService();
	}

	public function getOrCreateBrand($brandName)
	{
		return $this->brandService->getOrCreateBrand($brandName);
	}

	public function searchBrands($query)
	{
		$brands = $this->brandService->searchBrands($query);
		echo json_encode($brands);
	}
}
