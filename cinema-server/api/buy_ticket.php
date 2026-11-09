<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$session_id = (int)($data['session_id']);
$row = (int)($data['row']);
$seat = (int)($data['seat']);
$name = trim($data['buyer_name'] == '' ? 'Гость' : $data['buyer_name']);


if (!$session_id || !$row || !$seat) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверные данные']);
    exit;
}

try {
    $pdo->beginTransaction();
    
    $stmt = $pdo->prepare("SELECT price FROM sessions WHERE id = ?");
    $stmt->execute([$session_id]);
    $price = $stmt->fetchColumn();
    
    if ($price === false) throw new Exception("Сеанс не найден");

    $stmt = $pdo->prepare("
        INSERT INTO tickets (session_id, row_number, seat_number, price, buyer_name, status) 
        VALUES (?, ?, ?, ?, ?, 'sold')
    ");
    $stmt->execute([$session_id, $row, $seat, $price, $name]);
    
    $pdo->commit();
    echo json_encode(['success' => true, 'message' => 'Билет успешно куплен!']);

} catch (PDOException $e) {
    $pdo->rollBack();
    if ($e->getCode() == 23000) {
        http_response_code(409);
        echo json_encode(['error' => 'Это место уже занято!']);
    } else {
        http_response_code(500);
        echo json_encode(['error' => 'Ошибка базы данных: ' . $e->getMessage()]);
    }
} catch (Exception $e) {
    $pdo->rollBack();
    http_response_code(400);
    echo json_encode(['error' => $e->getMessage()]);
}