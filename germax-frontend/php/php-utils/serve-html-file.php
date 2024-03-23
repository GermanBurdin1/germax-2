<?php

function serveHtmlFile($filePath) {
	$fullPath = $_SERVER['DOCUMENT_ROOT'] . '\\' . $filePath;
    // Проверяем, существует ли файл
    if (file_exists($fullPath)) {
        // Устанавливаем правильный MIME тип для HTML
        header('Content-Type: text/html');

        // Выводим содержимое файла
        readfile($fullPath);
    } else {
        // Если файл не найден, отправляем HTTP статус 404 Not Found
        http_response_code(404);
        echo "Ошибка: файл не найден.";
    }
}

?>
