import React, { useState, useEffect } from 'react';
import {
  Compass,
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  FileCode,
  Download,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Sliders,
  CheckSquare,
  Square,
  Eye,
  Edit3,
  Layers,
  BookOpen,
  FolderKanban,
  Globe,
  Share2,
  FileText,
  Smartphone,
  Monitor,
  Check,
  X,
  ArrowUpRight,
  Info,
  Tag,
  Plus
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';

import { SEORedirect, SEOPageItem, SEOStats } from '../../types';

export const AdminSEOEngine: React.FC = () => {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'matrix' | 'redirects' | 'sitemap'>('matrix');

  // SEO Pages Data & Stats
  const [pages, setPages] = useState<SEOPageItem[]>([]);
  const [stats, setStats] = useState<SEOStats>({
    total_pages: 0,
    indexed_pages: 0,
    core_pages: 0,
    service_pages: 0,
    blog_pages: 0,
    project_pages: 0,
    avg_health_score: 100
  });
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [redirects, setRedirects] = useState<SEORedirect[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedHealth, setSelectedHealth] = useState<'all' | 'perfect' | 'good' | 'warning'>('all');

  // Bulk Selection
  const [selectedPaths, setSelectedPaths] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Edit SEO Drawer / Modal
  const [editingPage, setEditingPage] = useState<SEOPageItem | null>(null);
  const [editMetaTitle, setEditMetaTitle] = useState('');
  const [editMetaDesc, setEditMetaDesc] = useState('');
  const [editKeywords, setEditKeywords] = useState('');
  const [editCanonical, setEditCanonical] = useState('');
  const [editRobots, setEditRobots] = useState('index, follow');
  const [editOgTitle, setEditOgTitle] = useState('');
  const [editOgDesc, setEditOgDesc] = useState('');
  const [editOgImage, setEditOgImage] = useState('');
  const [editSchemaType, setEditSchemaType] = useState('WebPage');
  const [editCustomSchema, setEditCustomSchema] = useState('');
  const [editPriority, setEditPriority] = useState(0.8);
  const [editChangefreq, setEditChangefreq] = useState('weekly');
  const [editIsIndexed, setEditIsIndexed] = useState(true);
  const [savingPage, setSavingPage] = useState(false);
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadSEOData();
    SunraiseAPI.getSEORedirects().then(setRedirects);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadSEOData = async () => {
    setLoading(true);
    try {
      const data = await SunraiseAPI.getSEOPages({
        type: selectedType !== 'all' ? selectedType : undefined,
        search: searchQuery || undefined
      });
      setPages(data.pages);
      setStats(data.stats);
    } catch (e) {
      console.error('Error loading SEO data:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    setSyncing(true);
    try {
      const msg = await SunraiseAPI.syncSEOPages();
      showToast(msg);
      await loadSEOData();
    } catch (err: any) {
      alert(err.message || 'Auto-sync failed');
    } finally {
      setSyncing(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (p: SEOPageItem) => {
    setEditingPage(p);
    setEditMetaTitle(p.meta_title || p.title);
    setEditMetaDesc(p.meta_description || '');
    setEditKeywords(p.focus_keywords || '');
    setEditCanonical(p.canonical_url || `https://sunraisesolutions.com${p.path}`);
    setEditRobots(p.robots || 'index, follow');
    setEditOgTitle(p.og_title || p.meta_title || p.title);
    setEditOgDesc(p.og_description || p.meta_description || '');
    setEditOgImage(p.og_image || '');
    setEditSchemaType(p.schema_type || 'WebPage');
    setEditCustomSchema(p.custom_schema_json || '');
    setEditPriority(Number(p.sitemap_priority) || 0.8);
    setEditChangefreq(p.sitemap_changefreq || 'weekly');
    setEditIsIndexed(Boolean(p.is_indexed));
  };

  const handleSavePageSEO = async () => {
    if (!editingPage) return;
    setSavingPage(true);
    try {
      await SunraiseAPI.updateSEOPage({
        path: editingPage.path,
        page_type: editingPage.page_type,
        title: editingPage.title,
        meta_title: editMetaTitle,
        meta_description: editMetaDesc,
        focus_keywords: editKeywords,
        canonical_url: editCanonical,
        robots: editRobots,
        og_title: editOgTitle,
        og_description: editOgDesc,
        og_image: editOgImage,
        schema_type: editSchemaType,
        custom_schema_json: editCustomSchema || undefined,
        sitemap_priority: editPriority,
        sitemap_changefreq: editChangefreq,
        is_indexed: editIsIndexed
      });
      setPages((prev) =>
        prev.map((item) =>
          item.path === editingPage.path
            ? {
                ...item,
                meta_title: editMetaTitle,
                meta_description: editMetaDesc,
                focus_keywords: editKeywords,
                canonical_url: editCanonical,
                robots: editRobots,
                sitemap_priority: editPriority,
                sitemap_changefreq: editChangefreq,
                is_indexed: editIsIndexed ? 1 : 0
              }
            : item
        )
      );
      showToast(`SEO metadata updated for ${editingPage.path}!`);
      setEditingPage(null);
      await loadSEOData();
    } catch (err: any) {
      alert(err.message || 'Failed to save SEO metadata');
    } finally {
      setSavingPage(false);
    }
  };

  // Bulk Actions
  const handleSelectAll = () => {
    if (selectedPaths.length === filteredPages.length) {
      setSelectedPaths([]);
    } else {
      setSelectedPaths(filteredPages.map(p => p.path));
    }
  };

  const toggleSelectPath = (path: string) => {
    setSelectedPaths(prev =>
      prev.includes(path) ? prev.filter(p => p !== path) : [...prev, path]
    );
  };

  const handleBulkRobots = async (robotsValue: string) => {
    if (selectedPaths.length === 0) return;
    setBulkLoading(true);
    try {
      await SunraiseAPI.bulkUpdateSEO({
        paths: selectedPaths,
        operation: 'set_robots',
        value: robotsValue
      });
      showToast(`Updated robots to "${robotsValue}" for ${selectedPaths.length} pages.`);
      setSelectedPaths([]);
      await loadSEOData();
    } catch (e: any) {
      alert(e.message || 'Bulk update failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleBulkPriority = async (priorityValue: number) => {
    if (selectedPaths.length === 0) return;
    setBulkLoading(true);
    try {
      await SunraiseAPI.bulkUpdateSEO({
        paths: selectedPaths,
        operation: 'set_priority',
        value: priorityValue
      });
      showToast(`Updated sitemap priority to ${priorityValue} for ${selectedPaths.length} pages.`);
      setSelectedPaths([]);
      await loadSEOData();
    } catch (e: any) {
      alert(e.message || 'Bulk update failed');
    } finally {
      setBulkLoading(false);
    }
  };

  const handleDownloadSitemapXML = () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter(p => p.is_indexed)
  .map(
    (u) => `  <url>
    <loc>https://sunraisesolutions.com${u.path === '/' ? '' : u.path}</loc>
    <lastmod>${u.updated_at ? u.updated_at.slice(0, 10) : new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${u.sitemap_changefreq || 'weekly'}</changefreq>
    <priority>${Number(u.sitemap_priority).toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Filtered pages in UI
  const filteredPages = pages.filter(p => {
    if (selectedType !== 'all' && p.page_type !== selectedType) return false;
    if (selectedHealth === 'perfect' && (p.health_score || 0) < 100) return false;
    if (selectedHealth === 'good' && ((p.health_score || 0) < 80 || (p.health_score || 0) >= 100)) return false;
    if (selectedHealth === 'warning' && (p.health_score || 0) >= 80) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchPath = p.path.toLowerCase().includes(q);
      const matchTitle = (p.meta_title || p.title || '').toLowerCase().includes(q);
      const matchKeywords = (p.focus_keywords || '').toLowerCase().includes(q);
      if (!matchPath && !matchTitle && !matchKeywords) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gray-950 text-white rounded-2xl shadow-2xl border border-orange-500/30 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Streamlined Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-sunraise">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-950 font-heading flex items-center gap-2">
              <span>SEO Engine &amp; Matrix</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                {stats.total_pages || pages.length} Pages
              </span>
            </h1>
            <p className="text-xs text-gray-400">
              Manage meta titles, descriptions, focus keywords, sitemaps, and indexing
            </p>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleForceSync}
            disabled={syncing}
            className="px-3.5 py-2 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200 text-xs font-bold flex items-center gap-2 transition"
            title="Auto-discover and index all website pages"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Re-Indexing...' : 'Sync & Re-Index'}</span>
          </button>

          <button
            onClick={handleDownloadSitemapXML}
            className="px-3.5 py-2 rounded-xl bg-gray-900 text-white hover:bg-black text-xs font-bold flex items-center gap-2 shadow-xs transition"
            title="Export live XML sitemap"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Export sitemap.xml</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Pages</div>
          <div className="text-2xl font-black text-gray-950 mt-1">{stats.total_pages}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Monitored endpoints</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Sitemap Indexed</div>
          <div className="text-2xl font-black text-emerald-600 mt-1">{stats.indexed_pages}</div>
          <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Active in XML crawl</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Avg Health Score</div>
          <div className="text-2xl font-black text-orange-600 mt-1">{stats.avg_health_score}%</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Audit compliance</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Services Matrix</div>
          <div className="text-2xl font-black text-blue-600 mt-1">{stats.service_pages}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Service detail routes</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Blog Articles</div>
          <div className="text-2xl font-black text-purple-600 mt-1">{stats.blog_pages}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Content marketing posts</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Completed Projects</div>
          <div className="text-2xl font-black text-amber-600 mt-1">{stats.project_pages}</div>
          <div className="text-[10px] text-gray-500 mt-0.5">Client project deployments</div>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'matrix'
              ? 'bg-orange-600 text-white shadow-sunraise'
              : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>All Pages SEO Matrix ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('redirects')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'redirects'
              ? 'bg-orange-600 text-white shadow-sunraise'
              : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>301 Permanent Redirects ({redirects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('sitemap')}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition ${
            activeTab === 'sitemap'
              ? 'bg-orange-600 text-white shadow-sunraise'
              : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>Live XML Sitemap &amp; Robots.txt</span>
        </button>
      </div>

      {/* TAB 1: ALL PAGES SEO MATRIX */}
      {activeTab === 'matrix' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search pages by URL path, meta title, keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Page Type Filter Pills */}
              <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                {[
                  { id: 'all', label: 'All Pages' },
                  { id: 'core', label: 'Core Site' },
                  { id: 'service', label: 'Services' },
                  { id: 'blog', label: 'Blogs' },
                  { id: 'project', label: 'Projects' }
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedType(t.id)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                      selectedType === t.id
                        ? 'bg-white text-gray-950 shadow-xs'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Health Filter */}
              <select
                value={selectedHealth}
                onChange={(e) => setSelectedHealth(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-none"
              >
                <option value="all">Health: All</option>
                <option value="perfect">Perfect (100%)</option>
                <option value="good">Good (80-99%)</option>
                <option value="warning">Needs Attention (&lt;80%)</option>
              </select>
            </div>

            {/* Bulk Action Controls */}
            {selectedPaths.length > 0 && (
              <div className="flex items-center gap-2 w-full md:w-auto bg-orange-50 border border-orange-200 p-1.5 rounded-xl animate-in fade-in">
                <span className="text-xs font-extrabold text-orange-900 px-2">
                  {selectedPaths.length} Selected
                </span>
                <button
                  onClick={() => handleBulkRobots('index, follow')}
                  disabled={bulkLoading}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100 text-orange-900 rounded-lg text-[11px] font-bold border border-orange-200 transition"
                >
                  Set Index, Follow
                </button>
                <button
                  onClick={() => handleBulkRobots('noindex, nofollow')}
                  disabled={bulkLoading}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100 text-red-700 rounded-lg text-[11px] font-bold border border-orange-200 transition"
                >
                  Set NoIndex
                </button>
                <button
                  onClick={() => handleBulkPriority(0.9)}
                  disabled={bulkLoading}
                  className="px-2.5 py-1 bg-white hover:bg-orange-100 text-orange-900 rounded-lg text-[11px] font-bold border border-orange-200 transition"
                >
                  Priority 0.9
                </button>
              </div>
            )}
          </div>

          {/* Table Matrix */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-warm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs table-fixed border-collapse">
                <colgroup>
                  <col className="w-10" />
                  <col className="w-[16%]" />
                  <col className="w-[20%]" />
                  <col className="w-[28%]" />
                  <col className="w-[9%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8%]" />
                  <col className="w-[11%]" />
                </colgroup>
                <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-extrabold border-b border-gray-100 text-[10px]">
                  <tr>
                    <th className="py-2.5 px-2 text-center">
                      <button onClick={handleSelectAll} className="text-gray-400 hover:text-gray-900">
                        {selectedPaths.length > 0 && selectedPaths.length === filteredPages.length ? (
                          <CheckSquare className="w-4 h-4 text-orange-600" />
                        ) : (
                          <Square className="w-4 h-4" />
                        )}
                      </button>
                    </th>
                    <th className="py-2.5 px-2">Page Path</th>
                    <th className="py-2.5 px-2">Meta Title</th>
                    <th className="py-2.5 px-2">Focus Keywords</th>
                    <th className="py-2.5 px-1 text-center">Robots</th>
                    <th className="py-2.5 px-1 text-center">Sitemap</th>
                    <th className="py-2.5 px-1 text-center">Health</th>
                    <th className="py-2.5 px-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                        <span>Aggregating and indexing all system pages...</span>
                      </td>
                    </tr>
                  ) : filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-gray-400">
                        No pages match your current search and filters.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((p) => {
                      const isSelected = selectedPaths.includes(p.path);
                      const titleLen = (p.meta_title || p.title || '').length;
                      const descLen = (p.meta_description || '').length;
                      const score = p.health_score || 0;

                      return (
                        <tr
                          key={p.path}
                          className={`hover:bg-gray-50/80 transition ${isSelected ? 'bg-orange-50/40' : ''}`}
                        >
                          <td className="py-2 px-3 text-center">
                            <button onClick={() => toggleSelectPath(p.path)} className="text-gray-400 hover:text-gray-900">
                              {isSelected ? (
                                <CheckSquare className="w-4 h-4 text-orange-600" />
                              ) : (
                                <Square className="w-4 h-4" />
                              )}
                            </button>
                          </td>
                          <td className="py-2.5 px-2.5 overflow-hidden">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span
                                className={`px-1 py-0.5 rounded font-mono text-[9px] font-extrabold uppercase tracking-wider shrink-0 ${
                                  p.page_type === 'core'
                                    ? 'bg-blue-100 text-blue-800'
                                    : p.page_type === 'service'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : p.page_type === 'blog'
                                    ? 'bg-purple-100 text-purple-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {p.page_type}
                              </span>
                              <span className="font-mono font-bold text-gray-900 truncate text-xs block min-w-0" title={p.path}>
                                {p.path}
                              </span>
                              <a
                                href={p.path}
                                target="_blank"
                                rel="noreferrer"
                                className="text-gray-400 hover:text-orange-600 transition shrink-0"
                                title="Open Live Page"
                              >
                                <ArrowUpRight className="w-3 h-3" />
                              </a>
                            </div>
                            <div className="text-[10px] text-gray-400 truncate mt-0.5 block" title={p.title}>
                              {p.title}
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 overflow-hidden">
                            <div className="font-semibold text-gray-900 truncate text-xs block" title={p.meta_title || p.title}>
                              {p.meta_title || p.title}
                            </div>
                            <div className="flex items-center gap-1.5 mt-0.5 text-[10px]">
                              <span
                                className={`font-bold ${
                                  titleLen >= 40 && titleLen <= 65
                                    ? 'text-emerald-600'
                                    : titleLen < 40
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                                }`}
                              >
                                {titleLen}c
                              </span>
                              <span className="text-gray-300">•</span>
                              <span className="text-gray-400 truncate">
                                {descLen}c desc
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-2.5 overflow-hidden">
                            <div className="flex flex-wrap gap-1 max-h-16 overflow-y-auto">
                              {p.focus_keywords ? (
                                p.focus_keywords.split(',').map((kw, i) => (
                                  <span
                                    key={i}
                                    className="px-1.5 py-0.5 rounded-md bg-orange-50 border border-orange-200/60 text-orange-900 text-[10px] font-semibold whitespace-nowrap"
                                  >
                                    #{kw.trim()}
                                  </span>
                                ))
                              ) : (
                                <span className="text-[11px] text-gray-400 italic">None set</span>
                              )}
                            </div>
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="text-[10px] text-orange-600 font-bold hover:text-orange-700 hover:underline inline-flex items-center gap-1 mt-1"
                              title="Edit SEO Tags"
                            >
                              <Tag className="w-2.5 h-2.5" />
                              <span>Edit Tags</span>
                            </button>
                          </td>
                          <td className="py-2.5 px-1 text-center overflow-hidden">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-block ${
                                p.robots?.includes('noindex')
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              {p.robots?.includes('noindex') ? 'noindex' : 'index'}
                            </span>
                          </td>
                          <td className="py-2.5 px-1 text-center overflow-hidden">
                            <div className="inline-flex flex-col items-center">
                              <span className="font-mono text-xs font-bold text-gray-900 leading-tight">
                                {Number(p.sitemap_priority).toFixed(1)}
                              </span>
                              <span className="text-[9px] text-gray-400 capitalize leading-tight">
                                {p.sitemap_changefreq || 'weekly'}
                              </span>
                            </div>
                          </td>
                          <td className="py-2.5 px-1 text-center overflow-hidden">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-extrabold inline-block ${
                                score >= 90
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : score >= 75
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {score}%
                            </span>
                          </td>
                          <td className="py-2.5 px-2 text-center overflow-hidden">
                            <button
                              type="button"
                              onClick={() => handleOpenEdit(p)}
                              className="px-2.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs inline-flex items-center justify-center gap-1 active:scale-95"
                              title="Edit Meta Tags & SEO"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: 301 REDIRECTS */}
      {activeTab === 'redirects' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-warm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-gray-950 text-base">
                Automated 301 Permanent Redirect Registry
              </h3>
              <p className="text-xs text-gray-500">
                Preserved URLs automatically mapped to new endpoints when an admin modifies a slug.
              </p>
            </div>
          </div>

          {redirects.length === 0 ? (
            <div className="p-8 text-center text-gray-400 border border-dashed rounded-2xl text-xs">
              No custom 301 redirects registered yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-y border-gray-100">
                <tr>
                  <th className="py-3 px-4">Old URL Path</th>
                  <th className="py-3 px-4">New Target Path</th>
                  <th className="py-3 px-4">HTTP Status</th>
                  <th className="py-3 px-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {redirects.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition">
                    <td className="py-3 px-4 font-mono font-bold text-red-600">{r.old_path}</td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-600">{r.new_path}</td>
                    <td className="py-3 px-4">
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                        {r.status_code}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-400">{r.created_at}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* TAB 3: LIVE XML SITEMAP */}
      {activeTab === 'sitemap' && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-warm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-heading font-black text-gray-950 text-base">
                Live Google / Bing XML Sitemap Inspector
              </h3>
              <p className="text-xs text-gray-500">
                Generated dynamically from the database and synced with your SEO priority settings.
              </p>
            </div>
            <a
              href="/api/sitemap.php"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 rounded-xl bg-orange-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sunraise"
            >
              <span>View Raw XML Output</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="p-4 rounded-2xl bg-gray-950 text-gray-200 font-mono text-xs overflow-x-auto max-h-96">
            <pre>
{`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter(p => p.is_indexed)
  .map(
    (u) => `  <url>
    <loc>https://sunraisesolutions.com${u.path === '/' ? '' : u.path}</loc>
    <lastmod>${u.updated_at ? u.updated_at.slice(0, 10) : new Date().toISOString().slice(0, 10)}</lastmod>
    <changefreq>${u.sitemap_changefreq || 'weekly'}</changefreq>
    <priority>${Number(u.sitemap_priority).toFixed(1)}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`}
            </pre>
          </div>
        </div>
      )}

      {/* EDIT PAGE SEO MODAL / SLIDE-OVER */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-gray-950/70 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-extrabold px-2 py-0.5 bg-orange-100 text-orange-800 rounded uppercase">
                      {editingPage.page_type}
                    </span>
                    <span className="font-mono text-xs font-bold text-gray-900">{editingPage.path}</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-gray-900 mt-0.5 truncate max-w-md">
                    {editingPage.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setEditingPage(null)}
                className="w-8 h-8 rounded-lg bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Google SERP Preview Card */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-gray-700 flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-orange-600" />
                    <span>Google SERP Simulation Preview</span>
                  </span>
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                    <button
                      onClick={() => setSerpDevice('desktop')}
                      className={`p-1 rounded text-xs ${serpDevice === 'desktop' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-400'}`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setSerpDevice('mobile')}
                      className={`p-1 rounded text-xs ${serpDevice === 'mobile' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-400'}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className={`bg-white p-4 rounded-xl border border-gray-200 shadow-xs ${serpDevice === 'mobile' ? 'max-w-sm' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center text-[9px] text-white font-bold">
                      S
                    </div>
                    <div className="text-[11px] text-gray-600 font-sans truncate">
                      https://sunraisesolutions.com <span className="text-gray-400">{editingPage.path}</span>
                    </div>
                  </div>
                  <div className="text-blue-800 hover:underline font-medium text-base line-clamp-1 cursor-pointer font-sans">
                    {editMetaTitle || editingPage.title}
                  </div>
                  <div className="text-gray-600 text-xs mt-1 line-clamp-2 leading-relaxed font-sans">
                    {editMetaDesc || 'No meta description configured yet. Search engines will generate an automated snippet from the page content.'}
                  </div>
                </div>
              </div>

              {/* Meta Title */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-gray-900">
                    Page Meta Title *
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      editMetaTitle.length >= 40 && editMetaTitle.length <= 60
                        ? 'text-emerald-600'
                        : editMetaTitle.length > 60
                        ? 'text-red-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {editMetaTitle.length} / 60 Chars (Ideal: 50-60)
                  </span>
                </div>
                <input
                  type="text"
                  value={editMetaTitle}
                  onChange={(e) => setEditMetaTitle(e.target.value)}
                  placeholder="e.g. Hospital Management Software (HMS) | Sunraise Solutions"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-extrabold text-gray-900">
                    Page Meta Description *
                  </label>
                  <span
                    className={`text-[11px] font-bold ${
                      editMetaDesc.length >= 130 && editMetaDesc.length <= 160
                        ? 'text-emerald-600'
                        : editMetaDesc.length > 160
                        ? 'text-red-500'
                        : 'text-amber-500'
                    }`}
                  >
                    {editMetaDesc.length} / 160 Chars (Ideal: 140-160)
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={editMetaDesc}
                  onChange={(e) => setEditMetaDesc(e.target.value)}
                  placeholder="Provide a compelling call-to-action summary that entices users on Google to click your search listing."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Focus Keywords & Interactive Tag Manager */}
              <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-orange-600" />
                    <span>Focus Keyword(s) &amp; SEO Tags</span>
                  </label>
                  <span className="text-[10px] text-gray-500 font-bold">
                    {editKeywords.split(',').filter(k => k.trim()).length} Tags Configured
                  </span>
                </div>

                {/* Tag Badges / Chips with Remove 'X' */}
                <div className="flex flex-wrap gap-1.5 min-h-[36px] p-2 bg-white rounded-xl border border-gray-200">
                  {editKeywords.split(',').filter(k => k.trim()).map((kw, i) => {
                    const tag = kw.trim();
                    return (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-orange-100/90 text-orange-950 font-bold text-xs border border-orange-200 group"
                      >
                        <span>#{tag}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const remaining = editKeywords.split(',')
                              .map(k => k.trim())
                              .filter((k, idx) => idx !== i)
                              .join(', ');
                            setEditKeywords(remaining);
                          }}
                          className="hover:text-red-600 p-0.5 rounded transition text-gray-400"
                          title="Remove Tag"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}

                  {editKeywords.split(',').filter(k => k.trim()).length === 0 && (
                    <span className="text-xs text-gray-400 italic py-0.5">
                      No tags yet. Type in the input below to add tags.
                    </span>
                  )}
                </div>

                {/* Quick Add Tag Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="new-tag-input"
                    placeholder="Type a tag and press Enter or click Add (e.g. hyderabad seo, erp software)..."
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        const val = (e.currentTarget.value || '').trim().replace(/^#/, '');
                        if (val) {
                          const existing = editKeywords.split(',').map(k => k.trim()).filter(Boolean);
                          if (!existing.includes(val)) {
                            setEditKeywords([...existing, val].join(', '));
                          }
                          e.currentTarget.value = '';
                        }
                      }
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('new-tag-input') as HTMLInputElement;
                      if (input && input.value.trim()) {
                        const val = input.value.trim().replace(/^#/, '');
                        const existing = editKeywords.split(',').map(k => k.trim()).filter(Boolean);
                        if (!existing.includes(val)) {
                          setEditKeywords([...existing, val].join(', '));
                        }
                        input.value = '';
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 active:scale-95"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Tag</span>
                  </button>
                </div>

                {/* Quick 1-Click Tag Suggestions */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Suggestions:</span>
                  {[
                    'hyderabad',
                    'rajahmundry',
                    'enterprise software',
                    'seo services',
                    'web development',
                    'hospital erp',
                    'digital agency'
                  ].map((sug) => {
                    const existing = editKeywords.split(',').map(k => k.trim().toLowerCase());
                    const isAdded = existing.includes(sug.toLowerCase());
                    return (
                      <button
                        key={sug}
                        type="button"
                        disabled={isAdded}
                        onClick={() => {
                          const current = editKeywords.split(',').map(k => k.trim()).filter(Boolean);
                          if (!isAdded) {
                            setEditKeywords([...current, sug].join(', '));
                          }
                        }}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition ${
                          isAdded
                            ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-orange-400 hover:text-orange-600'
                        }`}
                      >
                        + #{sug}
                      </button>
                    );
                  })}
                </div>

                {/* Comma-separated raw view */}
                <details className="text-[11px] text-gray-500">
                  <summary className="cursor-pointer font-bold hover:text-orange-600 select-none">
                    Edit as raw comma-separated text
                  </summary>
                  <textarea
                    rows={2}
                    value={editKeywords}
                    onChange={(e) => setEditKeywords(e.target.value)}
                    placeholder="tag 1, tag 2, tag 3"
                    className="w-full mt-1.5 p-2 rounded-xl border border-gray-200 text-xs font-mono bg-white focus:outline-none focus:border-orange-500"
                  />
                </details>
              </div>

              {/* Canonical URL & Robots */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-extrabold text-gray-900 block mb-1.5">
                    Canonical URL Tag
                  </label>
                  <input
                    type="text"
                    value={editCanonical}
                    onChange={(e) => setEditCanonical(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-extrabold text-gray-900 block mb-1.5">
                    Robots Directives
                  </label>
                  <select
                    value={editRobots}
                    onChange={(e) => setEditRobots(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-orange-500"
                  >
                    <option value="index, follow">index, follow (Standard Public)</option>
                    <option value="noindex, follow">noindex, follow (Crawl links only)</option>
                    <option value="noindex, nofollow">noindex, nofollow (Hidden &amp; Private)</option>
                    <option value="index, noarchive">index, noarchive (Prevent Google Cache)</option>
                  </select>
                </div>
              </div>

              {/* OpenGraph Social Sharing Card */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                <span className="text-xs font-extrabold text-gray-900 flex items-center gap-1.5">
                  <Share2 className="w-3.5 h-3.5 text-orange-600" />
                  <span>OpenGraph Social Media Cards (LinkedIn, WhatsApp, X)</span>
                </span>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">OG Title</label>
                  <input
                    type="text"
                    value={editOgTitle}
                    onChange={(e) => setEditOgTitle(e.target.value)}
                    placeholder="Headline used when shared on LinkedIn or WhatsApp"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-700 block mb-1">OG Image URL</label>
                  <input
                    type="text"
                    value={editOgImage}
                    onChange={(e) => setEditOgImage(e.target.value)}
                    placeholder="https://sunraisesolutions.com/og-banner.jpg"
                    className="w-full px-3 py-1.5 bg-white rounded-lg border border-gray-200 text-xs font-mono"
                  />
                </div>
              </div>

              {/* XML Sitemap & Priority Controls */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-extrabold text-gray-900">Include in XML Sitemap</div>
                    <div className="text-[11px] text-gray-500">Allow search engine crawlers to discover this URL in sitemap.xml</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={editIsIndexed}
                    onChange={(e) => setEditIsIndexed(e.target.checked)}
                    className="w-5 h-5 rounded text-orange-600 focus:ring-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">
                      Crawl Priority: <span className="text-orange-600 font-mono font-black">{Number(editPriority).toFixed(1)}</span>
                    </label>
                    <input
                      type="range"
                      min="0.1"
                      max="1.0"
                      step="0.1"
                      value={editPriority}
                      onChange={(e) => setEditPriority(parseFloat(e.target.value))}
                      className="w-full accent-orange-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-700 block mb-1">Change Frequency</label>
                    <select
                      value={editChangefreq}
                      onChange={(e) => setEditChangefreq(e.target.value)}
                      className="w-full p-2 bg-white rounded-lg border border-gray-200 text-xs font-bold"
                    >
                      <option value="daily">daily</option>
                      <option value="weekly">weekly</option>
                      <option value="monthly">monthly</option>
                      <option value="yearly">yearly</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="px-4 py-2 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSavePageSEO}
                disabled={savingPage}
                className="px-6 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-sunraise flex items-center gap-2 transition"
              >
                {savingPage ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving SEO...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Save Page SEO</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
