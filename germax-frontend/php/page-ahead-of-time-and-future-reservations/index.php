<?php

require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\get-absolute-path.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\serve-html-file.php');

?>

<!DOCTYPE html>
<html lang='fr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Document</title>
</head>
<body>
    <?php serveHtmlFile('dist/header.html'); ?>
    <?php serveHtmlFile('dist/content-page-ahead-of-time-and-future-reservations.html'); ?>
    <?php serveHtmlFile('dist/footer.html'); ?>
</body>
</html>
