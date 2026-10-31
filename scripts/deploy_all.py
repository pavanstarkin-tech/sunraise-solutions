import os
import sys
import zipfile
import paramiko
import urllib.request
import ssl

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
API_DIR = os.path.join(WORKSPACE_DIR, "api")
FRONTEND_DIST = os.path.join(WORKSPACE_DIR, "frontend", "dist")

# Load local .env if available (ignored by git)
env_path = os.path.join(WORKSPACE_DIR, ".env")
if os.path.exists(env_path):
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ[k.strip()] = v.strip()

HOST = os.getenv("SSH_HOST", "193.203.185.110")
PORT = int(os.getenv("SSH_PORT", "65002"))
USER = os.getenv("SSH_USER", "u833088220")
PASS = os.getenv("SSH_PASS", "YOUR_SSH_PASSWORD")
DB_PASS = os.getenv("DB_PASS", "YOUR_DB_PASSWORD")

REMOTE_TARGETS = [
    "/home/u833088220/public_html",
    "/home/u833088220/domains/testers.acheva.in/public_html"
]
REMOTE_API_ONLY = [
    "/home/u833088220/api"
]

def make_zip():
    zip_path = os.path.join(WORKSPACE_DIR, "sunraise_hostinger_deploy.zip")
    print(f"[1/4] Creating local deployment bundle: {zip_path}")
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        # Add frontend dist files
        for root, _, files in os.walk(FRONTEND_DIST):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.relpath(full_path, FRONTEND_DIST)
                zipf.write(full_path, rel_path)

        # Add api files
        for root, _, files in os.walk(API_DIR):
            for file in files:
                full_path = os.path.join(root, file)
                rel_path = os.path.join("api", os.path.relpath(full_path, API_DIR))
                zipf.write(full_path, rel_path)

    size_mb = os.path.getsize(zip_path) / (1024 * 1024)
    print(f"  [OK] Created sunraise_hostinger_deploy.zip ({size_mb:.2f} MB)")
    return zip_path

def deploy_remote(zip_path):
    print(f"\n[2/4] Connecting to Hostinger SSH ({HOST}:{PORT})...")
    client = paramiko.SSHClient()
    client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=20)
    sftp = client.open_sftp()

    def ensure_dir(path):
        parts = path.strip("/").split("/")
        curr = ""
        for p in parts:
            curr += "/" + p
            try:
                sftp.mkdir(curr)
            except IOError:
                pass

    for t in REMOTE_TARGETS:
        ensure_dir(t)
        ensure_dir(f"{t}/api")
        ensure_dir(f"{t}/api/uploads")
        ensure_dir(f"{t}/assets")

    for t in REMOTE_API_ONLY:
        ensure_dir(t)
        ensure_dir(f"{t}/uploads")

    print("\n[3/4] Deploying Backend & Frontend files to remote servers...")

    # Upload Backend files
    api_files = [f for f in os.listdir(API_DIR) if os.path.isfile(os.path.join(API_DIR, f))]
    for filename in api_files:
        local_path = os.path.join(API_DIR, filename)
        all_api_targets = [f"{t}/api" for t in REMOTE_TARGETS] + REMOTE_API_ONLY
        for target in all_api_targets:
            remote_path = f"{target}/{filename}"
            # For config.php, inject DB password if masked
            if filename == "config.php" and DB_PASS and DB_PASS != "YOUR_DB_PASSWORD":
                with open(local_path, "r", encoding="utf-8") as cf:
                    cfg_content = cf.read()
                cfg_content = cfg_content.replace("'YOUR_DATABASE_PASSWORD'", f"'{DB_PASS}'")
                with sftp.file(remote_path, "w") as rf:
                    rf.write(cfg_content)
            else:
                sftp.put(local_path, remote_path)
    print(f"  [OK] Uploaded {len(api_files)} backend files to all targets")

    # Upload Frontend Dist files
    for t in REMOTE_TARGETS:
        # Clean old asset files from remote assets folder to avoid accumulating old hashes
        try:
            old_assets = sftp.listdir(f"{t}/assets")
            for old_f in old_assets:
                try:
                    sftp.remove(f"{t}/assets/{old_f}")
                except Exception:
                    pass
        except Exception:
            pass

        # Upload new assets
        assets_dir = os.path.join(FRONTEND_DIST, "assets")
        if os.path.exists(assets_dir):
            for asset_f in os.listdir(assets_dir):
                local_f = os.path.join(assets_dir, asset_f)
                remote_f = f"{t}/assets/{asset_f}"
                sftp.put(local_f, remote_f)

        # Upload root frontend files
        for root_f in [".htaccess", "index.html", "favicon.svg", "icons.svg", "logo.png"]:
            local_f = os.path.join(FRONTEND_DIST, root_f)
            if os.path.exists(local_f):
                remote_f = f"{t}/{root_f}"
                sftp.put(local_f, remote_f)

        print(f"  [OK] Uploaded frontend production bundle to {t}")

    # Also upload the zip backup to /home/u833088220/public_html
    sftp.put(zip_path, "/home/u833088220/public_html/sunraise_hostinger_deploy.zip")
    print("  [OK] Staged sunraise_hostinger_deploy.zip in public_html")

    sftp.close()
    client.close()

def verify_live():
    print("\n[4/4] Verifying Remote Deployment...")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    test_endpoints = [
        "https://testers.acheva.in/api/services.php",
        "https://testers.acheva.in/api/pages.php"
    ]

    for ep in test_endpoints:
        try:
            req = urllib.request.Request(ep, headers={'User-Agent': 'Mozilla/5.0'})
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                data = resp.read().decode('utf-8')
                name = ep.split('/')[-1]
                if data.startswith('{') or data.startswith('['):
                    print(f"  [OK] Remote {name} verified (returns valid JSON).")
                else:
                    print(f"  [WARN] Remote {name} returned non-JSON: {data[:100]}")
        except Exception as e:
            print(f"  [FAIL] Failed verifying {ep}: {e}")

    # Verify Frontend
    try:
        req = urllib.request.Request("https://testers.acheva.in/", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            print(f"  [OK] Live HTTP check: https://testers.acheva.in/ returned HTTP {resp.status}")
    except Exception as e:
        print(f"  [FAIL] Live site check failed: {e}")

if __name__ == "__main__":
    if not os.path.exists(FRONTEND_DIST):
        print(f"ERROR: {FRONTEND_DIST} does not exist. Run 'cd frontend && npm run build' first.")
        sys.exit(1)

    zip_file = make_zip()
    deploy_remote(zip_file)
    verify_live()
    print("\nSUCCESS: Frontend & Backend deployment to Hostinger completed!")
