/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.20-11.8.9-MariaDB, for Linux (x86_64)
--
-- Host: localhost    Database: u833088220_sunrise
-- ------------------------------------------------------
-- Server version	11.8.9-MariaDB-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `blog_categories`
--

DROP TABLE IF EXISTS `blog_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blog_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `slug` varchar(100) NOT NULL,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_uca1400_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blog_categories`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `blog_categories` WRITE;
/*!40000 ALTER TABLE `blog_categories` DISABLE KEYS */;
INSERT INTO `blog_categories` VALUES
(1,'SEO & Organic Growth','seo-organic-growth','2026-10-30 05:03:24'),
(2,'Web Engineering','web-engineering','2026-10-30 05:03:24'),
(3,'Mobile Architecture','mobile-architecture','2026-10-30 05:03:24'),
(4,'Healthcare Technology','healthcare-technology','2026-10-30 05:03:24'),
(5,'Performance Marketing','performance-marketing','2026-10-30 05:03:24'),
(6,'Political Branding','political-branding','2026-10-30 05:03:24'),
(7,'CGI & 3D Visuals','cgi-3d-visuals','2026-10-30 05:03:24'),
(8,'Digital Strategy','digital-strategy','2026-10-30 05:03:24'),
(9,'location','location','2026-10-30 07:39:01');
/*!40000 ALTER TABLE `blog_categories` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `blogs`
--

DROP TABLE IF EXISTS `blogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `blogs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(200) NOT NULL,
  `title` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `cover_image` varchar(500) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `service_code` varchar(32) DEFAULT NULL,
  `content_blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`content_blocks`)),
  `seo_meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seo_meta`)),
  `published_at` timestamp NULL DEFAULT NULL,
  `is_published` tinyint(1) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` varchar(20) DEFAULT 'published',
  `scheduled_at` datetime DEFAULT NULL,
  `tags` varchar(500) DEFAULT '',
  `author` varchar(100) DEFAULT 'Sunraise Editorial Team',
  `is_featured` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `image_alt` varchar(255) DEFAULT '',
  `image_caption` varchar(255) DEFAULT '',
  `content_html` longtext DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `blogs`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `blogs` WRITE;
/*!40000 ALTER TABLE `blogs` DISABLE KEYS */;
INSERT INTO `blogs` VALUES
(1,'why-technical-seo-drives-380-percent-more-qualified-leads','Why Technical SEO Drives 380% More Qualified Leads for Hyderabad Businesses','Discover the exact architectural audit checkpoints, Core Web Vitals fixes, and schema markup strategies our agency uses to dominate Google search results.','https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80','SEO & Organic Growth','SRV-SEO-01','[{\"id\":\"blk-b1-1\",\"type\":\"html\",\"sort_order\":1,\"html_content\":\"<p class=\\\"text-lg leading-relaxed text-gray-700 mb-6\\\">Search algorithms have fundamentally shifted. Surface-level keyword stuffing no longer works. Modern search engines measure interaction to next paint (INP), semantic content vectors, and technical crawl authority.<\\/p><h2 class=\\\"text-2xl font-bold text-gray-900 mt-8 mb-4\\\">1. Eliminating Render-Blocking Bottlenecks<\\/h2><p class=\\\"text-gray-700 leading-relaxed mb-6\\\">When Sunraise Solutions audits corporate websites across Andhra Pradesh and Telangana, 82% fail Core Web Vitals on mobile devices due to uncompressed media and heavy JavaScript payloads. Fixing this alone often yields an immediate 20-35% boost in search visibility.<\\/p><h2 class=\\\"text-2xl font-bold text-gray-900 mt-8 mb-4\\\">2. The Power of Hyper-Local Entity Schema<\\/h2><p class=\\\"text-gray-700 leading-relaxed mb-6\\\">By injecting structured Schema.org JSON-LD linking your physical office addresses in Hyderabad and Rajahmundry with exact geo-coordinates, Google\\u2019s Knowledge Graph immediately elevates your brand above generic aggregators.<\\/p>\"}]','{\"meta_title\":\"Technical SEO Lead Gen Guide | Sunraise Solutions\",\"meta_description\":\"Learn how technical SEO and Core Web Vitals optimization can drive a 380% surge in organic inbound inquiries for your enterprise.\",\"keywords\":\"Technical SEO Hyderabad, Organic Lead Generation, Google Core Web Vitals\"}','2026-10-29 13:40:07',1,'2026-10-29 12:40:07','2026-10-31 04:06:27','published',NULL,'','Sunraise Editorial Team',0,2,'','',NULL),
(2,'choosing-the-right-hospital-management-software-in-2026','Architecting NABH-Compliant Hospital Management Systems: 2026 Checklist','A strategic roadmap for hospital owners and medical directors on modernizing clinical EHR, patient telemetry, and pharmacy workflows without downtime.','https://testers.acheva.in/api/uploads/sunraise_1793338150_c8cf4f27.png','Healthcare Technology','SRV-HMS-08','[{\"id\":\"blk-html-1793340065882\",\"type\":\"html\",\"sort_order\":1,\"html_content\":\"<p class=\\\"text-lg leading-relaxed text-gray-700 mb-6\\\">Healthcare modernization is no longer an IT luxury; it is a clinical and legal necessity. A robust Hospital Management System (HMS) must combine rapid OPD triage with bank-grade patient data privacy.<\\/p>\"}]','{\"meta_title\":\"NABH Hospital Management Software Checklist 2026 | Sunraise\",\"meta_description\":\"Everything healthcare directors must know when migrating to cloud-native, NABH-compliant hospital software in South India.\",\"keywords\":\"NABH HMS checklist, Hospital Management Software Andhra Pradesh, Healthcare EHR\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/blog\\/choosing-the-right-hospital-management-software-in-2026\",\"og_image\":\"https:\\/\\/testers.acheva.in\\/api\\/uploads\\/sunraise_1793338150_c8cf4f27.png\"}','2026-10-30 06:01:06',1,'2026-10-29 12:40:07','2026-11-03 10:24:27','published',NULL,'','Sunraise Editorial Team',0,10,'','','<p class=\"text-lg leading-relaxed text-gray-700 mb-6\">Healthcare modernization is no longer an IT luxury; it is a clinical and legal necessity. A robust Hospital Management System (HMS) must combine rapid OPD triage with bank-grade patient data privacy.</p>');
/*!40000 ALTER TABLE `blogs` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `leads`
--

DROP TABLE IF EXISTS `leads`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `leads` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `service_code` varchar(32) DEFAULT NULL,
  `budget_range` varchar(100) DEFAULT NULL,
  `message` text DEFAULT NULL,
  `source_page` varchar(200) DEFAULT NULL,
  `status` enum('new','contacted','qualified','closed') DEFAULT 'new',
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `leads`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `leads` WRITE;
/*!40000 ALTER TABLE `leads` DISABLE KEYS */;
INSERT INTO `leads` VALUES
(1,'Test Lead Verification','verify@sunraisesolutions.com','+91 9988776655','SRV-SEO-01','₹1,00,000 - ₹3,00,000','Testing automated lead submission over Hostinger REST API','/','new','2026-10-30 04:27:55');
/*!40000 ALTER TABLE `leads` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `media_items`
--

DROP TABLE IF EXISTS `media_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `media_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(500) NOT NULL,
  `filename` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `alt` varchar(255) DEFAULT '',
  `caption` text DEFAULT NULL,
  `size_bytes` int(11) DEFAULT 0,
  `folder` varchar(100) DEFAULT 'General',
  `format` varchar(50) DEFAULT 'WEBP',
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `media_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `media_items` WRITE;
/*!40000 ALTER TABLE `media_items` DISABLE KEYS */;
INSERT INTO `media_items` VALUES
(1,'https://testers.acheva.in/api/uploads/sunraise_1793436986_87ce87b8.png','sunraise_1793436986_87ce87b8.png','Digital & PR House','Digital & PR House',NULL,6174417,'Columns','PNG','2026-10-31 08:56:26'),
(2,'https://testers.acheva.in/api/uploads/sunraise_1793436989_5d1c8935.png','sunraise_1793436989_5d1c8935.png','logo','logo',NULL,49658,'Columns','PNG','2026-10-31 08:56:29'),
(3,'https://testers.acheva.in/api/uploads/sunraise_1793436992_bbdf5279.png','sunraise_1793436992_bbdf5279.png','Professional Portrait in Navy Shirt','Professional Portrait in Navy Shirt',NULL,1535961,'Columns','PNG','2026-10-31 08:56:32'),
(4,'https://testers.acheva.in/api/uploads/sunraise_1793442921_b9615656.jpg','sunraise_1793442921_b9615656.jpg','1793262947215','1793262947215',NULL,21895,'Testimonials','JPG','2026-10-31 10:35:21');
/*!40000 ALTER TABLE `media_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `navigation_items`
--

DROP TABLE IF EXISTS `navigation_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `navigation_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `parent_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `url` varchar(255) NOT NULL,
  `target` varchar(20) DEFAULT '_self',
  `icon_name` varchar(50) DEFAULT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `badge` varchar(50) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `sort_order` int(11) DEFAULT 0,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`),
  KEY `idx_sort` (`sort_order`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navigation_items`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `navigation_items` WRITE;
/*!40000 ALTER TABLE `navigation_items` DISABLE KEYS */;
INSERT INTO `navigation_items` VALUES
(1,NULL,'Home','/','_self','Home',NULL,NULL,'Main corporate landing overview',1,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(2,NULL,'About Us','/about','_self','Users',NULL,NULL,'18+ years corporate digital excellence',2,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(3,2,'Our Leadership Team','/about#leadership','_self','Award','https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80','Core','Meet the visionaries behind Sunraise Solutions',1,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(4,2,'Corporate Locations & Hubs','/about#locations','_self','Building2','https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80','Dual Hub','Hyderabad HQ and Rajahmundry Regional Delivery Center',2,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(5,NULL,'Services','/services','_self','Sparkles',NULL,'8 Capabilities','Comprehensive enterprise digital capabilities',3,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(6,5,'Search Engine Optimization','/services/search-engine-optimization','_self','Search','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80','SRV-SEO-01','Algorithm dominance and high-authority local entity ranking',1,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(7,5,'Website Architecture & Design','/services/website-architecture-and-design','_self','Globe','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80','SRV-WEB-02','High-performance React & cloud headless architectures',2,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(8,5,'Mobile App Engineering','/services/mobile-application-development','_self','Smartphone','https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&w=600&q=80','SRV-APP-03','Cross-platform native iOS & Android applications',3,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(9,5,'Performance Marketing & Ads','/services/social-media-and-performance-marketing','_self','Megaphone','https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=600&q=80','SRV-SMM-04','High-ROAS lead acquisition on Meta and Google Ads',4,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(10,5,'Custom Cloud Software (CRM/ERP)','/services/custom-software-development','_self','Code2','https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80','SRV-DEV-05','Bespoke automation software, CRM and ERP ecosystems',5,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(11,5,'Electoral Campaign Strategy','/services/political-campaign-management','_self','Vote','https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=600&q=80','SRV-POL-06','Voter sentiment analytics, field tracking and digital outreach',6,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(12,5,'Corporate Film & Media Production','/services/video-and-multimedia-production','_self','Film','https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80','SRV-MED-07','Ad commercials, broadcast media, 3D animations and documentaries',7,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(13,5,'Healthcare & Hospital SaaS','/services/hospital-management-software','_self','Activity','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80','SRV-HOS-08','NABH compliant clinical telemetry, EHR and bed occupancy systems',8,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(14,NULL,'Projects','/projects','_self','FolderKanban',NULL,NULL,'Real deployed client architectures and engineering success',4,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(15,14,'Clinical Healthcare Software','/projects?category=Healthcare','_self','Activity','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80','Featured','Deployed NABH clinical system managing patient telemetry',1,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(16,14,'High-Scale Ecommerce Systems','/projects?category=E-Commerce','_self','Globe','https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80','Active','Automated omnichannel checkout handling multi-crore transactions',2,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(17,NULL,'Blog','/blog','_self','BookOpen',NULL,NULL,'Industry insights, SEO breakdowns and technical thought leadership',5,1,'2026-10-31 04:49:00','2026-10-31 04:49:00'),
(18,NULL,'Contact','/contact','_self','Phone',NULL,NULL,'Connect with our corporate architects in Hyderabad or Rajahmundry',6,1,'2026-10-31 04:49:00','2026-10-31 04:49:00');
/*!40000 ALTER TABLE `navigation_items` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `navigation_settings`
--

DROP TABLE IF EXISTS `navigation_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `navigation_settings` (
  `setting_key` varchar(100) NOT NULL,
  `setting_value` longtext DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`setting_key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `navigation_settings`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `navigation_settings` WRITE;
/*!40000 ALTER TABLE `navigation_settings` DISABLE KEYS */;
INSERT INTO `navigation_settings` VALUES
('navbar_cta_text','Get Proposal','2026-10-31 04:49:00'),
('navbar_cta_url','/contact','2026-10-31 04:49:00'),
('navbar_cta_visible','1','2026-10-31 04:49:00'),
('navbar_logo_url','/logo.png','2026-10-31 04:49:00'),
('services_dropdown_promo_cta','Consult Our Architects','2026-10-31 04:49:00'),
('services_dropdown_promo_image','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80','2026-10-31 04:49:00'),
('services_dropdown_promo_title','Looking for custom bespoke enterprise architecture?','2026-10-31 04:49:00'),
('services_dropdown_promo_url','/contact','2026-10-31 04:49:00'),
('services_dropdown_subtitle','8 Enterprise Capabilities','2026-10-31 04:49:00'),
('services_dropdown_title','Our Core Specializations','2026-10-31 04:49:00'),
('top_bar_announcement','Dual Presence: Hyderabad HQ & Rajahmundry Regional Hub | 18+ Years Corporate Digital Excellence','2026-10-31 04:49:00'),
('top_bar_phone','+91 99596 39539','2026-10-31 04:49:00'),
('top_bar_show_admin_link','1','2026-10-31 04:49:00');
/*!40000 ALTER TABLE `navigation_settings` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `pages`
--

DROP TABLE IF EXISTS `pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page_key` varchar(50) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `title` varchar(200) NOT NULL,
  `hero_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hero_config`)),
  `page_blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`page_blocks`)),
  `seo_meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seo_meta`)),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `page_type` varchar(50) DEFAULT 'landing',
  `status` varchar(50) DEFAULT 'published',
  `seo_score` int(11) DEFAULT 85,
  `author` varchar(100) DEFAULT 'SEO Strategy Team',
  `last_modified_by` varchar(100) DEFAULT 'Admin',
  `is_published` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `page_key` (`page_key`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pages`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `pages` WRITE;
/*!40000 ALTER TABLE `pages` DISABLE KEYS */;
INSERT INTO `pages` VALUES
(1,'page_core_home','home','Home Page','{\"badge\": \"Top Digital Marketing Agency in Andhra Pradesh\", \"title\": \"Grow Your Business with\", \"highlight_text\": \"Sunraise Solutions\", \"subtitle\": \"With 18+ years of expertise in digital marketing and software innovation, we help startups, growing brands, and established businesses build a powerful digital presence that drives real results. Headquartered in Hyderabad with a regional center in Rajahmundry.\", \"primary_cta\": \"Get a Free Proposal\", \"secondary_cta\": \"Explore Projects\", \"hero_image\": \"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80\", \"stats\": [{\"label\": \"Proven Experience\", \"val\": \"18+ Years\"}, {\"label\": \"Projects Delivered\", \"val\": \"500+\"}, {\"label\": \"Client Retention\", \"val\": \"98%\"}]}','[{\"id\": \"blk-home-values\", \"type\": \"component\", \"component_name\": \"ThreeColumn\", \"order\": 0, \"props\": {\"title\": \"Innovation, Strategy & Excellence\", \"columns\": [{\"title\": \"Innovation with Purpose\", \"desc\": \"We engineer scalable architectures and AI-assisted workflows tailored to solve concrete operational hurdles and maximize capital efficiency.\", \"bg\": \"white\"}, {\"title\": \"Strategic Solutions\", \"desc\": \"Algorithmic SEO, hyper-local search mapping, and full-funnel ad campaigns constructed to dominate Andhra Pradesh and national search rankings.\", \"bg\": \"white\"}, {\"title\": \"Dedicated to Excellence\", \"desc\": \"18+ years of reliable delivery, zero-regression software maintenance, and round-the-clock senior engineering leadership for peace of mind.\", \"bg\": \"white\"}], \"cardSize\": \"spacious\", \"cardShadow\": \"warm\"}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-whoweare\", \"type\": \"component\", \"component_name\": \"TwoColumn\", \"order\": 1, \"props\": {\"title\": \"Architecting High-Yield Software & Digital Growth Across South India\", \"left_title\": \"Our Engineering Heritage\", \"left_desc\": \"Sunraise Solutions stands as a benchmark of technical reliability and strategic innovation. Headquartered in Hyderabad\'s premier tech corridor with an expansive regional footprint in Rajahmundry, Andhra Pradesh, we partner with healthcare giants, educational institutions, political campaigns, and mid-market enterprises.\", \"left_image\": \"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80\", \"left_bullets\": [\"18+ Years Industry Experience\", \"Custom Enterprise Software & Web Solutions\", \"SEO & Sub-Second Performance\", \"Result-Driven Conversion Pipelines\"], \"right_title\": \"Dual Corporate Hub Presence\", \"right_desc\": \"Immediate regional support across Telangana and Andhra Pradesh with dedicated account directors and round-the-clock engineering availability.\", \"right_bullets\": [\"Hyderabad Head Office: Madhapur, Hitec City Corridor\", \"Rajahmundry Regional Hub: Danavaipeta Commercial Centre\", \"Pan India & Global Client Coverage\", \"92% Satisfied Clients Returning Often\"], \"right_bg\": \"orange\"}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-services\", \"type\": \"component\", \"component_name\": \"FeatureGrid\", \"order\": 2, \"props\": {\"badge\": \"Dynamic Capabilities\", \"title\": \"Full-Suite Corporate Digital Services\", \"description\": \"Configured dynamically in our CMS. Each service offers dedicated service codes, sub-second SLAs, and integrated completed projects.\", \"columns\": 4, \"features\": [\"01 - Web Development: High-performance, responsive websites, e-commerce stores, and custom portals engineered for conversion.\", \"02 - Mobile App Development: Powerful Android & iOS apps tailored to your business workflows.\", \"03 - Digital Marketing: Hyper-targeted SEO, PPC advertising, social media growth, and branding campaigns.\", \"04 - Custom Software Development: Scalable ERP, CRM, and cloud-native software built to automate operations.\", \"05 - Political Branding: Strategic digital campaigns and narrative engineering for political leaders and public campaigns.\", \"06 - White Label Digital Services: Reseller-ready digital marketing and software development for partner agencies.\", \"07 - CGI Advertising Agency: 3D product visualizations, CGI ads, and cinematic commercial video production.\", \"08 - Hospital Management Software (HMS): Complete clinical workflow software with OPD, IPD, billing, and pharmacy modules.\"], \"cardSize\": \"compact\", \"cardShadow\": \"warm\"}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-process\", \"type\": \"component\", \"component_name\": \"ProcessTimeline\", \"order\": 3, \"props\": {\"badge\": \"Engineered Delivery\", \"title\": \"Our 4-Step Working Process\", \"columns\": 4, \"steps\": [{\"step\": \"01\", \"title\": \"Brand Discovery / Audit\", \"desc\": \"In-depth algorithmic analysis of current architecture, organic rankings, and market positioning.\"}, {\"step\": \"02\", \"title\": \"Creative Planning / Strategy\", \"desc\": \"Architecting custom technical roadmaps, high-converting prototypes, and target keyword clusters.\"}, {\"step\": \"03\", \"title\": \"Digital Execution\", \"desc\": \"Agile development, sub-second speed optimization, and multi-channel campaign rollout.\"}, {\"step\": \"04\", \"title\": \"Growth Optimization\", \"desc\": \"Continuous telemetry measurement, automated 301 safeguards, and ongoing conversion scale.\"}]}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-projects\", \"type\": \"component\", \"component_name\": \"ThreeColumn\", \"order\": 4, \"props\": {\"title\": \"Featured Completed Projects & Implementations\", \"columns\": [{\"title\": \"Avanthi MCA College\", \"desc\": \"SEO & Web Development \\u00b7 +420% Organic Admission Inquiries and complete responsive university portal with sub-second page loads.\"}, {\"title\": \"Sri Veera Hanuman Nursery\", \"desc\": \"E-Commerce & Digital Marketing \\u00b7 3.2x Online Inquiries for India\'s largest plant nursery with Telugu-English multilingual mapping.\"}, {\"title\": \"Union Hospital\", \"desc\": \"Hospital Management Software (HMS) \\u00b7 Paperless OPD, IPD, billing, and pharmacy digital workflows with automated doctor schedules.\"}]}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-trust\", \"type\": \"component\", \"component_name\": \"KPICounter\", \"order\": 5, \"props\": {\"title\": \"Why Industry Leaders Choose Sunraise Solutions\", \"stats\": [{\"label\": \"Industry Experience\", \"val\": \"18+ Years\"}, {\"label\": \"Projects Delivered\", \"val\": \"500+\"}, {\"label\": \"Client Retention\", \"val\": \"98%\"}, {\"label\": \"Happy Corporate Clients\", \"val\": \"300+\"}]}, \"styles\": {\"paddingY\": 40}}, {\"id\": \"blk-home-testimonials\", \"type\": \"component\", \"component_name\": \"Testimonials\", \"order\": 6, \"props\": {\"title\": \"Endorsed by Andhra Pradesh & Hyderabad Leaders (4.8 Rating)\", \"reviews\": [{\"name\": \"MAKSIM Infotech\", \"role\": \"Technology Operations\", \"text\": \"From branding to web development, Sunraise Solutions handled everything professionally. Their team is skilled, responsive, and always delivers on time.\", \"rating\": 5}, {\"name\": \"Hotel Jaya Residency\", \"role\": \"Hospitality Operations\", \"text\": \"Sunraise Solutions has transformed our online presence with exceptional web development strategies. Direct room bookings have surged significantly.\", \"rating\": 5}, {\"name\": \"MVR Group\", \"role\": \"Corporate Enterprises\", \"text\": \"Sunraise Solutions built us a beautiful website and provided excellent support throughout the process. Their attention to detail and design sense is top-notch.\", \"rating\": 5}]}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-faqs\", \"type\": \"component\", \"component_name\": \"FAQAccordion\", \"order\": 7, \"props\": {\"title\": \"Frequently Asked Questions (SEO FAQs)\", \"items\": [{\"q\": \"How does Sunraise Solutions ensure Google Top 3 rankings in Hyderabad?\", \"a\": \"We leverage deep Core Web Vitals optimization, semantic schema markup linking your Hyderabad addresses, high-DA localized link building, and conversion-optimized content clusters.\"}, {\"q\": \"Do you offer custom software development with local Rajahmundry support?\", \"a\": \"Yes! Our Rajahmundry branch provides immediate on-site consultation and ongoing support for enterprises and hospitals across coastal Andhra Pradesh.\"}, {\"q\": \"What is your Hospital Management Software (HMS) deployment timeline?\", \"a\": \"A standard NABH-ready HMS deployment across OPD, IPD, and pharmacy modules is completed within 3 to 6 weeks, including data migration and medical staff training.\"}, {\"q\": \"How do you safeguard client rankings when restructuring a website?\", \"a\": \"We employ our Zero-Regression SEO framework with automated 301 redirects, URL slug preservation, and strict heading hierarchy checks.\"}]}, \"styles\": {\"paddingY\": 48}}, {\"id\": \"blk-home-proposal-cta\", \"type\": \"component\", \"component_name\": \"CTABanner\", \"order\": 8, \"props\": {\"badge\": \"Free Architectural Consultation\", \"title\": \"Get a Free SEO & Software Proposal\", \"description\": \"Receive a comprehensive competitive audit and commercial roadmap within 24 hours from our senior architects in Hyderabad or Rajahmundry.\", \"button_text\": \"Request Free Proposal\", \"button_link\": \"/contact\"}, \"styles\": {\"paddingY\": 48}}]','{\"meta_title\": \"Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry\", \"meta_description\": \"Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing.\", \"focus_keyword\": \"SEO Services Hyderabad, Web Development Rajahmundry\", \"canonical_url\": \"https://testers.acheva.in/\", \"robots_index\": true, \"robots_follow\": true, \"sitemap_include\": true}','2026-10-31 05:20:56','core','published',85,'SEO Strategy Team','Admin',1,'2026-10-31 04:58:07'),
(2,'page_core_about','about','About Us','{\"badge\":\"CORPORATE HERITAGE\",\"title\":\"18+ Years Building Market Leaders & Digital Dominance\",\"highlight_text\":\"By Sunraise Solutions\",\"subtitle\":\"Dual presence in Hyderabad HITEC City HQ and Rajahmundry Regional Delivery Center.\",\"primary_cta\":\"Claim Free Proposal\",\"secondary_cta\":\"Explore Capabilities\",\"hero_image\":\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Client Retention\",\"val\":\"98%\"},{\"label\":\"Growth Surge\",\"val\":\"+280%\"}]}','[{\"id\":\"blk-about-hero\",\"type\":\"visual\",\"component_name\":\"Container\",\"sort_order\":1,\"props\":{\"badge\":\"18+ YEARS CORPORATE DIGITAL HERITAGE\",\"title\":\"Building High-Performance Digital Equity Across South India\",\"content\":\"Founded with an unwavering commitment to engineering mastery and business growth, Sunraise Solutions unites visionary digital marketing with enterprise-grade cloud software.\",\"image\":\"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80\",\"button_text\":\"Explore Our Hubs\",\"button_url\":\"#locations\"}},{\"id\":\"blk-about-locations\",\"type\":\"visual\",\"component_name\":\"TwoColumn\",\"sort_order\":2,\"props\":{\"title\":\"Dual Presence: Hyderabad Headquarters & Rajahmundry Operations Hub\",\"columns\":[{\"id\":\"col-ab-hyd\",\"title\":\"Hyderabad Headquarters\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-ab-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"HITEC City Hyderabad HQ\",\"alignment\":\"left\"},{\"id\":\"el-ab-img1\",\"type\":\"Image\",\"url\":\"https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80\",\"alt\":\"Hyderabad Corporate Office\",\"alignment\":\"center\"},{\"id\":\"el-ab-p1\",\"type\":\"Paragraph\",\"text\":\"Level 4, Cyber Towers, HITEC City. Direct access to premier tech talent, institutional clients, and regional enterprise leaders.\",\"alignment\":\"left\"},{\"id\":\"el-ab-btn1\",\"type\":\"Button\",\"text\":\"Hyderabad HQ Details\",\"url\":\"/contact\",\"variant\":\"primary\",\"alignment\":\"left\"}]},{\"id\":\"col-ab-rjy\",\"title\":\"Rajahmundry Regional Hub\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-ab-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Rajahmundry Regional Delivery Hub\",\"alignment\":\"left\"},{\"id\":\"el-ab-img2\",\"type\":\"Image\",\"url\":\"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80\",\"alt\":\"Rajahmundry Delivery Hub\",\"alignment\":\"center\"},{\"id\":\"el-ab-p2\",\"type\":\"Paragraph\",\"text\":\"Danavaipeta, Rajahmundry. Dedicated regional delivery center supporting manufacturing, healthcare, and educational institutions across Coastal Andhra.\",\"alignment\":\"left\"},{\"id\":\"el-ab-btn2\",\"type\":\"Button\",\"text\":\"Rajahmundry Hub Details\",\"url\":\"/contact\",\"variant\":\"secondary\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-about-pillars\",\"type\":\"visual\",\"component_name\":\"ThreeColumn\",\"sort_order\":3,\"props\":{\"title\":\"Our Three Operational Pillars\",\"columns\":[{\"id\":\"col-pil-1\",\"title\":\"Technical Dominance\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-pil-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Technical Dominance\",\"alignment\":\"left\"},{\"id\":\"el-pil-p1\",\"type\":\"Paragraph\",\"text\":\"Sub-second load times, headless React architectures, and rigorous code security audits.\",\"alignment\":\"left\"}]},{\"id\":\"col-pil-2\",\"title\":\"Search Authority\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-pil-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Search Authority\",\"alignment\":\"left\"},{\"id\":\"el-pil-p2\",\"type\":\"Paragraph\",\"text\":\"White-hat PR links, Google Knowledge Graph alignment, and zero-penalty algorithmic SEO.\",\"alignment\":\"left\"}]},{\"id\":\"col-pil-3\",\"title\":\"Measurable ROI\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-pil-h3\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Measurable ROI\",\"alignment\":\"left\"},{\"id\":\"el-pil-p3\",\"type\":\"Paragraph\",\"text\":\"Transparent conversion tracking, clear lead pipelines, and verifiable commercial growth.\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-about-cta\",\"type\":\"visual\",\"component_name\":\"CTABanner\",\"sort_order\":4,\"props\":{\"badge\":\"PARTNER WITH US\",\"title\":\"Partner with an 18-Year Legacy Digital Agency\",\"description\":\"Connect with our leadership to plan your digital growth trajectory.\",\"button_text\":\"Contact Our Architects\",\"button_url\":\"/contact\"}}]','{\"meta_title\":\"About Us | Sunraise Solutions - 18+ Years Corporate Legacy\",\"meta_description\":\"Learn about Sunraise Solutions, our executive leadership, 18+ years of digital transformation, and our dual presence.\",\"focus_keyword\":\"Sunraise Solutions About\",\"robots_index\":true,\"robots_follow\":true,\"sitemap_include\":true}','2026-10-31 04:58:07','core','published',85,'SEO Strategy Team','Admin',1,'2026-10-31 04:58:07'),
(3,'page_core_services','services','Services Hub','{\"badge\":\"CAPABILITIES DIRECTORY\",\"title\":\"Enterprise Engineering & Marketing Capabilities\",\"highlight_text\":\"By Sunraise Solutions\",\"subtitle\":\"Explore our full spectrum of 8 corporate specializations engineered for verifiable commercial ROI.\",\"primary_cta\":\"Claim Free Proposal\",\"secondary_cta\":\"Explore Capabilities\",\"hero_image\":\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Client Retention\",\"val\":\"98%\"},{\"label\":\"Growth Surge\",\"val\":\"+280%\"}]}','[{\"id\":\"blk-srv-hero\",\"type\":\"visual\",\"component_name\":\"Container\",\"sort_order\":1,\"props\":{\"badge\":\"ENTERPRISE SERVICES DIRECTORY\",\"title\":\"8 Engineered Capabilities for Enterprise Dominance\",\"content\":\"Explore our full spectrum of corporate capabilities designed for scalable ROI, sub-second speeds, and search dominance.\",\"image\":\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"button_text\":\"Consult Our Architects\",\"button_url\":\"/contact\"}},{\"id\":\"blk-srv-grid\",\"type\":\"visual\",\"component_name\":\"FeatureGrid\",\"sort_order\":2,\"props\":{\"title\":\"Specialized Corporate Services Catalog\",\"description\":\"Each service backed by dedicated SLAs, enterprise frameworks, and experienced technical leadership.\",\"features\":[\"SRV-SEO-01: Search Engine Optimization - Algorithm ranking & local map dominance\",\"SRV-WEB-02: Web Architecture & Design - Fast, modern React & cloud platforms\",\"SRV-APP-03: Mobile App Development - iOS & Android cross-platform solutions\",\"SRV-SMM-04: Performance Marketing - High-ROAS Google & Meta ad funnels\",\"SRV-DEV-05: Custom Software Development - Cloud ERP, CRM & automated systems\",\"SRV-POL-06: Political Campaign Management - Voter data analytics & ground outreach\",\"SRV-MED-07: Video & Media Production - TV commercials, 3D animations & documentaries\",\"SRV-HOS-08: Hospital Management Software - NABH compliant telemetry & EHR\"]}},{\"id\":\"blk-srv-sla\",\"type\":\"visual\",\"component_name\":\"TwoColumn\",\"sort_order\":3,\"props\":{\"title\":\"Enterprise Delivery Standards & Quality Benchmarks\",\"columns\":[{\"id\":\"col-sla-1\",\"title\":\"Sub-Second Performance SLA\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-sla-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Sub-Second Performance SLA\",\"alignment\":\"left\"},{\"id\":\"el-sla-p1\",\"type\":\"Paragraph\",\"text\":\"Every web platform we build achieves 95+ Core Web Vitals speed scores with global CDN distribution.\",\"alignment\":\"left\"}]},{\"id\":\"col-sla-2\",\"title\":\"Dedicated Technical Lead\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-sla-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Dedicated Technical Lead\",\"alignment\":\"left\"},{\"id\":\"el-sla-p2\",\"type\":\"Paragraph\",\"text\":\"Direct access to our senior software architects and digital strategists with daily standup updates.\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-srv-cta\",\"type\":\"visual\",\"component_name\":\"CTABanner\",\"sort_order\":4,\"props\":{\"badge\":\"BESPOKE ARCHITECTURE\",\"title\":\"Need a Tailored Enterprise Architecture?\",\"description\":\"Our engineering team is ready to design a custom solution for your business.\",\"button_text\":\"Request Custom Architecture\",\"button_url\":\"/contact\"}}]','{\"meta_title\":\"Enterprise Services Directory | Sunraise Solutions\",\"meta_description\":\"Explore 8 corporate specializations: SEO, Web Development, Apps, Performance Marketing, Cloud ERP, and Hospital SaaS.\",\"focus_keyword\":\"Corporate IT Services Hyderabad\",\"robots_index\":true,\"robots_follow\":true,\"sitemap_include\":true}','2026-10-31 04:58:07','core','published',85,'SEO Strategy Team','Admin',1,'2026-10-31 04:58:07'),
(4,'page_core_projects','projects','Completed Projects','{\"badge\":\"PROVEN TRACK RECORD\",\"title\":\"Real Deployed Client Architectures & Measurable Impact\",\"highlight_text\":\"By Sunraise Solutions\",\"subtitle\":\"Explore real-world software deployments, conversion surges, and digital transformation outcomes.\",\"primary_cta\":\"Claim Free Proposal\",\"secondary_cta\":\"Explore Capabilities\",\"hero_image\":\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Client Retention\",\"val\":\"98%\"},{\"label\":\"Growth Surge\",\"val\":\"+280%\"}]}','[{\"id\":\"blk-proj-hero\",\"type\":\"visual\",\"component_name\":\"Container\",\"sort_order\":1,\"props\":{\"badge\":\"PROVEN TRACK RECORD\",\"title\":\"Real Deployed Client Architectures & Measurable Impact\",\"content\":\"Review real client architectures deployed by Sunraise Solutions across healthcare, retail, real estate, and government institutions.\",\"image\":\"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80\",\"button_text\":\"Discuss Your Project\",\"button_url\":\"/contact\"}},{\"id\":\"blk-proj-showcase\",\"type\":\"visual\",\"component_name\":\"TwoColumn\",\"sort_order\":2,\"props\":{\"title\":\"Flagship Completed Deployments\",\"columns\":[{\"id\":\"col-pr-1\",\"title\":\"NABH Clinical Healthcare Platform\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-pr-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"NABH Hospital EHR & Telemetry Platform\",\"alignment\":\"left\"},{\"id\":\"el-pr-img1\",\"type\":\"Image\",\"url\":\"https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80\",\"alt\":\"Healthcare Software\",\"alignment\":\"center\"},{\"id\":\"el-pr-p1\",\"type\":\"Paragraph\",\"text\":\"Deployed across 12 hospitals in AP & Telangana with real-time bed occupancy tracking, doctor rosters, and electronic health records.\",\"alignment\":\"left\"},{\"id\":\"el-pr-btn1\",\"type\":\"Button\",\"text\":\"Explore Healthcare Tech\",\"url\":\"/services/hospital-management-software\",\"variant\":\"primary\",\"alignment\":\"left\"}]},{\"id\":\"col-pr-2\",\"title\":\"Omnichannel Retail Platform\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-pr-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Omnichannel Multi-Crore Retail Ecosystem\",\"alignment\":\"left\"},{\"id\":\"el-pr-img2\",\"type\":\"Image\",\"url\":\"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80\",\"alt\":\"Retail Software\",\"alignment\":\"center\"},{\"id\":\"el-pr-p2\",\"type\":\"Paragraph\",\"text\":\"High-scale ecommerce platform handling thousands of concurrent transactions with real-time warehouse ERP synchronization.\",\"alignment\":\"left\"},{\"id\":\"el-pr-btn2\",\"type\":\"Button\",\"text\":\"Explore Web Engineering\",\"url\":\"/services/website-architecture-and-design\",\"variant\":\"secondary\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-proj-stack\",\"type\":\"visual\",\"component_name\":\"ThreeColumn\",\"sort_order\":3,\"props\":{\"title\":\"Our Technology & Engineering Stack\",\"columns\":[{\"id\":\"col-st-1\",\"title\":\"Frontend Architecture\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-st-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Frontend Architecture\",\"alignment\":\"left\"},{\"id\":\"el-st-p1\",\"type\":\"Paragraph\",\"text\":\"React 19, TypeScript, TailwindCSS, Next.js, Vite with sub-second asset bundling.\",\"alignment\":\"left\"}]},{\"id\":\"col-st-2\",\"title\":\"Backend & Cloud\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-st-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Backend & Cloud\",\"alignment\":\"left\"},{\"id\":\"el-st-p2\",\"type\":\"Paragraph\",\"text\":\"PHP 8, Node.js, Python, MySQL, PostgreSQL, Docker, AWS and Hostinger cloud infrastructure.\",\"alignment\":\"left\"}]},{\"id\":\"col-st-3\",\"title\":\"Search & Growth\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-st-h3\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Search & Growth\",\"alignment\":\"left\"},{\"id\":\"el-st-p3\",\"type\":\"Paragraph\",\"text\":\"Ahrefs, SEMrush, Google Search Console API, GA4 attribution funnels and Schema.org.\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-proj-cta\",\"type\":\"visual\",\"component_name\":\"CTABanner\",\"sort_order\":4,\"props\":{\"badge\":\"START A PROJECT\",\"title\":\"Ready to Build Your Next High-Performance Platform?\",\"description\":\"Our team will review your requirements and provide an architectural blueprint within 48 hours.\",\"button_text\":\"Submit Project Brief\",\"button_url\":\"/contact\"}}]','{\"meta_title\":\"Completed Projects & Portfolio | Sunraise Solutions\",\"meta_description\":\"Review real deployed client architectures, hospital software systems, and high-scale eCommerce platforms.\",\"focus_keyword\":\"Completed Web Projects\",\"robots_index\":true,\"robots_follow\":true,\"sitemap_include\":true}','2026-10-31 04:58:07','core','published',85,'SEO Strategy Team','Admin',1,'2026-10-31 04:58:07'),
(5,'page_core_blog','blog','Blog & Technical Articles','{\"badge\":\"INSIGHTS & THOUGHT LEADERSHIP\",\"title\":\"Algorithmic Search, Engineering & Marketing Insights\",\"highlight_text\":\"By Sunraise Solutions\",\"subtitle\":\"Deep-dive technical articles, SEO algorithm updates, and architectural guides by Sunraise experts.\",\"primary_cta\":\"Claim Free Proposal\",\"secondary_cta\":\"Explore Capabilities\",\"hero_image\":\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Client Retention\",\"val\":\"98%\"},{\"label\":\"Growth Surge\",\"val\":\"+280%\"}]}','[{\"id\":\"blk-blog-hero\",\"type\":\"visual\",\"component_name\":\"Container\",\"sort_order\":1,\"props\":{\"badge\":\"TECHNICAL INSIGHTS & STRATEGY\",\"title\":\"Algorithmic Search, Cloud Software & Corporate Growth\",\"content\":\"Explore technical breakdowns, SEO algorithm changes, and growth case studies authored by Sunraise Solutions specialists.\",\"image\":\"https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80\"}},{\"id\":\"blk-blog-cards\",\"type\":\"visual\",\"component_name\":\"ThreeColumn\",\"sort_order\":2,\"props\":{\"title\":\"Featured Engineering & Marketing Articles\",\"columns\":[{\"id\":\"col-bl-1\",\"title\":\"Core Web Vitals Guide\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-bl-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Google Core Web Vitals 2026: Sub-Second Imperative\",\"alignment\":\"left\"},{\"id\":\"el-bl-p1\",\"type\":\"Paragraph\",\"text\":\"How page speed directly correlates with conversion velocity and organic ranking in competitive South Indian markets.\",\"alignment\":\"left\"},{\"id\":\"el-bl-btn1\",\"type\":\"Button\",\"text\":\"Read Article\",\"url\":\"/blog\",\"variant\":\"primary\",\"alignment\":\"left\"}]},{\"id\":\"col-bl-2\",\"title\":\"Enterprise SEO Guide\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-bl-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Enterprise SEO vs Local Map Pack Dominance\",\"alignment\":\"left\"},{\"id\":\"el-bl-p2\",\"type\":\"Paragraph\",\"text\":\"Architectural guide to dominating both Google local 3-pack rankings and nationwide organic search terms.\",\"alignment\":\"left\"},{\"id\":\"el-bl-btn2\",\"type\":\"Button\",\"text\":\"Read Article\",\"url\":\"/blog\",\"variant\":\"primary\",\"alignment\":\"left\"}]},{\"id\":\"col-bl-3\",\"title\":\"Hospital Compliance Guide\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-bl-h3\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"NABH Software Compliance for Hospitals\",\"alignment\":\"left\"},{\"id\":\"el-bl-p3\",\"type\":\"Paragraph\",\"text\":\"Key technical standards required for hospital management systems to achieve full NABH compliance.\",\"alignment\":\"left\"},{\"id\":\"el-bl-btn3\",\"type\":\"Button\",\"text\":\"Read Article\",\"url\":\"/blog\",\"variant\":\"primary\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-blog-cta\",\"type\":\"visual\",\"component_name\":\"CTABanner\",\"sort_order\":3,\"props\":{\"badge\":\"STAY INFORMED\",\"title\":\"Subscribe to Technical Insights & SEO Updates\",\"description\":\"Get our monthly technical breakdown delivered straight to your inbox.\",\"button_text\":\"Contact Editorial Team\",\"button_url\":\"/contact\"}}]','{\"meta_title\":\"Blog & Digital Insights | Sunraise Solutions\",\"meta_description\":\"Latest industry insights on search engine optimization, full-stack web architectures, and growth strategy.\",\"focus_keyword\":\"Digital Marketing Blog\",\"robots_index\":true,\"robots_follow\":true,\"sitemap_include\":true}','2026-10-31 04:58:07','core','published',85,'SEO Strategy Team','Admin',1,'2026-10-31 04:58:07'),
(6,'page_core_contact','contact','Contact Us','{\"badge\":\"DIRECT ARCHITECT ACCESS\",\"title\":\"Consult with Our Enterprise Architects\",\"highlight_text\":\"By Sunraise Solutions\",\"subtitle\":\"Ready to dominate your industry? Connect directly with our strategy leadership in Hyderabad or Rajahmundry.\",\"primary_cta\":\"Claim Free Proposal\",\"secondary_cta\":\"Explore Capabilities\",\"hero_image\":\"https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Client Retention\",\"val\":\"98%\"},{\"label\":\"Growth Surge\",\"val\":\"+280%\"}]}','[{\"id\":\"blk-cnt-hero\",\"type\":\"visual\",\"component_name\":\"Container\",\"sort_order\":1,\"props\":{\"badge\":\"DIRECT LEADERSHIP ACCESS\",\"title\":\"Connect with Our Solutions Architects\",\"content\":\"Whether you need a full enterprise software build, custom SEO ranking strategy, or digital transformation advisory, our leadership is ready to help.\",\"image\":\"https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80\"}},{\"id\":\"blk-cnt-locations\",\"type\":\"visual\",\"component_name\":\"TwoColumn\",\"sort_order\":2,\"props\":{\"title\":\"Visit Our Headquarters & Delivery Centers\",\"columns\":[{\"id\":\"col-cn-1\",\"title\":\"Hyderabad Corporate Headquarters\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-cn-h1\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Hyderabad Corporate Headquarters\",\"alignment\":\"left\"},{\"id\":\"el-cn-img1\",\"type\":\"Image\",\"url\":\"https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80\",\"alt\":\"Hyderabad Corporate Office\",\"alignment\":\"center\"},{\"id\":\"el-cn-p1\",\"type\":\"Paragraph\",\"text\":\"Level 4, Cyber Towers, HITEC City, Hyderabad, Telangana 500081. Phone: +91 99596 39539. Email: info@sunraisesolutions.com\",\"alignment\":\"left\"},{\"id\":\"el-cn-btn1\",\"type\":\"Button\",\"text\":\"Call Hyderabad Office\",\"url\":\"tel:+919959639539\",\"variant\":\"primary\",\"alignment\":\"left\"}]},{\"id\":\"col-cn-2\",\"title\":\"Rajahmundry Regional Delivery Hub\",\"direction\":\"col\",\"elements\":[{\"id\":\"el-cn-h2\",\"type\":\"Heading\",\"level\":\"h3\",\"text\":\"Rajahmundry Regional Delivery Hub\",\"alignment\":\"left\"},{\"id\":\"el-cn-img2\",\"type\":\"Image\",\"url\":\"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80\",\"alt\":\"Rajahmundry Delivery Hub\",\"alignment\":\"center\"},{\"id\":\"el-cn-p2\",\"type\":\"Paragraph\",\"text\":\"Danavaipeta, Rajahmundry, Andhra Pradesh 533103. Phone: +91 99596 39539. Serving Godavari, Visakhapatnam & Vijayawada regions.\",\"alignment\":\"left\"},{\"id\":\"el-cn-btn2\",\"type\":\"Button\",\"text\":\"Call Rajahmundry Office\",\"url\":\"tel:+919959639539\",\"variant\":\"secondary\",\"alignment\":\"left\"}]}]}},{\"id\":\"blk-cnt-form\",\"type\":\"visual\",\"component_name\":\"ContactForm\",\"sort_order\":3,\"props\":{\"title\":\"Request a Confidential Proposal & Technical Audit\",\"subtitle\":\"Our executive engineering team responds within 24 hours with a comprehensive roadmap.\"}},{\"id\":\"blk-cnt-faq\",\"type\":\"visual\",\"component_name\":\"FAQAccordion\",\"sort_order\":4,\"props\":{\"title\":\"Engagement & Consultation FAQs\",\"items\":[{\"q\":\"How do project consultations work?\",\"a\":\"We schedule an initial discovery call to review your technical requirements and business goals, followed by an architectural proposal.\"},{\"q\":\"Can we visit your offices in Hyderabad or Rajahmundry?\",\"a\":\"Yes! We welcome clients to both our HITEC City Hyderabad headquarters and our Rajahmundry delivery center.\"}]}}]','{\"meta_title\":\"Contact Sunraise Solutions | Hyderabad HQ & Rajahmundry Regional Hub\",\"meta_description\":\"Get in touch for a bespoke digital marketing proposal, software consultation, or enterprise technical audit.\",\"focus_keyword\":\"Contact Sunraise Solutions\",\"robots_index\":true,\"robots_follow\":true,\"sitemap_include\":true}','2026-10-31 04:58:07','core','published',85,'SEO Strategy Team','Admin',1,'2026-10-31 04:58:07');
/*!40000 ALTER TABLE `pages` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `projects`
--

DROP TABLE IF EXISTS `projects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `slug` varchar(150) NOT NULL,
  `title` varchar(200) NOT NULL,
  `client_name` varchar(150) DEFAULT NULL,
  `service_code` varchar(32) NOT NULL,
  `category_badge` varchar(100) NOT NULL,
  `thumbnail_url` varchar(500) NOT NULL,
  `summary` text DEFAULT NULL,
  `case_study_blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`case_study_blocks`)),
  `seo_meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seo_meta`)),
  `is_featured` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `client_industry` varchar(100) DEFAULT 'Corporate Enterprise',
  `project_year` varchar(20) DEFAULT '2026',
  `metrics` longtext DEFAULT NULL,
  `technologies` varchar(500) DEFAULT '',
  `challenge` text DEFAULT NULL,
  `solution` text DEFAULT NULL,
  `views` int(11) DEFAULT 0,
  `content_html` longtext DEFAULT NULL,
  `status` varchar(20) DEFAULT 'completed',
  `project_url` varchar(255) DEFAULT '',
  `image_alt` varchar(255) DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`),
  KEY `service_code` (`service_code`),
  CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`service_code`) REFERENCES `services` (`service_code`) ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `projects`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `projects` WRITE;
/*!40000 ALTER TABLE `projects` DISABLE KEYS */;
INSERT INTO `projects` VALUES
(1,'avanthi-mca-college','Avanthi MCA College Admissions & Portal','Avanthi Educational Society','SRV-SEO-01','SEO','https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80','Generated 4,200+ qualified student admission inquiries within 90 days via technical on-page SEO restructuring and hyper-local search domination across Hyderabad.',NULL,'{\"meta_title\":\"Avanthi MCA College SEO Case Study | Sunraise Solutions\",\"meta_description\":\"How Sunraise delivered +340% organic enrollment inquiries for Avanthi MCA College in Hyderabad.\"}',1,'2026-10-29 12:40:06','Corporate Enterprise','2026',NULL,'',NULL,NULL,0,NULL,'completed','',''),
(2,'sri-veera-hanuman-nursery','Sri Veera Hanuman Nursery E-Commerce','Sri Veera Hanuman Nursery','SRV-WEB-02','Web Development','https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80','Engineered high-concurrency horticultural marketplace with live inventory sync, shipping logistics integration, and sub-second catalog browsing.',NULL,'{\"meta_title\":\"Sri Veera Hanuman Nursery E-Commerce Web Portal | Sunraise\",\"meta_description\":\"High-performance plant nursery e-commerce platform built for scale across South India.\"}',1,'2026-10-29 12:40:06','Corporate Enterprise','2026',NULL,'',NULL,NULL,0,NULL,'completed','',''),
(3,'union-hospital-digital-ecosystem','Union Hospital 360° Healthcare Digital','Union Hospitals Group','SRV-HMS-08','Hospital Management','https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80','Deployed complete NABH-compliant cloud Hospital Management System integrating emergency triage, automated pharmacy dispensing, and real-time bed management.',NULL,'{\"meta_title\":\"Union Hospital HMS Implementation Case Study | Sunraise\",\"meta_description\":\"Complete hospital ERP modernization boosting staff workflow efficiency by 65%.\"}',1,'2026-10-29 12:40:06','Corporate Enterprise','2026',NULL,'',NULL,NULL,0,NULL,'completed','',''),
(4,'aero-drone-technologies','Aero Drone Technologies Brand Platform','Aero Drone Tech India','SRV-WEB-02','Web Development','https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80','Created an interactive 3D WebGL drone customizer and defense-grade commercial platform highlighting autonomous surveillance hardware capabilities.',NULL,'{\"meta_title\":\"Aero Drone Technologies Digital Platform | Sunraise Solutions\",\"meta_description\":\"Bespoke 3D interactive web portal designed for advanced aerospace drone manufacturers.\"}',1,'2026-10-29 12:40:06','Corporate Enterprise','2026',NULL,'',NULL,NULL,0,NULL,'completed','',''),
(5,'dmi-hospital-telemetry','DMI Hospital Patient Telemetry & Appointments','DMI Healthcare','SRV-HMS-08','Hospital Management','https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80','Modernized patient appointment queueing, reducing patient wait times by 48 minutes on average, and integrated automated WhatsApp prescription alerts.',NULL,'{\"meta_title\":\"DMI Hospital Healthcare Systems | Sunraise Solutions\",\"meta_description\":\"Patient queue optimization and digital prescription rollout at DMI Hospital.\"}',1,'2026-10-29 12:40:07','Corporate Enterprise','2026',NULL,'',NULL,NULL,0,NULL,'completed','',''),
(6,'usha-prime-hospital-growth','Usha Prime Hospital Search & Local Brand','Usha Prime Super Specialty Hospital','SRV-SEO-01','SEO','https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80','Secured rank #1 for 14 emergency cardiology and orthopedic search queries in Rajahmundry, resulting in a 220% increase in monthly emergency admissions.',NULL,'{\"meta_title\":\"Usha Prime Hospital Local Search Domination | Sunraise\",\"meta_description\":\"Hospital local SEO case study: capturing Google 3-Pack rankings for emergency medical care.\"}',1,'2026-10-29 12:40:07','Corporate Enterprise','2026',NULL,'',NULL,NULL,0,NULL,'completed','','');
/*!40000 ALTER TABLE `projects` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `seo_pages`
--

DROP TABLE IF EXISTS `seo_pages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seo_pages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(255) NOT NULL,
  `page_type` varchar(50) NOT NULL DEFAULT 'core',
  `title` varchar(255) NOT NULL,
  `meta_title` varchar(255) DEFAULT NULL,
  `meta_description` text DEFAULT NULL,
  `focus_keywords` text DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `robots` varchar(50) NOT NULL DEFAULT 'index, follow',
  `og_title` varchar(255) DEFAULT NULL,
  `og_description` text DEFAULT NULL,
  `og_image` varchar(500) DEFAULT NULL,
  `twitter_card` varchar(50) NOT NULL DEFAULT 'summary_large_image',
  `schema_type` varchar(50) NOT NULL DEFAULT 'WebPage',
  `custom_schema_json` longtext DEFAULT NULL,
  `sitemap_priority` decimal(2,1) NOT NULL DEFAULT 0.8,
  `sitemap_changefreq` varchar(20) NOT NULL DEFAULT 'weekly',
  `is_indexed` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`)
) ENGINE=InnoDB AUTO_INCREMENT=1598 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo_pages`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `seo_pages` WRITE;
/*!40000 ALTER TABLE `seo_pages` DISABLE KEYS */;
INSERT INTO `seo_pages` VALUES
(1,'/','core','Home - Corporate Digital Agency & HMS Software','Sunraise Solutions | Corporate Digital Agency & HMS Software Architecture','Elite digital transformation agency in Hyderabad & Rajahmundry. Custom web engineering, mobile apps, hospital management systems (HMS), and zero-regression SAO.','digital agency hyderabad, web development rajahmundry, hospital management software, corporate it solutions, hyderabad, rajahmundry, digital agency, enterprise software, seo services, hospital erp, web development','https://sunraisesolutions.com/','index, follow','Sunraise Solutions | Enterprise Software & Digital Architecture','Scalable cloud infrastructure, NABH-compliant hospital software, and high-impact digital engineering.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','Organization',NULL,1.0,'weekly',1,'2026-10-30 05:21:11','2026-10-31 10:35:54'),
(2,'/about','core','About Us - Engineering Excellence & Leadership','About Sunraise Solutions |  Heritage','Discover the technology architects, healthcare software engineers, and digital strategists powering enterprise clients across Andhra Pradesh and Telangana.','about sunraise solutions, it company hyderabad, software engineers rajahmundry','https://sunraisesolutions.com/about','index, follow','About Sunraise Solutions | Corporate Leadership','Pioneering healthcare digital transformation and bespoke enterprise software systems.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','AboutPage',NULL,0.8,'monthly',1,'2026-10-30 05:21:11','2026-10-31 07:27:57'),
(3,'/services','core','Enterprise Services - Web, Mobile, SEO & HMS','Technology Services & Digital Capabilities | Sunraise Solutions','Explore our full suite of digital engineering capabilities: Custom Web Engineering, iOS/Android Mobile Apps, SEO Growth Engines, and Hospital Management ERPs.','custom software development, react web development, seo services hyderabad, hms software ap','https://sunraisesolutions.com/services','index, follow','End-to-End Enterprise Services | Sunraise Solutions','Architected for velocity, compliance, and exponential business growth.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','CollectionPage',NULL,0.9,'weekly',1,'2026-10-30 05:21:11','2026-10-30 05:21:11'),
(4,'/hms-software','core','Hospital Management Software (HMS) - NABH Ready','NABH-Compliant Hospital Management Software (HMS) | Sunraise Solutions','Enterprise healthcare software architecture: IPD/OPD management, pharmacy inventory, lab reporting, insurance claims, and tele-consultation portals.','hospital management system, hms software hyderabad, clinic management rajahmundry, nabh compliant hospital software','https://sunraisesolutions.com/hms-software','index, follow','Next-Gen Hospital Management Systems (HMS)','Transform clinical workflows, automate patient billing, and maintain complete NABH compliance.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','MedicalBusiness',NULL,0.9,'weekly',1,'2026-10-30 05:21:11','2026-10-30 05:21:11'),
(5,'/portfolio','core','Portfolio & Case Studies - Proven ROI','Client Case Studies & Verified Business Results | Sunraise Solutions','Explore real-world case studies demonstrating over 380% organic traffic surges, sub-second latency web apps, and enterprise healthcare deployments.','software case studies, web development portfolio, client results hyderabad','https://sunraisesolutions.com/portfolio','index, follow','Sunraise Solutions Client Case Studies & Impact','Tangible digital ROI for healthcare networks, political brands, and enterprise corporates.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','CollectionPage',NULL,0.8,'weekly',1,'2026-10-30 05:21:11','2026-10-30 05:21:11'),
(6,'/blog','core','Sunraise Tech Insights & Engineering Articles','Engineering Blog & Digital Insights | Sunraise Solutions','Authoritative technical essays, SEO algorithms, hospital management best practices, and enterprise cloud architecture blueprints.','tech blog hyderabad, software architecture essays, seo guide 2026','https://sunraisesolutions.com/blog','index, follow','Sunraise Technology & Engineering Insights','Actionable knowledge from principal software architects and digital strategists.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','Blog',NULL,0.8,'daily',1,'2026-10-30 05:21:11','2026-10-30 05:21:11'),
(7,'/contact','core','Contact Us - Hyderabad & Rajahmundry Offices','Contact Sunraise Solutions | Hyderabad & Rajahmundry Development Centers','Initiate your digital transformation project. Reach out to our technical consulting team in Hyderabad or Rajahmundry for custom quotes and audits.','contact sunraise solutions, software agency contact hyderabad, it company rajahmundry contact','https://sunraisesolutions.com/contact','index, follow','Connect With Sunraise Solutions Technology Consultants','Fast-track your digital transformation with dedicated enterprise engineers.','https://sunraisesolutions.com/og-cover.jpg','summary_large_image','ContactPage',NULL,0.7,'monthly',1,'2026-10-30 05:21:11','2026-10-30 05:21:11'),
(8,'/blog/why-technical-seo-drives-380-percent-more-qualified-leads','blog','Why Technical SEO Drives 380% More Qualified Leads for Hyderabad Businesses','Technical SEO Lead Gen Guide | Sunraise Solutions','Learn how technical SEO and Core Web Vitals optimization can drive a 380% surge in organic inbound inquiries for your enterprise.','Technical SEO Hyderabad, Organic Lead Generation, Google Core Web Vitals','https://sunraisesolutions.com/blog/why-technical-seo-drives-380-percent-more-qualified-leads','index, follow','Technical SEO Lead Gen Guide | Sunraise Solutions','Learn how technical SEO and Core Web Vitals optimization can drive a 380% surge in organic inbound inquiries for your enterprise.','https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80','summary_large_image','Article',NULL,0.8,'weekly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(9,'/blog/choosing-the-right-hospital-management-software-in-2026','blog','Architecting NABH-Compliant Hospital Management Systems: 2026 Checklist','NABH Hospital Management Software Checklist 2026 | Sunraise','Everything healthcare directors must know when migrating to cloud-native, NABH-compliant hospital software in South India.','NABH HMS checklist, Hospital Management Software Andhra Pradesh, Healthcare EHR','https://sunraisesolutions.com/blog/choosing-the-right-hospital-management-software-in-2026','index, follow','NABH Hospital Management Software Checklist 2026 | Sunraise','Everything healthcare directors must know when migrating to cloud-native, NABH-compliant hospital software in South India.','https://testers.acheva.in/api/uploads/sunraise_1793338150_c8cf4f27.png','summary_large_image','Article',NULL,0.8,'weekly',1,'2026-10-30 05:23:37','2026-10-30 06:01:06'),
(10,'/projects/avanthi-mca-college','project','Avanthi MCA College Admissions & Portal','Avanthi MCA College Admissions & Portal - Avanthi Educational Society Case Study | Sunraise','Read how Sunraise engineered solutions for Avanthi Educational Society (Corporate Enterprise).','avanthi educational society, seo, case study, roi','https://sunraisesolutions.com/projects/avanthi-mca-college','index, follow','Avanthi MCA College Admissions & Portal - Avanthi Educational Society Case Study | Sunraise','Read how Sunraise engineered solutions for Avanthi Educational Society (Corporate Enterprise).',NULL,'summary_large_image','CaseStudy',NULL,0.8,'monthly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(11,'/projects/sri-veera-hanuman-nursery','project','Sri Veera Hanuman Nursery E-Commerce','Sri Veera Hanuman Nursery E-Commerce - Sri Veera Hanuman Nursery Case Study | Sunraise','Read how Sunraise engineered solutions for Sri Veera Hanuman Nursery (Corporate Enterprise).','sri veera hanuman nursery, web development, case study, roi','https://sunraisesolutions.com/projects/sri-veera-hanuman-nursery','index, follow','Sri Veera Hanuman Nursery E-Commerce - Sri Veera Hanuman Nursery Case Study | Sunraise','Read how Sunraise engineered solutions for Sri Veera Hanuman Nursery (Corporate Enterprise).',NULL,'summary_large_image','CaseStudy',NULL,0.8,'monthly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(12,'/projects/union-hospital-digital-ecosystem','project','Union Hospital 360° Healthcare Digital','Union Hospital 360° Healthcare Digital - Union Hospitals Group Case Study | Sunraise','Read how Sunraise engineered solutions for Union Hospitals Group (Corporate Enterprise).','union hospitals group, hospital management, case study, roi','https://sunraisesolutions.com/projects/union-hospital-digital-ecosystem','index, follow','Union Hospital 360° Healthcare Digital - Union Hospitals Group Case Study | Sunraise','Read how Sunraise engineered solutions for Union Hospitals Group (Corporate Enterprise).',NULL,'summary_large_image','CaseStudy',NULL,0.8,'monthly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(13,'/projects/aero-drone-technologies','project','Aero Drone Technologies Brand Platform','Aero Drone Technologies Brand Platform - Aero Drone Tech India Case Study | Sunraise','Read how Sunraise engineered solutions for Aero Drone Tech India (Corporate Enterprise).','aero drone tech india, web development, case study, roi','https://sunraisesolutions.com/projects/aero-drone-technologies','index, follow','Aero Drone Technologies Brand Platform - Aero Drone Tech India Case Study | Sunraise','Read how Sunraise engineered solutions for Aero Drone Tech India (Corporate Enterprise).',NULL,'summary_large_image','CaseStudy',NULL,0.8,'monthly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(14,'/projects/dmi-hospital-telemetry','project','DMI Hospital Patient Telemetry & Appointments','DMI Hospital Patient Telemetry & Appointments - DMI Healthcare Case Study | Sunraise','Read how Sunraise engineered solutions for DMI Healthcare (Corporate Enterprise).','dmi healthcare, hospital management, case study, roi','https://sunraisesolutions.com/projects/dmi-hospital-telemetry','index, follow','DMI Hospital Patient Telemetry & Appointments - DMI Healthcare Case Study | Sunraise','Read how Sunraise engineered solutions for DMI Healthcare (Corporate Enterprise).',NULL,'summary_large_image','CaseStudy',NULL,0.8,'monthly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(15,'/projects/usha-prime-hospital-growth','project','Usha Prime Hospital Search & Local Brand','Usha Prime Hospital Search & Local Brand - Usha Prime Super Specialty Hospital Case Study | Sunraise','Read how Sunraise engineered solutions for Usha Prime Super Specialty Hospital (Corporate Enterprise).','usha prime super specialty hospital, seo, case study, roi','https://sunraisesolutions.com/projects/usha-prime-hospital-growth','index, follow','Usha Prime Hospital Search & Local Brand - Usha Prime Super Specialty Hospital Case Study | Sunraise','Read how Sunraise engineered solutions for Usha Prime Super Specialty Hospital (Corporate Enterprise).',NULL,'summary_large_image','CaseStudy',NULL,0.8,'monthly',1,'2026-10-30 05:23:37','2026-10-30 05:23:37'),
(16,'/services/seo-services-in-hyderabad','service','SEO Services in Hyderabad','Best SEO Services in Hyderabad & AP | Sunraise Solutions','Sunraise Solutions is Hyderabad’s leading digital agency delivering technical SEO, local Google Map pack dominance, and organic lead generation for 18+ years.','SEO Services Hyderabad, Local SEO Hyderabad, SEO Company Rajahmundry, Search Engine Optimization Telangana','https://sunraisesolutions.com/services/seo-services-in-hyderabad','index, follow','Best SEO Services in Hyderabad & AP | Sunraise Solutions','Sunraise Solutions is Hyderabad’s leading digital agency delivering technical SEO, local Google Map pack dominance, and organic lead generation for 18+ years.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(17,'/services/web-development','service','Web Development & Web Apps','Top Web Development Company in Hyderabad | Sunraise Solutions','Professional website design and custom web app development company in Hyderabad and Rajahmundry. 18+ years of delivering high-performance platforms.','Web Development Hyderabad, Website Design Rajahmundry, React Development, Custom Web Apps AP','https://sunraisesolutions.com/services/web-development','index, follow','Top Web Development Company in Hyderabad | Sunraise Solutions','Professional website design and custom web app development company in Hyderabad and Rajahmundry. 18+ years of delivering high-performance platforms.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(18,'/services/mobile-app-development','service','Mobile App Development','Mobile App Development Services Hyderabad | Sunraise Solutions','Leading mobile application developers in Hyderabad and Andhra Pradesh crafting iOS and Android mobile software for startups and enterprises.','Mobile App Development Hyderabad, iOS App Developers AP, Flutter Developers Hyderabad, Android App Company','https://sunraisesolutions.com/services/mobile-app-development','index, follow','Mobile App Development Services Hyderabad | Sunraise Solutions','Leading mobile application developers in Hyderabad and Andhra Pradesh crafting iOS and Android mobile software for startups and enterprises.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(19,'/services/digital-marketing','service','Digital Marketing & Performance Ads','Top Digital Marketing Agency in Hyderabad | Sunraise Solutions','Drive revenue with Google Ads, Meta campaigns, and strategic social media marketing from Sunraise Solutions Hyderabad.','Digital Marketing Agency Hyderabad, Performance Marketing AP, Google Ads Expert Hyderabad','https://sunraisesolutions.com/services/digital-marketing','index, follow','Top Digital Marketing Agency in Hyderabad | Sunraise Solutions','Drive revenue with Google Ads, Meta campaigns, and strategic social media marketing from Sunraise Solutions Hyderabad.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(20,'/services/custom-software-development','service','Custom Software Development','Custom Software Development Company Hyderabad | Sunraise Solutions','Enterprise-grade custom software, CRM, and ERP development services tailored for mid-market and enterprise businesses across Telangana & AP.','Custom Software Development Hyderabad, ERP Software AP, Enterprise CRM Solutions','https://sunraisesolutions.com/services/custom-software-development','index, follow','Custom Software Development Company Hyderabad | Sunraise Solutions','Enterprise-grade custom software, CRM, and ERP development services tailored for mid-market and enterprise businesses across Telangana & AP.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(21,'/services/political-branding','service','Political Branding & Campaign PR','Political Branding & Digital Campaign Strategy AP & Telangana | Sunraise','Premier political war-room consulting, digital voter sentiment analytics, and election campaign branding in Andhra Pradesh and Hyderabad.','Political Branding Hyderabad, Election Campaign AP, Political PR Agency Hyderabad, Voter Analytics','https://sunraisesolutions.com/services/political-branding','index, follow','Political Branding & Digital Campaign Strategy AP & Telangana | Sunraise','Premier political war-room consulting, digital voter sentiment analytics, and election campaign branding in Andhra Pradesh and Hyderabad.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(22,'/services/cgi-advertising','service','CGI Advertising & 3D Visuals','CGI Advertising & 3D Visual Effects Hyderabad | Sunraise Solutions','High-end CGI advertising, 3D product rendering, and anamorphic VFX production in Hyderabad for viral brand marketing.','CGI Advertising Hyderabad, 3D VFX Agency AP, 3D Product Animation Studio','https://sunraisesolutions.com/services/cgi-advertising','index, follow','CGI Advertising & 3D Visual Effects Hyderabad | Sunraise Solutions','High-end CGI advertising, 3D product rendering, and anamorphic VFX production in Hyderabad for viral brand marketing.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(23,'/services/hospital-management-software','service','Hospital Management Software (HMS)','Hospital Management Software (HMS) Hyderabad & AP | Sunraise Solutions','Comprehensive Hospital Management Software (HMS) covering OPD, IPD, EHR, NABH compliance, Pharmacy, and Diagnostic Lab automation.','Hospital Management Software Hyderabad, HMS Software AP, Clinic Management Software, Healthcare EHR Software','https://sunraisesolutions.com/services/hospital-management-software','index, follow','Hospital Management Software (HMS) Hyderabad & AP | Sunraise Solutions','Comprehensive Hospital Management Software (HMS) covering OPD, IPD, EHR, NABH compliance, Pharmacy, and Diagnostic Lab automation.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 05:24:31','2026-10-30 05:24:31'),
(594,'/services/best-seo-agency-in-hyderabad','service','SEO','Best SEO Agency  in Hyderabad | Sunraise Solutions','Looking for the Best SEO Agency in Hyderabad? Sunraise Solutions boosts Google rankings, drives organic traffic, generates leads, and grows your business.','SEO Services Hyderabad, Local SEO Hyderabad, SEO Company Rajahmundry, Search Engine Optimization Telangana','https://sunraisesolutions.com/services/seo-services-in-hyderabad','index, follow','Best SEO Agency  in Hyderabad | Sunraise Solutions','Looking for the Best SEO Agency in Hyderabad? Sunraise Solutions boosts Google rankings, drives organic traffic, generates leads, and grows your business.','','summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-30 10:14:24','2026-10-31 07:26:36'),
(611,'/services/best-web-design-company-in-hyderabad','service','Website Design & Development ','Best Web Design Company in Hyderabad | Top Web Development','Best web design company in Hyderabad offering top web development. Fast, responsive, SEO-ready websites that grow your business. Get a free quote.','Web Development Hyderabad, Website Design Rajahmundry, React Development, Custom Web Apps AP','https://sunraisesolutions.com/services/web-development','index, follow','Best Web Design Company in Hyderabad | Top Web Development','Best web design company in Hyderabad offering top web development. Fast, responsive, SEO-ready websites that grow your business. Get a free quote.',NULL,'summary_large_image','Service',NULL,0.9,'weekly',1,'2026-10-31 04:09:20','2026-10-31 04:09:20'),
(843,'/p/home','custom','Home Page','Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry','Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing.','SEO Services Hyderabad, Web Development Rajahmundry','https://testers.acheva.in/','index, follow','Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry','Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing.',NULL,'summary_large_image','WebPage',NULL,0.8,'weekly',1,'2026-10-31 05:49:16','2026-10-31 05:49:16'),
(844,'/p/about','custom','About Us','About Us | Sunraise Solutions - 18+ Years Corporate Legacy','Learn about Sunraise Solutions, our executive leadership, 18+ years of digital transformation, and our dual presence.','Sunraise Solutions About','https://sunraisesolutions.com/p/about','index, follow','About Us | Sunraise Solutions - 18+ Years Corporate Legacy','Learn about Sunraise Solutions, our executive leadership, 18+ years of digital transformation, and our dual presence.',NULL,'summary_large_image','WebPage',NULL,0.8,'weekly',1,'2026-10-31 05:49:16','2026-10-31 05:49:16'),
(845,'/p/services','custom','Services Hub','Enterprise Services Directory | Sunraise Solutions','Explore 8 corporate specializations: SEO, Web Development, Apps, Performance Marketing, Cloud ERP, and Hospital SaaS.','Corporate IT Services Hyderabad','https://sunraisesolutions.com/p/services','index, follow','Enterprise Services Directory | Sunraise Solutions','Explore 8 corporate specializations: SEO, Web Development, Apps, Performance Marketing, Cloud ERP, and Hospital SaaS.',NULL,'summary_large_image','WebPage',NULL,0.8,'weekly',1,'2026-10-31 05:49:16','2026-10-31 05:49:16'),
(846,'/p/projects','custom','Completed Projects','Completed Projects & Portfolio | Sunraise Solutions','Review real deployed client architectures, hospital software systems, and high-scale eCommerce platforms.','Completed Web Projects','https://sunraisesolutions.com/p/projects','index, follow','Completed Projects & Portfolio | Sunraise Solutions','Review real deployed client architectures, hospital software systems, and high-scale eCommerce platforms.',NULL,'summary_large_image','WebPage',NULL,0.8,'weekly',1,'2026-10-31 05:49:16','2026-10-31 05:49:16'),
(847,'/p/blog','custom','Blog & Technical Articles','Blog & Digital Insights | Sunraise Solutions','Latest industry insights on search engine optimization, full-stack web architectures, and growth strategy.','Digital Marketing Blog','https://sunraisesolutions.com/p/blog','index, follow','Blog & Digital Insights | Sunraise Solutions','Latest industry insights on search engine optimization, full-stack web architectures, and growth strategy.',NULL,'summary_large_image','WebPage',NULL,0.8,'weekly',1,'2026-10-31 05:49:16','2026-10-31 05:49:16'),
(848,'/p/contact','custom','Contact Us','Contact Sunraise Solutions | Hyderabad HQ & Rajahmundry Regional Hub','Get in touch for a bespoke digital marketing proposal, software consultation, or enterprise technical audit.','Contact Sunraise Solutions','https://sunraisesolutions.com/p/contact','index, follow','Contact Sunraise Solutions | Hyderabad HQ & Rajahmundry Regional Hub','Get in touch for a bespoke digital marketing proposal, software consultation, or enterprise technical audit.',NULL,'summary_large_image','WebPage',NULL,0.8,'weekly',1,'2026-10-31 05:49:16','2026-10-31 05:49:16');
/*!40000 ALTER TABLE `seo_pages` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `seo_redirects`
--

DROP TABLE IF EXISTS `seo_redirects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seo_redirects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `old_path` varchar(255) NOT NULL,
  `new_path` varchar(255) NOT NULL,
  `status_code` int(11) DEFAULT 301,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `old_path` (`old_path`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seo_redirects`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `seo_redirects` WRITE;
/*!40000 ALTER TABLE `seo_redirects` DISABLE KEYS */;
INSERT INTO `seo_redirects` VALUES
(1,'/services/seo-services-in-hyderabad','/services/best-seo-agency-in-hyderabad',301,'2026-10-30 10:06:29'),
(2,'/services/web-development','/services/best-web-design-company-in-hyderabad',301,'2026-10-30 11:29:12');
/*!40000 ALTER TABLE `seo_redirects` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `services`
--

DROP TABLE IF EXISTS `services`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `services` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `service_code` varchar(32) NOT NULL,
  `slug` varchar(150) NOT NULL,
  `title` varchar(200) NOT NULL,
  `short_description` text DEFAULT NULL,
  `icon_name` varchar(100) DEFAULT NULL,
  `thumbnail_url` varchar(500) DEFAULT NULL,
  `hero_config` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`hero_config`)),
  `page_blocks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`page_blocks`)),
  `seo_meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`seo_meta`)),
  `is_published` tinyint(1) DEFAULT 1,
  `display_order` int(11) DEFAULT 0,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `service_code` (`service_code`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `services`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `services` WRITE;
/*!40000 ALTER TABLE `services` DISABLE KEYS */;
INSERT INTO `services` VALUES
(1,'SRV-SEO-01','best-seo-agency-in-hyderabad','SEO','Boost your website’s visibility with professional SEO services designed to improve Google rankings, increase organic traffic, and generate more leads. Our effective SEO strategies include keyword optimization, on-page SEO, technical SEO, and quality content optimization to help your business grow online and reach the right audience.','Search','https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"HYDERABAD #1 SEO AGENCY\",\"title\":\"Best SEO Agency in Hyderabad for Startups and Growing Businesses\",\"highlight_text\":\"\",\"subtitle\":\"Stop losing leads to competitors. We build high-converting search visibility through deep technical audits, local map-pack dominance, and white-hat link velocity.\",\"primary_cta\":\"Get Free SEO Audit\",\"secondary_cta\":\"View SEO Case Studies\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Organic Traffic Surge\",\"val\":\"+380%\"},{\"label\":\"Keywords Page 1\",\"val\":\"1,450+\"},{\"label\":\"Retention Rate\",\"val\":\"98%\"}]}','[{\"id\":\"blk-seo-1\",\"type\":\"visual\",\"component_name\":\"FeatureGrid\",\"sort_order\":1,\"props\":{\"title\":\"Complete 360\\u00b0 SEO Capabilities\",\"description\":\"Engineered for exponential ROI in competitive Andhra Pradesh and Telangana markets.\",\"features\":[\"Technical Core Web Vitals Optimization\",\"Google Business Profile 3-Pack Rank\",\"Laser-targeted Telugu & English Keyword Clustering\",\"High-DA White-Hat PR Backlink Outreach\",\"Conversion Rate Optimization (CRO)\"]}},{\"id\":\"blk-seo-2\",\"type\":\"visual\",\"component_name\":\"ProcessTimeline\",\"sort_order\":2,\"props\":{\"title\":\"Our 4-Stage Search Domination Protocol\",\"steps\":[{\"step\":\"01\",\"title\":\"Algorithmic Audit & Competitor Gap Analysis\",\"desc\":\"In-depth crawler analysis identifying crawl budget issues, index bloat, and keyword cannibalization.\"},{\"step\":\"02\",\"title\":\"Information Architecture & On-Page Engineering\",\"desc\":\"Schema markup injection, semantic heading alignment, and Core Web Vitals speed optimization.\"},{\"step\":\"03\",\"title\":\"Local Map Pack & High-Authority PR Link Building\",\"desc\":\"Hyper-local citation synchronization across Hyderabad & AP alongside top-tier digital PR links.\"},{\"step\":\"04\",\"title\":\"Conversion Tracking & Revenue Analytics\",\"desc\":\"Bi-weekly keyword tracking, GA4 funnel attribution, and continuous CRO iteration.\"}]}},{\"id\":\"blk-seo-3\",\"type\":\"html\",\"component_name\":\"RawHTML\",\"sort_order\":3,\"html_content\":\"<div class=\\\"p-8 rounded-2xl bg-gradient-to-r from-orange-500\\/10 to-amber-500\\/10 border border-orange-200 text-center\\\"><h3 class=\\\"text-2xl font-bold text-gray-900 mb-2\\\">Want guaranteed Google Top 3 rankings for your business?<\\/h3><p class=\\\"text-gray-600 mb-6\\\">Claim your 100% free comprehensive technical and competitor audit report today.<\\/p><a href=\\\"#proposal-form\\\" class=\\\"inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-lg hover:shadow-orange-500\\/25 transition\\\">Claim Free Audit Report &rarr;<\\/a><\\/div>\",\"css_content\":\"\"},{\"id\":\"blk-1793346035274-pu2\",\"type\":\"visual\",\"category\":\"layout\",\"component_name\":\"Container\",\"sort_order\":4,\"props\":{\"badge\":\"ENTERPRISE ARCHITECTURE\",\"title\":\"Flexible Content Section\",\"content\":\"Place your tailored messaging, badges, and announcements inside this responsive container.\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793346055147-8xs\",\"type\":\"visual\",\"category\":\"layout\",\"component_name\":\"TwoColumn\",\"sort_order\":5,\"props\":{\"title\":\"Strategic Architecture & Execution\",\"left_title\":\"Strategic Overview\",\"left_content\":\"Comprehensive architectural foundation optimized for high search visibility and seamless conversion pipelines.\",\"right_title\":\"Enterprise ROI\",\"right_content\":\"Deploy measurable marketing funnels engineered to convert visitors into high-value corporate clients.\",\"left_image\":\"blob:http:\\/\\/localhost:5173\\/76940754-dd86-4cbc-82e2-96a5f931a3e4\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-html-1793336150507\",\"type\":\"html\",\"component_name\":\"RawHTML\",\"sort_order\":6,\"html_content\":\"<div class=\\\"p-8 rounded-2xl bg-gradient-to-r from-orange-500\\/10 to-amber-500\\/10 border border-orange-200 text-center\\\">\\n  <h2 class=\\\"text-2xl font-bold text-gray-900 mb-2\\\">Custom Conversion Widget<\\/h2>\\n  <p class=\\\"text-gray-600 mb-4\\\">Craft bespoke offers or interactive CTAs directly in this live editor.<\\/p>\\n  <button class=\\\"px-6 py-2.5 rounded-full bg-orange-600 text-white font-semibold shadow hover:bg-orange-700\\\">Click Here &rarr;<\\/button>\\n<\\/div>\",\"css_content\":\"\"},{\"id\":\"blk-1793345982093-mys\",\"type\":\"visual\",\"category\":\"layout\",\"component_name\":\"TwoColumn\",\"sort_order\":7,\"props\":{\"title\":\"Strategic Architecture & Execution\",\"left_title\":\"Strategic Overview\",\"left_content\":\"Comprehensive architectural foundation optimized for high search visibility and seamless conversion pipelines.\",\"right_title\":\"Enterprise ROI\",\"right_content\":\"Deploy measurable marketing funnels engineered to convert visitors into high-value corporate clients.\",\"left_image\":\"\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793346009278-vs0\",\"type\":\"visual\",\"category\":\"layout\",\"component_name\":\"ThreeColumn\",\"sort_order\":8,\"props\":{\"title\":\"Strategic Capabilities\",\"columns\":[{\"title\":\"Technical Dominance\",\"desc\":\"Sub-second page speeds with Core Web Vitals compliance.\",\"icon\":\"check\",\"bg\":\"gray\"},{\"title\":\"Search Authority\",\"desc\":\"White-hat PR links and local entity Knowledge Graph signals.\"},{\"title\":\"Conversion Funnels\",\"desc\":\"Optimized booking, inquiry, and WhatsApp lead capture engines.\"}]},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}}]','{\"meta_title\":\"Best SEO Agency  in Hyderabad | SS\",\"meta_description\":\"Looking for the Best SEO Agency in Hyderabad? Sunraise Solutions boosts Google rankings, drives organic traffic, generates leads, and grows your business.\",\"keywords\":\"SEO Services Hyderabad, Local SEO Hyderabad, SEO Company Rajahmundry, Search Engine Optimization Telangana\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/seo-services-in-hyderabad\",\"og_title\":\"Best SEO Agency  in Hyderabad | Sunraise Solutions\",\"og_description\":\"Looking for the Best SEO Agency in Hyderabad? Sunraise Solutions boosts Google rankings, drives organic traffic, generates leads, and grows your business.\",\"og_image\":\"\"}',1,1,'2026-10-29 12:40:05','2026-10-31 07:34:06'),
(2,'SRV-WEB-02','best-web-design-company-in-hyderabad','Website Design & Development ','We design and build fast, mobile-friendly websites that look great and turn visitors into customers. From business sites to custom web applications, we create digital experiences that grow with your brand.','Globe','https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"HIGH-PERFORMANCE ARCHITECTURE\",\"title\":\"Responsive Websites Built for Growth by the\",\"highlight_text\":\"Best Web Design Company in Hyderabad\",\"subtitle\":\"We design and engineer bespoke web experiences that elevate your brand authority and convert visitors into loyal clients.\",\"primary_cta\":\"Start Web Project\",\"secondary_cta\":\"Explore Tech Stack\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Lighthouse Score\",\"val\":\"99\\/100\"},{\"label\":\"Delivered Portals\",\"val\":\"320+\"},{\"label\":\"Uptime Guarantee\",\"val\":\"99.9%\"}]}','[{\"id\":\"blk-1793360053755-nlt\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Heading\",\"sort_order\":1,\"props\":{\"level\":\"h2\",\"text\":\"Engage Your Audience with Authority\",\"alignment\":\"left\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793360082745-sl0\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Heading\",\"sort_order\":2,\"props\":{\"level\":\"h1\",\"text\":\"Engage Your Audience with Authority\",\"alignment\":\"left\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793360094777-pum\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Paragraph\",\"sort_order\":3,\"props\":{\"text\":\"Engineered for exponential ROI in competitive regional and national markets with data-driven precision.\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793360095986-g8h\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Heading\",\"sort_order\":4,\"props\":{\"level\":\"h2\",\"text\":\"Engage Your Audience with Authority\",\"alignment\":\"left\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}}]','{\"meta_title\":\"Best Web Design Company in Hyderabad | Top Web Development\",\"meta_description\":\"Best web design company in Hyderabad offering top web development. Fast, responsive, SEO-ready websites that grow your business. Get a free quote.\",\"keywords\":\"Web Development Hyderabad, Website Design Rajahmundry, React Development, Custom Web Apps AP\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/web-development\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,2,'2026-10-29 12:40:05','2026-10-30 11:43:31'),
(3,'SRV-MOB-03','mobile-app-development','Mobile App Development','Native iOS, Android, and Flutter applications featuring intuitive fluid UX, real-time push engines, and rock-solid cloud integrations.','Smartphone','https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"MOBILE INNOVATION\",\"title\":\"Scalable iOS & Android Apps Built for\",\"highlight_text\":\"Maximum Engagement\",\"subtitle\":\"Bring your product vision to the fingertips of millions with ultra-responsive native and cross-platform mobile apps.\",\"primary_cta\":\"Request App Scope\",\"secondary_cta\":\"View App Demos\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"App Store Rating\",\"val\":\"4.9 \\u2605\"},{\"label\":\"Total Downloads\",\"val\":\"1.2M+\"},{\"label\":\"Crash-Free Rate\",\"val\":\"99.9%\"}]}','[]','{\"meta_title\":\"Mobile App Development Services Hyderabad | Sunraise Solutions\",\"meta_description\":\"Leading mobile application developers in Hyderabad and Andhra Pradesh crafting iOS and Android mobile software for startups and enterprises.\",\"keywords\":\"Mobile App Development Hyderabad, iOS App Developers AP, Flutter Developers Hyderabad, Android App Company\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/mobile-app-development\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,3,'2026-10-29 12:40:05','2026-10-29 12:40:05'),
(4,'SRV-MKT-04','digital-marketing','Digital Marketing & Performance Ads','Full-funnel Meta & Google Ads campaigns, social media management, brand positioning, and aggressive revenue-generating conversion pipelines.','Megaphone','https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"REVENUE GENERATION\",\"title\":\"Hyper-Targeted Performance Ads &\",\"highlight_text\":\"Digital Growth Engines\",\"subtitle\":\"Stop burning ad budget. We optimize Meta, Google, and LinkedIn ad funnels to deliver verifiable qualified leads and high ROAS.\",\"primary_cta\":\"Accelerate My ROAS\",\"secondary_cta\":\"See Ad Results\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Average ROAS\",\"val\":\"4.6x\"},{\"label\":\"Leads Generated\",\"val\":\"85,000+\"},{\"label\":\"Ad Spend Managed\",\"val\":\"\\u20b912Cr+\"}]}','[{\"id\":\"blk-1793436927700-rp8\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Heading\",\"sort_order\":1,\"props\":{\"level\":\"h2\",\"text\":\"Engage Your Audience with Authority\",\"alignment\":\"left\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793436932170-3cf\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Paragraph\",\"sort_order\":2,\"props\":{\"text\":\"Engineered for exponential ROI in competitive regional and national markets with data-driven precision.\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793436935737-us4\",\"type\":\"visual\",\"category\":\"basic\",\"component_name\":\"Button\",\"sort_order\":3,\"props\":{\"text\":\"Claim Free Strategy Session\",\"url\":\"\\/contact\",\"variant\":\"primary\",\"alignment\":\"center\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"16\",\"paddingX\":\"16\"}},{\"id\":\"blk-1793437268178-0no\",\"type\":\"visual\",\"category\":\"layout\",\"component_name\":\"SplitImageText\",\"sort_order\":4,\"props\":{\"badge\":\"STRATEGIC EXCELLENCE\",\"title\":\"Built for Speed, Scalability, and Search Domination\",\"text\":\"We merge rigorous engineering standards with cutting-edge marketing funnels to deliver verifiable commercial ROI.\",\"image\":\"https:\\/\\/images.unsplash.com\\/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80\",\"bullets\":[\"Enterprise Performance Guarantee\",\"Zero Downtime Deployment\",\"Dedicated Senior Architect Lead\"],\"bg\":\"dark\",\"cardRadius\":\"20\"},\"styles\":{\"align\":\"left\",\"paddingY\":\"48\",\"paddingX\":\"16\",\"backgroundImage\":\"https:\\/\\/testers.acheva.in\\/api\\/uploads\\/sunraise_1793436992_bbdf5279.png\",\"backgroundOverlay\":\"#000000\",\"backgroundOverlayOpacity\":50,\"backgroundPosition\":\"top\",\"backgroundSize\":\"contain\",\"backgroundColor\":\"#fffbf5\",\"responsiveHide\":{\"mobile\":false}}}]','{\"meta_title\":\"Top Digital Marketing Agency in Hyderabad | Sunraise Solutions\",\"meta_description\":\"Drive revenue with Google Ads, Meta campaigns, and strategic social media marketing from Sunraise Solutions Hyderabad.\",\"keywords\":\"Digital Marketing Agency Hyderabad, Performance Marketing AP, Google Ads Expert Hyderabad\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/digital-marketing\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,4,'2026-10-29 12:40:05','2026-10-31 09:02:03'),
(5,'SRV-SFT-05','custom-software-development','Custom Software Development','Tailored ERP, CRM, and cloud-native software ecosystems designed to streamline operations and automate mission-critical organizational workflows.','Code2','https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"ENTERPRISE ARCHITECTURE\",\"title\":\"Purpose-Built Software Platforms for\",\"highlight_text\":\"Operational Mastery\",\"subtitle\":\"Eliminate manual bottlenecks with custom enterprise software, workflow automation, and multi-tenant cloud ecosystems.\",\"primary_cta\":\"Consult Our Engineers\",\"secondary_cta\":\"Architecture Review\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Operational Efficiency\",\"val\":\"+70%\"},{\"label\":\"Custom ERPs Shipped\",\"val\":\"85+\"},{\"label\":\"Zero-Downtime Migration\",\"val\":\"100%\"}]}','[]','{\"meta_title\":\"Custom Software Development Company Hyderabad | Sunraise Solutions\",\"meta_description\":\"Enterprise-grade custom software, CRM, and ERP development services tailored for mid-market and enterprise businesses across Telangana & AP.\",\"keywords\":\"Custom Software Development Hyderabad, ERP Software AP, Enterprise CRM Solutions\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/custom-software-development\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,5,'2026-10-29 12:40:05','2026-10-29 12:40:05'),
(6,'SRV-POL-06','political-branding','Political Branding & Campaign PR','Groundbreaking 360° constituency analytics, digital sentiment monitoring, narrative strategy, and high-impact voter outreach ecosystems.','Vote','https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"STRATEGIC INFLUENCE\",\"title\":\"Data-Driven Constituency War Rooms &\",\"highlight_text\":\"Political Branding\",\"subtitle\":\"Comprehensive digital voter sentiment analytics, micro-targeted grassroots outreach, and high-impact media production across AP & Telangana.\",\"primary_cta\":\"Confidential Briefing\",\"secondary_cta\":\"Campaign Footprint\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Elections Strategized\",\"val\":\"42+\"},{\"label\":\"Voter Reach\",\"val\":\"15M+\"},{\"label\":\"Field War Rooms\",\"val\":\"28\"}]}','[]','{\"meta_title\":\"Political Branding & Digital Campaign Strategy AP & Telangana | Sunraise\",\"meta_description\":\"Premier political war-room consulting, digital voter sentiment analytics, and election campaign branding in Andhra Pradesh and Hyderabad.\",\"keywords\":\"Political Branding Hyderabad, Election Campaign AP, Political PR Agency Hyderabad, Voter Analytics\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/political-branding\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,6,'2026-10-29 12:40:05','2026-10-29 12:40:05'),
(7,'SRV-CGI-07','cgi-advertising','CGI Advertising & 3D Visuals','Hyper-realistic CGI product animation, immersive 3D billboard effects, and cinematic visual spectacles that command instant virality.','Film','https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"CINEMATIC IMPACT\",\"title\":\"Hyper-Realistic 3D & Viral CGI\",\"highlight_text\":\"Advertising Production\",\"subtitle\":\"Stop thumb-scrolling with cinema-grade 3D product animations, anamorphic illusion billboards, and CGI social teasers.\",\"primary_cta\":\"Commission CGI Project\",\"secondary_cta\":\"Watch Showreel\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Viral Video Views\",\"val\":\"45M+\"},{\"label\":\"CGI Ads Rendered\",\"val\":\"120+\"},{\"label\":\"Average Engagement\",\"val\":\"8.4x\"}]}','[]','{\"meta_title\":\"CGI Advertising & 3D Visual Effects Hyderabad | Sunraise Solutions\",\"meta_description\":\"High-end CGI advertising, 3D product rendering, and anamorphic VFX production in Hyderabad for viral brand marketing.\",\"keywords\":\"CGI Advertising Hyderabad, 3D VFX Agency AP, 3D Product Animation Studio\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/cgi-advertising\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,7,'2026-10-29 12:40:06','2026-10-29 12:40:06'),
(8,'SRV-HMS-08','hospital-management-software','Hospital Management Software (HMS)','HIPAA-compliant, unified healthcare ecosystems bridging OPD, IPD, EHR, Pharmacy, Radiology, Lab automation, and NABH-ready telemetry.','Activity','https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80','{\"badge\":\"HEALTHCARE EXCELLENCE\",\"title\":\"NABH-Compliant, Intelligent Hospital\",\"highlight_text\":\"Management Software\",\"subtitle\":\"A unified clinical, billing, and patient telemetry operating system trusted by multi-specialty hospitals and healthcare groups across AP & Telangana.\",\"primary_cta\":\"Book Live HMS Demo\",\"secondary_cta\":\"Download HMS Specs\",\"hero_image\":\"https:\\/\\/images.unsplash.com\\/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80\",\"stats\":[{\"label\":\"Hospitals Operating\",\"val\":\"35+\"},{\"label\":\"Patient Records\",\"val\":\"1.8M+\"},{\"label\":\"Billing Audit Time\",\"val\":\"-65%\"}]}','[]','{\"meta_title\":\"Hospital Management Software (HMS) Hyderabad & AP | Sunraise Solutions\",\"meta_description\":\"Comprehensive Hospital Management Software (HMS) covering OPD, IPD, EHR, NABH compliance, Pharmacy, and Diagnostic Lab automation.\",\"keywords\":\"Hospital Management Software Hyderabad, HMS Software AP, Clinic Management Software, Healthcare EHR Software\",\"canonical_url\":\"https:\\/\\/sunraisesolutions.com\\/services\\/hospital-management-software\",\"og_image\":\"https:\\/\\/images.unsplash.com\\/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80\",\"lock_seo\":true}',1,8,'2026-10-29 12:40:06','2026-10-29 12:40:06');
/*!40000 ALTER TABLE `services` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;

--
-- Table structure for table `testimonials`
--

DROP TABLE IF EXISTS `testimonials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `testimonials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `client_name` varchar(150) NOT NULL,
  `client_role` varchar(150) DEFAULT NULL,
  `avatar_url` varchar(500) DEFAULT NULL,
  `rating` decimal(2,1) DEFAULT 5.0,
  `review_text` text NOT NULL,
  `service_code` varchar(32) DEFAULT NULL,
  `is_featured` tinyint(1) DEFAULT 1,
  `created_at` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `service_code` (`service_code`),
  CONSTRAINT `testimonials_ibfk_1` FOREIGN KEY (`service_code`) REFERENCES `services` (`service_code`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `testimonials`
--

SET @OLD_AUTOCOMMIT=@@AUTOCOMMIT, @@AUTOCOMMIT=0;
LOCK TABLES `testimonials` WRITE;
/*!40000 ALTER TABLE `testimonials` DISABLE KEYS */;
INSERT INTO `testimonials` VALUES
(1,'MAKSIM Infotech','Director of Technology Operations','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',5.0,'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance. Their ability to deliver high-performance applications on strict timelines is unmatched in Hyderabad.','SRV-SFT-05',1,'2026-10-29 12:40:07'),
(2,'Hotel Jaya Residency','General Manager, Hospitality Division','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',5.0,'Our direct room bookings multiplied by 3.4x within five months of launching the new responsive portal and local SEO campaigns. The Sunraise team feels like an in-house powerhouse.','SRV-SEO-01',1,'2026-10-29 12:40:07'),
(3,'MVR Agro Solutions','Managing Partner','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',5.0,'From brand strategy and Telugu-English multi-lingual digital ad campaigns to supply chain software, Sunraise delivered extraordinary commercial value for our brand across AP.','SRV-MKT-04',1,'2026-10-29 12:40:07'),
(4,'Dr. Ramesh','Chief Medical Officer, DMI Hospital','https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',5.0,'The Hospital Management System designed by Sunraise revolutionized our OPD and billing departments. Patient paperwork reduced to zero, and audits are now 100% effortless.','SRV-HMS-08',1,'2026-10-29 12:40:07'),
(5,'Dr. Usha','Managing Director, Usha Prime Hospital','https://testers.acheva.in/api/uploads/sunraise_1793442921_b9615656.jpg',5.0,'Sunraise Solutions is the undisputed leader for healthcare digital growth in Andhra Pradesh. Their search engine optimization work established us as the premier cardiology hospital in our region.','SRV-SEO-01',1,'2026-10-29 12:40:07');
/*!40000 ALTER TABLE `testimonials` ENABLE KEYS */;
UNLOCK TABLES;
COMMIT;
SET AUTOCOMMIT=@OLD_AUTOCOMMIT;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2026-11-03 10:49:52
