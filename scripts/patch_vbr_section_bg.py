import os

# 1. Update VisualBlockRenderer.tsx
vbr_path = os.path.join('frontend', 'src', 'components', 'builder', 'VisualBlockRenderer.tsx')
with open(vbr_path, 'r', encoding='utf-8') as f:
    vbr_code = f.read()

# Replace bg-white and bg-gray-50/50 on sections with conditional bg-transparent
vbr_code = vbr_code.replace(
    'className={`py-12 bg-white ${isMobile ? \'px-2\' : \'\'}`}',
    'className={`py-12 ${hasBgImg ? \'bg-transparent\' : \'bg-white\'} ${isMobile ? \'px-2\' : \'\'}`}'
)
vbr_code = vbr_code.replace(
    'className={`py-12 bg-white ${isMobile ? "px-2" : ""}`}',
    'className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"} ${isMobile ? "px-2" : ""}`}'
)
vbr_code = vbr_code.replace(
    'className={`py-12 bg-gray-50/50 ${isMobile ? \'px-2\' : \'\'}`}',
    'className={`py-12 ${hasBgImg ? \'bg-transparent\' : \'bg-gray-50/50\'} ${isMobile ? \'px-2\' : \'\'}`}'
)
vbr_code = vbr_code.replace(
    '<section style={wrapperStyle} className="py-12 bg-gray-50/50">',
    '<section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}'
)
vbr_code = vbr_code.replace(
    '<section style={wrapperStyle} className="py-12 bg-white">',
    '<section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"}`}'
)
vbr_code = vbr_code.replace(
    '<section style={wrapperStyle} className="py-16 bg-gray-50/50">',
    '<section style={wrapperStyle} className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}'
)
vbr_code = vbr_code.replace(
    '<section style={wrapperStyle} className="py-16 bg-white">',
    '<section style={wrapperStyle} className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-white"}`}'
)

with open(vbr_path, 'w', encoding='utf-8') as f:
    f.write(vbr_code)

print("Updated section background classes in VisualBlockRenderer.tsx")


# 2. Update ElementorPageBuilder.tsx with Hero background image support
builder_path = os.path.join('frontend', 'src', 'components', 'builder', 'ElementorPageBuilder.tsx')
with open(builder_path, 'r', encoding='utf-8') as f:
    builder_code = f.read()

# Import ImageInputControl in ElementorPageBuilder.tsx
if 'import { ImageInputControl } from \'./ImageInputControl\';' not in builder_code:
    builder_code = builder_code.replace(
        "import { MediaLibraryModal } from './MediaLibraryModal';",
        "import { MediaLibraryModal } from './MediaLibraryModal';\nimport { ImageInputControl } from './ImageInputControl';"
    )
    print("Imported ImageInputControl in ElementorPageBuilder.tsx")

# Update Hero section rendering to use background_image if present
old_hero_sec = """            {/* Optional Hero Banner if present - Clickable to edit */}
            {currentHero && (
              <section
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                  setIsEditingHero(true);
                }}
                className={`relative w-full shrink-0 ${
                  viewportMode === 'mobile' ? 'pt-6 pb-8 px-4' : 'pt-12 pb-16 px-6 md:px-12'
                } bg-mesh-bg border-b border-gray-200 sunraise-mesh-bg rounded-t-3xl cursor-pointer group transition-all duration-200 ${
                  isEditingHero ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:border-orange-300'
                }`}
              >"""

new_hero_sec = """            {/* Optional Hero Banner if present - Clickable to edit */}
            {currentHero && (
              <section
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                  setIsEditingHero(true);
                }}
                style={{
                  backgroundImage: currentHero.background_image
                    ? (currentHero.background_overlay
                        ? `linear-gradient(${currentHero.background_overlay}, ${currentHero.background_overlay}), url("${currentHero.background_image}")`
                        : `url("${currentHero.background_image}")`)
                    : undefined,
                  backgroundSize: currentHero.background_image ? 'cover' : undefined,
                  backgroundPosition: currentHero.background_image ? 'center' : undefined,
                  color: currentHero.background_image && currentHero.background_overlay ? '#ffffff' : undefined
                }}
                className={`relative w-full shrink-0 ${
                  viewportMode === 'mobile' ? 'pt-6 pb-8 px-4' : 'pt-12 pb-16 px-6 md:px-12'
                } ${currentHero.background_image ? '' : 'bg-mesh-bg sunraise-mesh-bg'} border-b border-gray-200 rounded-t-3xl cursor-pointer group transition-all duration-200 ${
                  isEditingHero ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:border-orange-300'
                }`}
              >"""

if old_hero_sec in builder_code:
    builder_code = builder_code.replace(old_hero_sec, new_hero_sec)
    print("Updated Hero section style in ElementorPageBuilder.tsx")
else:
    print("Could not find old_hero_sec in ElementorPageBuilder.tsx")

# Add Hero Background Image controls to Hero Settings Sidebar
old_stats_sidebar = """              {/* Stats Counters */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">Stats Counters</label>
                  <span className="text-[10px] text-gray-500 font-bold">{(currentHero.stats || []).length} Metrics</span>
                </div>"""

new_stats_sidebar = """              {/* Hero Background Image */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <ImageInputControl
                  label="Hero Background Image"
                  value={currentHero.background_image || ''}
                  onChange={(url) => setCurrentHero({ ...currentHero, background_image: url })}
                  folder="Hero Backgrounds"
                  placeholder="https://... or upload image"
                  helperText="Optional high-resolution background image for the top hero banner."
                />

                {currentHero.background_image && (
                  <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-700">Dark Contrast Overlay</label>
                      <span className="text-[10px] font-mono font-bold text-orange-600">
                        {currentHero.background_overlay_opacity !== undefined ? `${currentHero.background_overlay_opacity}%` : '50%'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="5"
                      value={currentHero.background_overlay_opacity !== undefined ? currentHero.background_overlay_opacity : 50}
                      onChange={(e) => {
                        const op = Number(e.target.value);
                        const color = `rgba(0, 0, 0, ${op / 100})`;
                        setCurrentHero({
                          ...currentHero,
                          background_overlay: op > 0 ? color : undefined,
                          background_overlay_opacity: op
                        });
                      }}
                      className="w-full accent-orange-600"
                    />
                  </div>
                )}
              </div>

              {/* Stats Counters */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">Stats Counters</label>
                  <span className="text-[10px] text-gray-500 font-bold">{(currentHero.stats || []).length} Metrics</span>
                </div>"""

if old_stats_sidebar in builder_code:
    builder_code = builder_code.replace(old_stats_sidebar, new_stats_sidebar)
    print("Added Hero background image controls to Hero Settings Sidebar")
else:
    print("Could not find old_stats_sidebar in ElementorPageBuilder.tsx")

with open(builder_path, 'w', encoding='utf-8') as f:
    f.write(builder_code)

print("Hero background feature scripted successfully!")

