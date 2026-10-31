-- ============================================================================
-- SUNRAISE SOLUTIONS - PRODUCTION DATABASE SCHEMA & INITIAL SEED DATA
-- Target DBMS: Hostinger MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS sunraise_cms CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE sunraise_cms;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS leads;
DROP TABLE IF EXISTS seo_redirects;
DROP TABLE IF EXISTS blogs;
DROP TABLE IF EXISTS testimonials;
DROP TABLE IF EXISTS projects;
DROP TABLE IF EXISTS pages;
DROP TABLE IF EXISTS services;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Services & Service Codes Table
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_code VARCHAR(32) NOT NULL UNIQUE, -- e.g., 'SRV-SEO-01', 'SRV-WEB-02'
    slug VARCHAR(150) NOT NULL UNIQUE,        -- e.g., 'seo-services-in-hyderabad'
    title VARCHAR(200) NOT NULL,
    short_description TEXT,
    icon_name VARCHAR(100),
    thumbnail_url VARCHAR(500),
    hero_config JSON NOT NULL,                -- { badge, title, highlight_text, subtitle, primary_cta, secondary_cta, hero_image, stats: [] }
    page_blocks JSON NOT NULL,                -- Array of { id, type: 'visual'|'html'|'code', component_name, html_content, css_content, props, sort_order }
    seo_meta JSON NOT NULL,                   -- { meta_title, meta_description, keywords, canonical_url, og_image, schema_json, lock_seo: true/false }
    is_published BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. Standalone Pages (Home, About, Contact, Custom Landing Pages)
CREATE TABLE pages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    page_key VARCHAR(50) NOT NULL UNIQUE,     -- 'home', 'about', 'projects_index', 'contact'
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    hero_config JSON NOT NULL,
    page_blocks JSON NOT NULL,
    seo_meta JSON NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. Projects / Case Studies (Linked to Service Codes)
CREATE TABLE projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,              -- e.g., 'Avanthi MCA College', 'Aero Drone Technologies'
    client_name VARCHAR(150),
    service_code VARCHAR(32) NOT NULL,        -- Foreign Key linking to services.service_code
    category_badge VARCHAR(100) NOT NULL,     -- e.g., 'SEO', 'Web Development', 'Social Media'
    thumbnail_url VARCHAR(500) NOT NULL,
    summary TEXT,
    case_study_blocks JSON,                   -- Drag-and-drop blocks for full project detail view
    seo_meta JSON NOT NULL,
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_code) REFERENCES services(service_code) ON UPDATE CASCADE ON DELETE RESTRICT
);

-- 4. Testimonials (Global or Linked to a Specific Service Code)
CREATE TABLE testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    client_name VARCHAR(150) NOT NULL,        -- e.g., 'MAKSIM Infotech', 'Dr. Ramesh'
    client_role VARCHAR(150),                 -- e.g., 'DMI Hospital', 'Hotel Jaya Residency'
    avatar_url VARCHAR(500),
    rating DECIMAL(2,1) DEFAULT 5.0,
    review_text TEXT NOT NULL,
    service_code VARCHAR(32) NULL,            -- Optional link to a specific service page
    is_featured BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (service_code) REFERENCES services(service_code) ON UPDATE CASCADE ON DELETE SET NULL
);

-- 5. Blog Posts & SEO Insights
CREATE TABLE blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(200) NOT NULL UNIQUE,
    title VARCHAR(255) NOT NULL,
    excerpt TEXT,
    cover_image VARCHAR(500),
    category VARCHAR(100),
    service_code VARCHAR(32) NULL,            -- Links blog post to relevant service for internal SEO linking
    content_blocks JSON NOT NULL,             -- Visual + HTML blocks
    seo_meta JSON NOT NULL,
    published_at TIMESTAMP NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 6. Automatic 301 Redirect Table (Preserves SEO when slugs change)
CREATE TABLE seo_redirects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    old_path VARCHAR(255) NOT NULL UNIQUE,
    new_path VARCHAR(255) NOT NULL,
    status_code INT DEFAULT 301,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Proposal & Contact Leads
