<?php

function removeSpecialCharacters($string) {
    $string = str_replace(array("\t"), '', $string);
    $string = str_replace("\r\n", ' ', $string);
    return $string;
}
