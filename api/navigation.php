<?php
require_once __DIR__ . '/config.php';

// Auto-create navigation tables
try {
    if (isset($pdo)) {
        $pdo->exec("CREATE TABLE IF NOT EXISTS navigation_items (
            id INT AUTO_INCREMENT PRIMARY KEY,
            parent_id INT NULL,
            title VARCHAR(255) NOT NULL,
            url VARCHAR(255) NOT NULL,
            target VARCHAR(20) DEFAULT '_self',
            icon_name VARCHAR(50) NULL,
            image_url VARCHAR(500) NULL,
            badge VARCHAR(50) NULL,
            description VARCHAR(255) NULL,
            sort_order INT DEFAULT 0,
            is_active TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_parent (parent_id),
            INDEX idx_sort (sort_order)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        $pdo->exec("CREATE TABLE IF NOT EXISTS navigation_settings (
            setting_key VARCHAR(100) PRIMARY KEY,
            setting_value LONGTEXT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

        // Seed default settings if empty
        $cntStmt = $pdo->query("SELECT COUNT(*) FROM navigation_settings");
        if ($cntStmt && (int)$cntStmt->fetchColumn() === 0) {
            $defaultSettings = [
                'top_bar_announcement' => 'Dual Presence: Hyderabad HQ & Rajahmundry Regional Hub | 18+ Years Corporate Digital Excellence',
                'top_bar_phone' => '+91 99596 39539',
                'top_bar_show_admin_link' => '1',
                'navbar_logo_url' => '/logo.png',
                'navbar_cta_text' => 'Get Proposal',
                'navbar_cta_url' => '/contact',
                'navbar_cta_visible' => '1',
                'services_dropdown_title' => 'Our Core Specializations',
                'services_dropdown_subtitle' => '8 Enterprise Capabilities',
                'services_dropdown_promo_title' => 'Looking for custom bespoke enterprise architecture?',
                'services_dropdown_promo_cta' => 'Consult Our Architects',
                'services_dropdown_promo_url' => '/contact',
                'services_dropdown_promo_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'
            ];
            $insSetting = $pdo->prepare("INSERT INTO navigation_settings (setting_key, setting_value) VALUES (?, ?)");
            foreach ($defaultSettings as $k => $v) {
                $insSetting->execute([$k, $v]);
            }
        }

        // Seed default menu items if empty
        $cntMenu = $pdo->query("SELECT COUNT(*) FROM navigation_items");
        if ($cntMenu && (int)$cntMenu->fetchColumn() === 0) {
            $insItem = $pdo->prepare("INSERT INTO navigation_items (parent_id, title, url, target, icon_name, image_url, badge, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
            
            // Top Level Items
            // 1. Home
            $insItem->execute([null, 'Home', '/', '_self', 'Home', null, null, 'Main corporate landing overview', 1]);
            
            // 2. About Us
            $insItem->execute([null, 'About Us', '/about', '_self', 'Users', null, null, '18+ years corporate digital excellence', 2]);
            $aboutId = $pdo->lastInsertId();
            $insItem->execute([$aboutId, 'Our Leadership Team', '/about#leadership', '_self', 'Award', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80', 'Core', 'Meet the visionaries behind Sunraise Solutions', 1]);
            $insItem->execute([$aboutId, 'Corporate Locations & Hubs', '/about#locations', '_self', 'Building2', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80', 'Dual Hub', 'Hyderabad HQ and Rajahmundry Regional Delivery Center', 2]);

            // 3. Services (Megamenu parent)
            $insItem->execute([null, 'Services', '/services', '_self', 'Sparkles', null, '8 Capabilities', 'Comprehensive enterprise digital capabilities', 3]);
            $servicesId = $pdo->lastInsertId();
            
            // Submenu items for Services
            $serviceSubs = [
                ['Search Engine Optimization', '/services/search-engine-optimization', 'Search', 'SRV-SEO-01', 'Algorithm dominance and high-authority local entity ranking', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80'],
                ['Website Architecture & Design', '/services/website-architecture-and-design', 'Globe', 'SRV-WEB-02', 'High-performance React & cloud headless architectures', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80'],
                ['Mobile App Engineering', '/services/mobile-application-development', 'Smartphone', 'SRV-APP-03', 'Cross-platform native iOS & Android applications', 'https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80'],
                ['Performance Marketing & Ads', '/services/social-media-and-performance-marketing', 'Megaphone', 'SRV-SMM-04', 'High-ROAS lead acquisition on Meta and Google Ads', 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80'],
                ['Custom Cloud Software (CRM/ERP)', '/services/custom-software-development', 'Code2', 'SRV-DEV-05', 'Bespoke automation software, CRM and ERP ecosystems', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80'],
                ['Electoral Campaign Strategy', '/services/political-campaign-management', 'Vote', 'SRV-POL-06', 'Voter sentiment analytics, field tracking and digital outreach', 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80'],
                ['Corporate Film & Media Production', '/services/video-and-multimedia-production', 'Film', 'SRV-MED-07', 'Ad commercials, broadcast media, 3D animations and documentaries', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80'],
                ['Healthcare & Hospital SaaS', '/services/hospital-management-software', 'Activity', 'SRV-HOS-08', 'NABH compliant clinical telemetry, EHR and bed occupancy systems', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80']
            ];

            foreach ($serviceSubs as $sIdx => $sData) {
                $insItem->execute([$servicesId, $sData[0], $sData[1], '_self', $sData[2], $sData[5], $sData[3], $sData[4], $sIdx + 1]);
            }

            // 4. Projects (formerly Case Studies)
            $insItem->execute([null, 'Projects', '/projects', '_self', 'FolderKanban', null, null, 'Real deployed client architectures and engineering success', 4]);
            $projId = $pdo->lastInsertId();
            $insItem->execute([$projId, 'Clinical Healthcare Software', '/projects?category=Healthcare', '_self', 'Activity', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80', 'Featured', 'Deployed NABH clinical system managing patient telemetry', 1]);
            $insItem->execute([$projId, 'High-Scale Ecommerce Systems', '/projects?category=E-Commerce', '_self', 'Globe', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80', 'Active', 'Automated omnichannel checkout handling multi-crore transactions', 2]);

            // 5. Blog
            $insItem->execute([null, 'Blog', '/blog', '_self', 'BookOpen', null, null, 'Industry insights, SEO breakdowns and technical thought leadership', 5]);

            // 6. Contact
            $insItem->execute([null, 'Contact', '/contact', '_self', 'Phone', null, null, 'Connect with our corporate architects in Hyderabad or Rajahmundry', 6]);
        }
    }
} catch (Exception $e) {
    // silently continue
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    // 1. Fetch settings
    $settingsStmt = $pdo->query("SELECT setting_key, setting_value FROM navigation_settings");
    $settings = [];
    if ($settingsStmt) {
        while ($row = $settingsStmt->fetch()) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
    }

    // 2. Fetch all menu items
    $itemsStmt = $pdo->query("SELECT * FROM navigation_items ORDER BY sort_order ASC, id ASC");
    $flatItems = $itemsStmt ? $itemsStmt->fetchAll() : [];

    // Format types
    foreach ($flatItems as &$item) {
        $item['id'] = (int)$item['id'];
        $item['parent_id'] = $item['parent_id'] !== null ? (int)$item['parent_id'] : null;
        $item['sort_order'] = (int)$item['sort_order'];
        $item['is_active'] = (bool)$item['is_active'];
    }
    unset($item);

    // Build hierarchical tree
    $itemsByParent = [];
    foreach ($flatItems as $item) {
        $pId = $item['parent_id'] ?? 0;
        if (!isset($itemsByParent[$pId])) {
            $itemsByParent[$pId] = [];
        }
        $itemsByParent[$pId][] = $item;
    }

    $tree = [];
    if (isset($itemsByParent[0])) {
        foreach ($itemsByParent[0] as $topItem) {
            $topItem['children'] = $itemsByParent[$topItem['id']] ?? [];
            $tree[] = $topItem;
        }
    }

    jsonResponse([
        'status' => 'success',
        'tree' => $tree,
        'flat_items' => $flatItems,
        'settings' => $settings
    ]);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid JSON input'], 400);
    }

    // A) Update Settings
    if (isset($input['settings']) && is_array($input['settings'])) {
        $stmt = $pdo->prepare("INSERT INTO navigation_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)");
        foreach ($input['settings'] as $key => $val) {
            $stmt->execute([$key, (string)$val]);
        }
    }

    // B) Bulk Tree Save (replaces or synchronizes menu items and submenus)
    if (isset($input['tree']) && is_array($input['tree'])) {
        $pdo->beginTransaction();
        try {
            // Clear existing and re-insert or sync
            $pdo->exec("DELETE FROM navigation_items");

            $insStmt = $pdo->prepare("INSERT INTO navigation_items (id, parent_id, title, url, target, icon_name, image_url, badge, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

            $idCounter = 1;

            foreach ($input['tree'] as $tIdx => $topItem) {
                $topId = $idCounter++;
                $insStmt->execute([
                    $topId,
                    null,
                    $topItem['title'] ?? 'Menu Item',
                    $topItem['url'] ?? '/',
                    $topItem['target'] ?? '_self',
                    $topItem['icon_name'] ?? null,
                    $topItem['image_url'] ?? null,
                    $topItem['badge'] ?? null,
                    $topItem['description'] ?? null,
                    $tIdx + 1,
                    isset($topItem['is_active']) ? (int)$topItem['is_active'] : 1
                ]);

                if (isset($topItem['children']) && is_array($topItem['children'])) {
                    foreach ($topItem['children'] as $cIdx => $subItem) {
                        $subId = $idCounter++;
                        $insStmt->execute([
                            $subId,
                            $topId,
                            $subItem['title'] ?? 'Submenu Item',
                            $subItem['url'] ?? '/',
                            $subItem['target'] ?? '_self',
                            $subItem['icon_name'] ?? null,
                            $subItem['image_url'] ?? null,
                            $subItem['badge'] ?? null,
                            $subItem['description'] ?? null,
                            $cIdx + 1,
                            isset($subItem['is_active']) ? (int)$subItem['is_active'] : 1
                        ]);
                    }
                }
            }

            $pdo->commit();
            jsonResponse(['status' => 'success', 'message' => 'Navigation menu tree synchronized successfully']);
        } catch (Exception $e) {
            $pdo->rollBack();
            jsonResponse(['status' => 'error', 'message' => 'Failed to save menu tree: ' . $e->getMessage()], 500);
        }
    }

    // C) Upsert Single Item
    if (isset($input['title']) && isset($input['url'])) {
        if (!empty($input['id'])) {
            $upStmt = $pdo->prepare("UPDATE navigation_items SET parent_id = ?, title = ?, url = ?, target = ?, icon_name = ?, image_url = ?, badge = ?, description = ?, sort_order = ?, is_active = ? WHERE id = ?");
            $upStmt->execute([
                $input['parent_id'] ?? null,
                $input['title'],
                $input['url'],
                $input['target'] ?? '_self',
                $input['icon_name'] ?? null,
                $input['image_url'] ?? null,
                $input['badge'] ?? null,
                $input['description'] ?? null,
                $input['sort_order'] ?? 0,
                isset($input['is_active']) ? (int)$input['is_active'] : 1,
                (int)$input['id']
            ]);
            jsonResponse(['status' => 'success', 'message' => 'Menu item updated']);
        } else {
            $inStmt = $pdo->prepare("INSERT INTO navigation_items (parent_id, title, url, target, icon_name, image_url, badge, description, sort_order, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $inStmt->execute([
                $input['parent_id'] ?? null,
                $input['title'],
                $input['url'],
                $input['target'] ?? '_self',
                $input['icon_name'] ?? null,
                $input['image_url'] ?? null,
                $input['badge'] ?? null,
                $input['description'] ?? null,
                $input['sort_order'] ?? 0,
                isset($input['is_active']) ? (int)$input['is_active'] : 1
            ]);
            jsonResponse(['status' => 'success', 'id' => (int)$pdo->lastInsertId(), 'message' => 'Menu item created']);
        }
    }

    jsonResponse(['status' => 'success', 'message' => 'Settings updated successfully']);
}

if ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        jsonResponse(['status' => 'error', 'message' => 'Missing menu item id'], 400);
    }

    // Delete item and its sub-items
    $delStmt = $pdo->prepare("DELETE FROM navigation_items WHERE id = ? OR parent_id = ?");
    $delStmt->execute([(int)$id, (int)$id]);
    jsonResponse(['status' => 'success', 'message' => 'Menu item deleted successfully']);
}

