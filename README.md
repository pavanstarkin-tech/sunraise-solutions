# Sunraise Solutions — Corporate Digital Agency & Custom Visual CMS

A high-performance, enterprise-grade Corporate Digital Agency Platform & Custom Visual CMS engineered for **Sunraise Solutions** (operating across Hyderabad HQ & Rajahmundry Regional Hub).

---

## 🌐 Live Deployed URLs

The platform is deployed and fully operational on Hostinger Cloud Infrastructure:

| Portal / Page | Live Production URL | Description |
| :--- | :--- | :--- |
| **Corporate Homepage** | [https://testers.acheva.in/](https://testers.acheva.in/) | Primary high-converting corporate agency portal |
| **Admin Login** | [https://testers.acheva.in/admin/login](https://testers.acheva.in/admin/login) | Firebase authenticated administrative entry |
| **Visual Page Builder Workspace** | [https://testers.acheva.in/admin/builder/workspace](https://testers.acheva.in/admin/builder/workspace) | Full-screen drag-and-drop Elementor-style builder |
| **Services Management** | [https://testers.acheva.in/admin/services](https://testers.acheva.in/admin/services) | Manage corporate capabilities & service codes |
| **Testimonials CMS** | [https://testers.acheva.in/admin/testimonials](https://testers.acheva.in/admin/testimonials) | Client reviews with photo upload & service filters |
| **Navigation Menu Manager** | [https://testers.acheva.in/admin/navigation](https://testers.acheva.in/admin/navigation) | Multi-tier submenu tree & header links editor |
| **Completed Projects / Portfolio** | [https://testers.acheva.in/projects](https://testers.acheva.in/projects) | Verified results, tech tag chips & case metrics |
| **Services Hub** | [https://testers.acheva.in/services](https://testers.acheva.in/services) | Comprehensive digital capability directory |
| **Canonical Service Page** | [https://testers.acheva.in/services/digital-marketing](https://testers.acheva.in/services/digital-marketing) | Dynamic hero, custom visual blocks & testimonials |
| **Legacy URL Fallback Route** | [https://testers.acheva.in/p/digital_marketing](https://testers.acheva.in/p/digital_marketing) | Slug-normalized (`_` to `-`) zero-404 service fallback |
| **Contact & Strategy Inquiries** | [https://testers.acheva.in/contact](https://testers.acheva.in/contact) | Lead capture with automatic database storage |
| **REST API Base** | [https://testers.acheva.in/api/services.php](https://testers.acheva.in/api/services.php) | Hostinger PHP REST API endpoint |

---

## 🚀 Key Features

### 1. Elementor-Style Visual Page Builder
- **True Drag & Drop Interface:** Powered by `@dnd-kit` with reordering, cloning, and quick deletion.
- **Responsive Viewport Switcher:** Live desktop (full), tablet (768px), and mobile (375px touch emulation) modes.
- **Section Background Image Uploads:** Custom background images with cover, contain, opacity, and contrast overlay styling.
- **Integrated Image & Media Uploader:** Direct file upload via `api/upload.php` to Hostinger storage and central media catalog.

### 2. Rich Component Palette
- **Image Slider:** Multi-slide carousel with customizable height, dark/gradient overlays, autoplay timer, next/prev arrows, and indicator dots.
- **Card Slider:** Responsive multi-card carousel (1 on mobile, 2 on tablet, 3 on desktop) for showcasing services and features.
- **Text & Quote Slider:** High-impact editorial announcement ticker and client testimonial slider with metrics.
- **Markup Tags & Technology Chips:** Technology stack badges with 4 styling presets (Orange Gradient, Dark Tech Enterprise, Outlined Pill, Minimal Gray).
- **Custom HTML & Scoped CSS:** Code injection block with pre-built one-click templates (Conversion CTA, 3-Stat Ribbon) and isolated styles.
- **Testimonials with Photo Upload:** Client avatar upload stored in the MySQL database and rendered across all public pages.

### 3. SEO-First Architecture & Zero Ranking Regressions
- Automated heading hierarchy sanitizer (enforces H1 uniqueness by converting nested H1s to H2s).
- Dynamic JSON-LD Schema.org structured data (LocalBusiness, Organization, Service, FAQPage, BreadcrumbList).
- Automated 301 SEO redirects when modifying page or service slugs.
- Dynamic XML sitemap generator (`/api/sitemap.php`).

---

## 📂 Project Architecture

```
sunrise/
├── api/                             # Hostinger PHP REST API Endpoints
│   ├── config.php                   # MySQL connection, CORS headers & preflight
│   ├── services.php                 # Services CRUD & block serialization
│   ├── projects.php                 # Projects / Case Studies CRUD with tech tags
│   ├── testimonials.php             # Client reviews CRUD with photo avatar storage
│   ├── pages.php                    # Custom landing pages and core pages storage
│   ├── navigation.php               # Multi-level menu hierarchy storage
│   ├── blogs.php                    # Technical articles & blog posts CRUD
│   ├── leads.php                    # Inbound proposal capture & triage
│   ├── redirects.php                # 301 SEO redirects engine
│   ├── upload.php                   # Direct media upload to Hostinger filesystem & DB
│   ├── seed.php                     # Database factory seed initialization
│   └── sitemap.php                  # Dynamic XML sitemap generator
├── backend/                         # Alternative Go Fiber REST API (Gin/GORM)
│   ├── handlers/
│   ├── middleware/
│   ├── models/
│   └── main.go
├── frontend/                        # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── components/              # UI, Navbar, Footer, VisualBlockRenderer, PageBuilder
│   │   ├── config/                  # Firebase App & Auth Singleton
│   │   ├── context/                 # AuthContext (Google SSO & Email login)
│   │   ├── pages/                   # Public Pages (Home, About, Services, Projects, Contact)
│   │   ├── pages/admin/             # Protected CMS Portals & Full-screen Builder
│   │   ├── services/api.ts          # Unified REST API Client with local fallback
│   │   └── types/                   # TypeScript definitions
│   └── vite.config.ts               # Vite bundler configuration
├── scripts/                         # Automated deployment & synchronization tools
│   ├── deploy_all.py                # Automated build & SSH/SFTP deployment to Hostinger
│   └── ...                          # Verification & migration utilities
├── .env.example                     # Environment template with masked credentials
├── apis.txt                         # Server specifications (credentials masked)
└── README.md                        # Project documentation
```

---

## 🔒 Security & Credential Masking

All sensitive passwords, database credentials, and SSH keys have been masked in this repository. 

To configure your local environment or deployment targets, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Configure your secrets in `.env` (which is excluded from version control via `.gitignore`):

```env
# Hostinger Database Configuration
DB_HOST=localhost
DB_USER=u833088220_Sunrise
DB_PASS=YourDatabasePasswordHere
DB_NAME=u833088220_sunrise

# Hostinger SSH Deployment Configuration
SSH_HOST=193.203.185.110
SSH_PORT=65002
SSH_USER=u833088220
SSH_PASS=YourSSHPasswordHere
```

---

## 🛠️ Local Development

### 1. Prerequisites
- Node.js 18+ and npm
- PHP 8.x / XAMPP (optional, for local API testing)

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### 3. Production Build
```bash
cd frontend
npm run build
```

---

## 🚢 Automated Deployment to Hostinger

To build and deploy both the frontend production assets and backend PHP endpoints to Hostinger via SSH/SFTP:

```bash
python scripts/deploy_all.py
```

This script:
1. Compiles the frontend via Vite (`npm run build`).
2. Creates an optimized deployment bundle.
3. Connects securely via SSH to Hostinger.
4. Uploads PHP backend files, uploads directory, and frontend production assets into `public_html/`.
5. Performs automated HTTP 200 health checks against live endpoints.

---

## 🏢 Corporate Contact & Headquarters

- **Headquarters:** Level 4, Cyber Towers, HITEC City, Hyderabad, Telangana 500081
- **Regional Center:** D.No: 7-2-14, Main Road, Danavaipeta, Rajahmundry, Andhra Pradesh 533103
- **Inquiries:** [hello@sunraisesolutions.com](mailto:hello@sunraisesolutions.com) | +91 99596 39539
- **Website:** [https://testers.acheva.in/](https://testers.acheva.in/)
