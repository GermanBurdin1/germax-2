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
        $result = $this->uploadService->uploadFile($_FILES['file']);
        echo json_encode($result);
    }
}
?>
