with open('frontend/src/types/index.ts', 'r', encoding='utf-8') as f:
    c = f.read()

target = "    | 'CustomCode';"
replacement = """    | 'CustomCode'
    | 'ImageSlider'
    | 'CardSlider'
    | 'TextSlider'
    | 'MarkupTags';"""

if target in c:
    c = c.replace(target, replacement, 1)
    with open('frontend/src/types/index.ts', 'w', encoding='utf-8') as f:
        f.write(c)
    print("SUCCESS: types/index.ts updated")
else:
    print("Target not found")

