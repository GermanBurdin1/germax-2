<?php

function removeSpecialCharacters($string) {
    // Удаляем символы \r, \n и \t с помощью str_replace()
    $string = str_replace(array("\t"), '', $string);
    // Заменяем комбинацию \r\n на пробел
    $string = str_replace("\r\n", ' ', $string);
    // Возвращаем обработанную строку
    return $string;
}
