<?php

function getAbsolutePath($relativePath) {
    // Возвращает абсолютный путь, используя корень документа сервера
    return $_SERVER['DOCUMENT_ROOT'] . '\\' . ltrim($relativePath, '\\');
}

?>
