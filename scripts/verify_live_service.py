import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    ("API Service by ID", "https://testers.acheva.in/api/services.php?id=4"),
    ("API Service by Slug (hyphen)", "https://testers.acheva.in/api/services.php?slug=digital-marketing"),
    ("API Service by Slug (underscore)", "https://testers.acheva.in/api/services.php?slug=digital_marketing"),
    ("Frontend Canonical Service", "https://testers.acheva.in/services/digital-marketing"),
    ("Frontend Custom Landing URL (underscore)", "https://testers.acheva.in/p/digital_marketing"),
]

for label, url in urls:
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = resp.read()
            status = resp.status
            if "api" in url:
                parsed = json.loads(data.decode('utf-8'))
                print(f"[OK] {label}: HTTP {status} | Title: {parsed.get('title')} | Blocks: {len(parsed.get('page_blocks', []))}")
            else:
                print(f"[OK] {label}: HTTP {status} | Bytes: {len(data)}")
    except Exception as e:
        print(f"[FAIL] {label}: {e}")

