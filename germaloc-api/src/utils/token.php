<?php

function generateToken($str) {
	return base64_encode($str . ':' . time());
}

function decrypt_token($token) {
	$decoded_token = base64_decode($token);
	$token_parts = explode(':', $decoded_token);

	if (count($token_parts) === 2) {
		$email = $token_parts[0];
		$timestamp = $token_parts[1];

		return array(
			'email' => $email,
			'timestamp' => $timestamp
		);
	} else {
		return false;
	}
}

