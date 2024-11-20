<?php

// isJsonContentType.php
require_once $_SERVER['DOCUMENT_ROOT'] . '/src/utils/is-json-content-type.php';

function renderSuccessAndExit($messagesText, $code = 200, $data = [])
{
	$successData = [
		'success' => true,
		'messages' => [...$messagesText],
		'data' => $data
	];

	if (isJsonContentType()) header('Content-Type: application/json');

	http_response_code($code);

	echo json_encode($successData);

	exit;
}

?>
