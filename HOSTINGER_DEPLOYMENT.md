# Sunraise Solutions — Hostinger hPanel Deployment & API Documentation

This directory contains the production-ready PHP REST backend and React 19 Frontend engineered to run seamlessly on **Hostinger hPanel Shared / Cloud Web Hosting**.

---

## 1. Verified Live Hostinger Database Status

The database has already been initialized and populated with Sunraise Solutions production seed data:

- **MySQL Database:** `u833088220_sunrise` (Host: `193.203.185.110` / `localhost`)
- **MySQL User:** `u833088220_Sunrise`
- **Seeded Tables:**
  - `services` (8 Active Corporate Services with codes `SRV-SEO-01` through `SRV-HMS-08`)
  - `projects` (6 Verified Case Studies with service code linkage)
  - `testimonials` (5 Client Reviews)
  - `blogs` (2 SEO & Healthcare articles)
  - `seo_redirects` (Automated 301 Permanent Redirect Registry)
  - `leads` (Inbound Proposal Pipeline)

---

## 2. Production PHP REST API Endpoints (`/api/*`)

All endpoints support CORS, return `application/json`, and connect directly to Hostinger MySQL:

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/services.php` | `GET` | Retrieve all active services with Hero and block configurations. |
| `/api/services.php?slug={slug}` | `GET` | Returns single service detail joined with linked projects and testimonials. |
| `/api/services.php` | `POST` / `PUT` | Upsert service. Automatically creates 301 redirect if slug changes and downgrades accidental `<h1>` to `<h2>`. |
| `/api/services.php?id={id}` | `DELETE` | Removes service from database. |
| `/api/projects.php` | `GET` | List case studies (filterable by `?service_code=SRV-SEO-01` or `?slug={slug}`). |
| `/api/projects.php` | `POST` / `PUT` | Upsert case study linked to a service code. |
| `/api/testimonials.php` | `GET` | List reviews (filterable by `?service_code=SRV-SEO-01`). |
| `/api/testimonials.php` | `POST` / `PUT` | Upsert testimonial. |
| `/api/blogs.php` | `GET` | List articles or fetch single via `?slug={slug}`. |
| `/api/blogs.php` | `POST` / `PUT` | Upsert article with SEO tags and reading time. |
| `/api/leads.php` | `POST` | Receive proposal inquiry from website forms. |
| `/api/leads.php` | `GET` | Return leads inbox for admin dashboard triage. |
| `/api/leads.php` | `PATCH` | Update lead workflow status (`new`, `contacted`, `qualified`, `closed`). |
| `/api/redirects.php` | `GET` | Inspect all registered 301 redirects to ensure Zero-Regression SEO. |
| `/api/upload.php` | `POST` | Multipart media upload (JPG, PNG, WEBP, MP4, etc.) to `api/uploads/`. |
| `/api/sitemap.php` | `GET` | Dynamic live XML sitemap pulling real-time database URLs. |

---

## 3. Fast Deployment Options to Hostinger hPanel

### Option A: 1-Click Upload via Hostinger File Manager (Recommended)
1. Log in to your **Hostinger hPanel** $\rightarrow$ **Websites** $\rightarrow$ **File Manager**.
2. Navigate to `public_html/`.
3. Upload `sunraise_hostinger_deploy.zip` (located in `c:\xampp\htdocs\projects\sunrise\sunraise_hostinger_deploy.zip`).
4. Right-click $\rightarrow$ **Extract** to current directory (`public_html`).
5. Delete the zip file.
6. **Done!** Your website, Admin CMS, and PHP REST APIs are immediately live.

---

### Option B: Upload via SSH / SCP
Using the SSH credentials from `apis.txt`:

```bash
# Upload the zip archive directly to public_html
scp -P 65002 sunraise_hostinger_deploy.zip u833088220@193.203.185.110:public_html/

# Connect via SSH and unzip
ssh -p 65002 u833088220@193.203.185.110
cd public_html
unzip -o sunraise_hostinger_deploy.zip
rm sunraise_hostinger_deploy.zip
```

---

## 4. Local Development

Both servers are pre-configured to run concurrently:

1. **PHP API Server:**
   ```bash
   php -S localhost:8000
   ```
2. **React + Vite Frontend (with Proxy):**
   ```bash
   cd frontend
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser. All API requests to `/api/*` seamlessly proxy to `http://localhost:8000/api/*` and read from your live Hostinger MySQL database!
