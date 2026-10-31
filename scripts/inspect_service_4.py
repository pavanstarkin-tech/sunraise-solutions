import urllib.request, ssl, json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://testers.acheva.in/api/services.php?slug=digital-marketing', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req, context=ctx)
data = json.loads(res.read().decode('utf-8'))

print("=== SERVICE DIGITAL-MARKETING FROM HOSTINGER ===")
print("ID:", data.get('id'))
print("Slug:", data.get('slug'))
print("Title:", data.get('title'))
print("Is published:", data.get('is_published'))
print("\nHero Config:")
print(json.dumps(data.get('hero_config'), indent=2))
print(f"\nBlocks Count: {len(data.get('page_blocks', []))}")
for i, b in enumerate(data.get('page_blocks', [])):
    print(f"\n--- Block {i}: {b.get('component_name')} ({b.get('id')}) ---")
    print(json.dumps(b.get('props'), indent=2)[:300])
