<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $status = $_GET['status'] ?? null;
    $query = "SELECT * FROM leads";
    $params = [];
    if ($status && $status !== 'All') {
        $query .= " WHERE status = ?";
        $params[] = $status;
    }
    $query .= " ORDER BY id DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $leads = $stmt->fetchAll();

    jsonResponse($leads);
}

if ($method === 'POST') {
    $data = getJsonInput();

    if (empty($data['full_name']) || empty($data['email']) || empty($data['phone'])) {
        jsonResponse(['status' => 'error', 'message' => 'Full name, email, and phone are required'], 400);
    }

    $stmt = $pdo->prepare("INSERT INTO leads (full_name, email, phone, service_code, budget_range, message, source_page, status) VALUES (?, ?, ?, ?, ?, ?, ?, 'new')");
    $stmt->execute([
        $data['full_name'],
        $data['email'],
        $data['phone'],
        !empty($data['service_code']) ? $data['service_code'] : null,
        $data['budget_range'] ?? '₹25k–₹50k',
        $data['message'] ?? '',
        $data['source_page'] ?? '/'
    ]);

    jsonResponse([
        'status' => 'success',
        'message' => 'Proposal request received successfully by Sunraise Solutions!',
        'id' => (int)$pdo->lastInsertId()
    ], 201);
}

if ($method === 'PATCH' || $method === 'PUT') {
    $data = getJsonInput();
    $id = $data['id'] ?? ($_GET['id'] ?? null);
    $status = $data['status'] ?? null;

    if (!$id || !$status) {
        jsonResponse(['status' => 'error', 'message' => 'id and status are required'], 400);
    }

    $stmt = $pdo->prepare("UPDATE leads SET status = ? WHERE id = ?");
    $stmt->execute([$status, $id]);

    jsonResponse(['status' => 'success', 'message' => 'Lead status updated to ' . $status]);
}
