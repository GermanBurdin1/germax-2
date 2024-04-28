<?php

function generateToken($str)
{
	return base64_encode($str . ':' . time());
}

function decrypt_token($token)
{
	// В реальном приложении может потребоваться использовать алгоритм расшифровки, соответствующий используемому алгоритму шифрования токена
	// В этом примере просто декодируем base64 и разбиваем строку по символу ':'
	$decoded_token = base64_decode($token);
	$token_parts = explode(':', $decoded_token);

	// Проверяем, что токен состоит из двух частей (логин и время создания)
	if (count($token_parts) === 2) {
		$email = $token_parts[0];
		$timestamp = $token_parts[1];

		// Возвращаем массив с данными пользователя
		return array(
			'email' => $email,
			'timestamp' => $timestamp
		);
	} else {
		// Если токен некорректен, возвращаем false
		return false;
	}
}
