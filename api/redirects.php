<?php
require_once __DIR__ . '/config.php';

$stmt = $pdo->query("SELECT * FROM seo_redirects ORDER BY id DESC");
$redirects = $stmt->fetchAll();
jsonResponse($redirects);
