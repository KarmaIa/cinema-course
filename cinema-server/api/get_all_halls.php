<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

$halls = $pdo->query("SELECT id, name, rows_count, seats_per_row FROM halls ORDER BY id ASC")->fetchAll(PDO::FETCH_ASSOC);
echo json_encode($halls, JSON_UNESCAPED_UNICODE);