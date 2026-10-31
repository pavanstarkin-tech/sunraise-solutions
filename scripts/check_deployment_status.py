import urllib.request, ssl, json

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

# 1. Homepage
req = urllib.request.Request('https://testers.acheva.in/', headers={'User-Agent': 'Mozilla/5.0'})
res = urllib.request.urlopen(req, context=ctx)
print(f"Homepage HTTP: {res.status} OK")

# 2. Check JS bundle deployed
html = res.read().decode('utf-8')
js_bundle = [line for line in html.split('\n') if '<script' in line and 'assets/index' in line]
print(f"Active JS Bundle in index.html: {js_bundle}")

# 3. Pages API
req_pages = urllib.request.Request('https://testers.acheva.in/api/pages.php?slug=home', headers={'User-Agent': 'Mozilla/5.0'})
res_pages = urllib.request.urlopen(req_pages, context=ctx)
data = json.loads(res_pages.read().decode('utf-8'))
print(f"Pages API slug=home: title='{data.get('title')}', blocks={len(data.get('page_blocks', []))}")
print(f"Hero badge: '{data.get('hero_config', {}).get('badge')}'")

