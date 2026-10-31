# Deployment Rules for Sunraise Solutions

1. **Backend Deployments:**
   - Whenever any modifications are made to backend PHP files in `api/`, automatically deploy them immediately to the Hostinger remote server using SSH/SFTP (`python scripts/deploy_backend.py`).
   - Remote targets:
     - `/home/u833088220/public_html/api/`
     - `/home/u833088220/api/`
     - `/home/u833088220/domains/testers.acheva.in/public_html/api/`

2. **Frontend Deployments:**
   - **DO NOT** deploy frontend files (`frontend/`, `index.html`, `assets/`, `sunraise_hostinger_deploy.zip`) to Hostinger until the user explicitly requests or confirms frontend deployment.
   - Keep all frontend changes local on Vite dev server (`http://localhost:5173/`).
