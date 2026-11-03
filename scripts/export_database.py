import os
import paramiko

WORKSPACE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
ENV_PATH = os.path.join(WORKSPACE_DIR, ".env")

# Load credentials
config = {}
if os.path.exists(ENV_PATH):
    with open(ENV_PATH, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                config[k.strip()] = v.strip()

SSH_HOST = os.getenv("SSH_HOST", config.get("SSH_HOST", "193.203.185.110"))
SSH_PORT = int(os.getenv("SSH_PORT", config.get("SSH_PORT", "65002")))
SSH_USER = os.getenv("SSH_USER", config.get("SSH_USER", "u833088220"))
SSH_PASS = os.getenv("SSH_PASS", config.get("SSH_PASS", "YOUR_SSH_PASSWORD"))

DB_USER = os.getenv("DB_USER", config.get("DB_USER", "u833088220_Sunrise"))
DB_PASS = os.getenv("DB_PASS", config.get("DB_PASS", "YOUR_DB_PASSWORD"))
DB_NAME = os.getenv("DB_NAME", config.get("DB_NAME", "u833088220_sunrise"))

OUTPUT_DIR = os.path.join(WORKSPACE_DIR, "database")
os.makedirs(OUTPUT_DIR, exist_ok=True)
LOCAL_SQL_FILE = os.path.join(OUTPUT_DIR, "sunraise_database_export.sql")

print(f"Connecting to Hostinger SSH ({SSH_HOST}:{SSH_PORT})...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(SSH_HOST, port=SSH_PORT, username=SSH_USER, password=SSH_PASS, timeout=30)

# Run mysqldump on remote Hostinger server
remote_dump_path = "/home/u833088220/database_export.sql"
dump_cmd = f"mysqldump -u '{DB_USER}' -p'{DB_PASS}' '{DB_NAME}' > {remote_dump_path}"

print(f"Executing remote mysqldump for database '{DB_NAME}'...")
stdin, stdout, stderr = client.exec_command(dump_cmd)
exit_status = stdout.channel.recv_exit_status()
err = stderr.read().decode('utf-8')

if exit_status != 0:
    print(f"Error during mysqldump: {err}")
    client.close()
    exit(1)

print("mysqldump generated successfully on remote server. Downloading via SFTP...")
sftp = client.open_sftp()
sftp.get(remote_dump_path, LOCAL_SQL_FILE)

# Clean up remote dump file for safety
try:
    sftp.remove(remote_dump_path)
    print("Cleaned up temporary remote dump file.")
except Exception:
    pass

sftp.close()
client.close()

size_kb = os.path.getsize(LOCAL_SQL_FILE) / 1024
print(f"SUCCESS: Exported database to {LOCAL_SQL_FILE} ({size_kb:.2f} KB)")
