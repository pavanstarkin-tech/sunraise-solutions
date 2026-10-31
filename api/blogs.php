<?php
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// 1. Auto-publish scheduled posts that have reached their scheduled_at time
try {
    $pdo->query("UPDATE blogs SET status = 'published', is_published = 1, published_at = NOW() WHERE status = 'scheduled' AND scheduled_at IS NOT NULL AND scheduled_at <= NOW()");
} catch (Exception $e) {}

// GET Requests
if ($method === 'GET') {
    $action = $_GET['action'] ?? null;

    // Check slug availability (like AmazingAP)
    if (isset($_GET['check_slug'])) {
        $slug = trim($_GET['check_slug']);
        $excludeId = isset($_GET['exclude_id']) ? (int)$_GET['exclude_id'] : 0;
        $stmt = $pdo->prepare("SELECT id FROM blogs WHERE slug = ? AND id != ? LIMIT 1");
        $stmt->execute([$slug, $excludeId]);
        $exists = (bool)$stmt->fetch();
        jsonResponse([
            'slug' => $slug,
            'available' => !$exists
        ]);
    }

    // Analytics summary (like AmazingAP overview tab)
    if ($action === 'analytics') {
        $totalStmt = $pdo->query("SELECT COUNT(*) as total, SUM(views) as total_views FROM blogs");
        $totals = $totalStmt->fetch();

        $statusStmt = $pdo->query("SELECT status, COUNT(*) as count FROM blogs GROUP BY status");
        $statusRows = $statusStmt->fetchAll();
        $statusCounts = ['published' => 0, 'draft' => 0, 'scheduled' => 0];
        foreach ($statusRows as $r) {
            $st = strtolower($r['status'] ?: 'published');
            $statusCounts[$st] = (int)$r['count'];
        }

        $catStmt = $pdo->query("SELECT category, COUNT(*) as count FROM blogs GROUP BY category ORDER BY count DESC");
        $categoryBreakdown = $catStmt->fetchAll();

        jsonResponse([
            'total_posts' => (int)($totals['total'] ?? 0),
            'total_views' => (int)($totals['total_views'] ?? 0),
            'status_counts' => $statusCounts,
            'category_breakdown' => $categoryBreakdown
        ]);
    }

    // Single post by slug
    $slug = $_GET['slug'] ?? null;
    if ($slug) {
        $stmt = $pdo->prepare("SELECT * FROM blogs WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $blog = $stmt->fetch();
        if (!$blog) jsonResponse(['status' => 'error', 'message' => 'Article not found'], 404);

        // Increment views if public visit
        if (!isset($_GET['no_view'])) {
            try {
                $pdo->prepare("UPDATE blogs SET views = views + 1 WHERE id = ?")->execute([$blog['id']]);
                $blog['views'] = (int)$blog['views'] + 1;
            } catch (Exception $e) {}
        }

        $blog['content_blocks'] = json_decode($blog['content_blocks'], true) ?: [];
        $blog['seo_meta'] = json_decode($blog['seo_meta'], true) ?: new stdClass();
        $blog['is_published'] = (bool)$blog['is_published'];
        $blog['is_featured'] = (bool)($blog['is_featured'] ?? false);
        $blog['views'] = (int)($blog['views'] ?? 0);
        jsonResponse($blog);
    }

    // Filtered / Search Query
    $where = [];
    $params = [];

    // Filter by published status (default to all if include_drafts is set or from admin)
    if (!isset($_GET['include_drafts'])) {
        $where[] = "(status = 'published' OR (status IS NULL AND is_published = 1))";
    } elseif (isset($_GET['status']) && $_GET['status'] !== 'all') {
        $where[] = "status = ?";
        $params[] = $_GET['status'];
    }

    if (!empty($_GET['category']) && $_GET['category'] !== 'all') {
        $where[] = "category = ?";
        $params[] = $_GET['category'];
    }

    if (!empty($_GET['service_code'])) {
        $where[] = "service_code = ?";
        $params[] = $_GET['service_code'];
    }

    if (!empty($_GET['search'])) {
        $where[] = "(title LIKE ? OR excerpt LIKE ? OR tags LIKE ?)";
        $s = '%' . trim($_GET['search']) . '%';
        $params[] = $s;
        $params[] = $s;
        $params[] = $s;
    }

    $whereSql = !empty($where) ? "WHERE " . implode(" AND ", $where) : "";

    // Sort order
    $sort = $_GET['sort'] ?? 'newest';
    $orderSql = "ORDER BY id DESC";
    if ($sort === 'oldest') $orderSql = "ORDER BY id ASC";
    elseif ($sort === 'views') $orderSql = "ORDER BY views DESC";
    elseif ($sort === 'title') $orderSql = "ORDER BY title ASC";

    $query = "SELECT * FROM blogs $whereSql $orderSql";
    $stmt = $pdo->prepare($query);
    $stmt->execute($params);
    $blogs = $stmt->fetchAll();

    foreach ($blogs as &$b) {
        $b['content_blocks'] = json_decode($b['content_blocks'], true) ?: [];
        $b['seo_meta'] = json_decode($b['seo_meta'], true) ?: new stdClass();
        $b['is_published'] = (bool)$b['is_published'];
        $b['is_featured'] = (bool)($b['is_featured'] ?? false);
        $b['views'] = (int)($b['views'] ?? 0);
    }

    jsonResponse($blogs);
}

// POST / PUT Requests (Single Upsert or Bulk Action)
if ($method === 'POST' || $method === 'PUT') {
    $data = getJsonInput();
    $action = $_GET['action'] ?? ($data['action'] ?? null);

    // Bulk actions (like AmazingAP)
    if ($action === 'bulk') {
        $ids = $data['ids'] ?? [];
        $bulkOp = $data['operation'] ?? '';

        if (empty($ids) || !is_array($ids)) {
            jsonResponse(['status' => 'error', 'message' => 'ids array required'], 400);
        }

        $placeholders = implode(',', array_fill(0, count($ids), '?'));

        if ($bulkOp === 'delete') {
            $stmt = $pdo->prepare("DELETE FROM blogs WHERE id IN ($placeholders)");
            $stmt->execute($ids);
            jsonResponse(['status' => 'success', 'message' => count($ids) . ' articles deleted']);
        } elseif ($bulkOp === 'publish') {
            $stmt = $pdo->prepare("UPDATE blogs SET status = 'published', is_published = 1, published_at = NOW() WHERE id IN ($placeholders)");
            $stmt->execute($ids);
            jsonResponse(['status' => 'success', 'message' => count($ids) . ' articles published']);
        } elseif ($bulkOp === 'draft') {
            $stmt = $pdo->prepare("UPDATE blogs SET status = 'draft', is_published = 0 WHERE id IN ($placeholders)");
            $stmt->execute($ids);
            jsonResponse(['status' => 'success', 'message' => count($ids) . ' articles moved to draft']);
        } else {
            jsonResponse(['status' => 'error', 'message' => 'Unknown bulk operation'], 400);
        }
    }

    // Single Article Upsert
    if (empty($data['slug']) || empty($data['title'])) {
        jsonResponse(['status' => 'error', 'message' => 'slug and title are required'], 400);
    }

    $id = $data['id'] ?? null;
    $status = $data['status'] ?? 'published';
    $isPub = ($status === 'published') ? 1 : 0;
    $pubAt = ($status === 'published') ? ($data['published_at'] ?? date('Y-m-d H:i:s')) : null;
    $scheduledAt = ($status === 'scheduled') ? ($data['scheduled_at'] ?? null) : null;
    $isFeatured = !empty($data['is_featured']) ? 1 : 0;
    $tags = is_array($data['tags'] ?? null) ? implode(', ', $data['tags']) : ($data['tags'] ?? '');

    // Content HTML & content blocks synchronization
    $contentHtml = $data['content_html'] ?? '';
    $contentBlocks = $data['content_blocks'] ?? [];

    if (empty($contentBlocks) && !empty($contentHtml)) {
        $contentBlocks = [
            [
                'id' => 'blk-gen-' . time(),
                'type' => 'html',
                'sort_order' => 1,
                'html_content' => $contentHtml
            ]
        ];
    } elseif (!empty($contentBlocks) && empty($contentHtml)) {
        foreach ($contentBlocks as $cb) {
            if (!empty($cb['html_content'])) {
                $contentHtml .= $cb['html_content'] . "\n";
            }
        }
    }

    if ($id) {
        $stmt = $pdo->prepare("
            UPDATE blogs SET 
                slug = ?, title = ?, excerpt = ?, cover_image = ?, image_alt = ?, image_caption = ?,
                category = ?, service_code = ?, tags = ?, author = ?, is_featured = ?,
                status = ?, scheduled_at = ?, content_html = ?, content_blocks = ?, 
                seo_meta = ?, is_published = ?, published_at = ?, updated_at = NOW()
            WHERE id = ?
        ");
        $stmt->execute([
            $data['slug'],
            $data['title'],
            $data['excerpt'] ?? '',
            $data['cover_image'] ?? '',
            $data['image_alt'] ?? '',
            $data['image_caption'] ?? '',
            $data['category'] ?? 'Insights',
            !empty($data['service_code']) ? $data['service_code'] : null,
            $tags,
            $data['author'] ?? 'Sunraise Editorial Team',
            $isFeatured,
            $status,
            $scheduledAt,
            $contentHtml,
            json_encode($contentBlocks),
            json_encode($data['seo_meta'] ?? []),
            $isPub,
            $pubAt,
            $id
        ]);

        // Sync with seo_pages on update
        try {
            $seo = $data['seo_meta'] ?? [];
            $metaTitle = $seo['meta_title'] ?? ($data['title'] . ' | Sunraise Insights');
            $metaDesc = $seo['meta_description'] ?? ($data['excerpt'] ?? '');
            $keywords = $seo['keywords'] ?? $tags;
            $canonical = $seo['canonical_url'] ?? ('https://sunraisesolutions.com/blog/' . $data['slug']);
            $ogImg = $seo['og_image'] ?? ($data['cover_image'] ?? '');
            $robots = $seo['robots'] ?? 'index, follow';
            
            $stmtSeo = $pdo->prepare("
                INSERT INTO seo_pages (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, og_image, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
                VALUES (?, 'blog', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Article', 0.8, 'weekly', ?)
                ON DUPLICATE KEY UPDATE
                    title = VALUES(title),
                    meta_title = VALUES(meta_title),
                    meta_description = VALUES(meta_description),
                    focus_keywords = VALUES(focus_keywords),
                    canonical_url = VALUES(canonical_url),
                    robots = VALUES(robots),
                    og_title = VALUES(og_title),
                    og_description = VALUES(og_description),
                    og_image = VALUES(og_image),
                    is_indexed = VALUES(is_indexed),
                    updated_at = CURRENT_TIMESTAMP
            ");
            $stmtSeo->execute([
                '/blog/' . $data['slug'],
                $data['title'],
                $metaTitle,
                $metaDesc,
                $keywords,
                $canonical,
                $robots,
                $metaTitle,
                $metaDesc,
                $ogImg,
                $isPub
            ]);
        } catch (Exception $e) {}

        jsonResponse(['status' => 'success', 'message' => 'Article updated successfully', 'id' => (int)$id]);
    } else {
        $stmt = $pdo->prepare("
            INSERT INTO blogs (
                slug, title, excerpt, cover_image, image_alt, image_caption,
                category, service_code, tags, author, is_featured,
                status, scheduled_at, content_html, content_blocks, seo_meta, 
                is_published, published_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $data['slug'],
            $data['title'],
            $data['excerpt'] ?? '',
            $data['cover_image'] ?? '',
            $data['image_alt'] ?? '',
            $data['image_caption'] ?? '',
            $data['category'] ?? 'Insights',
            !empty($data['service_code']) ? $data['service_code'] : null,
            $tags,
            $data['author'] ?? 'Sunraise Editorial Team',
            $isFeatured,
            $status,
            $scheduledAt,
            $contentHtml,
            json_encode($contentBlocks),
            json_encode($data['seo_meta'] ?? []),
            $isPub,
            $pubAt
        ]);
        $newId = (int)$pdo->lastInsertId();

        // Sync with seo_pages
        try {
            $seo = $data['seo_meta'] ?? [];
            $metaTitle = $seo['meta_title'] ?? ($data['title'] . ' | Sunraise Insights');
            $metaDesc = $seo['meta_description'] ?? ($data['excerpt'] ?? '');
            $keywords = $seo['keywords'] ?? $tags;
            $canonical = $seo['canonical_url'] ?? ('https://sunraisesolutions.com/blog/' . $data['slug']);
            $ogImg = $seo['og_image'] ?? ($data['cover_image'] ?? '');
            $robots = $seo['robots'] ?? 'index, follow';
            
            $stmtSeo = $pdo->prepare("
                INSERT INTO seo_pages (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, og_image, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
                VALUES (?, 'blog', ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Article', 0.8, 'weekly', ?)
                ON DUPLICATE KEY UPDATE
                    title = VALUES(title),
                    meta_title = VALUES(meta_title),
                    meta_description = VALUES(meta_description),
                    focus_keywords = VALUES(focus_keywords),
                    canonical_url = VALUES(canonical_url),
                    robots = VALUES(robots),
                    og_title = VALUES(og_title),
                    og_description = VALUES(og_description),
                    og_image = VALUES(og_image),
                    is_indexed = VALUES(is_indexed),
                    updated_at = CURRENT_TIMESTAMP
            ");
            $stmtSeo->execute([
                '/blog/' . $data['slug'],
                $data['title'],
                $metaTitle,
                $metaDesc,
                $keywords,
                $canonical,
                $robots,
                $metaTitle,
                $metaDesc,
                $ogImg,
                $isPub
            ]);
        } catch (Exception $e) {}

        jsonResponse([
            'status' => 'success', 
            'message' => 'Article created successfully', 
            'id' => $newId
        ], 201);
    }
}

// DELETE Request
if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['status' => 'error', 'message' => 'id required'], 400);
    $stmt = $pdo->prepare("DELETE FROM blogs WHERE id = ?");
    $stmt->execute([$id]);
    jsonResponse(['status' => 'success', 'message' => 'Article deleted successfully']);
}
