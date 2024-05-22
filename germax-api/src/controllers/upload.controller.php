<?php

require_once $_SERVER['DOCUMENT_ROOT'] . '/src/services/upload.service.php';

class UploadController
{
    private $uploadService;

    public function __construct()
    {
        $this->uploadService = new UploadService();
    }

    public function uploadFile()
    {
        if (!isset($_FILES['file'])) {
            echo json_encode(['success' => false, 'message' => 'No file uploaded']);
            return;
        }

        $result = $this->uploadService->uploadFile($_FILES['file']);
        echo json_encode($result);
    }
}
?>