CREATE TABLE leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    service_code VARCHAR(32) NULL,
    budget_range VARCHAR(100),                -- e.g., '₹25k–₹50k'
    message TEXT,
    source_page VARCHAR(200),
    status ENUM('new', 'contacted', 'qualified', 'closed') DEFAULT 'new',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INITIAL SEED DATA FOR PRODUCTION
-- ============================================================================

-- 1. Services Seed
INSERT INTO services (service_code, slug, title, short_description, icon_name, thumbnail_url, hero_config, page_blocks, seo_meta, is_published, display_order)
VALUES 
(
  'SRV-SEO-01',
  'seo-services-in-hyderabad',
  'SEO Services in Hyderabad',
  'Dominate local and national Google rankings with our proprietary data-driven technical, on-page, and authority link-building blueprints.',
  'Search',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'HYDERABAD #1 SEO AGENCY',
    'title', 'Dominate Google Rankings with High-Performance',
    'highlight_text', 'SEO in Hyderabad',
    'subtitle', 'Stop losing leads to competitors. We build high-converting search visibility through deep technical audits, local map-pack dominance, and white-hat link velocity.',
    'primary_cta', 'Get Free SEO Audit',
    'secondary_cta', 'View SEO Case Studies',
    'hero_image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Organic Traffic Surge', 'val', '+380%'),
      JSON_OBJECT('label', 'Keywords Page 1', 'val', '1,450+'),
      JSON_OBJECT('label', 'Retention Rate', 'val', '98%')
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT('id', 'blk-seo-1', 'type', 'visual', 'component_name', 'FeatureGrid', 'props', JSON_OBJECT('title', 'Complete 360° SEO Capabilities', 'description', 'Engineered for exponential ROI in competitive Andhra Pradesh and Telangana markets.', 'features', JSON_ARRAY('Technical Core Web Vitals Optimization', 'Google Business Profile 3-Pack Rank', 'Laser-targeted Telugu & English Keyword Clustering', 'High-DA White-Hat PR Backlink Outreach', 'Conversion Rate Optimization (CRO)'))),
    JSON_OBJECT('id', 'blk-seo-2', 'type', 'visual', 'component_name', 'ProcessTimeline', 'props', JSON_OBJECT('title', 'Our 4-Stage Search Domination Protocol', 'steps', JSON_ARRAY(
      JSON_OBJECT('step', '01', 'title', 'Algorithmic Audit & Competitor Gap Analysis', 'desc', 'In-depth crawler analysis identifying crawl budget issues, index bloat, and keyword cannibalization.'),
      JSON_OBJECT('step', '02', 'title', 'Information Architecture & On-Page Engineering', 'desc', 'Schema markup injection, semantic heading alignment, and Core Web Vitals speed optimization.'),
      JSON_OBJECT('step', '03', 'title', 'Local Map Pack & High-Authority PR Link Building', 'desc', 'Hyper-local citation synchronization across Hyderabad & AP alongside top-tier digital PR links.'),
      JSON_OBJECT('step', '04', 'title', 'Conversion Tracking & Revenue Analytics', 'desc', 'Bi-weekly keyword tracking, GA4 funnel attribution, and continuous CRO iteration.')
    ))),
    JSON_OBJECT('id', 'blk-seo-3', 'type', 'html', 'component_name', 'RawHTML', 'html_content', '<div class="p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center"><h3 class="text-2xl font-bold text-gray-900 mb-2">Want guaranteed Google Top 3 rankings for your business?</h3><p class="text-gray-600 mb-6">Claim your 100% free comprehensive technical and competitor audit report today.</p><a href="#proposal-form" class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-lg hover:shadow-orange-500/25 transition">Claim Free Audit Report &rarr;</a></div>', 'css_content', '')
  ),
  JSON_OBJECT(
    'meta_title', 'Best SEO Services in Hyderabad & AP | Sunraise Solutions',
    'meta_description', 'Sunraise Solutions is Hyderabad’s leading digital agency delivering technical SEO, local Google Map pack dominance, and organic lead generation for 18+ years.',
    'keywords', 'SEO Services Hyderabad, Local SEO Hyderabad, SEO Company Rajahmundry, Search Engine Optimization Telangana',
    'canonical_url', 'https://sunraisesolutions.com/services/seo-services-in-hyderabad',
    'og_image', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "SEO Services in Hyderabad", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 1
),
(
  'SRV-WEB-02',
  'web-development',
  'Web Development & Web Apps',
  'Bespoke, blazing-fast web architectures engineered in React, Next.js, and high-concurrency backends for seamless business scalability.',
  'Globe',
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'HIGH-PERFORMANCE ARCHITECTURE',
    'title', 'High-Converting Web Platforms with',
    'highlight_text', 'Sub-Second Speeds',
    'subtitle', 'We design and engineer bespoke web experiences that elevate your brand authority and convert visitors into loyal clients.',
    'primary_cta', 'Start Web Project',
    'secondary_cta', 'Explore Tech Stack',
    'hero_image', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Lighthouse Score', 'val', '99/100'),
      JSON_OBJECT('label', 'Delivered Portals', 'val', '320+'),
      JSON_OBJECT('label', 'Uptime Guarantee', 'val', '99.9%')
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT('id', 'blk-web-1', 'type', 'visual', 'component_name', 'FeatureGrid', 'props', JSON_OBJECT('title', 'Full-Cycle Web Solutions', 'description', 'From corporate portals to complex web apps.', 'features', JSON_ARRAY('Custom React & Next.js Architecture', 'Mobile-First Responsive UX/UI', 'Headless CMS & Visual Editors', 'API-Driven Microservices', 'Enterprise Security & SSL Hardening')))
  ),
  JSON_OBJECT(
    'meta_title', 'Top Web Development Company in Hyderabad | Sunraise Solutions',
    'meta_description', 'Professional website design and custom web app development company in Hyderabad and Rajahmundry. 18+ years of delivering high-performance platforms.',
    'keywords', 'Web Development Hyderabad, Website Design Rajahmundry, React Development, Custom Web Apps AP',
    'canonical_url', 'https://sunraisesolutions.com/services/web-development',
    'og_image', 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "Web Development", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 2
),
(
  'SRV-MOB-03',
  'mobile-app-development',
  'Mobile App Development',
  'Native iOS, Android, and Flutter applications featuring intuitive fluid UX, real-time push engines, and rock-solid cloud integrations.',
  'Smartphone',
  'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'MOBILE INNOVATION',
    'title', 'Scalable iOS & Android Apps Built for',
    'highlight_text', 'Maximum Engagement',
    'subtitle', 'Bring your product vision to the fingertips of millions with ultra-responsive native and cross-platform mobile apps.',
    'primary_cta', 'Request App Scope',
    'secondary_cta', 'View App Demos',
    'hero_image', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'App Store Rating', 'val', '4.9 ★'),
      JSON_OBJECT('label', 'Total Downloads', 'val', '1.2M+'),
      JSON_OBJECT('label', 'Crash-Free Rate', 'val', '99.9%')
    )
  ),
  JSON_ARRAY(
    JSON_OBJECT('id', 'blk-mob-1', 'type', 'visual', 'component_name', 'FeatureGrid', 'props', JSON_OBJECT('title', 'Mobile App Specializations', 'description', 'Delivering enterprise apps across healthcare, education, logistics, and retail.', 'features', JSON_ARRAY('Flutter & React Native Cross-Platform', 'Native Swift & Kotlin Engineering', 'Secure Payment Gateway Gateways', 'Real-time WebSocket & Push Sync', 'Offline-First Local Storage')))
  ),
  JSON_OBJECT(
    'meta_title', 'Mobile App Development Services Hyderabad | Sunraise Solutions',
    'meta_description', 'Leading mobile application developers in Hyderabad and Andhra Pradesh crafting iOS and Android mobile software for startups and enterprises.',
    'keywords', 'Mobile App Development Hyderabad, iOS App Developers AP, Flutter Developers Hyderabad, Android App Company',
    'canonical_url', 'https://sunraisesolutions.com/services/mobile-app-development',
    'og_image', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "Mobile App Development", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 3
),
(
  'SRV-MKT-04',
  'digital-marketing',
  'Digital Marketing & Performance Ads',
  'Full-funnel Meta & Google Ads campaigns, social media management, brand positioning, and aggressive revenue-generating conversion pipelines.',
  'Megaphone',
  'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'REVENUE GENERATION',
    'title', 'Hyper-Targeted Performance Ads &',
    'highlight_text', 'Digital Growth Engines',
    'subtitle', 'Stop burning ad budget. We optimize Meta, Google, and LinkedIn ad funnels to deliver verifiable qualified leads and high ROAS.',
    'primary_cta', 'Accelerate My ROAS',
    'secondary_cta', 'See Ad Results',
    'hero_image', 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Average ROAS', 'val', '4.6x'),
      JSON_OBJECT('label', 'Leads Generated', 'val', '85,000+'),
      JSON_OBJECT('label', 'Ad Spend Managed', 'val', '₹12Cr+')
    )
  ),
  JSON_ARRAY(),
  JSON_OBJECT(
    'meta_title', 'Top Digital Marketing Agency in Hyderabad | Sunraise Solutions',
    'meta_description', 'Drive revenue with Google Ads, Meta campaigns, and strategic social media marketing from Sunraise Solutions Hyderabad.',
    'keywords', 'Digital Marketing Agency Hyderabad, Performance Marketing AP, Google Ads Expert Hyderabad',
    'canonical_url', 'https://sunraisesolutions.com/services/digital-marketing',
    'og_image', 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "Digital Marketing", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 4
),
(
  'SRV-SFT-05',
  'custom-software-development',
  'Custom Software Development',
  'Tailored ERP, CRM, and cloud-native software ecosystems designed to streamline operations and automate mission-critical organizational workflows.',
  'Code2',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'ENTERPRISE ARCHITECTURE',
    'title', 'Purpose-Built Software Platforms for',
    'highlight_text', 'Operational Mastery',
    'subtitle', 'Eliminate manual bottlenecks with custom enterprise software, workflow automation, and multi-tenant cloud ecosystems.',
    'primary_cta', 'Consult Our Engineers',
    'secondary_cta', 'Architecture Review',
    'hero_image', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Operational Efficiency', 'val', '+70%'),
      JSON_OBJECT('label', 'Custom ERPs Shipped', 'val', '85+'),
      JSON_OBJECT('label', 'Zero-Downtime Migration', 'val', '100%')
    )
  ),
  JSON_ARRAY(),
  JSON_OBJECT(
    'meta_title', 'Custom Software Development Company Hyderabad | Sunraise Solutions',
    'meta_description', 'Enterprise-grade custom software, CRM, and ERP development services tailored for mid-market and enterprise businesses across Telangana & AP.',
    'keywords', 'Custom Software Development Hyderabad, ERP Software AP, Enterprise CRM Solutions',
    'canonical_url', 'https://sunraisesolutions.com/services/custom-software-development',
    'og_image', 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "Custom Software Development", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 5
),
(
  'SRV-POL-06',
  'political-branding',
  'Political Branding & Campaign PR',
  'Groundbreaking 360° constituency analytics, digital sentiment monitoring, narrative strategy, and high-impact voter outreach ecosystems.',
  'Vote',
  'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'STRATEGIC INFLUENCE',
    'title', 'Data-Driven Constituency War Rooms &',
    'highlight_text', 'Political Branding',
    'subtitle', 'Comprehensive digital voter sentiment analytics, micro-targeted grassroots outreach, and high-impact media production across AP & Telangana.',
    'primary_cta', 'Confidential Briefing',
    'secondary_cta', 'Campaign Footprint',
    'hero_image', 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Elections Strategized', 'val', '42+'),
      JSON_OBJECT('label', 'Voter Reach', 'val', '15M+'),
      JSON_OBJECT('label', 'Field War Rooms', 'val', '28')
    )
  ),
  JSON_ARRAY(),
  JSON_OBJECT(
    'meta_title', 'Political Branding & Digital Campaign Strategy AP & Telangana | Sunraise',
    'meta_description', 'Premier political war-room consulting, digital voter sentiment analytics, and election campaign branding in Andhra Pradesh and Hyderabad.',
    'keywords', 'Political Branding Hyderabad, Election Campaign AP, Political PR Agency Hyderabad, Voter Analytics',
    'canonical_url', 'https://sunraisesolutions.com/services/political-branding',
    'og_image', 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "Political Branding", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 6
),
(
  'SRV-CGI-07',
  'cgi-advertising',
  'CGI Advertising & 3D Visuals',
  'Hyper-realistic CGI product animation, immersive 3D billboard effects, and cinematic visual spectacles that command instant virality.',
  'Film',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'CINEMATIC IMPACT',
    'title', 'Hyper-Realistic 3D & Viral CGI',
    'highlight_text', 'Advertising Production',
    'subtitle', 'Stop thumb-scrolling with cinema-grade 3D product animations, anamorphic illusion billboards, and CGI social teasers.',
    'primary_cta', 'Commission CGI Project',
    'secondary_cta', 'Watch Showreel',
    'hero_image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Viral Video Views', 'val', '45M+'),
      JSON_OBJECT('label', 'CGI Ads Rendered', 'val', '120+'),
      JSON_OBJECT('label', 'Average Engagement', 'val', '8.4x')
    )
  ),
  JSON_ARRAY(),
  JSON_OBJECT(
    'meta_title', 'CGI Advertising & 3D Visual Effects Hyderabad | Sunraise Solutions',
    'meta_description', 'High-end CGI advertising, 3D product rendering, and anamorphic VFX production in Hyderabad for viral brand marketing.',
    'keywords', 'CGI Advertising Hyderabad, 3D VFX Agency AP, 3D Product Animation Studio',
    'canonical_url', 'https://sunraisesolutions.com/services/cgi-advertising',
    'og_image', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "CGI Advertising", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 7
),
(
  'SRV-HMS-08',
  'hospital-management-software',
  'Hospital Management Software (HMS)',
  'HIPAA-compliant, unified healthcare ecosystems bridging OPD, IPD, EHR, Pharmacy, Radiology, Lab automation, and NABH-ready telemetry.',
  'Activity',
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
  JSON_OBJECT(
    'badge', 'HEALTHCARE EXCELLENCE',
    'title', 'NABH-Compliant, Intelligent Hospital',
    'highlight_text', 'Management Software',
    'subtitle', 'A unified clinical, billing, and patient telemetry operating system trusted by multi-specialty hospitals and healthcare groups across AP & Telangana.',
    'primary_cta', 'Book Live HMS Demo',
    'secondary_cta', 'Download HMS Specs',
    'hero_image', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    'stats', JSON_ARRAY(
      JSON_OBJECT('label', 'Hospitals Operating', 'val', '35+'),
      JSON_OBJECT('label', 'Patient Records', 'val', '1.8M+'),
      JSON_OBJECT('label', 'Billing Audit Time', 'val', '-65%')
    )
  ),
  JSON_ARRAY(),
  JSON_OBJECT(
    'meta_title', 'Hospital Management Software (HMS) Hyderabad & AP | Sunraise Solutions',
    'meta_description', 'Comprehensive Hospital Management Software (HMS) covering OPD, IPD, EHR, NABH compliance, Pharmacy, and Diagnostic Lab automation.',
    'keywords', 'Hospital Management Software Hyderabad, HMS Software AP, Clinic Management Software, Healthcare EHR Software',
    'canonical_url', 'https://sunraisesolutions.com/services/hospital-management-software',
    'og_image', 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    'schema_json', '{"@context": "https://schema.org", "@type": "Service", "name": "Hospital Management Software", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
    'lock_seo', true
  ),
  true, 8
);

