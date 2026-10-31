import os

# 1. Update frontend/src/types/index.ts
types_path = os.path.join('frontend', 'src', 'types', 'index.ts')
with open(types_path, 'r', encoding='utf-8') as f:
    types_code = f.read()

# Add to HeroConfig
if 'background_image?: string;' not in types_code:
    types_code = types_code.replace(
        '  hero_image: string;\n  stats: HeroStat[];',
        '  hero_image: string;\n  background_image?: string;\n  background_overlay?: string;\n  background_overlay_opacity?: number;\n  stats: HeroStat[];'
    )
    print("Updated HeroConfig in index.ts")

# Add to BlockStyles
if 'backgroundImage?: string;' not in types_code:
    types_code = types_code.replace(
        '  align?: \'left\' | \'center\' | \'right\';\n  responsiveHide?: {',
        """  align?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backgroundRepeat?: 'no-repeat' | 'repeat';
  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
  responsiveHide?: {"""
    )
    print("Updated BlockStyles in index.ts")

with open(types_path, 'w', encoding='utf-8') as f:
    f.write(types_code)


# 2. Update frontend/src/components/builder/VisualBlockRenderer.tsx
vbr_path = os.path.join('frontend', 'src', 'components', 'builder', 'VisualBlockRenderer.tsx')
with open(vbr_path, 'r', encoding='utf-8') as f:
    vbr_code = f.read()

old_wrapper_code = """  // Outer container styling based on block.styles
  const wrapperStyle: React.CSSProperties = {
    backgroundColor: styles.backgroundColor || undefined,
    color: styles.textColor || undefined,
    paddingTop: styles.paddingY ? `${styles.paddingY}px` : undefined,
    paddingBottom: styles.paddingY ? `${styles.paddingY}px` : undefined,
    paddingLeft: styles.paddingX ? `${styles.paddingX}px` : undefined,
    paddingRight: styles.paddingX ? `${styles.paddingX}px` : undefined,
    marginTop: styles.marginY ? `${styles.marginY}px` : undefined,
    marginBottom: styles.marginY ? `${styles.marginY}px` : undefined,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    textAlign: styles.align || undefined
  };"""

new_wrapper_code = """  // Outer container styling based on block.styles
  const hasBgImg = Boolean(styles.backgroundImage);

  // Calculate overlay gradient if background image is active
  let bgImageStyle: string | undefined = undefined;
  if (hasBgImg) {
    if (styles.backgroundOverlay) {
      const opacity = (styles.backgroundOverlayOpacity !== undefined ? styles.backgroundOverlayOpacity : 50) / 100;
      let overlayColor = styles.backgroundOverlay;
      if (overlayColor.startsWith('#')) {
        const r = parseInt(overlayColor.slice(1, 3), 16) || 0;
        const g = parseInt(overlayColor.slice(3, 5), 16) || 0;
        const b = parseInt(overlayColor.slice(5, 7), 16) || 0;
        overlayColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      bgImageStyle = `linear-gradient(${overlayColor}, ${overlayColor}), url("${styles.backgroundImage}")`;
    } else {
      bgImageStyle = `url("${styles.backgroundImage}")`;
    }
  }

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: hasBgImg ? (styles.backgroundColor || 'transparent') : (styles.backgroundColor || undefined),
    color: styles.textColor || (hasBgImg && styles.backgroundOverlay ? '#ffffff' : undefined),
    paddingTop: styles.paddingY ? `${styles.paddingY}px` : undefined,
    paddingBottom: styles.paddingY ? `${styles.paddingY}px` : undefined,
    paddingLeft: styles.paddingX ? `${styles.paddingX}px` : undefined,
    paddingRight: styles.paddingX ? `${styles.paddingX}px` : undefined,
    marginTop: styles.marginY ? `${styles.marginY}px` : undefined,
    marginBottom: styles.marginY ? `${styles.marginY}px` : undefined,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    textAlign: styles.align || undefined,
    backgroundImage: bgImageStyle,
    backgroundSize: hasBgImg ? (styles.backgroundSize || 'cover') : undefined,
    backgroundPosition: hasBgImg ? (styles.backgroundPosition || 'center') : undefined,
    backgroundRepeat: hasBgImg ? (styles.backgroundRepeat || 'no-repeat') : undefined,
    position: 'relative'
  };"""

if old_wrapper_code in vbr_code:
    vbr_code = vbr_code.replace(old_wrapper_code, new_wrapper_code)
    print("Updated wrapperStyle in VisualBlockRenderer.tsx")
else:
    print("Could not find old_wrapper_code in VisualBlockRenderer.tsx")

with open(vbr_path, 'w', encoding='utf-8') as f:
    f.write(vbr_code)


