<?php
try {
    $pdo = new PDO("sqlite:" . __DIR__ . '/cinema.sqlite');
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $pdo->exec("PRAGMA foreign_keys = ON;");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS films (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            duration_min INTEGER NOT NULL,
            age_rating TEXT,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        );
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS halls (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            rows_count INTEGER NOT NULL,
            seats_per_row INTEGER NOT NULL
        );
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            film_id INTEGER NOT NULL,
            hall_id INTEGER NOT NULL,
            start_time TEXT NOT NULL,
            price REAL NOT NULL,
            created_at TEXT DEFAULT (datetime('now', 'localtime')),
            FOREIGN KEY (film_id) REFERENCES films(id) ON DELETE CASCADE,
            FOREIGN KEY (hall_id) REFERENCES halls(id) ON DELETE CASCADE
        );
    ");

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS tickets (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id INTEGER NOT NULL,
            row_number INTEGER NOT NULL,
            seat_number INTEGER NOT NULL,
            price REAL NOT NULL,
            buyer_name TEXT,
            purchased_at TEXT DEFAULT (datetime('now', 'localtime')),
            status TEXT DEFAULT 'sold',
            FOREIGN KEY (session_id) REFERENCES sessions(id) ON DELETE CASCADE,
            UNIQUE (session_id, row_number, seat_number)
        );
    ");
} catch (PDOException $e) {
    die("Ошибка: " . $e->getMessage());
}
?>