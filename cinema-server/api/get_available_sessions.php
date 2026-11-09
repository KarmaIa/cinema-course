<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') 
{ 
    http_response_code(200); 
    exit; 
}

try {
    $sql = "
        SELECT s.id, s.start_time, s.price, 
               f.title AS film_title, f.duration_min, 
               h.name AS hall_name,
               h.rows_count, h.seats_per_row,
               (SELECT COUNT(*) FROM tickets t WHERE t.session_id = s.id AND t.status = 'sold') AS sold_count
        FROM sessions s
        JOIN films f ON f.id = s.film_id
        JOIN halls h ON h.id = s.hall_id
        WHERE datetime('now', 'localtime') < s.start_time
        ORDER BY s.start_time ASC
    ";
    $sessions = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($sessions, JSON_UNESCAPED_UNICODE);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}