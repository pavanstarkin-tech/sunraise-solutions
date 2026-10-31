with open('frontend/src/components/builder/ElementSettingsSidebar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """                      <ImageInputControl
                        label="Slide Image"
                        value={slide.url || ''}
                        onChange={(url) => {
                          const cur = [...(props.slides || [])];
                          cur[sIdx] = { ...cur[sIdx], url };
                          handlePropChange('slides', cur);
                        }}
                        onOpenMediaModal={() => {
                          setMediaCallback(() => (url: string) => {
                            const cur = [...(props.slides || [])];
                            cur[sIdx] = { ...cur[sIdx], url };
                            handlePropChange('slides', cur);
                          });
                          setIsMediaModalOpen(true);
                        }}
                        isUploading={isDirectUploading}
                        onDirectUpload={(e) =>
                          handleDirectUpload(e, 'url', (url) => {
                            const cur = [...(props.slides || [])];
                            cur[sIdx] = { ...cur[sIdx], url };
                            handlePropChange('slides', cur);
                          })
                        }
                      />"""

replacement = """                      <ImageInputControl
                        label="Slide Image"
                        value={slide.url || ''}
                        onChange={(url) => {
                          const cur = [...(props.slides || [])];
                          cur[sIdx] = { ...cur[sIdx], url };
                          handlePropChange('slides', cur);
                        }}
                        folder="Page Elements"
                        placeholder="https://... or upload image"
                      />"""

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement.replace('\r\n', '\n'), 1)
    with open('frontend/src/components/builder/ElementSettingsSidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print("SUCCESS: ImageInputControl updated in ElementSettingsSidebar")
else:
    print("Target not found")

