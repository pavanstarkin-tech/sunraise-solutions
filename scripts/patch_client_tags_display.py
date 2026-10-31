import os

# 1. Update HomePage.tsx
home_path = os.path.join('frontend', 'src', 'pages', 'HomePage.tsx')
with open(home_path, 'r', encoding='utf-8') as f:
    home_code = f.read()

# Replace Read Study with View Project and add technologies tags
old_home_card = """                    <h3 className="text-lg font-bold text-gray-900 font-heading mb-3 group-hover:text-orange-600 transition">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {project.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    {project.service_code}
                  </span>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    <span>Read Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>"""

new_home_card = """                    <h3 className="text-lg font-bold text-gray-900 font-heading mb-2 group-hover:text-orange-600 transition">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {project.summary}
                    </p>

                    {/* Tag Property / Technologies Chips */}
                    {project.technologies && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(typeof project.technologies === 'string'
                          ? project.technologies.split(',')
                          : (Array.isArray(project.technologies) ? project.technologies : [])
                        ).map((t: string) => t.trim()).filter(Boolean).slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    {project.service_code}
                  </span>
                  <Link
                    to="/projects"
                    className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    <span>View Project</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>"""

if old_home_card in home_code:
    home_code = home_code.replace(old_home_card, new_home_card)
    print("Updated project card with tags in HomePage.tsx")
else:
    print("Could not find old_home_card in HomePage.tsx")

with open(home_path, 'w', encoding='utf-8') as f:
    f.write(home_code)


# 2. Update ProjectsPage.tsx
proj_path = os.path.join('frontend', 'src', 'pages', 'ProjectsPage.tsx')
with open(proj_path, 'r', encoding='utf-8') as f:
    proj_code = f.read()

old_proj_card = """                    <h3 className="text-lg font-bold text-gray-900 font-heading mt-1 mb-3 group-hover:text-orange-600 transition">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {proj.summary}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    {proj.service_code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition">
                    <span>View Case Breakdown</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>"""

new_proj_card = """                    <h3 className="text-lg font-bold text-gray-900 font-heading mt-1 mb-2 group-hover:text-orange-600 transition">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {proj.summary}
                    </p>

                    {/* Tag Property / Technologies Chips */}
                    {proj.technologies && (
                      <div className="flex flex-wrap gap-1 mt-3">
                        {(typeof proj.technologies === 'string'
                          ? proj.technologies.split(',')
                          : (Array.isArray(proj.technologies) ? proj.technologies : [])
                        ).map((t: string) => t.trim()).filter(Boolean).slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100 text-orange-700 text-[10px] font-bold"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold text-gray-400">
                    {proj.service_code}
                  </span>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 group-hover:translate-x-1 transition">
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>"""

if old_proj_card in proj_code:
    proj_code = proj_code.replace(old_proj_card, new_proj_card)
    print("Updated project card with tags in ProjectsPage.tsx")
else:
    print("Could not find old_proj_card in ProjectsPage.tsx")

# Also add tags into the modal in ProjectsPage.tsx
old_modal_title = """            <h2 className="text-2xl font-black text-gray-900 font-heading mt-1 mb-4">
              {selectedProject.title}
            </h2>"""

new_modal_title = """            <h2 className="text-2xl font-black text-gray-900 font-heading mt-1 mb-2">
              {selectedProject.title}
            </h2>

            {/* Tag Property in Modal */}
            {selectedProject.technologies && (
              <div className="flex flex-wrap gap-1.5 mb-4">
                {(typeof selectedProject.technologies === 'string'
                  ? selectedProject.technologies.split(',')
                  : (Array.isArray(selectedProject.technologies) ? selectedProject.technologies : [])
                ).map((t: string) => t.trim()).filter(Boolean).map((tag: string, i: number) => (
                  <span
                    key={i}
                    className="px-2.5 py-1 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}"""

if old_modal_title in proj_code:
    proj_code = proj_code.replace(old_modal_title, new_modal_title)
    print("Updated modal with tags in ProjectsPage.tsx")

with open(proj_path, 'w', encoding='utf-8') as f:
    f.write(proj_code)


# 3. Update ServiceDetailPage.tsx
srv_path = os.path.join('frontend', 'src', 'pages', 'ServiceDetailPage.tsx')
with open(srv_path, 'r', encoding='utf-8') as f:
    srv_code = f.read()

srv_code = srv_code.replace('<span>View All Case Studies</span>', '<span>View All Completed Projects</span>')

with open(srv_path, 'w', encoding='utf-8') as f:
    f.write(srv_code)
print("Updated ServiceDetailPage.tsx")

print("All client-side tag display updates completed!")

