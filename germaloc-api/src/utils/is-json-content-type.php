<?php

function isJsonContentType()
{
	// Получаем все заголовки ответа
	$headers = apache_request_headers();

	// Проверяем наличие заголовка 'Content-Type' и его значение
	return (
		isset($headers['Content-Type']) &&
		$headers['Content-Type'] === 'application/json'
	);
}
