<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<?php


	require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\get-absolute-path.php');
	require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\serve-html-file.php');


	serveHtmlFile('dist/header.html');
	serveHtmlFile('dist/content-page-index.html');
	serveHtmlFile('dist/footer.html');

	?>
</body>
</html>
