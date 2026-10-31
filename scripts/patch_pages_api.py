with open('api/pages.php', 'r', encoding='utf-8') as f:
    content = f.read()

target = """    if ($slug) {
        $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? LIMIT 1");
        $stmt->execute([$slug]);
        $page = $stmt->fetch();"""

replacement = """    if ($slug) {
        $normalizedSlug = str_replace('_', '-', $slug);
        $stmt = $pdo->prepare("SELECT * FROM pages WHERE slug = ? OR slug = ? LIMIT 1");
        $stmt->execute([$slug, $normalizedSlug]);
        $page = $stmt->fetch();"""

if target in content:
    content = content.replace(target, replacement, 1)
    with open('api/pages.php', 'w', encoding='utf-8', newline='\r\n') as f:
        f.write(content)
    print("SUCCESS: api/pages.php patched")
else:
    # Try normalizing line breaks
    target_lf = target.replace('\r\n', '\n')
    content_lf = content.replace('\r\n', '\n')
    if target_lf in content_lf:
        content_lf = content_lf.replace(target_lf, replacement.replace('\r\n', '\n'), 1)
        with open('api/pages.php', 'w', encoding='utf-8') as f:
            f.write(content_lf)
        print("SUCCESS: api/pages.php patched (LF normalized)")
    else:
        print("Target not found")

