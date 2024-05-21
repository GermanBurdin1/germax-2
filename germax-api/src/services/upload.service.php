<?php

class UploadService
{
	private $uploadDir;

	public function __construct()
	{
		$this->uploadDir = __DIR__ . '/../files/images/';
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

			// Сгенерируйте уникальное имя для файла
			$newFileName = md5(time() . $fileName) . '.' . $fileExtension;

			// Укажите допустимые расширения файлов
			$allowedfileExtensions = array('jpg', 'jpeg', 'png');

			if (in_array($fileExtension, $allowedfileExtensions)) {
				// Путь для сохранения файла
				$dest_path = $this->uploadDir . $newFileName;

				if (move_uploaded_file($fileTmpPath, $dest_path)) {
					return ['success' => true, 'url' => $dest_path];
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