# 3. Update frontend/src/components/builder/ElementSettingsSidebar.tsx
sidebar_path = os.path.join('frontend', 'src', 'components', 'builder', 'ElementSettingsSidebar.tsx')
with open(sidebar_path, 'r', encoding='utf-8') as f:
    sidebar_code = f.read()

target_style_tab = """        {activeTab === 'style' && (
          <div className="space-y-4">"""

bg_image_controls = """        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* ==================================================== */}
            {/* SECTION BACKGROUND IMAGE & OVERLAYS                 */}
            {/* ==================================================== */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                  <span>Section Background Image</span>
                </div>
                {styles.backgroundImage && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>

              <ImageInputControl
                label="Upload or Pick Background Image"
                value={styles.backgroundImage || ''}
                onChange={(url) => handleStyleChange('backgroundImage', url)}
                folder="Section Backgrounds"
                placeholder="https://... or upload image"
                helperText="Upload any JPG, PNG or WebP image to render as a full section background."
              />

              {/* Sizing, Position & Overlay Controls if Image Selected */}
              {styles.backgroundImage && (
                <div className="space-y-3 pt-2 border-t border-gray-200/80">
                  {/* Background Sizing */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Display Size</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Cover (Fill)', val: 'cover' },
                        { label: 'Contain', val: 'contain' },
                        { label: 'Auto (Actual)', val: 'auto' }
                      ].map((s) => (
                        <button
                          key={s.val}
                          type="button"
                          onClick={() => handleStyleChange('backgroundSize', s.val as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (styles.backgroundSize || 'cover') === s.val
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Position */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Image Position</label>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { label: 'Center', val: 'center' },
                        { label: 'Top', val: 'top' },
                        { label: 'Bottom', val: 'bottom' },
                        { label: 'Left', val: 'left' },
                        { label: 'Right', val: 'right' }
                      ].map((pos) => (
                        <button
                          key={pos.val}
                          type="button"
                          onClick={() => handleStyleChange('backgroundPosition', pos.val as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (styles.backgroundPosition || 'center') === pos.val
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Repeat */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Tiling / Repeat</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: 'No Repeat', val: 'no-repeat' },
                        { label: 'Tile Repeat', val: 'repeat' }
                      ].map((rep) => (
                        <button
                          key={rep.val}
                          type="button"
                          onClick={() => handleStyleChange('backgroundRepeat', rep.val as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (styles.backgroundRepeat || 'no-repeat') === rep.val
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast Overlay Controls */}
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-800">Contrast Color Overlay</label>
                      <span className="text-[10px] font-mono font-bold text-orange-600">
                        {styles.backgroundOverlayOpacity !== undefined ? `${styles.backgroundOverlayOpacity}%` : (styles.backgroundOverlay ? '50%' : 'None')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={styles.backgroundOverlay && styles.backgroundOverlay.startsWith('#') ? styles.backgroundOverlay : '#000000'}
                        onChange={(e) => {
                          handleStyleChange('backgroundOverlay', e.target.value);
                          if (styles.backgroundOverlayOpacity === undefined) {
                            handleStyleChange('backgroundOverlayOpacity', 50);
                          }
                        }}
                        className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                        title="Choose Overlay Tint Color"
                      />
                      <input
                        type="range"
                        min="0"
                        max="95"
                        step="5"
                        value={styles.backgroundOverlayOpacity !== undefined ? styles.backgroundOverlayOpacity : (styles.backgroundOverlay ? 50 : 0)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleStyleChange('backgroundOverlayOpacity', val);
                          if (val > 0) {
                            if (!styles.backgroundOverlay) {
                              handleStyleChange('backgroundOverlay', '#000000');
                            }
                          } else {
                            handleStyleChange('backgroundOverlay', undefined);
                          }
                        }}
                        className="flex-1 accent-orange-600"
                      />
                    </div>

                    {/* Quick Text Contrast Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleStyleChange('textColor', '#ffffff')}
                        className="flex-1 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-bold hover:bg-black transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <span>Set White Text</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStyleChange('textColor', '#111827')}
                        className="flex-1 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[10px] font-bold hover:bg-gray-50 transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <span>Set Dark Text</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>"""

if target_style_tab in sidebar_code:
    sidebar_code = sidebar_code.replace(target_style_tab, bg_image_controls)
    print("Added Section Background Image controls to ElementSettingsSidebar.tsx")
else:
    print("Could not find target_style_tab in ElementSettingsSidebar.tsx")

with open(sidebar_path, 'w', encoding='utf-8') as f:
    f.write(sidebar_code)

print("Section background feature scripted successfully!")