-- 2. Projects / Case Studies Seed
INSERT INTO projects (slug, title, client_name, service_code, category_badge, thumbnail_url, summary, seo_meta, is_featured)
VALUES
(
  'avanthi-mca-college',
  'Avanthi MCA College Admissions & Portal',
  'Avanthi Educational Society',
  'SRV-SEO-01',
  'SEO & Lead Gen',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
  'Generated 4,200+ qualified student admission inquiries within 90 days via technical on-page SEO restructuring and hyper-local search domination across Hyderabad.',
  JSON_OBJECT('meta_title', 'Avanthi MCA College SEO Case Study | Sunraise Solutions', 'meta_description', 'How Sunraise delivered +340% organic enrollment inquiries for Avanthi MCA College in Hyderabad.', 'keywords', 'Avanthi MCA College SEO, Education Lead Gen Hyderabad'),
  true
),
(
  'sri-veera-hanuman-nursery',
  'Sri Veera Hanuman Nursery E-Commerce',
  'Sri Veera Hanuman Nursery',
  'SRV-WEB-02',
  'Web Development',
  'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80',
  'Engineered high-concurrency horticultural marketplace with live inventory sync, shipping logistics integration, and sub-second catalog browsing.',
  JSON_OBJECT('meta_title', 'Sri Veera Hanuman Nursery E-Commerce Web Portal | Sunraise', 'meta_description', 'High-performance plant nursery e-commerce platform built for scale across South India.', 'keywords', 'E-commerce nursery web development, Plant delivery portal'),
  true
),
(
  'union-hospital-digital-ecosystem',
  'Union Hospital 360° Healthcare Digital',
  'Union Hospitals Group',
  'SRV-HMS-08',
  'Hospital Management',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
  'Deployed complete NABH-compliant cloud Hospital Management System integrating emergency triage, automated pharmacy dispensing, and real-time bed management.',
  JSON_OBJECT('meta_title', 'Union Hospital HMS Implementation Case Study | Sunraise', 'meta_description', 'Complete hospital ERP modernization boosting staff workflow efficiency by 65%.', 'keywords', 'Union Hospital HMS, Hospital ERP Case Study'),
  true
),
(
  'aero-drone-technologies',
  'Aero Drone Technologies Brand Platform',
  'Aero Drone Tech India',
  'SRV-WEB-02',
  'Web Development & 3D',
  'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
  'Created an interactive 3D WebGL drone customizer and defense-grade commercial platform highlighting autonomous surveillance hardware capabilities.',
  JSON_OBJECT('meta_title', 'Aero Drone Technologies Digital Platform | Sunraise Solutions', 'meta_description', 'Bespoke 3D interactive web portal designed for advanced aerospace drone manufacturers.', 'keywords', 'Drone technology web design, WebGL industrial showcase'),
  true
),
(
  'dmi-hospital-telemetry',
  'DMI Hospital Patient Telemetry & Appointments',
  'DMI Healthcare',
  'SRV-HMS-08',
  'Hospital Management',
  'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
  'Modernized patient appointment queueing, reducing patient wait times by 48 minutes on average, and integrated automated WhatsApp prescription alerts.',
  JSON_OBJECT('meta_title', 'DMI Hospital Healthcare Systems | Sunraise Solutions', 'meta_description', 'Patient queue optimization and digital prescription rollout at DMI Hospital.', 'keywords', 'DMI hospital software, Healthcare automation Hyderabad'),
  true
),
(
  'usha-prime-hospital-growth',
  'Usha Prime Hospital Search & Local Brand',
  'Usha Prime Super Specialty Hospital',
  'SRV-SEO-01',
  'SEO & Social Media',
  'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
  'Secured rank #1 for 14 emergency cardiology and orthopedic search queries in Rajahmundry, resulting in a 220% increase in monthly emergency admissions.',
  JSON_OBJECT('meta_title', 'Usha Prime Hospital Local Search Domination | Sunraise', 'meta_description', 'Hospital local SEO case study: capturing Google 3-Pack rankings for emergency medical care.', 'keywords', 'Hospital SEO Rajahmundry, Medical Local SEO Andhra Pradesh'),
  true
);

