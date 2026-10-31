import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, X, CheckCircle2, TrendingUp, Building2, Tag } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { SunraiseAPI } from '../services/api';
import { Project, CustomPage } from '../types';
import { VisualBlockRenderer } from '../components/builder/VisualBlockRenderer';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [customPageData, setCustomPageData] = useState<CustomPage | null>(null);

  useEffect(() => {
    SunraiseAPI.getProjects().then(setProjects);
    SunraiseAPI.getPageBySlug('projects').then((res) => {
      if (res && res.page_blocks && res.page_blocks.length > 0) {
        setCustomPageData(res);
      }
    });
  }, []);

  const categories = ['All', 'SEO', 'Web Development', 'Hospital Management'];

  const filtered = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category_badge.toLowerCase().includes(activeFilter.toLowerCase()));

  

  return (
    <>
      <SEOHead
        title="Completed Projects Portfolio | Sunraise Solutions"
        description="Explore our verified completed projects in SEO, web development, custom cloud software, and hospital management software across Hyderabad & AP."
        canonicalPath="/projects"
      />

      <section className="py-20 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Demonstrated ROI</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 font-heading leading-tight mb-4">
            Completed Projects &amp; Delivered Platforms
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Real commercial outcomes achieved for leading healthcare networks, academic societies, aerospace manufacturers, and enterprise brands.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                  activeFilter === cat
                    ? 'bg-orange-600 text-white shadow-sunraise'
                    : 'bg-warm-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((proj) => (
              <div
                key={proj.id}
                onClick={() => setSelectedProject(proj)}
                className="rounded-2xl bg-white border border-gray-100 shadow-warm overflow-hidden hover:shadow-warm-hover hover:-translate-y-1.5 transition duration-300 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={proj.thumbnail_url}
                      alt={proj.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-gray-900/85 backdrop-blur-md text-white text-xs font-bold">
                        {proj.category_badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <span className="text-xs font-semibold text-orange-600">
                      {proj.client_name}
                    </span>
                    <h3 className="text-lg font-bold text-gray-900 font-heading mt-1 mb-2 group-hover:text-orange-600 transition">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold">
                {selectedProject.category_badge} • {selectedProject.service_code}
              </span>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <img
              src={selectedProject.thumbnail_url}
              alt={selectedProject.title}
              className="rounded-2xl w-full h-64 object-cover mb-6"
            />

            <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
              Client: {selectedProject.client_name}
            </span>
            <h2 className="text-2xl font-black text-gray-900 font-heading mt-1 mb-2">
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
            )}

            <div className="space-y-4 text-sm text-gray-600 leading-relaxed mb-6">
              <p>{selectedProject.summary}</p>
              <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-800">
                  Key Architectural Accomplishments
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-orange-950 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Sub-second Core Web Vitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>High-DA Backlink Network</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Zero Data Loss Migration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                    <span>Full Funnel Attribution</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <Link
                to={`/services/${selectedProject.service_code === 'SRV-SEO-01' ? 'seo-services-in-hyderabad' : 'web-development'}`}
                className="text-xs font-bold text-gray-600 hover:text-orange-600"
              >
                Explore Associated Service Offering &rarr;
              </Link>
              <button
                onClick={() => setSelectedProject(null)}
                className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-bold text-xs"
              >
                Close Project Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
