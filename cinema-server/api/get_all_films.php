<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$films = $pdo->query("SELECT id, title, description, duration_min, age_rating FROM films ORDER BY title ASC")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($films, JSON_UNESCAPED_UNICODE);