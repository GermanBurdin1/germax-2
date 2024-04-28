<?php

// isJsonContentType.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/is-json-content-type.php';

function renderSuccessAndExit($messagesText, $code = 200, $data = [])
{
	// Формируем массив с данными об ошибке
	$successData = [
		'success' => true,
		'error' => [...$messagesText],
		'data' => $data
	];

	// Проверяем, установлен ли уже заголовок Content-Type: application/json
	if (isJsonContentType()) header('Content-Type: application/json');

	http_response_code($code);

	// Выводим JSON с данными об ошибке
	echo json_encode($successData);

	// Прекращаем выполнение скрипта
	exit;
}

?>
