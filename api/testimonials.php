<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $service_code = $_GET['service_code'] ?? null;
    $query = "SELECT * FROM testimonials";
    $params = [];
    if ($service_code) {
        $query .= " WHERE service_code = ? OR service_code IS NULL";
        $params[] = $service_code;
    }
    $query .= " ORDER BY id DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $testimonials = $stmt->fetchAll();

    foreach ($testimonials as &$t) {
        $t['rating'] = (float)$t['rating'];
        $t['is_featured'] = (bool)$t['is_featured'];
    }

    jsonResponse($testimonials);
}

if ($method === 'POST' || $method === 'PUT') {
    $data = getJsonInput();

    if (empty($data['client_name']) || empty($data['review_text'])) {
        jsonResponse(['status' => 'error', 'message' => 'client_name and review_text are required'], 400);
    }

    $id = $data['id'] ?? null;
    if ($id) {
        $stmt = $pdo->prepare("UPDATE testimonials SET client_name = ?, client_role = ?, avatar_url = ?, rating = ?, review_text = ?, service_code = ?, is_featured = ? WHERE id = ?");
        $stmt->execute([
            $data['client_name'],
            $data['client_role'] ?? '',
            $data['avatar_url'] ?? '',
            $data['rating'] ?? 5.0,
            $data['review_text'],
            !empty($data['service_code']) ? $data['service_code'] : null,
            isset($data['is_featured']) ? ($data['is_featured'] ? 1 : 0) : 1,
            $id
        ]);
        jsonResponse(['status' => 'success', 'message' => 'Testimonial updated', 'id' => $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO testimonials (client_name, client_role, avatar_url, rating, review_text, service_code, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['client_name'],
            $data['client_role'] ?? '',
            $data['avatar_url'] ?? '',
            $data['rating'] ?? 5.0,
            $data['review_text'],
            !empty($data['service_code']) ? $data['service_code'] : null,
            isset($data['is_featured']) ? ($data['is_featured'] ? 1 : 0) : 1
        ]);
        jsonResponse(['status' => 'success', 'message' => 'Testimonial created', 'id' => (int)$pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['status' => 'error', 'message' => 'id required'], 400);
    $stmt = $pdo->prepare("DELETE FROM testimonials WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['status' => 'success', 'message' => 'Testimonial deleted']);
}
