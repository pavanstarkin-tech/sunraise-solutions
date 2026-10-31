import urllib.request, ssl, json
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

req = urllib.request.Request('https://testers.acheva.in/api/pages.php', headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req, context=ctx) as res:
    data = json.loads(res.read().decode('utf-8'))
    print(f"Total pages returned by api/pages.php: {len(data)}")
    for p in data:
        print(f"ID {p.get('id')}: {p.get('title')} ({p.get('slug')}) - {len(p.get('page_blocks', []))} blocks")

