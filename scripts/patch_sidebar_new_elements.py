with open('frontend/src/components/builder/ElementSettingsSidebar.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """            {/* RAW HTML BLOCK */}
            {block.type === 'html' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700">Raw HTML Content</label>
                <textarea
                  rows={8}
                  value={block.html_content || ''}
                  onChange={(e) => onUpdate({ ...block, html_content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 focus:outline-none focus:border-orange-500"
                />
                <label className="text-xs font-bold text-gray-700">Scoped CSS</label>
                <textarea
                  rows={4}
                  value={block.css_content || ''}
                  onChange={(e) => onUpdate({ ...block, css_content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 focus:outline-none focus:border-orange-500"
                  placeholder=".my-class { color: orange; }"
                />
              </div>
            )}"""

replacement = """            {/* RAW HTML & CUSTOM CODE BLOCK */}
            {(block.type === 'html' || block.component_name === 'RawHTML') && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">HTML Code & Markup</label>
                  <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Tailwind Ready</span>
                </div>

                {/* Quick HTML Templates */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">Insert Ready-Made Template</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const template = `<div class="p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center">
  <span class="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-3">CONVERSION ENGINE</span>
  <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Accelerate Your Digital Revenue Today</h2>
  <p class="text-sm text-gray-600 max-w-xl mx-auto mb-6">Partner with senior architects in Hyderabad & Rajahmundry for verified ROI.</p>
  <a href="/contact" class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg transition">Claim Free Strategy Audit &rarr;</a>
</div>`;
                        onUpdate({ ...block, html_content: template, props: { ...props, html_content: template } });
                      }}
                      className="p-2 rounded-lg border border-gray-200 hover:border-orange-400 text-[11px] text-gray-700 font-semibold bg-white text-left transition"
                    >
                      + Conversion CTA
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const template = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
  <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
    <div class="text-3xl font-black text-orange-600 mb-1">99.9%</div>
    <div class="text-xs font-bold text-gray-900 uppercase">Uptime SLA</div>
    <p class="text-xs text-gray-500 mt-1">High-availability cloud architecture</p>
  </div>
  <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
    <div class="text-3xl font-black text-orange-600 mb-1">4.6x</div>
    <div class="text-xs font-bold text-gray-900 uppercase">Average ROAS</div>
    <p class="text-xs text-gray-500 mt-1">Verified commercial ad campaigns</p>
  </div>
  <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
    <div class="text-3xl font-black text-orange-600 mb-1">18+</div>
    <div class="text-xs font-bold text-gray-900 uppercase">Years Mastery</div>
    <p class="text-xs text-gray-500 mt-1">AP & Telangana regional dominance</p>
  </div>
</div>`;
                        onUpdate({ ...block, html_content: template, props: { ...props, html_content: template } });
                      }}
                      className="p-2 rounded-lg border border-gray-200 hover:border-orange-400 text-[11px] text-gray-700 font-semibold bg-white text-left transition"
                    >
                      + 3-Stat Ribbon
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={block.html_content || props.html_content || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdate({ ...block, html_content: val, props: { ...props, html_content: val } });
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 focus:outline-none focus:border-orange-500"
                  placeholder="<div>Place HTML & Tailwind classes here</div>"
                />

                <label className="text-xs font-bold text-gray-700">Scoped CSS</label>
                <textarea
                  rows={3}
                  value={block.css_content || ''}
                  onChange={(e) => onUpdate({ ...block, css_content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 focus:outline-none focus:border-orange-500"
                  placeholder=".my-custom-class { color: orange; }"
                />
              </div>
            )}

            {/* ==================================================== */}
            {/* IMAGE SLIDER SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'ImageSlider' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title (Optional)</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Featured Visual Gallery"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="e.g. High-resolution showcase of recent creative deployments."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Slider Height</label>
                    <select
                      value={props.height || '420px'}
                      onChange={(e) => handlePropChange('height', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="320px">Compact (320px)</option>
                      <option value="420px">Standard (420px)</option>
                      <option value="520px">Tall (520px)</option>
                      <option value="600px">Hero Cinematic (600px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Image Overlay</label>
                    <select
                      value={props.overlay || 'gradient'}
                      onChange={(e) => handlePropChange('overlay', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="gradient">Gradient Overlay</option>
                      <option value="dark">Dark Tint</option>
                      <option value="none">No Overlay</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">Autoplay Slides</span>
                    <input
                      type="checkbox"
                      checked={props.autoplay !== false}
                      onChange={(e) => handlePropChange('autoplay', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                  </div>
                  {props.autoplay !== false && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                      <span className="text-gray-600 font-medium">Interval (seconds):</span>
                      <input
                        type="number"
                        min={2}
                        max={15}
                        value={props.interval || 4}
                        onChange={(e) => handlePropChange('interval', Number(e.target.value))}
                        className="w-16 p-1 text-center font-bold font-mono rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                {/* Slides List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Slides ({(props.slides || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const curSlides = props.slides || [];
                        handlePropChange('slides', [
                          ...curSlides,
                          {
                            id: `slide-${Date.now()}`,
                            url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
                            title: 'New Slide Capability',
                            caption: 'Description of your featured project or deployment.',
                            link_url: '/contact',
                            link_text: 'Learn More'
                          }
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slide</span>
                    </button>
                  </div>

                  {(props.slides || []).map((slide: any, sIdx: number) => (
                    <div key={slide.id || sIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-gray-900 font-heading">
                          Slide #{sIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.slides || [])];
                            cur.splice(sIdx, 1);
                            handlePropChange('slides', cur);
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Remove slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <ImageInputControl
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
                      />

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Slide Title</label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => {
                            const cur = [...(props.slides || [])];
                            cur[sIdx] = { ...cur[sIdx], title: e.target.value };
                            handlePropChange('slides', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Caption / Description</label>
                        <textarea
                          rows={2}
                          value={slide.caption || ''}
                          onChange={(e) => {
                            const cur = [...(props.slides || [])];
                            cur[sIdx] = { ...cur[sIdx], caption: e.target.value };
                            handlePropChange('slides', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">CTA Link</label>
                          <input
                            type="text"
                            value={slide.link_url || ''}
                            onChange={(e) => {
                              const cur = [...(props.slides || [])];
                              cur[sIdx] = { ...cur[sIdx], link_url: e.target.value };
                              handlePropChange('slides', cur);
                            }}
                            placeholder="/services"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Button Label</label>
                          <input
                            type="text"
                            value={slide.link_text || ''}
                            onChange={(e) => {
                              const cur = [...(props.slides || [])];
                              cur[sIdx] = { ...cur[sIdx], link_text: e.target.value };
                              handlePropChange('slides', cur);
                            }}
                            placeholder="Learn More"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* CARD SLIDER SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'CardSlider' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Strategic Solutions & Capabilities"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="e.g. Explore our multi-disciplinary digital growth frameworks."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Cards ({(props.cards || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const curCards = props.cards || [];
                      handlePropChange('cards', [
                        ...curCards,
                        {
                          id: `card-${Date.now()}`,
                          badge: 'SOLUTIONS',
                          title: 'New Service Capability',
                          description: 'Engineered architecture with high-converting user experience.',
                          link_url: '/services',
                          link_text: 'Explore'
                        }
                      ]);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(props.cards || []).map((card: any, cIdx: number) => (
                    <div key={card.id || cIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-gray-900 font-heading">
                          Card #{cIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.cards || [])];
                            cur.splice(cIdx, 1);
                            handlePropChange('cards', cur);
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Badge</label>
                          <input
                            type="text"
                            value={card.badge || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], badge: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            placeholder="ENGINEERING"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold uppercase focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Card Title</label>
                          <input
                            type="text"
                            value={card.title || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], title: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Description</label>
                        <textarea
                          rows={2}
                          value={card.description || ''}
                          onChange={(e) => {
                            const cur = [...(props.cards || [])];
                            cur[cIdx] = { ...cur[cIdx], description: e.target.value };
                            handlePropChange('cards', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Link URL</label>
                          <input
                            type="text"
                            value={card.link_url || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], link_url: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            placeholder="/contact"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Link Text</label>
                          <input
                            type="text"
                            value={card.link_text || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], link_text: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            placeholder="Learn More"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TEXT SLIDER SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'TextSlider' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title (Optional)</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. What Industry Leaders Say"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="e.g. Direct feedback and milestones from our partners."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Autoplay Quote Ticker</span>
                  <input
                    type="checkbox"
                    checked={props.autoplay !== false}
                    onChange={(e) => handlePropChange('autoplay', e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Quotes &amp; Slides ({(props.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const curItems = props.items || [];
                      handlePropChange('items', [
                        ...curItems,
                        {
                          id: `item-${Date.now()}`,
                          badge: 'CLIENT RESULT',
                          quote: 'Working with Sunraise Solutions transformed our organic traffic velocity.',
                          author: 'Partner Executive',
                          company: 'Corporate Client',
                          metric: '+250% Growth'
                        }
                      ]);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Quote</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(props.items || []).map((item: any, itIdx: number) => (
                    <div key={item.id || itIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-gray-900 font-heading">
                          Quote #{itIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.items || [])];
                            cur.splice(itIdx, 1);
                            handlePropChange('items', cur);
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Badge</label>
                          <input
                            type="text"
                            value={item.badge || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], badge: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="VERIFIED RESULT"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold uppercase focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Metric Tag</label>
                          <input
                            type="text"
                            value={item.metric || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], metric: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="+380% ROAS"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono font-bold text-emerald-700 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Quote Text</label>
                        <textarea
                          rows={3}
                          value={item.quote || ''}
                          onChange={(e) => {
                            const cur = [...(props.items || [])];
                            cur[itIdx] = { ...cur[itIdx], quote: e.target.value };
                            handlePropChange('items', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Author</label>
                          <input
                            type="text"
                            value={item.author || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], author: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="Kiran Kumar"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Company / Role</label>
                          <input
                            type="text"
                            value={item.company || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], company: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="Managing Director"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* MARKUP TAGS & CHIPS SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'MarkupTags' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge</label>
                  <input
                    type="text"
                    value={props.badge || 'CORE COMPETENCIES'}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    placeholder="CORE COMPETENCIES"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold uppercase focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Technology Stack & Frameworks"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Subtitle</label>
                  <input
                    type="text"
                    value={props.description || ''}
                    onChange={(e) => handlePropChange('description', e.target.value)}
                    placeholder="e.g. We engineer with modern battle-tested technologies."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Tag Styling</label>
                    <select
                      value={props.style_variant || 'gradient'}
                      onChange={(e) => handlePropChange('style_variant', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="gradient">Orange Gradient</option>
                      <option value="dark">Dark Enterprise</option>
                      <option value="outline">Outlined Pill</option>
                      <option value="minimal">Minimal Gray</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Alignment</label>
                    <select
                      value={props.alignment || 'center'}
                      onChange={(e) => handlePropChange('alignment', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="center">Centered</option>
                      <option value="left">Left Aligned</option>
                    </select>
                  </div>
                </div>

                {/* Tags List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Tags &amp; Chips ({(props.tags || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const curTags = props.tags || [];
                        handlePropChange('tags', [
                          ...curTags,
                          { label: 'New Tag', category: 'General' }
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tag</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(props.tags || []).map((tag: any, tIdx: number) => (
                      <div key={tIdx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={tag.label || ''}
                          onChange={(e) => {
                            const cur = [...(props.tags || [])];
                            cur[tIdx] = { ...cur[tIdx], label: e.target.value };
                            handlePropChange('tags', cur);
                          }}
                          placeholder="Tag Label (e.g. React 19)"
                          className="flex-1 p-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                        <input
                          type="text"
                          value={tag.category || ''}
                          onChange={(e) => {
                            const cur = [...(props.tags || [])];
                            cur[tIdx] = { ...cur[tIdx], category: e.target.value };
                            handlePropChange('tags', cur);
                          }}
                          placeholder="Category"
                          className="w-24 p-1.5 rounded-lg border border-gray-300 text-[11px] font-mono bg-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.tags || [])];
                            cur.splice(tIdx, 1);
                            handlePropChange('tags', cur);
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Remove tag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}"""

# Normalize CRLF
c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement.replace('\r\n', '\n'), 1)
    with open('frontend/src/components/builder/ElementSettingsSidebar.tsx', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print("SUCCESS: ElementSettingsSidebar updated with controls for all new elements")
else:
    print("Target not found in ElementSettingsSidebar")

