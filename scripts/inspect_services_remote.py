import urllib.request, ssl, json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://testers.acheva.in/api/services.php', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req, context=ctx)
data = json.loads(res.read().decode('utf-8'))

print(f"Total services: {len(data)}")
for s in data:
    print(f"ID {s.get('id')}: Code='{s.get('service_code')}', Slug='{s.get('slug')}', Title='{s.get('title')}', Blocks={len(s.get('page_blocks', []))}, Published={s.get('is_published')}")