-- 3. Testimonials Seed
INSERT INTO testimonials (client_name, client_role, avatar_url, rating, review_text, service_code, is_featured)
VALUES
(
  'MAKSIM Infotech',
  'Director of Technology Operations',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
  5.0,
  'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance. Their ability to deliver high-performance applications on strict timelines is unmatched in Hyderabad.',
  'SRV-SFT-05',
  true
),
(
  'Hotel Jaya Residency',
  'General Manager, Hospitality Division',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
  5.0,
  'Our direct room bookings multiplied by 3.4x within five months of launching the new responsive portal and local SEO campaigns. The Sunraise team feels like an in-house powerhouse.',
  'SRV-SEO-01',
  true
),
(
  'MVR Agro Solutions',
  'Managing Partner',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  5.0,
  'From brand strategy and Telugu-English multi-lingual digital ad campaigns to supply chain software, Sunraise delivered extraordinary commercial value for our brand across AP.',
  'SRV-MKT-04',
  true
),
(
  'Dr. Ramesh',
  'Chief Medical Officer, DMI Hospital',
  'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
  5.0,
  'The Hospital Management System designed by Sunraise revolutionized our OPD and billing departments. Patient paperwork reduced to zero, and audits are now 100% effortless.',
  'SRV-HMS-08',
  true
),
(
  'Dr. Usha',
  'Managing Director, Usha Prime Hospital',
  'https://images.unsplash.com/photo-1594824813598-f2b77a1645e5?auto=format&fit=crop&w=200&q=80',
  5.0,
  'Sunraise Solutions is the undisputed leader for healthcare digital growth in Andhra Pradesh. Their search engine optimization work established us as the premier cardiology hospital in our region.',
  'SRV-SEO-01',
  true
);

