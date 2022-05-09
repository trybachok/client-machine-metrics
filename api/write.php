<?php
$filename = 'log.txt';

if (is_writable($filename)) {
    if (!$fp = fopen($filename, 'ab')) {
        exit;
    }
    if (fwrite($fp, "\n\n") === FALSE) {
        echo 'Ошибка записи в файл';
        exit;
    }
    $time = date('d.m.Y H:i:s');
    $message = 'Запрос на запись файла';
    if (fwrite($fp, "$time $message") === FALSE) {
        echo 'Ошибка записи в файл';
        exit;
    }
    echo 'Загрузка завершена успешно';
    fclose($fp);
} else {
    echo 'Файл недоступен для записи';
}