with open('frontend/src/components/builder/ElementorPageBuilder.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

old_snippet = """  // Canonical public path for live preview and header indicator
  const publicPath = pageType === 'service'
    ? `/services/${pageSlug}`
    : (pageSlug === 'home' ? '/' : (pageType === 'core' ? `/${pageSlug}` : `/p/${pageSlug}`));"""

new_snippet = """  // Canonical public path for live preview and header indicator
  const corePages = ['home', 'about', 'services', 'projects', 'blog', 'contact'];
  const publicPath = pageType === 'service'
    ? `/services/${pageSlug}`
    : (pageSlug === 'home' ? '/' : (corePages.includes(pageSlug) ? `/${pageSlug}` : `/p/${pageSlug}`));"""

if old_snippet in c:
    c = c.replace(old_snippet, new_snippet, 1)
    with open('frontend/src/components/builder/ElementorPageBuilder.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("ElementorPageBuilder: publicPath updated")
else:
    print("Snippet not found")

