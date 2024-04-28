<?php

// isJsonContentType.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/is-json-content-type.php';

function renderErrorAndExit($errorsText, $errorCode = 500, $data = [])
{
	// Формируем массив с данными об ошибке
	$errorData = [
		'success' => false,
		'error' => [...$errorsText],
		'data' => $data
	];

	// Проверяем, установлен ли уже заголовок Content-Type: application/json
	if (isJsonContentType()) header('Content-Type: application/json');

	http_response_code($errorCode);

	// Выводим JSON с данными об ошибке
	echo json_encode($errorData);

	// Прекращаем выполнение скрипта
	exit;
}

?>
