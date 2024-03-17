<?php


require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\get-absolute-path.php');
require_once($_SERVER['DOCUMENT_ROOT'] . '\php-utils\serve-html-file.php');

serveHtmlFile('dist/header.html');
serveHtmlFile('dist/page1.html');

?>
