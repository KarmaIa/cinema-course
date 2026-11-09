<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'PUT') { http_response_code(405); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$id = (int)($data['id'] ?? 0);
$title = trim($data['title'] ?? '');
$duration = (int)($data['duration_min'] ?? 0);
$description = trim($data['description'] ?? '');
$age_rating = trim($data['age_rating'] ?? '');

if ($duration < 20 || $duration > 300) {
    http_response_code(400);
    echo json_encode(['error' => 'Длительность фильма должна быть от 20 до 300 минут.']);
    exit;
}

if (!$id || !$title || !$duration) {
    http_response_code(400);
    echo json_encode(['error' => 'Название и длительность обязательны']);
    exit;
}

try {
    $stmt = $pdo->prepare("
        UPDATE films 
        SET title = ?, duration_min = ?, description = ?, age_rating = ? 
        WHERE id = ?
    ");
    $stmt->execute([$title, $duration, $description, $age_rating, $id]);
    
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка БД: ' . $e->getMessage()]);
}