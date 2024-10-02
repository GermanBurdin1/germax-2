<?php

function serveHtmlFile($filePath) {
	$fullPath = $_SERVER['DOCUMENT_ROOT'] . '/' . $filePath;
    if (file_exists($fullPath)) {
		if (!headers_sent()) header('Content-Type: text/html');
        readfile($fullPath);
    } else {
        http_response_code(404);
        echo "Erreur: fichier non trouvé. Chemin $fullPath<br>";
    }
}

?>
