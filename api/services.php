<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $slug = $_GET['slug'] ?? null;
    $id = $_GET['id'] ?? null;

    if ($slug || $id) {
        if ($id) {
            $stmt = $pdo->prepare("SELECT * FROM services WHERE id = ? LIMIT 1");
            $stmt->execute([$id]);
        } else {
            $normalizedSlug = str_replace('_', '-', $slug);
            $stmt = $pdo->prepare("SELECT * FROM services WHERE slug = ? OR slug = ? LIMIT 1");
            $stmt->execute([$slug, $normalizedSlug]);
        }
        $service = $stmt->fetch();

        if (!$service) {
            jsonResponse(['status' => 'error', 'message' => 'Service not found'], 404);
        }

        // Decode JSON fields
        $service['hero_config'] = json_decode($service['hero_config'], true) ?: new stdClass();
        $service['page_blocks'] = json_decode($service['page_blocks'], true) ?: [];
        $service['seo_meta'] = json_decode($service['seo_meta'], true) ?: new stdClass();
        $service['is_published'] = (bool)$service['is_published'];

        // Attach linked projects
        $projStmt = $pdo->prepare("SELECT * FROM projects WHERE service_code = ? ORDER BY id DESC");
        $projStmt->execute([$service['service_code']]);
        $projects = $projStmt->fetchAll();
        foreach ($projects as &$p) {
            $p['seo_meta'] = json_decode($p['seo_meta'], true) ?: new stdClass();
            $p['is_featured'] = (bool)$p['is_featured'];
        }
        $service['projects'] = $projects;

        // Attach linked testimonials
        $testStmt = $pdo->prepare("SELECT * FROM testimonials WHERE service_code = ? OR service_code IS NULL ORDER BY id DESC");
        $testStmt->execute([$service['service_code']]);
        $testimonials = $testStmt->fetchAll();
        foreach ($testimonials as &$t) {
            $t['rating'] = (float)$t['rating'];
            $t['is_featured'] = (bool)$t['is_featured'];
        }
        $service['testimonials'] = $testimonials;

        jsonResponse($service);
    }

    // List all
    $query = "SELECT * FROM services";
    if (!isset($_GET['include_unpublished'])) {
        $query .= " WHERE is_published = 1";
    }
    $query .= " ORDER BY display_order ASC, id ASC";

    $stmt = $pdo->query($query);
    $services = $stmt->fetchAll();

    foreach ($services as &$s) {
        $s['hero_config'] = json_decode($s['hero_config'], true) ?: new stdClass();
        $s['page_blocks'] = json_decode($s['page_blocks'], true) ?: [];
        $s['seo_meta'] = json_decode($s['seo_meta'], true) ?: new stdClass();
        $s['is_published'] = (bool)$s['is_published'];
    }

    jsonResponse($services);
}

if ($method === 'POST' || $method === 'PUT') {
    $data = getJsonInput();

    if (empty($data['service_code']) || empty($data['slug']) || empty($data['title'])) {
        jsonResponse(['status' => 'error', 'message' => 'service_code, slug, and title are required'], 400);
    }

    // SEO Sanitizer: Downgrade any nested <h1> tags inside blocks to <h2>
    $pageBlocks = $data['page_blocks'] ?? [];
    foreach ($pageBlocks as &$block) {
        if (!empty($block['html_content'])) {
            $block['html_content'] = preg_replace('/<h1(\s|>)/i', '<h2$1', $block['html_content']);
            $block['html_content'] = preg_replace('/<\/h1>/i', '</h2>', $block['html_content']);
        }
    }

    $id = $data['id'] ?? null;
    if ($id) {
        // Check for slug modification to register 301 redirect
        $chk = $pdo->prepare("SELECT slug FROM services WHERE id = ?");
        $chk->execute([$id]);
        $existing = $chk->fetch();

        if ($existing && $existing['slug'] !== $data['slug']) {
            $oldPath = "/services/" . $existing['slug'];
            $newPath = "/services/" . $data['slug'];
            $redStmt = $pdo->prepare("INSERT INTO seo_redirects (old_path, new_path, status_code) VALUES (?, ?, 301) ON DUPLICATE KEY UPDATE new_path = ?");
            $redStmt->execute([$oldPath, $newPath, $newPath]);
        }

        $stmt = $pdo->prepare("UPDATE services SET service_code = ?, slug = ?, title = ?, short_description = ?, icon_name = ?, thumbnail_url = ?, hero_config = ?, page_blocks = ?, seo_meta = ?, is_published = ?, display_order = ? WHERE id = ?");
        $stmt->execute([
            $data['service_code'],
            $data['slug'],
            $data['title'],
            $data['short_description'] ?? '',
            $data['icon_name'] ?? 'Globe',
            $data['thumbnail_url'] ?? '',
            json_encode($data['hero_config'] ?? []),
            json_encode($pageBlocks),
            json_encode($data['seo_meta'] ?? []),
            isset($data['is_published']) ? ($data['is_published'] ? 1 : 0) : 1,
            $data['display_order'] ?? 0,
            $id
        ]);

        jsonResponse(['status' => 'success', 'message' => 'Service updated successfully with SEO safeguard', 'id' => $id]);
    } else {
        // Insert new
        $stmt = $pdo->prepare("INSERT INTO services (service_code, slug, title, short_description, icon_name, thumbnail_url, hero_config, page_blocks, seo_meta, is_published, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $data['service_code'],
            $data['slug'],
            $data['title'],
            $data['short_description'] ?? '',
            $data['icon_name'] ?? 'Globe',
            $data['thumbnail_url'] ?? '',
            json_encode($data['hero_config'] ?? []),
            json_encode($pageBlocks),
            json_encode($data['seo_meta'] ?? []),
            isset($data['is_published']) ? ($data['is_published'] ? 1 : 0) : 1,
            $data['display_order'] ?? 0
        ]);

        jsonResponse(['status' => 'success', 'message' => 'Service created successfully', 'id' => (int)$pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['status' => 'error', 'message' => 'id parameter required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM services WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['status' => 'success', 'message' => 'Service deleted successfully']);
}
