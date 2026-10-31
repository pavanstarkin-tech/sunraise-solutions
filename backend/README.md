# Sunraise Solutions - Go Fiber Backend & SEO CMS Engine

Production Go Fiber API backend configured for Hostinger Cloud/cPanel MySQL with Firebase Authentication and dynamic XML sitemap generation.

## Features
- **Hostinger MySQL & GORM ORM:** High-performance relational schema with JSON blocks storage for dynamic visual builders.
- **Firebase Auth JWT Verification:** Protects `/api/v1/admin/*` routes via Firebase Admin SDK.
- **Dynamic SEO 301 Redirect Engine:** Detects service slug changes and automatically writes and serves permanent 301 redirects to protect Google search rank equity.
- **Dynamic Live Sitemap:** Generates `/sitemap.xml` directly from published database entities.
- **Lead Capture & Notifications:** Inbound proposal inquiry pipeline.

## Environment Variables (`.env`)
```bash
PORT=8080
DB_HOST=127.0.0.1          # Hostinger MySQL Host (e.g. srv123.hstgr.io or localhost)
DB_PORT=3306
DB_USER=u123456789_sunraise
DB_PASS=YourStrongHostingerPassword
DB_NAME=u123456789_sunraise_cms
SITE_BASE_URL=https://sunraisesolutions.com
DEV_MODE=true              # Set to true for local testing without Firebase credentials
FIREBASE_SERVICE_ACCOUNT_KEY=./serviceAccountKey.json
```

## Running Locally
```bash
cd backend
go mod tidy
go run main.go
```

## Importing Database to Hostinger phpMyAdmin
1. Log in to your Hostinger hPanel -> Databases -> phpMyAdmin.
2. Select your database.
3. Click **Import** and upload `backend/schema.sql`.
