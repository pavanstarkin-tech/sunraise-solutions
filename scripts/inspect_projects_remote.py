import urllib.request, ssl, json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://testers.acheva.in/api/projects.php', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req, context=ctx)
data = json.loads(res.read().decode('utf-8'))

print(f"Total projects: {len(data)}")
for p in data:
    print(f"ID {p.get('id')}: Client='{p.get('client_name')}', Title='{p.get('title')}', Badge='{p.get('category_badge')}', ServiceCode='{p.get('service_code')}', Img='{p.get('thumbnail_url')[:40]}...'")

