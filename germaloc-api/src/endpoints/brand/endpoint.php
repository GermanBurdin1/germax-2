<?php
header("Access-Control-Allow-Origin: http://germax-frontend");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, Accept, Authorization, X-Requested-With, *");
header("Content-Type: application/json; charset=UTF-8");

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/controllers/brand.controller.php');

$brandController = new BrandController();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
	$input = json_decode(file_get_contents('php://input'), true);
	$brandName = $input['name'] ?? null;

	if ($brandName) {
		$brandId = $brandController->getOrCreateBrand($brandName);
		echo json_encode(['success' => true, 'id_brand' => $brandId]);
	} else {
		echo json_encode(['success' => false, 'message' => 'Brand name is required']);
	}
} elseif ($_SERVER["REQUEST_METHOD"] == "GET") {
	$query = $_GET['name'] ?? '';
	$brandController->searchBrands($query);
} elseif ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
	http_response_code(204);
	exit;
} else {
	http_response_code(405);
	echo json_encode(['error' => 'Method not allowed']);
}
