<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }

$session_id = isset($_GET['id']) ? (int)$_GET['id'] : 0;

try {
    // Размер зала
    $stmt = $pdo->prepare("
        SELECT h.rows_count, h.seats_per_row, s.price, f.title AS film_title
        FROM sessions s 
        JOIN halls h ON h.id = s.hall_id
        JOIN films f ON f.id = s.film_id
        WHERE s.id = ?
    ");
    $stmt->execute([$session_id]);
    $hall = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$hall) {
        http_response_code(404);
        echo json_encode(['error' => 'Сеанс не найден']);
        exit;
    }

    // Занятые места
    $stmt = $pdo->prepare("
        SELECT row_number, seat_number
        FROM tickets 
        WHERE session_id = ? AND status IN ('sold')
    ");
    $stmt->execute([$session_id]);
    $taken = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        'hall' => $hall,
        'taken_seats' => $taken
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}