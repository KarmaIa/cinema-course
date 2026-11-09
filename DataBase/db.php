<?php

$pdo = new PDO("sqlite:" . __DIR__ . '/cinema.sqlite');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("PRAGMA foreign_keys = ON;");
?>