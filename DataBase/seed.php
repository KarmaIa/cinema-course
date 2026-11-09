<?php
$pdo = new PDO("sqlite:" . __DIR__ . '/cinema.sqlite');
$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$pdo->exec("PRAGMA foreign_keys = ON;");

$pdo->exec("
    INSERT INTO films (title, description, duration_min, age_rating)
    VALUES
    ('Начало', 'Фильм про сны', 148, '12+'),
    ('Интерстеллар', 'Космос и время', 169, '12+'),
    ('Дюна', 'Пустынная планета', 155, '16+');
");

$pdo->exec("
    INSERT INTO halls (name, rows_count, seats_per_row)
    VALUES
    ('Зал 1', 10, 12),
    ('Зал 2', 8, 10),
    ('Зал 3', 10, 10),
    ('Зал 4', 10, 12),
    ('VIP', 5, 6);
");
?>