import urllib.request, ssl, json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://testers.acheva.in/api/pages.php?slug=home', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req, context=ctx)
data = json.loads(res.read().decode('utf-8'))

print("Hero config:", json.dumps(data.get('hero_config'), indent=2))
print("\nBlocks count:", len(data.get('page_blocks', [])))

for i, b in enumerate(data.get('page_blocks', [])):
    print(f"\n--- BLOCK {i}: {b.get('component_name')} ({b.get('id')}) ---")
    print(json.dumps(b.get('props'), indent=2)[:300] + "...")

