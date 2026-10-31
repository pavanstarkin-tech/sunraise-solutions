import os, re

# ==========================================
# 1. PATCH HomePage.tsx
# ==========================================
home_path = os.path.join('frontend', 'src', 'pages', 'HomePage.tsx')
with open(home_path, 'r', encoding='utf-8') as f:
    home_content = f.read()

# Replace early return in HomePage.tsx
# Target lines 100-115:
#   if (customPageData && customPageData.page_blocks && customPageData.page_blocks.length > 0) { ... }
early_return_pattern = re.compile(
    r'\s*// If page blocks configured in Visual Builder, render custom visual builder layout\s*'
    r'if\s*\(\s*customPageData\s*&&\s*customPageData\.page_blocks\s*&&\s*customPageData\.page_blocks\.length\s*>\s*0\s*\)\s*\{[\s\S]*?return\s*\(\s*<>[\s\S]*?<\/>\s*\);\s*\}',
    re.MULTILINE
)

if early_return_pattern.search(home_content):
    home_content = early_return_pattern.sub('', home_content)
    print("Removed block override early return from HomePage.tsx")
else:
    # Alternative direct search
    old_snippet = """  // If page blocks configured in Visual Builder, render custom visual builder layout
  if (customPageData && customPageData.page_blocks && customPageData.page_blocks.length > 0) {"""
    if old_snippet in home_content:
        # Find ending of this if block
        idx = home_content.find(old_snippet)
        end_idx = home_content.find("  return (", idx)
        if end_idx != -1:
            home_content = home_content[:idx] + home_content[end_idx:]
            print("Directly sliced out early return in HomePage.tsx")

# Ensure SEOHead uses customPageData?.seo_meta
home_content = home_content.replace(
    'title="Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry"',
    'title={customPageData?.seo_meta?.meta_title || "Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry"}'
)
home_content = home_content.replace(
    'description="Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing."',
    'description={customPageData?.seo_meta?.meta_description || "Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing."}'
)

with open(home_path, 'w', encoding='utf-8') as f:
    f.write(home_content)


# ==========================================
# 2. PATCH AboutPage.tsx
# ==========================================
about_path = os.path.join('frontend', 'src', 'pages', 'AboutPage.tsx')
with open(about_path, 'r', encoding='utf-8') as f:
    about_content = f.read()

about_pattern = re.compile(
    r'if\s*\(\s*customPageData\s*&&\s*customPageData\.page_blocks\s*&&\s*customPageData\.page_blocks\.length\s*>\s*0\s*\)\s*\{[\s\S]*?return\s*\(\s*<>[\s\S]*?<\/>\s*\);\s*\}',
    re.MULTILINE
)
if about_pattern.search(about_content):
    about_content = about_pattern.sub('', about_content)
    print("Removed block override early return from AboutPage.tsx")

with open(about_path, 'w', encoding='utf-8') as f:
    f.write(about_content)


# ==========================================
# 3. PATCH ProjectsPage.tsx
# ==========================================
projects_path = os.path.join('frontend', 'src', 'pages', 'ProjectsPage.tsx')
with open(projects_path, 'r', encoding='utf-8') as f:
    projects_content = f.read()

if projects_pattern := re.search(r'if\s*\(\s*customPageData\s*&&\s*customPageData\.page_blocks\s*&&\s*customPageData\.page_blocks\.length\s*>\s*0\s*\)\s*\{[\s\S]*?return\s*\(\s*<>[\s\S]*?<\/>\s*\);\s*\}', projects_content):
    projects_content = projects_content[:projects_pattern.start()] + projects_content[projects_pattern.end():]
    print("Removed block override early return from ProjectsPage.tsx")

with open(projects_path, 'w', encoding='utf-8') as f:
    f.write(projects_content)


# ==========================================
# 4. PATCH ContactPage.tsx
# ==========================================
contact_path = os.path.join('frontend', 'src', 'pages', 'ContactPage.tsx')
with open(contact_path, 'r', encoding='utf-8') as f:
    contact_content = f.read()

if contact_pattern := re.search(r'if\s*\(\s*customPageData\s*&&\s*customPageData\.page_blocks\s*&&\s*customPageData\.page_blocks\.length\s*>\s*0\s*\)\s*\{[\s\S]*?return\s*\(\s*<>[\s\S]*?<\/>\s*\);\s*\}', contact_content):
    contact_content = contact_content[:contact_pattern.start()] + contact_content[contact_pattern.end():]
    print("Removed block override early return from ContactPage.tsx")

with open(contact_path, 'w', encoding='utf-8') as f:
    f.write(contact_content)

print("Core pages patched successfully!")

