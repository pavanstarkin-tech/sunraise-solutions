with open('frontend/src/components/builder/ElementPaletteSidebar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update imports
import_old = "  Search,\n  Plus\n} from 'lucide-react';"
import_new = "  Search,\n  Plus,\n  SlidersHorizontal,\n  Tag,\n  GalleryHorizontalEnd\n} from 'lucide-react';"

if import_old in c:
    c = c.replace(import_old, import_new, 1)
    print("Palette imports updated")
else:
    print("Import target not found")

# 2. Add elements to paletteElements
# In Basic: add MarkupTags and make RawHTML non-restricted
# In Layout: add ImageSlider, CardSlider, TextSlider

palette_target = "    { id: 'el-html', name: 'RawHTML', label: 'HTML Embed', desc: 'Custom code injection', category: 'basic', icon: Code2, restricted: true },"

palette_repl = """    { id: 'el-tags', name: 'MarkupTags', label: 'Markup Tags & Chips', desc: 'Technology & skill badges', category: 'basic', icon: Tag },
    { id: 'el-html', name: 'RawHTML', label: 'HTML Embed / Custom Code', desc: 'Custom HTML injection with live render', category: 'basic', icon: Code2 },"""

if palette_target in c:
    c = c.replace(palette_target, palette_repl, 1)
    print("Palette basic items updated")
else:
    print("Palette basic target not found")

# In Layout section:
layout_target = "    { id: 'el-split-img', name: 'SplitImageText', label: 'Image & Text Combo', desc: 'Editorial split feature', category: 'layout', icon: Split },"

layout_repl = """    { id: 'el-split-img', name: 'SplitImageText', label: 'Image & Text Combo', desc: 'Editorial split feature', category: 'layout', icon: Split },
    { id: 'el-img-slider', name: 'ImageSlider', label: 'Image Slider', desc: 'Multi-slide media carousel with captions', category: 'layout', icon: GalleryHorizontalEnd },
    { id: 'el-card-slider', name: 'CardSlider', label: 'Card Slider', desc: 'Feature & service cards carousel', category: 'layout', icon: SlidersHorizontal },
    { id: 'el-text-slider', name: 'TextSlider', label: 'Text / Quote Slider', desc: 'Announcement ticker & client reviews', category: 'layout', icon: MessageSquareQuote },"""

if layout_target in c:
    c = c.replace(layout_target, layout_repl, 1)
    print("Palette layout slider items updated")
else:
    print("Palette layout target not found")

with open('frontend/src/components/builder/ElementPaletteSidebar.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: ElementPaletteSidebar.tsx written")

