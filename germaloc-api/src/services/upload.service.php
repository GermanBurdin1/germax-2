<?php
class UploadService
{
    private $uploadDir;

    public function __construct()
    {
        $this->uploadDir = $_SERVER['DOCUMENT_ROOT'] . '/src/files/images/';

        if (!is_dir($this->uploadDir)) {
            mkdir($this->uploadDir, 0777, true);
        }
    }

    public function uploadFile($file)
    {
        if ($file['error'] === UPLOAD_ERR_OK) {
            $fileTmpPath = $file['tmp_name'];
            $fileName = $file['name'];
            $fileSize = $file['size'];
            $fileType = $file['type'];
            $fileNameCmps = explode(".", $fileName);
            $fileExtension = strtolower(end($fileNameCmps));

            $newFileName = md5(time() . $fileName) . '.' . $fileExtension;

            $allowedfileExtensions = array('jpg', 'jpeg', 'png', 'webp');

            if (in_array($fileExtension, $allowedfileExtensions)) {
                // Путь для сохранения файла
                $dest_path = $this->uploadDir . $newFileName;

                if (move_uploaded_file($fileTmpPath, $dest_path)) {
                    $publicUrl = htmlspecialchars($_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/src/files/images/' . $newFileName, ENT_QUOTES, 'UTF-8');
                    return ['success' => true, 'url' => $publicUrl];
                } else {
                    return ['success' => false, 'message' => 'File could not be uploaded.'];
                }
            } else {
                return ['success' => false, 'message' => 'Upload failed. Allowed file types: ' . implode(',', $allowedfileExtensions)];
            }
        } else {
            return ['success' => false, 'message' => 'There was some error in the file upload.'];
        }
    }
}
