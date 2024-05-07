<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/database.php');

class EquipmentRequestService {
    private $pdo;

    public function __construct() {
        $this->pdo = (new Database())->connect();
    }

    public function createRequest($data) {
        $sql = "INSERT INTO equipment_request (request_date, equipment_name, quantity, id_type, id_user, comment) VALUES (CURDATE(), ?, ?, ?, ?, ?)";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute([$data['equipment_name'], $data['quantity'], $data['id_type'], $data['id_user'], $data['comment']]);
        return ['success' => true, 'message' => 'Request created successfully'];
    }

    public function getAllRequests() {
        $sql = "SELECT * FROM Equipment_request";
        $stmt = $this->pdo->prepare($sql);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}

?>
