<?php
require_once __DIR__ . '/config.php';

// Empty tables cleanly
$pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
$pdo->exec("TRUNCATE TABLE projects");
$pdo->exec("TRUNCATE TABLE testimonials");
$pdo->exec("TRUNCATE TABLE blogs");
$pdo->exec("TRUNCATE TABLE services");
$pdo->exec("SET FOREIGN_KEY_CHECKS = 1");

// 1. Seed Services
$services = [
    [
        'service_code' => 'SRV-SEO-01',
        'slug' => 'seo-services-in-hyderabad',
        'title' => 'SEO Services in Hyderabad',
        'short_description' => 'Dominate local and national Google rankings with our proprietary data-driven technical, on-page, and authority link-building blueprints.',
        'icon_name' => 'Search',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'HYDERABAD #1 SEO AGENCY',
            'title' => 'Dominate Google Rankings with High-Performance',
            'highlight_text' => 'SEO in Hyderabad',
            'subtitle' => 'Stop losing leads to competitors. We build high-converting search visibility through deep technical audits, local map-pack dominance, and white-hat link velocity.',
            'primary_cta' => 'Get Free SEO Audit',
            'secondary_cta' => 'View SEO Case Studies',
            'hero_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Organic Traffic Surge', 'val' => '+380%'],
                ['label' => 'Keywords Page 1', 'val' => '1,450+'],
                ['label' => 'Retention Rate', 'val' => '98%']
            ]
        ],
        'page_blocks' => [
            [
                'id' => 'blk-seo-1',
                'type' => 'visual',
                'component_name' => 'FeatureGrid',
                'sort_order' => 1,
                'props' => [
                    'title' => 'Complete 360° SEO Capabilities',
                    'description' => 'Engineered for exponential ROI in competitive Andhra Pradesh and Telangana markets.',
                    'features' => [
                        'Technical Core Web Vitals Optimization',
                        'Google Business Profile 3-Pack Rank',
                        'Laser-targeted Telugu & English Keyword Clustering',
                        'High-DA White-Hat PR Backlink Outreach',
                        'Conversion Rate Optimization (CRO)'
                    ]
                ]
            ],
            [
                'id' => 'blk-seo-2',
                'type' => 'visual',
                'component_name' => 'ProcessTimeline',
                'sort_order' => 2,
                'props' => [
                    'title' => 'Our 4-Stage Search Domination Protocol',
                    'steps' => [
                        ['step' => '01', 'title' => 'Algorithmic Audit & Competitor Gap Analysis', 'desc' => 'In-depth crawler analysis identifying crawl budget issues, index bloat, and keyword cannibalization.'],
                        ['step' => '02', 'title' => 'Information Architecture & On-Page Engineering', 'desc' => 'Schema markup injection, semantic heading alignment, and Core Web Vitals speed optimization.'],
                        ['step' => '03', 'title' => 'Local Map Pack & High-Authority PR Link Building', 'desc' => 'Hyper-local citation synchronization across Hyderabad & AP alongside top-tier digital PR links.'],
                        ['step' => '04', 'title' => 'Conversion Tracking & Revenue Analytics', 'desc' => 'Bi-weekly keyword tracking, GA4 funnel attribution, and continuous CRO iteration.']
                    ]
                ]
            ],
            [
                'id' => 'blk-seo-3',
                'type' => 'html',
                'component_name' => 'RawHTML',
                'sort_order' => 3,
                'html_content' => '<div class="p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center"><h3 class="text-2xl font-bold text-gray-900 mb-2">Want guaranteed Google Top 3 rankings for your business?</h3><p class="text-gray-600 mb-6">Claim your 100% free comprehensive technical and competitor audit report today.</p><a href="#proposal-form" class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-lg hover:shadow-orange-500/25 transition">Claim Free Audit Report &rarr;</a></div>',
                'css_content' => ''
            ]
        ],
        'seo_meta' => [
            'meta_title' => 'Best SEO Services in Hyderabad & AP | Sunraise Solutions',
            'meta_description' => 'Sunraise Solutions is Hyderabad’s leading digital agency delivering technical SEO, local Google Map pack dominance, and organic lead generation for 18+ years.',
            'keywords' => 'SEO Services Hyderabad, Local SEO Hyderabad, SEO Company Rajahmundry, Search Engine Optimization Telangana',
            'canonical_url' => 'https://sunraisesolutions.com/services/seo-services-in-hyderabad',
            'og_image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 1
    ],
    [
        'service_code' => 'SRV-WEB-02',
        'slug' => 'web-development',
        'title' => 'Web Development & Web Apps',
        'short_description' => 'Bespoke, blazing-fast web architectures engineered in React, Next.js, and high-concurrency backends for seamless business scalability.',
        'icon_name' => 'Globe',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'HIGH-PERFORMANCE ARCHITECTURE',
            'title' => 'High-Converting Web Platforms with',
            'highlight_text' => 'Sub-Second Speeds',
            'subtitle' => 'We design and engineer bespoke web experiences that elevate your brand authority and convert visitors into loyal clients.',
            'primary_cta' => 'Start Web Project',
            'secondary_cta' => 'Explore Tech Stack',
            'hero_image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Lighthouse Score', 'val' => '99/100'],
                ['label' => 'Delivered Portals', 'val' => '320+'],
                ['label' => 'Uptime Guarantee', 'val' => '99.9%']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'Top Web Development Company in Hyderabad | Sunraise Solutions',
            'meta_description' => 'Professional website design and custom web app development company in Hyderabad and Rajahmundry. 18+ years of delivering high-performance platforms.',
            'keywords' => 'Web Development Hyderabad, Website Design Rajahmundry, React Development, Custom Web Apps AP',
            'canonical_url' => 'https://sunraisesolutions.com/services/web-development',
            'og_image' => 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 2
    ],
    [
        'service_code' => 'SRV-MOB-03',
        'slug' => 'mobile-app-development',
        'title' => 'Mobile App Development',
        'short_description' => 'Native iOS, Android, and Flutter applications featuring intuitive fluid UX, real-time push engines, and rock-solid cloud integrations.',
        'icon_name' => 'Smartphone',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'MOBILE INNOVATION',
            'title' => 'Scalable iOS & Android Apps Built for',
            'highlight_text' => 'Maximum Engagement',
            'subtitle' => 'Bring your product vision to the fingertips of millions with ultra-responsive native and cross-platform mobile apps.',
            'primary_cta' => 'Request App Scope',
            'secondary_cta' => 'View App Demos',
            'hero_image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'App Store Rating', 'val' => '4.9 ★'],
                ['label' => 'Total Downloads', 'val' => '1.2M+'],
                ['label' => 'Crash-Free Rate', 'val' => '99.9%']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'Mobile App Development Services Hyderabad | Sunraise Solutions',
            'meta_description' => 'Leading mobile application developers in Hyderabad and Andhra Pradesh crafting iOS and Android mobile software for startups and enterprises.',
            'keywords' => 'Mobile App Development Hyderabad, iOS App Developers AP, Flutter Developers Hyderabad, Android App Company',
            'canonical_url' => 'https://sunraisesolutions.com/services/mobile-app-development',
            'og_image' => 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 3
    ],
    [
        'service_code' => 'SRV-MKT-04',
        'slug' => 'digital-marketing',
        'title' => 'Digital Marketing & Performance Ads',
        'short_description' => 'Full-funnel Meta & Google Ads campaigns, social media management, brand positioning, and aggressive revenue-generating conversion pipelines.',
        'icon_name' => 'Megaphone',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'REVENUE GENERATION',
            'title' => 'Hyper-Targeted Performance Ads &',
            'highlight_text' => 'Digital Growth Engines',
            'subtitle' => 'Stop burning ad budget. We optimize Meta, Google, and LinkedIn ad funnels to deliver verifiable qualified leads and high ROAS.',
            'primary_cta' => 'Accelerate My ROAS',
            'secondary_cta' => 'See Ad Results',
            'hero_image' => 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Average ROAS', 'val' => '4.6x'],
                ['label' => 'Leads Generated', 'val' => '85,000+'],
                ['label' => 'Ad Spend Managed', 'val' => '₹12Cr+']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'Top Digital Marketing Agency in Hyderabad | Sunraise Solutions',
            'meta_description' => 'Drive revenue with Google Ads, Meta campaigns, and strategic social media marketing from Sunraise Solutions Hyderabad.',
            'keywords' => 'Digital Marketing Agency Hyderabad, Performance Marketing AP, Google Ads Expert Hyderabad',
            'canonical_url' => 'https://sunraisesolutions.com/services/digital-marketing',
            'og_image' => 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 4
    ],
    [
        'service_code' => 'SRV-SFT-05',
        'slug' => 'custom-software-development',
        'title' => 'Custom Software Development',
        'short_description' => 'Tailored ERP, CRM, and cloud-native software ecosystems designed to streamline operations and automate mission-critical organizational workflows.',
        'icon_name' => 'Code2',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'ENTERPRISE ARCHITECTURE',
            'title' => 'Purpose-Built Software Platforms for',
            'highlight_text' => 'Operational Mastery',
            'subtitle' => 'Eliminate manual bottlenecks with custom enterprise software, workflow automation, and multi-tenant cloud ecosystems.',
            'primary_cta' => 'Consult Our Engineers',
            'secondary_cta' => 'Architecture Review',
            'hero_image' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Operational Efficiency', 'val' => '+70%'],
                ['label' => 'Custom ERPs Shipped', 'val' => '85+'],
                ['label' => 'Zero-Downtime Migration', 'val' => '100%']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'Custom Software Development Company Hyderabad | Sunraise Solutions',
            'meta_description' => 'Enterprise-grade custom software, CRM, and ERP development services tailored for mid-market and enterprise businesses across Telangana & AP.',
            'keywords' => 'Custom Software Development Hyderabad, ERP Software AP, Enterprise CRM Solutions',
            'canonical_url' => 'https://sunraisesolutions.com/services/custom-software-development',
            'og_image' => 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 5
    ],
    [
        'service_code' => 'SRV-POL-06',
        'slug' => 'political-branding',
        'title' => 'Political Branding & Campaign PR',
        'short_description' => 'Groundbreaking 360° constituency analytics, digital sentiment monitoring, narrative strategy, and high-impact voter outreach ecosystems.',
        'icon_name' => 'Vote',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'STRATEGIC INFLUENCE',
            'title' => 'Data-Driven Constituency War Rooms &',
            'highlight_text' => 'Political Branding',
            'subtitle' => 'Comprehensive digital voter sentiment analytics, micro-targeted grassroots outreach, and high-impact media production across AP & Telangana.',
            'primary_cta' => 'Confidential Briefing',
            'secondary_cta' => 'Campaign Footprint',
            'hero_image' => 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Elections Strategized', 'val' => '42+'],
                ['label' => 'Voter Reach', 'val' => '15M+'],
                ['label' => 'Field War Rooms', 'val' => '28']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'Political Branding & Digital Campaign Strategy AP & Telangana | Sunraise',
            'meta_description' => 'Premier political war-room consulting, digital voter sentiment analytics, and election campaign branding in Andhra Pradesh and Hyderabad.',
            'keywords' => 'Political Branding Hyderabad, Election Campaign AP, Political PR Agency Hyderabad, Voter Analytics',
            'canonical_url' => 'https://sunraisesolutions.com/services/political-branding',
            'og_image' => 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 6
    ],
    [
        'service_code' => 'SRV-CGI-07',
        'slug' => 'cgi-advertising',
        'title' => 'CGI Advertising & 3D Visuals',
        'short_description' => 'Hyper-realistic CGI product animation, immersive 3D billboard effects, and cinematic visual spectacles that command instant virality.',
        'icon_name' => 'Film',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'CINEMATIC IMPACT',
            'title' => 'Hyper-Realistic 3D & Viral CGI',
            'highlight_text' => 'Advertising Production',
            'subtitle' => 'Stop thumb-scrolling with cinema-grade 3D product animations, anamorphic illusion billboards, and CGI social teasers.',
            'primary_cta' => 'Commission CGI Project',
            'secondary_cta' => 'Watch Showreel',
            'hero_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Viral Video Views', 'val' => '45M+'],
                ['label' => 'CGI Ads Rendered', 'val' => '120+'],
                ['label' => 'Average Engagement', 'val' => '8.4x']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'CGI Advertising & 3D Visual Effects Hyderabad | Sunraise Solutions',
            'meta_description' => 'High-end CGI advertising, 3D product rendering, and anamorphic VFX production in Hyderabad for viral brand marketing.',
            'keywords' => 'CGI Advertising Hyderabad, 3D VFX Agency AP, 3D Product Animation Studio',
            'canonical_url' => 'https://sunraisesolutions.com/services/cgi-advertising',
            'og_image' => 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 7
    ],
    [
        'service_code' => 'SRV-HMS-08',
        'slug' => 'hospital-management-software',
        'title' => 'Hospital Management Software (HMS)',
        'short_description' => 'HIPAA-compliant, unified healthcare ecosystems bridging OPD, IPD, EHR, Pharmacy, Radiology, Lab automation, and NABH-ready telemetry.',
        'icon_name' => 'Activity',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
        'hero_config' => [
            'badge' => 'HEALTHCARE EXCELLENCE',
            'title' => 'NABH-Compliant, Intelligent Hospital',
            'highlight_text' => 'Management Software',
            'subtitle' => 'A unified clinical, billing, and patient telemetry operating system trusted by multi-specialty hospitals and healthcare groups across AP & Telangana.',
            'primary_cta' => 'Book Live HMS Demo',
            'secondary_cta' => 'Download HMS Specs',
            'hero_image' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
            'stats' => [
                ['label' => 'Hospitals Operating', 'val' => '35+'],
                ['label' => 'Patient Records', 'val' => '1.8M+'],
                ['label' => 'Billing Audit Time', 'val' => '-65%']
            ]
        ],
        'page_blocks' => [],
        'seo_meta' => [
            'meta_title' => 'Hospital Management Software (HMS) Hyderabad & AP | Sunraise Solutions',
            'meta_description' => 'Comprehensive Hospital Management Software (HMS) covering OPD, IPD, EHR, NABH compliance, Pharmacy, and Diagnostic Lab automation.',
            'keywords' => 'Hospital Management Software Hyderabad, HMS Software AP, Clinic Management Software, Healthcare EHR Software',
            'canonical_url' => 'https://sunraisesolutions.com/services/hospital-management-software',
            'og_image' => 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
            'lock_seo' => true
        ],
        'is_published' => 1,
        'display_order' => 8
    ]
];

