<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '/src/utils/error.php');

function validateArrAssoc($arr) {
	$errorsText = [];

	foreach ($arr["errors"] as $key => $value) {
		if (isset($arr["data"][$key]) === false) {
			$errorsText[] = $arr["errors"][$key];
		}
	}

	$errorMessage = join('', $errorsText);

	if (count($errorsText) != 0) {
		renderErrorAndExit($errorsText, $arr["errorCode"]);
	}
}

?>
