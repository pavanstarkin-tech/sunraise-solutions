<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// GET all categories with post count
if ($method === 'GET') {
    try {
        $stmt = $pdo->query("
            SELECT c.id, c.name, c.slug, COUNT(b.id) as post_count
            FROM blog_categories c
            LEFT JOIN blogs b ON b.category COLLATE utf8mb4_unicode_ci = c.name COLLATE utf8mb4_unicode_ci
            GROUP BY c.id, c.name, c.slug
            ORDER BY c.name ASC
        ");
        $categories = $stmt->fetchAll();
        jsonResponse($categories);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

// POST create category
if ($method === 'POST') {
    $data = getJsonInput();
    $name = trim($data['name'] ?? '');
    if (!$name) {
        jsonResponse(['status' => 'error', 'message' => 'Category name is required'], 400);
    }
    $slug = strtolower(trim(preg_replace('/[^A-Za-z0-9-]+/', '-', $name)));

    try {
        $stmt = $pdo->prepare("INSERT INTO blog_categories (name, slug) VALUES (?, ?)");
        $stmt->execute([$name, $slug]);
        jsonResponse([
            'status' => 'success',
            'message' => 'Category created',
            'id' => (int)$pdo->lastInsertId(),
            'name' => $name,
            'slug' => $slug
        ], 201);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => 'Category already exists or invalid'], 409);
    }
}

// DELETE category
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    $name = $_GET['name'] ?? null;

    try {
        if ($id) {
            $stmt = $pdo->prepare("DELETE FROM blog_categories WHERE id = ?");
            $stmt->execute([$id]);
        } elseif ($name) {
            $stmt = $pdo->prepare("DELETE FROM blog_categories WHERE name = ?");
            $stmt->execute([$name]);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'Category id or name required'], 400);
        }
        jsonResponse(['status' => 'success', 'message' => 'Category deleted']);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}
