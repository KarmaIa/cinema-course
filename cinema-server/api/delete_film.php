<?php
require_once __DIR__ . '/../../DataBase/db.php';
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(200); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') { http_response_code(405); exit; }

$data = json_decode(file_get_contents('php://input'), true);
$film_id = (int)($data['id'] ?? 0);

if (!$film_id) {
    http_response_code(400);
    echo json_encode(['error' => 'Неверный ID фильма']);
    exit;
}

try {
    // Проверка, есть ли сеансы с этим фильмом
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM sessions WHERE film_id = ?");
    $stmt->execute([$film_id]);
    $sessionsCount = $stmt->fetchColumn();

    if ($sessionsCount > 0) {
        http_response_code(409);
        echo json_encode(['error' => "Невозможно удалить фильм. У него есть $sessionsCount сеанс(ов)."]);
        exit;
    }

    // Если сеансов нет, удаляем
    $stmt = $pdo->prepare("DELETE FROM films WHERE id = ?");
    $stmt->execute([$film_id]);
    
    echo json_encode(['success' => true]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Ошибка БД: ' . $e->getMessage()]);
}