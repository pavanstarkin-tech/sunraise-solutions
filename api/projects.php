<?php
require_once __DIR__ . '/config.php';

// Safe schema additions for projects
try {
    $pdo->exec("ALTER TABLE `projects` ADD COLUMN `content_html` LONGTEXT NULL");
} catch (Exception $e) {}
try {
    $pdo->exec("ALTER TABLE `projects` ADD COLUMN `status` VARCHAR(20) DEFAULT 'completed'");
} catch (Exception $e) {}
try {
    $pdo->exec("ALTER TABLE `projects` ADD COLUMN `project_url` VARCHAR(255) DEFAULT ''");
} catch (Exception $e) {}
try {
    $pdo->exec("ALTER TABLE `projects` ADD COLUMN `image_alt` VARCHAR(255) DEFAULT ''");
} catch (Exception $e) {}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // Check slug availability
    if (isset($_GET['check_slug'])) {
        $slug = trim($_GET['check_slug']);
        $excludeId = isset($_GET['exclude_id']) ? (int)$_GET['exclude_id'] : 0;
        $stmt = $pdo->prepare("SELECT id FROM projects WHERE slug = ? AND id != ? LIMIT 1");
        $stmt->execute([$slug, $excludeId]);
        $exists = (bool)$stmt->fetch();
        jsonResponse([
            'slug' => $slug,
            'available' => !$exists
        ]);
    }

    // Analytics summary
    if (isset($_GET['action']) && $_GET['action'] === 'analytics') {
        $totalStmt = $pdo->query("SELECT COUNT(*) as total, SUM(views) as total_views FROM projects");
        $totals = $totalStmt->fetch();

        $serviceStmt = $pdo->query("SELECT service_code, COUNT(*) as count FROM projects GROUP BY service_code ORDER BY count DESC");
        $serviceBreakdown = $serviceStmt->fetchAll();

        $featuredStmt = $pdo->query("SELECT COUNT(*) as count FROM projects WHERE is_featured = 1");
        $featured = $featuredStmt->fetch();

        jsonResponse([
            'total_projects' => (int)($totals['total'] ?? 0),
            'total_views' => (int)($totals['total_views'] ?? 0),
            'featured_count' => (int)($featured['count'] ?? 0),
            'service_breakdown' => $serviceBreakdown
        ]);
    }

    $slug = $_GET['slug'] ?? null;
    if ($slug) {
        $stmt = $pdo->prepare("SELECT * FROM projects WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $project = $stmt->fetch();
        if (!$project) jsonResponse(['status' => 'error', 'message' => 'Project not found'], 404);

        if (!isset($_GET['no_view'])) {
            try {
                $pdo->prepare("UPDATE projects SET views = views + 1 WHERE id = ?")->execute([$project['id']]);
                $project['views'] = (int)$project['views'] + 1;
            } catch (Exception $e) {}
        }

        $project['case_study_blocks'] = json_decode($project['case_study_blocks'], true) ?: [];
        $project['seo_meta'] = json_decode($project['seo_meta'], true) ?: new stdClass();
        $project['metrics'] = json_decode($project['metrics'], true) ?: [];
        $project['is_featured'] = (bool)$project['is_featured'];
        $project['views'] = (int)($project['views'] ?? 0);
        $project['status'] = $project['status'] ?? ($project['is_featured'] ? 'featured' : 'completed');
        $project['project_url'] = $project['project_url'] ?? '';
        $project['image_alt'] = $project['image_alt'] ?? '';
        
        $project['content_html'] = $project['content_html'] ?? ($project['solution'] ?? '');
        if (empty($project['content_html']) && !empty($project['case_study_blocks'])) {
            $joined = '';
            foreach ($project['case_study_blocks'] as $cb) {
                if (!empty($cb['html_content'])) {
                    $joined .= $cb['html_content'] . "\n";
                }
            }
            $project['content_html'] = $joined;
        }

        jsonResponse($project);
    }

    $where = [];
    $params = [];

    if (!empty($_GET['service_code'])) {
        $where[] = "service_code = ?";
        $params[] = $_GET['service_code'];
    }

    if (!empty($_GET['category'])) {
        $where[] = "category_badge = ?";
        $params[] = $_GET['category'];
    }

    if (isset($_GET['is_featured'])) {
        $where[] = "is_featured = ?";
        $params[] = $_GET['is_featured'] ? 1 : 0;
    }

    if (!empty($_GET['search'])) {
        $where[] = "(title LIKE ? OR client_name LIKE ? OR summary LIKE ? OR technologies LIKE ?)";
        $s = '%' . trim($_GET['search']) . '%';
        $params[] = $s;
        $params[] = $s;
        $params[] = $s;
        $params[] = $s;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";
    $query = "SELECT * FROM projects $whereSql ORDER BY is_featured DESC, id DESC";

    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $projects = $stmt->fetchAll();

    foreach ($projects as &$p) {
        $p['case_study_blocks'] = json_decode($p['case_study_blocks'], true) ?: [];
        $p['seo_meta'] = json_decode($p['seo_meta'], true) ?: new stdClass();
        $p['metrics'] = json_decode($p['metrics'], true) ?: [];
        $p['is_featured'] = (bool)$p['is_featured'];
        $p['views'] = (int)($p['views'] ?? 0);
        $p['status'] = $p['status'] ?? ($p['is_featured'] ? 'featured' : 'completed');
        $p['project_url'] = $p['project_url'] ?? '';
        $p['image_alt'] = $p['image_alt'] ?? '';

        $p['content_html'] = $p['content_html'] ?? ($p['solution'] ?? '');
        if (empty($p['content_html']) && !empty($p['case_study_blocks'])) {
            $joined = '';
            foreach ($p['case_study_blocks'] as $cb) {
                if (!empty($cb['html_content'])) {
                    $joined .= $cb['html_content'] . "\n";
                }
            }
            $p['content_html'] = $joined;
        }
    }

    jsonResponse($projects);
}

if ($method === 'POST' || $method === 'PUT') {
    $data = getJsonInput();
    $action = $_GET['action'] ?? ($data['action'] ?? null);

    // Bulk actions
    if ($action === 'bulk') {
        $ids = $data['ids'] ?? [];
        $bulkOp = $data['operation'] ?? '';

        if (empty($ids) || !is_array($ids)) {
            jsonResponse(['status' => 'error', 'message' => 'ids array required'], 400);
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        if ($bulkOp === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM projects WHERE id IN ($placeholders)");
            $stmt->execute($ids);
            jsonResponse(['status' => 'success', 'message' => count($ids) . ' projects deleted']);
        } elseif ($bulkOp === 'feature') {
            $stmt = $pdo->prepare("UPDATE projects SET is_featured = 1 WHERE id IN ($placeholders)");
            $stmt->execute($ids);
            jsonResponse(['status' => 'success', 'message' => count($ids) . ' projects marked as featured']);
        } elseif ($bulkOp === 'unfeature') {
            $stmt = $pdo->prepare("UPDATE projects SET is_featured = 0 WHERE id IN ($placeholders)");
            $stmt->execute($ids);
            jsonResponse(['status' => 'success', 'message' => count($ids) . ' projects unmarked as featured']);
        }
    }

    if (empty($data['slug']) || empty($data['title'])) {
        jsonResponse(['status' => 'error', 'message' => 'slug and title are required'], 400);
    }

    $id = $data['id'] ?? null;
    $isFeatured = !empty($data['is_featured']) ? 1 : 0;
    $status = $data['status'] ?? ($isFeatured ? 'featured' : 'completed');
    $projectUrl = $data['project_url'] ?? '';
    $imageAlt = $data['image_alt'] ?? '';
    $contentHtml = $data['content_html'] ?? ($data['solution'] ?? '');
    
    $metrics = is_array($data['metrics'] ?? null) ? json_encode($data['metrics']) : ($data['metrics'] ?? '[]');
    $technologies = is_array($data['technologies'] ?? null) ? implode(', ', $data['technologies']) : ($data['technologies'] ?? '');

    $blocks = $data['case_study_blocks'] ?? [];
    if (empty($blocks) && !empty($contentHtml)) {
        $blocks = [
            [
                'id' => 'blk-html-' . time(),
                'type' => 'html',
                'html_content' => $contentHtml
            ]
        ];
    }

    if ($id) {
        $stmt = $pdo->prepare("
            UPDATE projects SET 
                slug = ?, title = ?, client_name = ?, client_industry = ?, project_year = ?,
                service_code = ?, category_badge = ?, thumbnail_url = ?, image_alt = ?, summary = ?,
                challenge = ?, solution = ?, content_html = ?, status = ?, project_url = ?, metrics = ?, technologies = ?,
                case_study_blocks = ?, seo_meta = ?, is_featured = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $data['slug'],
            $data['title'],
            $data['client_name'] ?? 'Client Enterprise',
            $data['client_industry'] ?? 'Corporate',
            $data['project_year'] ?? date('Y'),
            $data['service_code'] ?? 'SRV-SEO-01',
            $data['category_badge'] ?? 'Project',
            $data['thumbnail_url'] ?? '',
            $imageAlt,
            $data['summary'] ?? '',
            $data['challenge'] ?? '',
            $contentHtml,
            $contentHtml,
            $status,
            $projectUrl,
            $metrics,
            $technologies,
            json_encode($blocks),
            json_encode($data['seo_meta'] ?? []),
            $isFeatured,
            $id
        ]);
        jsonResponse(['status' => 'success', 'message' => 'Project updated successfully', 'id' => (int)$id]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO projects (
                slug, title, client_name, client_industry, project_year,
                service_code, category_badge, thumbnail_url, image_alt, summary,
                challenge, solution, content_html, status, project_url, metrics, technologies,
                case_study_blocks, seo_meta, is_featured
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['slug'],
            $data['title'],
            $data['client_name'] ?? 'Client Enterprise',
            $data['client_industry'] ?? 'Corporate',
            $data['project_year'] ?? date('Y'),
            $data['service_code'] ?? 'SRV-SEO-01',
            $data['category_badge'] ?? 'Project',
            $data['thumbnail_url'] ?? '',
            $imageAlt,
            $data['summary'] ?? '',
            $data['challenge'] ?? '',
            $contentHtml,
            $contentHtml,
            $status,
            $projectUrl,
            $metrics,
            $technologies,
            json_encode($blocks),
            json_encode($data['seo_meta'] ?? []),
            $isFeatured
        ]);
        jsonResponse(['status' => 'success', 'message' => 'Project created successfully', 'id' => (int)$pdo->lastInsertId()], 201);
    }
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['status' => 'error', 'message' => 'id required'], 400);
    $stmt = $pdo->prepare("DELETE FROM projects WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['status' => 'success', 'message' => 'Project deleted successfully']);
}
