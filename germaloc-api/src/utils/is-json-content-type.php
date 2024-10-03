<?php

function isJsonContentType()
{
	$headers = apache_request_headers();

	return (
		isset($headers['Content-Type']) &&
		$headers['Content-Type'] === 'application/json'
	);
}
