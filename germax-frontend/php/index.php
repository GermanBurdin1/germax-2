<!DOCTYPE html>
<html lang="fr">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Document</title>
</head>
<body>
	<?php
	require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\get-absolute-path.php');
	require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\serve-html-file.php');

	// Получаем текущий URI
	$currentUri = $_SERVER['REQUEST_URI'];

	// Определяем страницы, где нужно вставлять header и footer
	$allowedPages = ['/page-login.php', '/page-register.php', '/dashboard.php', '/index.php'];

	// Проверяем, содержится ли текущий URI в списке разрешённых
	if (in_array($currentUri, $allowedPages)) {
		serveHtmlFile('dist/header.html');
		serveHtmlFile('dist/content-page-index.html');
		serveHtmlFile('dist/footer.html');
	} else {
		// Здесь может быть логика для других страниц
		serveHtmlFile('dist/content-page-index.html');
	}
	?>
</body>
</html>

