<?php

$host = 'localhost'; 
$dbname = 'locmns';
$user = 'root';
$pass = '';

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
];

$dsn = "mysql:host=$host;dbname=$dbname";
try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

$type = isset($_GET['type']) ? $_GET['type'] : null;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;

if ($type) {
    $stmt = $pdo->prepare("SELECT m.* FROM model m JOIN type t ON m.id_type = t.id_type WHERE t.name = :type LIMIT :limit OFFSET :offset");
    $stmt->bindParam(':type', $type, PDO::PARAM_STR);
} else {
    $stmt = $pdo->prepare("SELECT * FROM model LIMIT :limit OFFSET :offset");
}

$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
$stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
$stmt->execute();

$model = $stmt->fetchAll();
echo json_encode($model);
?>
