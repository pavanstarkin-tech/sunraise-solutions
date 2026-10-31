<?php
require_once __DIR__ . '/config.php';

// Override content type to XML
header("Content-Type: application/xml; charset=utf-8");

$baseUrl = 'https://sunraisesolutions.com';
$today = date('Y-m-d');

$urls = [];

try {
    // Read directly from seo_pages if table exists and has rows
    $stmt = $pdo->query("
        SELECT path, sitemap_priority, sitemap_changefreq, updated_at 
        FROM seo_pages 
        WHERE is_indexed = 1 
        ORDER BY sitemap_priority DESC, path ASC
    ");
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (!empty($rows)) {
        foreach ($rows as $r) {
            $lastmod = !empty($r['updated_at']) ? substr($r['updated_at'], 0, 10) : $today;
            $loc = rtrim($baseUrl, '/') . '/' . ltrim($r['path'], '/');
            if ($r['path'] === '/') {
                $loc = $baseUrl . '/';
            }
            $urls[] = [
                'loc' => $loc,
                'lastmod' => $lastmod,
                'changefreq' => $r['sitemap_changefreq'] ?? 'weekly',
                'priority' => number_format((float)($r['sitemap_priority'] ?? 0.8), 1)
            ];
        }
    }
} catch (Exception $e) {}

// Fallback if seo_pages was empty
if (empty($urls)) {
    $urls = [
        ['loc' => "$baseUrl/", 'lastmod' => $today, 'changefreq' => 'weekly', 'priority' => '1.0'],
        ['loc' => "$baseUrl/about", 'lastmod' => $today, 'changefreq' => 'monthly', 'priority' => '0.8'],
        ['loc' => "$baseUrl/services", 'lastmod' => $today, 'changefreq' => 'weekly', 'priority' => '0.9'],
        ['loc' => "$baseUrl/portfolio", 'lastmod' => $today, 'changefreq' => 'weekly', 'priority' => '0.8'],
        ['loc' => "$baseUrl/blog", 'lastmod' => $today, 'changefreq' => 'daily', 'priority' => '0.8'],
        ['loc' => "$baseUrl/contact", 'lastmod' => $today, 'changefreq' => 'monthly', 'priority' => '0.7']
    ];
}

echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $u) {
    echo "  <url>\n";
    echo "    <loc>" . htmlspecialchars($u['loc']) . "</loc>\n";
    echo "    <lastmod>" . $u['lastmod'] . "</lastmod>\n";
    echo "    <changefreq>" . $u['changefreq'] . "</changefreq>\n";
    echo "    <priority>" . $u['priority'] . "</priority>\n";
    echo "  </url>\n";
}
echo '</urlset>';
exit();
