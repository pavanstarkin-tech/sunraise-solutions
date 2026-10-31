import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  FileCode,
  Layers,
  Plus,
  Search,
  Check,
  Compass,
  ArrowUpRight,
  Trash2,
  Copy,
  Edit3,
  Calendar,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Service, CustomPage, PageType, PageStatus } from '../../types';

export const AdminPageEditor: React.FC = () => {
  const navigate = useNavigate();

  // Data lists
  const [services, setServices] = useState<Service[]>([]);
  const [customPages, setCustomPages] = useState<CustomPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search for Dashboard
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Modal: Create New Page with Templates
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newPageTitle, setNewPageTitle] = useState('');
  const [newPageSlug, setNewPageSlug] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<PageType>('service');

  useEffect(() => {
    loadAllPages();
  }, []);

  const loadAllPages = async () => {
    setIsLoading(true);
    const [srvList, pageList] = await Promise.all([
      SunraiseAPI.getServices(),
      SunraiseAPI.getPages()
    ]);
    setServices(srvList);
    setCustomPages(pageList);
    setIsLoading(false);
  };

  const handleOpenWorkspace = (type: 'service' | 'page', id: number) => {
    // Navigate to dedicated full-screen workspace
    navigate(`/admin/builder/workspace?type=${type}&id=${id}`);
  };

  // Create New Page with Template
  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPageTitle.trim()) return;

    const slug = (newPageSlug || newPageTitle)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newPage = await SunraiseAPI.upsertPage({
      title: newPageTitle,
      slug,
      page_type: selectedTemplate,
      status: 'draft',
      hero_config: {
        badge: `${selectedTemplate.toUpperCase()} PAGE`,
        title: newPageTitle,
        highlight_text: 'By Sunraise Solutions',
        subtitle: 'High-performance digital platform engineered for search authority and maximum inbound conversions.',
        primary_cta: 'Claim Free Consultation',
        secondary_cta: 'Explore Solutions',
        hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        stats: [
          { label: 'Client Retention', val: '98%' },
          { label: 'Growth Surge', val: '+280%' }
        ]
      },
      page_blocks: getTemplateBlocks(selectedTemplate, newPageTitle),
      seo_meta: {
        meta_title: `${newPageTitle} | Sunraise Solutions`,
        meta_description: `Discover how Sunraise Solutions delivers enterprise growth and market dominance with ${newPageTitle}.`,
        focus_keyword: newPageTitle,
        robots_index: true,
        robots_follow: true,
        sitemap_include: true
      },
      seo_score: 92,
      author: 'SEO Strategy Team',
      last_modified_by: 'Admin'
    });

    setCreateModalOpen(false);
    setNewPageTitle('');
    setNewPageSlug('');
    handleOpenWorkspace('page', newPage.id);
  };

  const handleDeletePage = async (id: number) => {
    if (confirm('Permanently delete this landing page? Existing rankings may be affected.')) {
      await SunraiseAPI.deletePage(id);
      await loadAllPages();
    }
  };

  const handleDuplicatePage = async (page: CustomPage) => {
    const clone = await SunraiseAPI.upsertPage({
      ...page,
      id: undefined,
      title: `${page.title} (Copy)`,
      slug: `${page.slug}-copy-${Date.now().toString().slice(-4)}`,
      status: 'draft'
    });
    await loadAllPages();
    handleOpenWorkspace('page', clone.id);
  };

  // Combine services and custom pages for dashboard view
  const allDashboardItems = [
    ...services.map((s) => ({
      id: s.id,
      title: s.title,
      slug: s.slug,
      type: 'service' as const,
      category: 'Service Page',
      status: (s.is_published ? 'published' : 'draft') as PageStatus,
      updated_at: s.updated_at || s.created_at || new Date().toISOString(),
      seo_score: 94,
      author: 'Sunraise Architecture',
      blocksCount: s.page_blocks?.length || 0,
      isCore: false,
      publicPath: `/services/${s.slug}`,
      raw: s
    })),
    ...customPages.map((p) => ({
      id: p.id,
      title: p.title,
      slug: p.slug,
      type: 'page' as const,
      category: p.page_type === 'core' ? 'Core Website Page' : `${p.page_type.charAt(0).toUpperCase() + p.page_type.slice(1)} Page`,
      status: p.status,
      updated_at: p.updated_at || p.created_at || new Date().toISOString(),
      seo_score: p.seo_score || 88,
      author: p.author || 'SEO Team',
      blocksCount: p.page_blocks?.length || 0,
      isCore: p.page_type === 'core',
      publicPath: p.page_type === 'core' ? (p.slug === 'home' ? '/' : `/${p.slug}`) : `/p/${p.slug}`,
      raw: p
    }))
  ];

  const filteredItems = allDashboardItems.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.slug.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' 
      || (filterType === 'core' && (item as any).isCore)
      || (filterType === 'page' && !(item as any).isCore && item.type === 'page')
      || (filterType === 'service' && item.type === 'service');
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-warm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <FileCode className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-heading">
              Visual Page Builder &amp; Page Management
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Select any page to launch the dedicated full-screen visual workspace, or create new high-converting pages.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-sunraise-gradient text-white font-extrabold text-xs shadow-sunraise hover:shadow-sunraise-lg transition hover:scale-105 duration-200"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Managed Pages</p>
          <p className="text-2xl font-black text-gray-900 font-heading mt-1">{allDashboardItems.length}</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Published Live</p>
          <p className="text-2xl font-black text-emerald-600 font-heading mt-1">
            {allDashboardItems.filter((i) => i.status === 'published').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Drafts in Progress</p>
          <p className="text-2xl font-black text-amber-600 font-heading mt-1">
            {allDashboardItems.filter((i) => i.status === 'draft').length}
          </p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Avg SEO Score</p>
          <p className="text-2xl font-black text-orange-600 font-heading mt-1">94 / 100</p>
        </div>
      </div>

      {/* Core Website Pages Quick Launch Shelf */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-orange-50/80 via-white to-amber-50/50 border border-orange-100/80 shadow-warm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-orange-600" />
            <h3 className="text-sm font-extrabold text-gray-900 font-heading">
              Core Frontend Pages (1-Click Visual Editor)
            </h3>
          </div>
          <span className="text-xs text-orange-600 font-bold bg-white px-3 py-1 rounded-full shadow-sm border border-orange-100">
            Edit each page visually from admin
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: 'Home Page', slug: 'home', path: '/' },
            { label: 'About Us', slug: 'about', path: '/about' },
            { label: 'Services Hub', slug: 'services', path: '/services' },
            { label: 'Projects', slug: 'projects', path: '/projects' },
            { label: 'Blog & Articles', slug: 'blog', path: '/blog' },
            { label: 'Contact Us', slug: 'contact', path: '/contact' }
          ].map((cp) => {
            const pageMatch = customPages.find((p) => p.slug === cp.slug);
            return (
              <div key={cp.slug} className="p-3.5 rounded-2xl bg-white border border-gray-200/90 hover:border-orange-300 shadow-sm transition space-y-2.5 flex flex-col justify-between">
                <div>
                  <p className="font-bold text-xs text-gray-900 truncate">{cp.label}</p>
                  <p className="text-[10px] font-mono text-gray-400 mt-0.5 truncate">{cp.path}</p>
                </div>
                <div className="space-y-1.5 pt-1 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      if (pageMatch) {
                        handleOpenWorkspace('page', pageMatch.id);
                      } else {
                        // Create and open
                        SunraiseAPI.upsertPage({
                          title: cp.label,
                          slug: cp.slug,
                          page_type: 'core',
                          status: 'published'
                        }).then((np) => handleOpenWorkspace('page', np.id));
                      }
                    }}
                    className="w-full py-1.5 rounded-xl bg-sunraise-gradient text-white font-extrabold text-[11px] shadow-sunraise hover:shadow-sunraise-lg transition flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit in Builder</span>
                  </button>
                  <a
                    href={cp.path}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-1 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-600 text-[10px] font-bold text-center block transition"
                  >
                    View Live &rarr;
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Filters & Search */}
      <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search pages by title or URL slug..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Type:</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-gray-200 bg-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="core">Core Website Pages (Home, About, etc.)</option>
              <option value="service">Service Pages</option>
              <option value="page">Custom Landing Pages</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-500">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-gray-200 bg-white focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100 text-[11px] font-bold uppercase tracking-wider text-gray-500">
                <th className="p-4 pl-6">Page Title &amp; Slug</th>
                <th className="p-4">Type</th>
                <th className="p-4">SEO Health</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Modified</th>
                <th className="p-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {filteredItems.map((item) => (
                <tr
                  key={`${item.type}-${item.id}`}
                  className="hover:bg-orange-50/20 transition group"
                >
                  <td className="p-4 pl-6">
                    <div>
                      <p className="font-bold text-gray-900 group-hover:text-orange-600 transition text-sm">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mt-0.5">
                        <span>{(item as any).publicPath || (item.type === 'service' ? `/services/${item.slug}` : `/p/${item.slug}`)}</span>
                        <span>• {item.blocksCount} sections</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-gray-100 text-gray-700 font-semibold text-[11px]">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] text-white ${
                          item.seo_score >= 85
                            ? 'bg-emerald-500'
                            : item.seo_score >= 65
                            ? 'bg-amber-500'
                            : 'bg-red-500'
                        }`}
                      >
                        {item.seo_score}
                      </div>
                      <span className="text-[11px] text-gray-500 font-medium">Optimal</span>
                    </div>
                  </td>

                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${
                        item.status === 'published'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          item.status === 'published' ? 'bg-emerald-500' : 'bg-amber-500'
                        }`}
                      />
                      {item.status}
                    </span>
                  </td>

                  <td className="p-4 text-gray-500 text-[11px]">
                    <div>{new Date(item.updated_at).toLocaleDateString()}</div>
                    <div className="text-gray-400 text-[10px]">by {item.author}</div>
                  </td>

                  <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {/* Launch Dedicated Workspace */}
                      <button
                        type="button"
                        onClick={() => handleOpenWorkspace(item.type, item.id)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs shadow-sm hover:bg-orange-700 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Open Workspace</span>
                      </button>

                      {/* Preview Public Page */}
                      <a
                        href={(item as any).publicPath || (item.type === 'service' ? `/services/${item.slug}` : `/p/${item.slug}`)}
                        target="_blank"
                        rel="noreferrer"
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                        title="Preview Public Page"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </a>

                      {/* Duplicate */}
                      {item.type === 'page' && (
                        <button
                          type="button"
                          onClick={() => handleDuplicatePage(item.raw as CustomPage)}
                          className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
                          title="Duplicate Page"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      )}

                      {/* Delete */}
                      {item.type === 'page' && (
                        <button
                          type="button"
                          onClick={() => handleDeletePage(item.id)}
                          className="p-2 rounded-xl text-red-400 hover:text-red-700 hover:bg-red-50 transition"
                          title="Delete Page"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW PAGE WITH TEMPLATES MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-black text-gray-900 font-heading">
              Create New Website Page
            </h3>
            <p className="text-xs text-gray-500 mt-1 mb-6">
              Select a pre-architected high-converting template to launch quickly.
            </p>

            <form onSubmit={handleCreatePage} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-700">Page Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad Healthcare SEO Specialists"
                  value={newPageTitle}
                  onChange={(e) => {
                    setNewPageTitle(e.target.value);
                    if (!newPageSlug) {
                      setNewPageSlug(
                        e.target.value
                          .toLowerCase()
                          .replace(/[^a-z0-9]+/g, '-')
                          .replace(/(^-|-$)/g, '')
                      );
                    }
                  }}
                  className="w-full mt-1.5 p-3 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Target URL Slug</label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden mt-1.5">
                  <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-xs font-mono border-r border-gray-200 select-none">
                    /p/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="hyderabad-healthcare-seo"
                    value={newPageSlug}
                    onChange={(e) =>
                      setNewPageSlug(
                        e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-')
                      )
                    }
                    className="flex-1 p-2.5 text-xs font-mono font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 mb-2 block">
                  Select Architectural Template
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'service', label: 'Service Page', desc: 'Features, Process & FAQ' },
                    { id: 'location', label: 'Location Hub', desc: 'Local schema & map pack' },
                    { id: 'campaign', label: 'Campaign Landing', desc: 'Audit offer & lead form' }
                  ].map((tpl) => (
                    <div
                      key={tpl.id}
                      onClick={() => setSelectedTemplate(tpl.id as PageType)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition ${
                        selectedTemplate === tpl.id
                          ? 'border-orange-600 bg-orange-50/50 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <p className="text-xs font-bold text-gray-900">{tpl.label}</p>
                      <p className="text-[10px] text-gray-500 mt-0.5">{tpl.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-sunraise-gradient text-white font-extrabold text-xs shadow-sunraise hover:shadow-sunraise-lg transition"
                >
                  Create &amp; Open Workspace &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper: Pre-packaged blocks based on template
function getTemplateBlocks(template: PageType, pageTitle: string) {
  if (template === 'location') {
    return [
      {
        id: `blk-${Date.now()}-1`,
        type: 'visual' as const,
        component_name: 'Heading' as const,
        sort_order: 1,
        props: { level: 'h2', text: `Regional Growth Capabilities for ${pageTitle}`, alignment: 'center' }
      },
      {
        id: `blk-${Date.now()}-2`,
        type: 'visual' as const,
        component_name: 'FeatureGrid' as const,
        sort_order: 2,
        props: {
          title: 'Strategic Local Advantages',
          features: [
            'Hyper-Local Google Maps 3-Pack Optimization',
            'Dedicated Regional Account Executives',
            'Telugu & English Bilingual Ad Campaigns',
            'Sub-Second Core Web Vitals Platform Speeds'
          ]
        }
      },
      {
        id: `blk-${Date.now()}-3`,
        type: 'visual' as const,
        component_name: 'CTABanner' as const,
        sort_order: 3,
        props: {
          badge: 'REGIONAL LEADERSHIP',
          title: 'Schedule a Confidential Strategic Review',
          description: 'Meet our senior solutions team and unlock your personalized market blueprint.',
          button_text: 'Contact Regional Hub',
          button_url: '/contact'
        }
      }
    ];
  }

  if (template === 'campaign') {
    return [
      {
        id: `blk-${Date.now()}-1`,
        type: 'visual' as const,
        component_name: 'Heading' as const,
        sort_order: 1,
        props: { level: 'h2', text: 'Exclusive 2026 Digital Growth Offer', alignment: 'center' }
      },
      {
        id: `blk-${Date.now()}-2`,
        type: 'visual' as const,
        component_name: 'KPICounter' as const,
        sort_order: 2,
        props: {
          stats: [
            { label: 'Organic Traffic Surge', val: '+380%' },
            { label: 'Keywords Page 1', val: '1,450+' },
            { label: 'Client Retention', val: '98%' },
            { label: 'Years Serving AP & TS', val: '18+' }
          ]
        }
      },
      {
        id: `blk-${Date.now()}-3`,
        type: 'visual' as const,
        component_name: 'ContactForm' as const,
        sort_order: 3,
        props: {
          title: 'Claim Your Complimentary Strategy Proposal',
          subtitle: 'Our executive team in Hyderabad & Rajahmundry responds within 24 hours.'
        }
      }
    ];
  }

  // Default: Service Template
  return [
    {
      id: `blk-${Date.now()}-1`,
      type: 'visual' as const,
      component_name: 'Heading' as const,
      sort_order: 1,
      props: { level: 'h2', text: `Engineered Capabilities for ${pageTitle}`, alignment: 'center' }
    },
    {
      id: `blk-${Date.now()}-2`,
      type: 'visual' as const,
      component_name: 'FeatureGrid' as const,
      sort_order: 2,
      props: {
        title: 'Complete 360° Solution Capabilities',
        description: 'Engineered for exponential ROI in Andhra Pradesh and Telangana markets.',
        features: [
          'High-DA White-Hat PR Link Building',
          'Technical Core Web Vitals Optimization',
          'Conversion Rate Optimization (CRO)',
          'Google Business Profile 3-Pack Dominance'
        ]
      }
    },
    {
      id: `blk-${Date.now()}-3`,
      type: 'visual' as const,
      component_name: 'ProcessTimeline' as const,
      sort_order: 3,
      props: {
        title: 'Our Proven Working Methodology',
        steps: [
          { step: '01', title: 'Algorithmic Audit', desc: 'Deep crawler analysis identifying search bottlenecks.' },
          { step: '02', title: 'On-Page Architecture', desc: 'Schema injection and semantic heading optimization.' },
          { step: '03', title: 'PR Authority Velocity', desc: 'High-authority digital PR link building.' },
          { step: '04', title: 'Revenue Attribution', desc: 'GA4 analytics telemetry and ongoing iteration.' }
        ]
      }
    },
    {
      id: `blk-${Date.now()}-4`,
      type: 'visual' as const,
      component_name: 'CTABanner' as const,
      sort_order: 4,
      props: {
        badge: 'GET STARTED',
        title: 'Ready to Dominate Search Rankings?',
        description: 'Claim your 100% free comprehensive technical and competitor audit report today.',
        button_text: 'Claim Free Proposal',
        button_url: '/contact'
      }
    }
  ];
}
