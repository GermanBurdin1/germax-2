<?php

// isJsonContentType.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/is-json-content-type.php';

function renderErrorAndExit($errorsText, $errorCode = 500, $data = [])
{
    // Преобразуем строку в массив, если $errorsText не массив
    $errorsText = is_array($errorsText) ? $errorsText : [$errorsText];

    $errorData = [
        'success' => false,
        'error' => $errorsText, // Теперь здесь точно будет массив
        'data' => $data
    ];

    header('Content-Type: application/json');
    http_response_code($errorCode);
    echo json_encode($errorData);
    exit;
}


?>
