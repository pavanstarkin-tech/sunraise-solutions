with open('frontend/src/components/builder/VisualBlockRenderer.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-8"}`}>
              {items.map((r: any, i: number) => (
                <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-warm">
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(5)].map((_, star) => (
                      <Star key={star} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed italic mb-6">"{r.text}"</p>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                    <p className="text-xs text-gray-500">{r.role}</p>
                  </div>
                </div>
              ))}
            </div>"""

replacement = """            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-8"}`}>
              {items.map((r: any, i: number) => {
                const avatar = r.avatar_url || r.image_url;
                return (
                  <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-warm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(5)].map((_, star) => (
                          <Star key={star} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic mb-6">"{r.text}"</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={r.name || 'Client review'}
                          className="w-11 h-11 rounded-full object-cover border-2 border-orange-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-extrabold flex items-center justify-center text-sm shrink-0 border border-orange-200">
                          {(r.name || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>"""

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement.replace('\r\n', '\n'), 1)
    with open('frontend/src/components/builder/VisualBlockRenderer.tsx', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print("SUCCESS: VisualBlockRenderer updated with testimonial photo rendering")
else:
    print("Target not found in VisualBlockRenderer")

