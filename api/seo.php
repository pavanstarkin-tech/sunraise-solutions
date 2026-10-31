<?php
require_once __DIR__ . '/config.php';

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

// Helper: Auto-sync newly created services, blogs, and projects into seo_pages
function autoSyncSeoPages($pdo) {
    $baseUrl = 'https://sunraisesolutions.com';

    // 1. Sync Services
    try {
        $services = $pdo->query("SELECT id, slug, title, service_code, hero_config, seo_meta FROM services")->fetchAll(PDO::FETCH_ASSOC);
        $insertService = $pdo->prepare("
            INSERT IGNORE INTO seo_pages 
            (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
            VALUES (?, 'service', ?, ?, ?, ?, ?, 'index, follow', ?, ?, 'Service', 0.9, 'weekly', 1)
        ");
        foreach ($services as $s) {
            $path = '/services/' . $s['slug'];
            $meta = !empty($s['seo_meta']) ? json_decode($s['seo_meta'], true) : [];
            $hero = !empty($s['hero_config']) ? json_decode($s['hero_config'], true) : [];
            $subtitle = $hero['subtitle'] ?? '';
            $metaTitle = $meta['meta_title'] ?? ($s['title'] . ' | Sunraise Solutions');
            $metaDesc = $meta['meta_description'] ?? (substr($subtitle, 0, 155) . '...');
            $keywords = $meta['keywords'] ?? strtolower($s['title'] . ', ' . $s['service_code'] . ', enterprise tech');
            $canonical = $meta['canonical_url'] ?? ($baseUrl . $path);
            $insertService->execute([
                $path,
                $s['title'],
                $metaTitle,
                $metaDesc,
                $keywords,
                $canonical,
                $metaTitle,
                $metaDesc
            ]);
        }
        // 4. Sync Landing Pages (from pages table)
        try {
            $pages = $pdo->query("SELECT id, slug, title, page_type, seo_meta FROM pages")->fetchAll(PDO::FETCH_ASSOC);
            $insertPage = $pdo->prepare("
                INSERT IGNORE INTO seo_pages 
                (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
                VALUES (?, 'custom', ?, ?, ?, ?, ?, 'index, follow', ?, ?, 'WebPage', 0.8, 'weekly', 1)
            ");
            foreach ($pages as $pg) {
                $path = '/p/' . $pg['slug'];
                $meta = !empty($pg['seo_meta']) ? json_decode($pg['seo_meta'], true) : [];
                $metaTitle = $meta['meta_title'] ?? ($pg['title'] . ' | Sunraise Solutions');
                $metaDesc = $meta['meta_description'] ?? ('Explore ' . $pg['title'] . ' tailored by Sunraise Solutions.');
                $keywords = $meta['focus_keyword'] ?? ($meta['keywords'] ?? strtolower($pg['title'] . ', enterprise, hyderabad'));
                $canonical = $meta['canonical_url'] ?? ($baseUrl . $path);
                $insertPage->execute([
                    $path,
                    $pg['title'],
                    $metaTitle,
                    $metaDesc,
                    $keywords,
                    $canonical,
                    $metaTitle,
                    $metaDesc
                ]);
            }
        } catch (Exception $e) {}
    } catch (Exception $e) {}

    // 2. Sync Blogs
    try {
        $blogs = $pdo->query("SELECT id, slug, title, excerpt, cover_image, category, seo_meta FROM blogs")->fetchAll(PDO::FETCH_ASSOC);
        $insertBlog = $pdo->prepare("
            INSERT IGNORE INTO seo_pages 
            (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, og_image, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
            VALUES (?, 'blog', ?, ?, ?, ?, ?, 'index, follow', ?, ?, ?, 'Article', 0.8, 'weekly', 1)
        ");
        foreach ($blogs as $b) {
            $path = '/blog/' . $b['slug'];
            $meta = !empty($b['seo_meta']) ? json_decode($b['seo_meta'], true) : [];
            $metaTitle = $meta['meta_title'] ?? ($b['title'] . ' | Sunraise Insights');
            $metaDesc = $meta['meta_description'] ?? ($b['excerpt'] ?? '');
            $keywords = $meta['keywords'] ?? strtolower($b['category'] . ', technology, architecture, sunraise');
            $canonical = $meta['canonical_url'] ?? ($baseUrl . $path);
            $ogImage = $meta['og_image'] ?? ($b['cover_image'] ?? '');
            $insertBlog->execute([
                $path,
                $b['title'],
                $metaTitle,
                $metaDesc,
                $keywords,
                $canonical,
                $metaTitle,
                $metaDesc,
                $ogImage
            ]);
        }
        // 4. Sync Landing Pages (from pages table)
        try {
            $pages = $pdo->query("SELECT id, slug, title, page_type, seo_meta FROM pages")->fetchAll(PDO::FETCH_ASSOC);
            $insertPage = $pdo->prepare("
                INSERT IGNORE INTO seo_pages 
                (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
                VALUES (?, 'custom', ?, ?, ?, ?, ?, 'index, follow', ?, ?, 'WebPage', 0.8, 'weekly', 1)
            ");
            foreach ($pages as $pg) {
                $path = '/p/' . $pg['slug'];
                $meta = !empty($pg['seo_meta']) ? json_decode($pg['seo_meta'], true) : [];
                $metaTitle = $meta['meta_title'] ?? ($pg['title'] . ' | Sunraise Solutions');
                $metaDesc = $meta['meta_description'] ?? ('Explore ' . $pg['title'] . ' tailored by Sunraise Solutions.');
                $keywords = $meta['focus_keyword'] ?? ($meta['keywords'] ?? strtolower($pg['title'] . ', enterprise, hyderabad'));
                $canonical = $meta['canonical_url'] ?? ($baseUrl . $path);
                $insertPage->execute([
                    $path,
                    $pg['title'],
                    $metaTitle,
                    $metaDesc,
                    $keywords,
                    $canonical,
                    $metaTitle,
                    $metaDesc
                ]);
            }
        } catch (Exception $e) {}
    } catch (Exception $e) {}

    // 3. Sync Projects
    try {
        $projects = $pdo->query("SELECT id, slug, title, client_name, client_industry, category_badge, challenge FROM projects")->fetchAll(PDO::FETCH_ASSOC);
        $insertProject = $pdo->prepare("
            INSERT IGNORE INTO seo_pages 
            (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
            VALUES (?, 'project', ?, ?, ?, ?, ?, 'index, follow', ?, ?, 'CaseStudy', 0.8, 'monthly', 1)
        ");
        foreach ($projects as $p) {
            $path = '/projects/' . $p['slug'];
            $metaTitle = $p['title'] . ' - ' . $p['client_name'] . ' Case Study | Sunraise';
            $metaDesc = 'Read how Sunraise engineered solutions for ' . $p['client_name'] . ' (' . ($p['client_industry'] ?? 'Enterprise') . ').';
            $keywords = strtolower($p['client_name'] . ', ' . ($p['category_badge'] ?? '') . ', case study, roi');
            $canonical = $baseUrl . $path;
            $insertProject->execute([
                $path,
                $p['title'],
                $metaTitle,
                $metaDesc,
                $keywords,
                $canonical,
                $metaTitle,
                $metaDesc
            ]);
        }
        // 4. Sync Landing Pages (from pages table)
        try {
            $pages = $pdo->query("SELECT id, slug, title, page_type, seo_meta FROM pages")->fetchAll(PDO::FETCH_ASSOC);
            $insertPage = $pdo->prepare("
                INSERT IGNORE INTO seo_pages 
                (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
                VALUES (?, 'custom', ?, ?, ?, ?, ?, 'index, follow', ?, ?, 'WebPage', 0.8, 'weekly', 1)
            ");
            foreach ($pages as $pg) {
                $path = '/p/' . $pg['slug'];
                $meta = !empty($pg['seo_meta']) ? json_decode($pg['seo_meta'], true) : [];
                $metaTitle = $meta['meta_title'] ?? ($pg['title'] . ' | Sunraise Solutions');
                $metaDesc = $meta['meta_description'] ?? ('Explore ' . $pg['title'] . ' tailored by Sunraise Solutions.');
                $keywords = $meta['focus_keyword'] ?? ($meta['keywords'] ?? strtolower($pg['title'] . ', enterprise, hyderabad'));
                $canonical = $meta['canonical_url'] ?? ($baseUrl . $path);
                $insertPage->execute([
                    $path,
                    $pg['title'],
                    $metaTitle,
                    $metaDesc,
                    $keywords,
                    $canonical,
                    $metaTitle,
                    $metaDesc
                ]);
            }
        } catch (Exception $e) {}
    } catch (Exception $e) {}

    // 4. Sync Landing Pages (from pages table)
    try {
        $pages = $pdo->query("SELECT id, slug, title, page_type, seo_meta FROM pages")->fetchAll(PDO::FETCH_ASSOC);
        $insertPage = $pdo->prepare("
            INSERT IGNORE INTO seo_pages 
            (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, schema_type, sitemap_priority, sitemap_changefreq, is_indexed)
            VALUES (?, 'custom', ?, ?, ?, ?, ?, 'index, follow', ?, ?, 'WebPage', 0.8, 'weekly', 1)
        ");
        foreach ($pages as $pg) {
            $path = '/p/' . $pg['slug'];
            $meta = !empty($pg['seo_meta']) ? json_decode($pg['seo_meta'], true) : [];
            $metaTitle = $meta['meta_title'] ?? ($pg['title'] . ' | Sunraise Solutions');
            $metaDesc = $meta['meta_description'] ?? ('Explore ' . $pg['title'] . ' tailored by Sunraise Solutions.');
            $keywords = $meta['focus_keyword'] ?? ($meta['keywords'] ?? strtolower($pg['title'] . ', enterprise, hyderabad'));
            $canonical = $meta['canonical_url'] ?? ($baseUrl . $path);
            $insertPage->execute([
                $path,
                $pg['title'],
                $metaTitle,
                $metaDesc,
                $keywords,
                $canonical,
                $metaTitle,
                $metaDesc
            ]);
        }
    } catch (Exception $e) {}
}

// GET all pages with SEO metadata
if ($method === 'GET') {
    try {
        // Run auto-sync so newly created services, blogs, and projects are instantly indexed
        autoSyncSeoPages($pdo);

        $typeFilter = $_GET['type'] ?? '';
        $search = trim($_GET['search'] ?? '');

        $sql = "SELECT * FROM seo_pages WHERE 1=1";
        $params = [];

        if ($typeFilter && in_array($typeFilter, ['core', 'service', 'blog', 'project', 'custom'])) {
            $sql .= " AND page_type = ?";
            $params[] = $typeFilter;
        }

        if ($search) {
            $sql .= " AND (path LIKE ? OR title LIKE ? OR meta_title LIKE ? OR focus_keywords LIKE ?)";
            $term = "%$search%";
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
            $params[] = $term;
        }

        $sql .= " ORDER BY CASE WHEN page_type = 'core' THEN 1 WHEN page_type = 'service' THEN 2 WHEN page_type = 'blog' THEN 3 ELSE 4 END, path ASC";

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $pages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Compute SEO Health Score for each page
        foreach ($pages as &$p) {
            $score = 100;
            $issues = [];

            $titleLen = strlen($p['meta_title'] ?? '');
            if ($titleLen === 0) {
                $score -= 30;
                $issues[] = 'Missing meta title';
            } elseif ($titleLen < 30) {
                $score -= 10;
                $issues[] = 'Meta title too short (<30 chars)';
            } elseif ($titleLen > 65) {
                $score -= 10;
                $issues[] = 'Meta title may truncate (>65 chars)';
            }

            $descLen = strlen($p['meta_description'] ?? '');
            if ($descLen === 0) {
                $score -= 30;
                $issues[] = 'Missing meta description';
            } elseif ($descLen < 70) {
                $score -= 10;
                $issues[] = 'Meta description too short (<70 chars)';
            } elseif ($descLen > 165) {
                $score -= 10;
                $issues[] = 'Meta description may truncate (>165 chars)';
            }

            if (empty($p['focus_keywords'])) {
                $score -= 15;
                $issues[] = 'No focus keywords configured';
            }

            if (empty($p['og_image'])) {
                $score -= 10;
                $issues[] = 'Missing OpenGraph social share image';
            }

            if (empty($p['canonical_url'])) {
                $score -= 10;
                $issues[] = 'Canonical URL not explicitly set';
            }

            $p['health_score'] = max(0, $score);
            $p['health_issues'] = $issues;
        }

        // Summary Analytics
        $total = count($pages);
        $indexed = 0;
        $coreCount = 0;
        $serviceCount = 0;
        $blogCount = 0;
        $projectCount = 0;
        $scoreSum = 0;

        foreach ($pages as $p) {
            if ($p['is_indexed']) $indexed++;
            if ($p['page_type'] === 'core') $coreCount++;
            if ($p['page_type'] === 'service') $serviceCount++;
            if ($p['page_type'] === 'blog') $blogCount++;
            if ($p['page_type'] === 'project') $projectCount++;
            $scoreSum += $p['health_score'];
        }

        $avgScore = $total > 0 ? round($scoreSum / $total) : 100;

        jsonResponse([
            'status' => 'success',
            'stats' => [
                'total_pages' => $total,
                'indexed_pages' => $indexed,
                'core_pages' => $coreCount,
                'service_pages' => $serviceCount,
                'blog_pages' => $blogCount,
                'project_pages' => $projectCount,
                'avg_health_score' => $avgScore
            ],
            'pages' => $pages
        ]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}

// POST update SEO metadata for a page
if ($method === 'POST') {
    $data = getJsonInput();

    // Handle Bulk Action
    if ($action === 'bulk') {
        $paths = $data['paths'] ?? [];
        $operation = $data['operation'] ?? '';
        $value = $data['value'] ?? null;

        if (empty($paths) || !is_array($paths)) {
            jsonResponse(['status' => 'error', 'message' => 'No target page paths provided'], 400);
        }

        try {
            $inPlaceholders = implode(',', array_fill(0, count($paths), '?'));
            if ($operation === 'set_robots' && $value) {
                $stmt = $pdo->prepare("UPDATE seo_pages SET robots = ? WHERE path IN ($inPlaceholders)");
                $stmt->execute(array_merge([$value], $paths));
            } elseif ($operation === 'set_index') {
                $isIndexed = (int)($value ? 1 : 0);
                $stmt = $pdo->prepare("UPDATE seo_pages SET is_indexed = ? WHERE path IN ($inPlaceholders)");
                $stmt->execute(array_merge([$isIndexed], $paths));
            } elseif ($operation === 'set_priority' && is_numeric($value)) {
                $stmt = $pdo->prepare("UPDATE seo_pages SET sitemap_priority = ? WHERE path IN ($inPlaceholders)");
                $stmt->execute(array_merge([(float)$value], $paths));
            } elseif ($operation === 'set_changefreq' && $value) {
                $stmt = $pdo->prepare("UPDATE seo_pages SET sitemap_changefreq = ? WHERE path IN ($inPlaceholders)");
                $stmt->execute(array_merge([$value], $paths));
            } else {
                jsonResponse(['status' => 'error', 'message' => 'Invalid bulk operation'], 400);
            }

            jsonResponse(['status' => 'success', 'message' => 'Bulk SEO update successful', 'affected' => count($paths)]);
        } catch (Exception $e) {
            jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
        }
    }

    // Force Sync Action
    if ($action === 'sync') {
        autoSyncSeoPages($pdo);
        jsonResponse(['status' => 'success', 'message' => 'All new pages, services, blogs, and projects synchronized and indexed!']);
    }

    // Single Page SEO Save
    $path = trim($data['path'] ?? '');
    if (!$path) {
        jsonResponse(['status' => 'error', 'message' => 'Page path is required'], 400);
    }

    $title = trim($data['title'] ?? '');
    $metaTitle = trim($data['meta_title'] ?? $title);
    $metaDesc = trim($data['meta_description'] ?? '');
    $keywords = trim($data['focus_keywords'] ?? '');
    $canonical = trim($data['canonical_url'] ?? ('https://sunraisesolutions.com' . $path));
    $robots = trim($data['robots'] ?? 'index, follow');
    $ogTitle = trim($data['og_title'] ?? $metaTitle);
    $ogDesc = trim($data['og_description'] ?? $metaDesc);
    $ogImage = trim($data['og_image'] ?? '');
    $twitterCard = trim($data['twitter_card'] ?? 'summary_large_image');
    $schemaType = trim($data['schema_type'] ?? 'WebPage');
    $customSchema = !empty($data['custom_schema_json']) ? (is_string($data['custom_schema_json']) ? $data['custom_schema_json'] : json_encode($data['custom_schema_json'])) : null;
    $sitemapPriority = isset($data['sitemap_priority']) ? (float)$data['sitemap_priority'] : 0.8;
    $sitemapChangefreq = trim($data['sitemap_changefreq'] ?? 'weekly');
    $isIndexed = isset($data['is_indexed']) ? ($data['is_indexed'] ? 1 : 0) : 1;
    $pageType = trim($data['page_type'] ?? 'core');

    try {
        $stmt = $pdo->prepare("
            INSERT INTO seo_pages 
            (path, page_type, title, meta_title, meta_description, focus_keywords, canonical_url, robots, og_title, og_description, og_image, twitter_card, schema_type, custom_schema_json, sitemap_priority, sitemap_changefreq, is_indexed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                twitter_card = VALUES(twitter_card),
                schema_type = VALUES(schema_type),
                custom_schema_json = VALUES(custom_schema_json),
                sitemap_priority = VALUES(sitemap_priority),
                sitemap_changefreq = VALUES(sitemap_changefreq),
                is_indexed = VALUES(is_indexed),
                updated_at = CURRENT_TIMESTAMP
        ");

        $stmt->execute([
            $path,
            $pageType,
            $title,
            $metaTitle,
            $metaDesc,
            $keywords,
            $canonical,
            $robots,
            $ogTitle,
            $ogDesc,
            $ogImage,
            $twitterCard,
            $schemaType,
            $customSchema,
            $sitemapPriority,
            $sitemapChangefreq,
            $isIndexed
        ]);

        // Sync with parent tables if applicable
        if (strpos($path, '/blog/') === 0) {
            $slug = substr($path, 6);
            $seoMetaJson = json_encode([
                'meta_title' => $metaTitle,
                'meta_description' => $metaDesc,
                'keywords' => $keywords,
                'canonical_url' => $canonical,
                'og_title' => $ogTitle,
                'og_description' => $ogDesc,
                'og_image' => $ogImage
            ]);
            $updateBlog = $pdo->prepare("UPDATE blogs SET seo_meta = ? WHERE slug = ?");
            $updateBlog->execute([$seoMetaJson, $slug]);
        } elseif (strpos($path, '/services/') === 0) {
            $slug = substr($path, 10);
            $seoMetaJson = json_encode([
                'meta_title' => $metaTitle,
                'meta_description' => $metaDesc,
                'keywords' => $keywords,
                'canonical_url' => $canonical,
                'og_title' => $ogTitle,
                'og_description' => $ogDesc,
                'og_image' => $ogImage
            ]);
            $updateService = $pdo->prepare("UPDATE services SET seo_meta = ? WHERE slug = ?");
            $updateService->execute([$seoMetaJson, $slug]);
        } elseif (strpos($path, '/p/') === 0) {
            $slug = substr($path, 3);
            $seoMetaJson = json_encode([
                'meta_title' => $metaTitle,
                'meta_description' => $metaDesc,
                'focus_keyword' => $keywords,
                'keywords' => $keywords,
                'canonical_url' => $canonical,
                'og_title' => $ogTitle,
                'og_description' => $ogDesc,
                'og_image' => $ogImage
            ]);
            $updatePage = $pdo->prepare("UPDATE pages SET seo_meta = ? WHERE slug = ?");
            $updatePage->execute([$seoMetaJson, $slug]);
        } elseif (strpos($path, '/projects/') === 0) {
            $slug = substr($path, 10);
            $seoMetaJson = json_encode([
                'meta_title' => $metaTitle,
                'meta_description' => $metaDesc,
                'keywords' => $keywords,
                'canonical_url' => $canonical,
                'og_title' => $ogTitle,
                'og_description' => $ogDesc,
                'og_image' => $ogImage
            ]);
            $updateProject = $pdo->prepare("UPDATE projects SET seo_meta = ? WHERE slug = ?");
            $updateProject->execute([$seoMetaJson, $slug]);
        }

        jsonResponse([
            'status' => 'success',
            'message' => 'SEO metadata updated successfully for ' . $path
        ]);
    } catch (Exception $e) {
        jsonResponse(['status' => 'error', 'message' => $e->getMessage()], 500);
    }
}
