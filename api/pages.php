<?php
require_once __DIR__ . '/config.php';

// Safe schema synchronization
try {
    if (isset($pdo)) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS pages (
            id INT AUTO_INCREMENT PRIMARY KEY,
            page_key VARCHAR(100) UNIQUE,
            slug VARCHAR(255) NOT NULL UNIQUE,
            title VARCHAR(255) NOT NULL,
            page_type VARCHAR(50) DEFAULT 'landing',
            status VARCHAR(50) DEFAULT 'published',
            hero_config LONGTEXT NULL,
            page_blocks LONGTEXT NULL,
            seo_meta LONGTEXT NULL,
            seo_score INT DEFAULT 85,
            author VARCHAR(100) DEFAULT 'SEO Strategy Team',
            last_modified_by VARCHAR(100) DEFAULT 'Admin',
            is_published TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        // Ensure all columns exist
        $cols = [
            "page_type VARCHAR(50) DEFAULT 'landing'",
            "status VARCHAR(50) DEFAULT 'published'",
            "seo_score INT DEFAULT 85",
            "author VARCHAR(100) DEFAULT 'SEO Strategy Team'",
            "last_modified_by VARCHAR(100) DEFAULT 'Admin'",
            "is_published TINYINT(1) DEFAULT 1",
            "created_at DATETIME DEFAULT CURRENT_TIMESTAMP"
        ];
        foreach ($cols as $c) {
            $cName = explode(' ', $c)[0];
            $chk = $pdo->query("SHOW COLUMNS FROM pages LIKE '$cName'")->fetch();
            if (!$chk) {
                $pdo->exec("ALTER TABLE pages ADD COLUMN $c");
            }
        }
    }
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $slug = $_GET['slug'] ?? null;
    $id = $_GET['id'] ?? null;

    if ($slug) {
        $normalizedSlug = str_replace('_', '-', $slug);
        $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? OR slug = ? LIMIT 1");
        $stmt->execute([$slug, $normalizedSlug]);
        $page = $stmt->fetch();

        if (!$page) {
            jsonResponse(['status' => 'error', 'message' => 'Page not found'], 404);
        }

        $page['hero_config'] = json_decode($page['hero_config'] ?? '{}', true) ?: new stdClass();
        $page['page_blocks'] = json_decode($page['page_blocks'] ?? '[]', true) ?: [];
        $page['seo_meta'] = json_decode($page['seo_meta'] ?? '{}', true) ?: new stdClass();
        $page['is_published'] = isset($page['is_published']) ? (bool)$page['is_published'] : true;

        jsonResponse($page);
    }

    if ($id) {
        $stmt = $pdo->prepare("SELECT * FROM pages WHERE id = ? LIMIT 1");
        $stmt->execute([$id]);
        $page = $stmt->fetch();

        if (!$page) {
            jsonResponse(['status' => 'error', 'message' => 'Page not found'], 404);
        }

        $page['hero_config'] = json_decode($page['hero_config'] ?? '{}', true) ?: new stdClass();
        $page['page_blocks'] = json_decode($page['page_blocks'] ?? '[]', true) ?: [];
        $page['seo_meta'] = json_decode($page['seo_meta'] ?? '{}', true) ?: new stdClass();
        $page['is_published'] = isset($page['is_published']) ? (bool)$page['is_published'] : true;

        jsonResponse($page);
    }

    // List all pages
    $query = "SELECT * FROM pages ORDER BY id ASC";
    $stmt = $pdo->query($query);
    $pages = $stmt->fetchAll();

    foreach ($pages as &$p) {
        $p['hero_config'] = json_decode($p['hero_config'] ?? '{}', true) ?: new stdClass();
        $p['page_blocks'] = json_decode($p['page_blocks'] ?? '[]', true) ?: [];
        $p['seo_meta'] = json_decode($p['seo_meta'] ?? '{}', true) ?: new stdClass();
        $p['is_published'] = isset($p['is_published']) ? (bool)$p['is_published'] : true;
    }

    jsonResponse($pages);
}

if ($method === 'POST' || $method === 'PUT') {
    $data = getJsonInput();

    if (empty($data['slug']) || empty($data['title'])) {
        jsonResponse(['status' => 'error', 'message' => 'slug and title are required'], 400);
    }

    $pageBlocks = $data['page_blocks'] ?? [];
    foreach ($pageBlocks as &$block) {
        if (!empty($block['html_content'])) {
            $block['html_content'] = preg_replace('/<h1(\s|>)/i', '<h2$1', $block['html_content']);
            $block['html_content'] = preg_replace('/<\/h1>/i', '</h2>', $block['html_content']);
        }
    }
    unset($block);

    $id = $data['id'] ?? null;
    $pageKey = $data['page_key'] ?? ('page_' . bin2hex(random_bytes(4)));

    if ($id) {
        // Track slug change for 301 redirect
        $chk = $pdo->prepare("SELECT slug FROM pages WHERE id = ?");
        $chk->execute([$id]);
        $existing = $chk->fetch();

        if ($existing && $existing['slug'] !== $data['slug']) {
            $oldPath = "/p/" . $existing['slug'];
            $newPath = "/p/" . $data['slug'];
            try {
                $redStmt = $pdo->prepare("INSERT INTO seo_redirects (old_path, new_path, status_code) VALUES (?, ?, 301) ON DUPLICATE KEY UPDATE new_path = ?");
                $redStmt->execute([$oldPath, $newPath, $newPath]);
            } catch (Exception $e) {}
        }

        $stmt = $pdo->prepare("UPDATE pages SET title = ?, slug = ?, page_type = ?, status = ?, hero_config = ?, page_blocks = ?, seo_meta = ?, is_published = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([
            $data['title'],
            $data['slug'],
            $data['page_type'] ?? 'landing',
            $data['status'] ?? 'published',
            json_encode($data['hero_config'] ?? []),
            json_encode($pageBlocks, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($data['seo_meta'] ?? []),
            isset($data['is_published']) ? ($data['is_published'] ? 1 : 0) : 1,
            $id
        ]);

        jsonResponse(['status' => 'success', 'message' => 'Page updated successfully', 'id' => $id]);
    } else {
        $stmt = $pdo->prepare("INSERT INTO pages (page_key, slug, title, page_type, status, hero_config, page_blocks, seo_meta, is_published) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $pageKey,
            $data['slug'],
            $data['title'],
            $data['page_type'] ?? 'landing',
            $data['status'] ?? 'published',
            json_encode($data['hero_config'] ?? []),
            json_encode($pageBlocks, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            json_encode($data['seo_meta'] ?? []),
            isset($data['is_published']) ? ($data['is_published'] ? 1 : 0) : 1
        ]);

        jsonResponse(['status' => 'success', 'message' => 'Page created successfully', 'id' => (int)$pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['status' => 'error', 'message' => 'id parameter required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM pages WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['status' => 'success', 'message' => 'Page deleted successfully']);
}
