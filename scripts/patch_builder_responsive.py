import os

builder_path = os.path.join('frontend', 'src', 'components', 'builder', 'ElementorPageBuilder.tsx')
with open(builder_path, 'r', encoding='utf-8') as f:
    builder_code = f.read()

# 1. Viewport container class and device status bar
target_start = """          {/* Responsive Viewport Container with True Viewport Dimensions */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : '100%',
              maxWidth:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : '1200px',
              minWidth:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : undefined,
            }}
            className={`bg-white rounded-3xl shadow-2xl border border-gray-300/80 transition-all duration-300 mb-32 shrink-0 flex flex-col ${
              viewportMode !== 'desktop' ? 'mx-auto ring-8 ring-gray-900/10' : 'w-full'
            }`}
          >"""

replacement_start = """          {/* Viewport Indicator Badge */}
          {viewportMode !== 'desktop' && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-300 shadow-sm text-xs font-bold text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{viewportMode === 'mobile' ? 'Mobile Viewport (375 × 812 px) · Touch Emulation' : 'Tablet Viewport (768 × 1024 px) · Responsive Grid'}</span>
            </div>
          )}

          {/* Responsive Viewport Container with True Viewport Dimensions */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : '100%',
              maxWidth:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : '1200px',
              minWidth:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : undefined,
            }}
            className={`bg-white transition-all duration-300 mb-32 shrink-0 flex flex-col ${
              viewportMode === 'mobile'
                ? 'builder-viewport-mobile rounded-[44px] ring-[12px] ring-gray-900 shadow-2xl overflow-hidden'
                : viewportMode === 'tablet'
                ? 'builder-viewport-tablet rounded-[32px] ring-[14px] ring-gray-800 shadow-2xl overflow-hidden'
                : 'builder-viewport-desktop w-full rounded-3xl shadow-2xl border border-gray-300/80'
            }`}
          >
            {/* Mobile Top Status Bar & Notch */}
            {viewportMode === 'mobile' && (
              <div className="w-full bg-black text-white px-6 py-2.5 flex items-center justify-between select-none shrink-0 border-b border-gray-800">
                <span className="text-[11px] font-semibold tracking-tight">9:41</span>
                <div className="w-24 h-4 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-950 mr-2"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950"></div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="text-[9px] font-bold">5G</span>
                  <div className="w-4 h-2 border border-gray-400 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-xs"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tablet Top Bezel */}
            {viewportMode === 'tablet' && (
              <div className="w-full bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-xs select-none shrink-0 border-b border-gray-800">
                <span className="text-[11px] text-gray-400 font-medium">iPad Pro · 768px</span>
                <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-700"></div>
                <span className="text-[11px] text-gray-400">100%</span>
              </div>
            )}"""

if target_start in builder_code:
    builder_code = builder_code.replace(target_start, replacement_start)
    print("Replaced viewport start with mobile frame in ElementorPageBuilder.tsx")
else:
    print("Could not find target_start in ElementorPageBuilder.tsx")

# 2. Hero padding and responsiveness
hero_target = """                className={`relative w-full shrink-0 pt-12 pb-16 px-6 md:px-12 bg-mesh-bg border-b border-gray-200 sunraise-mesh-bg rounded-t-3xl cursor-pointer group transition-all duration-200 ${
                  isEditingHero ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:border-orange-300'
                }`}"""

hero_replacement = """                className={`relative w-full shrink-0 ${
                  viewportMode === 'mobile' ? 'pt-6 pb-8 px-4' : 'pt-12 pb-16 px-6 md:px-12'
                } bg-mesh-bg border-b border-gray-200 sunraise-mesh-bg rounded-t-3xl cursor-pointer group transition-all duration-200 ${
                  isEditingHero ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:border-orange-300'
                }`}"""

if hero_target in builder_code:
    builder_code = builder_code.replace(hero_target, hero_replacement)
    print("Updated Hero container responsiveness")

# 3. Hero heading scale
heading_target = """                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 font-heading leading-tight">"""
heading_replacement = """                  <h1 className={`${
                    viewportMode === 'mobile' ? 'text-2xl leading-tight' : 'text-3xl sm:text-4xl lg:text-5xl'
                  } font-black text-gray-900 font-heading leading-tight`}>"""

if heading_target in builder_code:
    builder_code = builder_code.replace(heading_target, heading_replacement)
    print("Updated Hero heading responsiveness")

# 4. Hero CTA buttons
cta_target = """                  <div className="flex justify-center gap-3 pt-3">"""
cta_replacement = """                  <div className={`${
                    viewportMode === 'mobile' ? 'flex flex-col gap-2' : 'flex justify-center gap-3'
                  } pt-3`}>"""

if cta_target in builder_code:
    builder_code = builder_code.replace(cta_target, cta_replacement)
    print("Updated Hero CTA responsiveness")

# 5. Hero stats grid
stats_target = """                  {currentHero.stats && currentHero.stats.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80 max-w-lg mx-auto">
                      {currentHero.stats.map((st, i) => (
                        <div key={i} className={i > 0 ? 'border-l border-gray-200 pl-4' : ''}>"""

stats_replacement = """                  {currentHero.stats && currentHero.stats.length > 0 && (
                    <div className={`${
                      viewportMode === 'mobile' ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-3 gap-4'
                    } pt-6 border-t border-gray-200/80 max-w-lg mx-auto`}>
                      {currentHero.stats.map((st, i) => (
                        <div key={i} className={viewportMode !== 'mobile' && i > 0 ? 'border-l border-gray-200 pl-4' : ''}>"""

if stats_target in builder_code:
    builder_code = builder_code.replace(stats_target, stats_replacement)
    print("Updated Hero stats responsiveness")

# 6. Droppable Canvas Blocks wrapper padding
canvas_target = """            {/* Droppable Canvas Blocks */}
            <div className="w-full p-4 sm:p-6 md:p-8 space-y-2">"""

canvas_replacement = """            {/* Droppable Canvas Blocks */}
            <div className={`w-full space-y-2 ${viewportMode === 'mobile' ? 'p-3' : 'p-4 sm:p-6 md:p-8'}`}>"""

if canvas_target in builder_code:
    builder_code = builder_code.replace(canvas_target, canvas_replacement)
    print("Updated Canvas Blocks wrapper padding")

# 7. Add bottom indicator bar before closing of viewport container
# Find the closing tag of the viewport container (preceding the Property Inspector Sidebar or right sidebar)
bottom_home_bar = """
            {/* Mobile Bottom Home Indicator Bar */}
            {viewportMode === 'mobile' && (
              <div className="w-full py-2.5 bg-gray-50 flex justify-center border-t border-gray-200 shrink-0">
                <div className="w-28 h-1 bg-gray-400 rounded-full"></div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: PROPERTY INSPECTOR */}"""

builder_code = builder_code.replace("""          </div>

          {/* RIGHT SIDEBAR: PROPERTY INSPECTOR */}""", bottom_home_bar)
print("Added bottom home bar indicator")

with open(builder_path, 'w', encoding='utf-8') as f:
    f.write(builder_code)

print("ElementorPageBuilder.tsx successfully updated!")

