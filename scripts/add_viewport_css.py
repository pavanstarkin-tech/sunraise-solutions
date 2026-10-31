import os

index_css_path = os.path.join('frontend', 'src', 'index.css')

with open(index_css_path, 'r', encoding='utf-8') as f:
    content = f.read()

viewport_css = """

/* ==========================================================================
   PAGE BUILDER RESPONSIVE VIEWPORT EMULATION (Mobile & Tablet)
   Enforces genuine responsive rendering inside the desktop admin canvas
   ========================================================================== */

/* 1. MOBILE VIEWPORT EMULATION (375px) */
.builder-viewport-mobile {
  max-width: 375px !important;
  width: 375px !important;
  font-size: 14px !important;
  overflow-x: hidden !important;
}

/* Force grids to single column on mobile */
.builder-viewport-mobile .grid,
.builder-viewport-mobile [class*="grid-cols-"],
.builder-viewport-mobile [class*="md:grid-cols-"],
.builder-viewport-mobile [class*="lg:grid-cols-"],
.builder-viewport-mobile [class*="sm:grid-cols-"] {
  grid-template-columns: repeat(1, minmax(0, 1fr)) !important;
  gap: 1rem !important;
}

/* Force responsive flex containers to stack vertically */
.builder-viewport-mobile .md\\:flex-row,
.builder-viewport-mobile .lg\\:flex-row,
.builder-viewport-mobile .sm\\:flex-row,
.builder-viewport-mobile [class*="md:flex-row"],
.builder-viewport-mobile [class*="lg:flex-row"],
.builder-viewport-mobile [class*="sm:flex-row"] {
  flex-direction: column !important;
  align-items: stretch !important;
}

/* Mobile typography scale */
.builder-viewport-mobile h1,
.builder-viewport-mobile .text-4xl,
.builder-viewport-mobile .text-5xl,
.builder-viewport-mobile .text-6xl,
.builder-viewport-mobile [class*="text-4xl"],
.builder-viewport-mobile [class*="text-5xl"],
.builder-viewport-mobile [class*="text-6xl"] {
  font-size: 1.5rem !important;
  line-height: 1.85rem !important;
  word-break: break-word !important;
}

.builder-viewport-mobile h2,
.builder-viewport-mobile .text-3xl,
.builder-viewport-mobile [class*="text-3xl"] {
  font-size: 1.25rem !important;
  line-height: 1.6rem !important;
  word-break: break-word !important;
}

.builder-viewport-mobile h3,
.builder-viewport-mobile .text-2xl,
.builder-viewport-mobile [class*="text-2xl"] {
  font-size: 1.1rem !important;
  line-height: 1.45rem !important;
}

.builder-viewport-mobile p,
.builder-viewport-mobile .text-base,
.builder-viewport-mobile .text-lg,
.builder-viewport-mobile [class*="text-lg"] {
  font-size: 0.875rem !important;
  line-height: 1.35rem !important;
}

/* Mobile compact paddings and margins */
.builder-viewport-mobile section,
.builder-viewport-mobile [class*="py-12"],
.builder-viewport-mobile [class*="py-16"],
.builder-viewport-mobile [class*="py-20"],
.builder-viewport-mobile [class*="py-24"] {
  padding-top: 1.5rem !important;
  padding-bottom: 1.5rem !important;
}

.builder-viewport-mobile [class*="px-6"],
.builder-viewport-mobile [class*="px-8"],
.builder-viewport-mobile [class*="px-12"],
.builder-viewport-mobile [class*="px-16"] {
  padding-left: 1rem !important;
  padding-right: 1rem !important;
}

/* Mobile buttons / action groups stack vertically and expand */
.builder-viewport-mobile .flex.justify-center.gap-3,
.builder-viewport-mobile .flex.items-center.gap-4,
.builder-viewport-mobile .flex.flex-wrap.items-center.gap-4,
.builder-viewport-mobile .flex.gap-4 {
  flex-direction: column !important;
  width: 100% !important;
}

.builder-viewport-mobile .flex.justify-center.gap-3 > *,
.builder-viewport-mobile .flex.items-center.gap-4 > *,
.builder-viewport-mobile .flex.flex-wrap.items-center.gap-4 > * {
  width: 100% !important;
  text-align: center !important;
  justify-content: center !important;
}

/* Ensure images fit within 375px */
.builder-viewport-mobile img {
  max-width: 100% !important;
  height: auto !important;
}

/* 2. TABLET VIEWPORT EMULATION (768px) */
.builder-viewport-tablet {
  max-width: 768px !important;
  width: 768px !important;
}

.builder-viewport-tablet [class*="lg:grid-cols-4"],
.builder-viewport-tablet [class*="lg:grid-cols-3"],
.builder-viewport-tablet [class*="grid-cols-4"] {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 1.25rem !important;
}

.builder-viewport-tablet h1 {
  font-size: 2.25rem !important;
  line-height: 2.6rem !important;
}
"""

if 'builder-viewport-mobile' not in content:
    with open(index_css_path, 'a', encoding='utf-8') as f:
        f.write(viewport_css)
    print("Successfully appended responsive viewport styles to index.css")
else:
    print("Already present in index.css")