$stmt = $pdo->prepare("INSERT INTO services (service_code, slug, title, short_description, icon_name, thumbnail_url, hero_config, page_blocks, seo_meta, is_published, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

foreach ($services as $s) {
    $stmt->execute([
        $s['service_code'],
        $s['slug'],
        $s['title'],
        $s['short_description'],
        $s['icon_name'],
        $s['thumbnail_url'],
        json_encode($s['hero_config']),
        json_encode($s['page_blocks']),
        json_encode($s['seo_meta']),
        $s['is_published'],
        $s['display_order']
    ]);
}

// 2. Seed Projects
$projects = [
    [
        'slug' => 'avanthi-mca-college',
        'title' => 'Avanthi MCA College Admissions & Portal',
        'client_name' => 'Avanthi Educational Society',
        'service_code' => 'SRV-SEO-01',
        'category_badge' => 'SEO',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
        'summary' => 'Generated 4,200+ qualified student admission inquiries within 90 days via technical on-page SEO restructuring and hyper-local search domination across Hyderabad.',
        'seo_meta' => [
            'meta_title' => 'Avanthi MCA College SEO Case Study | Sunraise Solutions',
            'meta_description' => 'How Sunraise delivered +340% organic enrollment inquiries for Avanthi MCA College in Hyderabad.'
        ],
        'is_featured' => 1
    ],
    [
        'slug' => 'sri-veera-hanuman-nursery',
        'title' => 'Sri Veera Hanuman Nursery E-Commerce',
        'client_name' => 'Sri Veera Hanuman Nursery',
        'service_code' => 'SRV-WEB-02',
        'category_badge' => 'Web Development',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80',
        'summary' => 'Engineered high-concurrency horticultural marketplace with live inventory sync, shipping logistics integration, and sub-second catalog browsing.',
        'seo_meta' => [
            'meta_title' => 'Sri Veera Hanuman Nursery E-Commerce Web Portal | Sunraise',
            'meta_description' => 'High-performance plant nursery e-commerce platform built for scale across South India.'
        ],
        'is_featured' => 1
    ],
    [
        'slug' => 'union-hospital-digital-ecosystem',
        'title' => 'Union Hospital 360° Healthcare Digital',
        'client_name' => 'Union Hospitals Group',
        'service_code' => 'SRV-HMS-08',
        'category_badge' => 'Hospital Management',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
        'summary' => 'Deployed complete NABH-compliant cloud Hospital Management System integrating emergency triage, automated pharmacy dispensing, and real-time bed management.',
        'seo_meta' => [
            'meta_title' => 'Union Hospital HMS Implementation Case Study | Sunraise',
            'meta_description' => 'Complete hospital ERP modernization boosting staff workflow efficiency by 65%.'
        ],
        'is_featured' => 1
    ],
    [
        'slug' => 'aero-drone-technologies',
        'title' => 'Aero Drone Technologies Brand Platform',
        'client_name' => 'Aero Drone Tech India',
        'service_code' => 'SRV-WEB-02',
        'category_badge' => 'Web Development',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
        'summary' => 'Created an interactive 3D WebGL drone customizer and defense-grade commercial platform highlighting autonomous surveillance hardware capabilities.',
        'seo_meta' => [
            'meta_title' => 'Aero Drone Technologies Digital Platform | Sunraise Solutions',
            'meta_description' => 'Bespoke 3D interactive web portal designed for advanced aerospace drone manufacturers.'
        ],
        'is_featured' => 1
    ],
    [
        'slug' => 'dmi-hospital-telemetry',
        'title' => 'DMI Hospital Patient Telemetry & Appointments',
        'client_name' => 'DMI Healthcare',
        'service_code' => 'SRV-HMS-08',
        'category_badge' => 'Hospital Management',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
        'summary' => 'Modernized patient appointment queueing, reducing patient wait times by 48 minutes on average, and integrated automated WhatsApp prescription alerts.',
        'seo_meta' => [
            'meta_title' => 'DMI Hospital Healthcare Systems | Sunraise Solutions',
            'meta_description' => 'Patient queue optimization and digital prescription rollout at DMI Hospital.'
        ],
        'is_featured' => 1
    ],
    [
        'slug' => 'usha-prime-hospital-growth',
        'title' => 'Usha Prime Hospital Search & Local Brand',
        'client_name' => 'Usha Prime Super Specialty Hospital',
        'service_code' => 'SRV-SEO-01',
        'category_badge' => 'SEO',
        'thumbnail_url' => 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
        'summary' => 'Secured rank #1 for 14 emergency cardiology and orthopedic search queries in Rajahmundry, resulting in a 220% increase in monthly emergency admissions.',
        'seo_meta' => [
            'meta_title' => 'Usha Prime Hospital Local Search Domination | Sunraise',
            'meta_description' => 'Hospital local SEO case study: capturing Google 3-Pack rankings for emergency medical care.'
        ],
        'is_featured' => 1
    ]
];

$stmt = $pdo->prepare("INSERT INTO projects (slug, title, client_name, service_code, category_badge, thumbnail_url, summary, seo_meta, is_featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($projects as $p) {
    $stmt->execute([
        $p['slug'],
        $p['title'],
        $p['client_name'],
        $p['service_code'],
        $p['category_badge'],
        $p['thumbnail_url'],
        $p['summary'],
        json_encode($p['seo_meta']),
        $p['is_featured']
    ]);
}

// 3. Seed Testimonials
$testimonials = [
    [
        'client_name' => 'MAKSIM Infotech',
        'client_role' => 'Director of Technology Operations',
        'avatar_url' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        'rating' => 5.0,
        'review_text' => 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance. Their ability to deliver high-performance applications on strict timelines is unmatched in Hyderabad.',
        'service_code' => 'SRV-SFT-05'
    ],
    [
        'client_name' => 'Hotel Jaya Residency',
        'client_role' => 'General Manager, Hospitality Division',
        'avatar_url' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        'rating' => 5.0,
        'review_text' => 'Our direct room bookings multiplied by 3.4x within five months of launching the new responsive portal and local SEO campaigns. The Sunraise team feels like an in-house powerhouse.',
        'service_code' => 'SRV-SEO-01'
    ],
    [
        'client_name' => 'MVR Agro Solutions',
        'client_role' => 'Managing Partner',
        'avatar_url' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        'rating' => 5.0,
        'review_text' => 'From brand strategy and Telugu-English multi-lingual digital ad campaigns to supply chain software, Sunraise delivered extraordinary commercial value for our brand across AP.',
        'service_code' => 'SRV-MKT-04'
    ],
    [
        'client_name' => 'Dr. Ramesh',
        'client_role' => 'Chief Medical Officer, DMI Hospital',
        'avatar_url' => 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
        'rating' => 5.0,
        'review_text' => 'The Hospital Management System designed by Sunraise revolutionized our OPD and billing departments. Patient paperwork reduced to zero, and audits are now 100% effortless.',
        'service_code' => 'SRV-HMS-08'
    ],
    [
        'client_name' => 'Dr. Usha',
        'client_role' => 'Managing Director, Usha Prime Hospital',
        'avatar_url' => 'https://images.unsplash.com/photo-1594824813598-f2b77a1645e5?auto=format&fit=crop&w=200&q=80',
        'rating' => 5.0,
        'review_text' => 'Sunraise Solutions is the undisputed leader for healthcare digital growth in Andhra Pradesh. Their search engine optimization work established us as the premier cardiology hospital in our region.',
        'service_code' => 'SRV-SEO-01'
    ]
];

$stmt = $pdo->prepare("INSERT INTO testimonials (client_name, client_role, avatar_url, rating, review_text, service_code, is_featured) VALUES (?, ?, ?, ?, ?, ?, 1)");
foreach ($testimonials as $t) {
    $stmt->execute([
        $t['client_name'],
        $t['client_role'],
        $t['avatar_url'],
        $t['rating'],
        $t['review_text'],
        $t['service_code']
    ]);
}

// 4. Seed Blogs
$blogs = [
    [
        'slug' => 'why-technical-seo-drives-380-percent-more-qualified-leads',
        'title' => 'Why Technical SEO Drives 380% More Qualified Leads for Hyderabad Businesses',
        'excerpt' => 'Discover the exact architectural audit checkpoints, Core Web Vitals fixes, and schema markup strategies our agency uses to dominate Google search results.',
        'cover_image' => 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
        'category' => 'SEO & Organic Growth',
        'service_code' => 'SRV-SEO-01',
        'content_blocks' => [
            [
                'id' => 'blk-b1-1',
                'type' => 'html',
                'sort_order' => 1,
                'html_content' => '<p class="text-lg leading-relaxed text-gray-700 mb-6">Search algorithms have fundamentally shifted. Surface-level keyword stuffing no longer works. Modern search engines measure interaction to next paint (INP), semantic content vectors, and technical crawl authority.</p><h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eliminating Render-Blocking Bottlenecks</h2><p class="text-gray-700 leading-relaxed mb-6">When Sunraise Solutions audits corporate websites across Andhra Pradesh and Telangana, 82% fail Core Web Vitals on mobile devices due to uncompressed media and heavy JavaScript payloads. Fixing this alone often yields an immediate 20-35% boost in search visibility.</p><h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. The Power of Hyper-Local Entity Schema</h2><p class="text-gray-700 leading-relaxed mb-6">By injecting structured Schema.org JSON-LD linking your physical office addresses in Hyderabad and Rajahmundry with exact geo-coordinates, Google’s Knowledge Graph immediately elevates your brand above generic aggregators.</p>'
            ]
        ],
        'seo_meta' => [
            'meta_title' => 'Technical SEO Lead Gen Guide | Sunraise Solutions',
            'meta_description' => 'Learn how technical SEO and Core Web Vitals optimization can drive a 380% surge in organic inbound inquiries for your enterprise.',
            'keywords' => 'Technical SEO Hyderabad, Organic Lead Generation, Google Core Web Vitals'
        ],
        'is_published' => 1,
        'published_at' => date('Y-m-d H:i:s')
    ],
    [
        'slug' => 'choosing-the-right-hospital-management-software-in-2026',
        'title' => 'Architecting NABH-Compliant Hospital Management Systems: 2026 Checklist',
        'excerpt' => 'A strategic roadmap for hospital owners and medical directors on modernizing clinical EHR, patient telemetry, and pharmacy workflows without downtime.',
        'cover_image' => 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
        'category' => 'Healthcare Technology',
        'service_code' => 'SRV-HMS-08',
        'content_blocks' => [
            [
                'id' => 'blk-b2-1',
                'type' => 'html',
                'sort_order' => 1,
                'html_content' => '<p class="text-lg leading-relaxed text-gray-700 mb-6">Healthcare modernization is no longer an IT luxury; it is a clinical and legal necessity. A robust Hospital Management System (HMS) must combine rapid OPD triage with bank-grade patient data privacy.</p>'
            ]
        ],
        'seo_meta' => [
            'meta_title' => 'NABH Hospital Management Software Checklist 2026 | Sunraise',
            'meta_description' => 'Everything healthcare directors must know when migrating to cloud-native, NABH-compliant hospital software in South India.',
            'keywords' => 'NABH HMS checklist, Hospital Management Software Andhra Pradesh, Healthcare EHR'
        ],
        'is_published' => 1,
        'published_at' => date('Y-m-d H:i:s')
    ]
];

$stmt = $pdo->prepare("INSERT INTO blogs (slug, title, excerpt, cover_image, category, service_code, content_blocks, seo_meta, is_published, published_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
foreach ($blogs as $b) {
    $stmt->execute([
        $b['slug'],
        $b['title'],
        $b['excerpt'],
        $b['cover_image'],
        $b['category'],
        $b['service_code'],
        json_encode($b['content_blocks']),
        json_encode($b['seo_meta']),
        $b['is_published'],
        $b['published_at']
    ]);
}

jsonResponse([
    'status' => 'success',
    'message' => 'Hostinger MySQL database populated successfully with Sunraise Solutions production seed data!',
    'services_count' => count($services),
    'projects_count' => count($projects),
    'testimonials_count' => count($testimonials),
    'blogs_count' => count($blogs)
]);