-- 4. Blog Posts Seed
INSERT INTO blogs (slug, title, excerpt, cover_image, category, service_code, content_blocks, seo_meta, is_published, published_at)
VALUES
(
  'why-technical-seo-drives-380-percent-more-qualified-leads',
  'Why Technical SEO Drives 380% More Qualified Leads for Hyderabad Businesses',
  'Discover the exact architectural audit checkpoints, Core Web Vitals fixes, and schema markup strategies our agency uses to dominate Google search results.',
  'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
  'SEO & Organic Growth',
  'SRV-SEO-01',
  JSON_ARRAY(
    JSON_OBJECT('id', 'blk-b1-1', 'type', 'html', 'html_content', '<p class="text-lg leading-relaxed text-gray-700 mb-6">Search algorithms have fundamentally shifted. Surface-level keyword stuffing no longer works. Modern search engines measure interaction to next paint (INP), semantic content vectors, and technical crawl authority.</p><h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eliminating Render-Blocking Bottlenecks</h2><p class="text-gray-700 leading-relaxed mb-6">When Sunraise Solutions audits corporate websites across Andhra Pradesh and Telangana, 82% fail Core Web Vitals on mobile devices due to uncompressed media and heavy JavaScript payloads. Fixing this alone often yields an immediate 20-35% boost in search visibility.</p><h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. The Power of Hyper-Local Entity Schema</h2><p class="text-gray-700 leading-relaxed mb-6">By injecting structured Schema.org JSON-LD linking your physical office addresses in Hyderabad and Rajahmundry with exact geo-coordinates, Google’s Knowledge Graph immediately elevates your brand above generic aggregators.</p>')
  ),
  JSON_OBJECT(
    'meta_title', 'Technical SEO Lead Gen Guide | Sunraise Solutions',
    'meta_description', 'Learn how technical SEO and Core Web Vitals optimization can drive a 380% surge in organic inbound inquiries for your enterprise.',
    'keywords', 'Technical SEO Hyderabad, Organic Lead Generation, Google Core Web Vitals'
  ),
  true,
  NOW()
),
(
  'choosing-the-right-hospital-management-software-in-2026',
  'Architecting NABH-Compliant Hospital Management Systems: 2026 Checklist',
  'A strategic roadmap for hospital owners and medical directors on modernizing clinical EHR, patient telemetry, and pharmacy workflows without downtime.',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
  'Healthcare Technology',
  'SRV-HMS-08',
  JSON_ARRAY(
    JSON_OBJECT('id', 'blk-b2-1', 'type', 'html', 'html_content', '<p class="text-lg leading-relaxed text-gray-700 mb-6">Healthcare modernization is no longer an IT luxury; it is a clinical and legal necessity. A robust Hospital Management System (HMS) must combine rapid OPD triage with bank-grade patient data privacy.</p>')
  ),
  JSON_OBJECT(
    'meta_title', 'NABH Hospital Management Software Checklist 2026 | Sunraise',
    'meta_description', 'Everything healthcare directors must know when migrating to cloud-native, NABH-compliant hospital software in South India.',
    'keywords', 'NABH HMS checklist, Hospital Management Software Andhra Pradesh, Healthcare EHR'
  ),
  true,
  NOW()
);
