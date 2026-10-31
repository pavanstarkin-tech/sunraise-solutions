with open('frontend/src/components/builder/ElementSettingsSidebar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-orange-600">Review #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentReviews.filter((_: any, i: number) => i !== idx);
                                    handlePropChange('reviews', updated);
                                  }}
                                  className="text-red-400 hover:text-red-600 p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-2">"""

replacement = """                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-orange-600">Review #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentReviews.filter((_: any, i: number) => i !== idx);
                                    handlePropChange('reviews', updated);
                                  }}
                                  className="text-red-400 hover:text-red-600 p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <ImageInputControl
                                label="Client Photo / Avatar"
                                value={rev.avatar_url || rev.image_url || ''}
                                onChange={(url) => {
                                  const updated = currentReviews.map((r: any, i: number) =>
                                    i === idx ? { ...r, avatar_url: url, image_url: url } : r
                                  );
                                  handlePropChange('reviews', updated);
                                }}
                                folder="Testimonials"
                                placeholder="https://... or upload client photo"
                              />

                              <div className="grid grid-cols-2 gap-2">"""

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement.replace('\r\n', '\n'), 1)
    with open('frontend/src/components/builder/ElementSettingsSidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print("SUCCESS: ElementSettingsSidebar updated with Testimonial photo upload")
else:
    print("Target not found in ElementSettingsSidebar")

