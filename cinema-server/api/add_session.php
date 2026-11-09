<?php
date_default_timezone_set('Asia/Novosibirsk');

require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$film_id = (int)($data['film_id'] ?? 0);
$hall_id = (int)($data['hall_id'] ?? 0);
$price = (float)($data['price'] ?? 0);
$start_time = $data['start_time'] ?? '';

if ($price < 100 || $price > 5000) {
    http_response_code(400);
    echo json_encode(['error' => 'Цена билета должна быть в пределах от 100 до 5000 рублей.']);
    exit;
}

if ($start_time) {
    $start_time = str_replace('T', ' ', $start_time) . ':00';
}

if (!$film_id || !$hall_id || !$price || !$start_time) {
    http_response_code(400);
    echo json_encode(['error' => 'Заполните все поля']);
    exit;
}

if ($start_time <= date('Y-m-d H:i:s')) {
    http_response_code(400);
    echo json_encode(['error' => 'Нельзя создать сеанс в прошлом! Выберите будущую дату и время.']);
    exit;
}

try {
    $stmt = $pdo->prepare("SELECT duration_min FROM films WHERE id = ?");
    $stmt->execute([$film_id]);
    $duration = $stmt->fetchColumn();
    
    if (!$duration) throw new Exception("Фильм не найден");
    
    $end_time = date('Y-m-d H:i:s', strtotime($start_time . ' + ' . $duration . ' minutes'));
    
    // Проверяем время нового сеанса на то чтобы в одно время не шли фильмы в одном зале в одно время
    $stmt = $pdo->prepare("
        SELECT s.id, f.title, s.start_time, f.duration_min 
        FROM sessions s
        JOIN films f ON f.id = s.film_id
        WHERE s.hall_id = ? 
          AND s.start_time < ?
          AND datetime(s.start_time, '+' || f.duration_min || ' minutes') > ?
        ORDER BY s.start_time ASC
    ");
    $stmt->execute([$hall_id, $end_time, $start_time]);
    $overlap = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($overlap) {
        $overlapEndTime = date('H:i', strtotime($overlap['start_time'] . ' + ' . $overlap['duration_min'] . ' minutes'));
        $overlapStartTime = date('H:i', strtotime($overlap['start_time']));

        http_response_code(409);
        echo json_encode([
            'error' => "В этом зале уже идет или будет идти фильм '{$overlap['title']}'. Он начинается в {$overlapStartTime} и заканчивается в {$overlapEndTime}. Выберите другое время или зал."
        ]);
        exit;
    }

    $stmt = $pdo->prepare("INSERT INTO sessions (film_id, hall_id, start_time, price) VALUES (?, ?, ?, ?)");
    $stmt->execute([$film_id, $hall_id, $start_time, $price]);
    
    echo json_encode(['success' => true]);

}
catch (Exception $e) {
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}
catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка БД: ' . $e->getMessage()]);
}