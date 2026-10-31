import os

home_path = os.path.join('frontend', 'src', 'pages', 'HomePage.tsx')
with open(home_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace hardcoded hero text with dynamic properties with fallbacks
old_hero_badge = """              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
                <span>DIGITAL MARKETING &amp; SOFTWARE SOLUTIONS</span>
              </div>"""

new_hero_badge = """              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
                <span>{customPageData?.hero_config?.badge || "Top Digital Marketing Agency in Andhra Pradesh"}</span>
              </div>"""

content = content.replace(old_hero_badge, new_hero_badge)

old_hero_title = """              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] font-heading">
                Grow Your Business with{' '}
                <span className="text-sunraise-gradient">Sunraise Solutions</span>
              </h1>"""

new_hero_title = """              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] font-heading">
                {customPageData?.hero_config?.title || "Grow Your Business with"}{' '}
                <span className="text-sunraise-gradient">{customPageData?.hero_config?.highlight_text || "Sunraise Solutions"}</span>
              </h1>"""

content = content.replace(old_hero_title, new_hero_title)

old_hero_sub = """              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl font-normal">
                Hyderabad &amp; Rajahmundry's elite full-stack agency. We blend 18+ years of battle-tested software engineering with algorithmic SEO domination to turn your digital presence into an unstoppable revenue pipeline.
              </p>"""

new_hero_sub = """              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl font-normal">
                {customPageData?.hero_config?.subtitle || "With 18+ years of expertise in digital marketing and software innovation, we help startups, growing brands, and established businesses build a powerful digital presence that drives real results. Headquartered in Hyderabad with a regional center in Rajahmundry."}
              </p>"""

content = content.replace(old_hero_sub, new_hero_sub)

old_stats = """              {/* 3 KPI Counters */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/80">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                    18+ Years
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Proven Experience</div>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-heading">
                    500+
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Projects Delivered</div>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                    98%
                  </div>
                  <div className="text-xs text-gray-500 font-medium">Client Retention</div>
                </div>
              </div>"""

new_stats = """              {/* 3 KPI Counters */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200/80">
                <div className="space-y-1">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                    {customPageData?.hero_config?.stats?.[0]?.val || "18+ Years"}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {customPageData?.hero_config?.stats?.[0]?.label || "Proven Experience"}
                  </div>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-orange-600 font-heading">
                    {customPageData?.hero_config?.stats?.[1]?.val || "500+"}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {customPageData?.hero_config?.stats?.[1]?.label || "Projects Delivered"}
                  </div>
                </div>
                <div className="space-y-1 border-l border-gray-200 pl-4">
                  <div className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                    {customPageData?.hero_config?.stats?.[2]?.val || "98%"}
                  </div>
                  <div className="text-xs text-gray-500 font-medium">
                    {customPageData?.hero_config?.stats?.[2]?.label || "Client Retention"}
                  </div>
                </div>
              </div>"""

content = content.replace(old_stats, new_stats)

with open(home_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("HomePage.tsx dynamically bound to hero_config!")

