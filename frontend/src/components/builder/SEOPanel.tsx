import React, { useState } from 'react';
import { SEOMeta, PageBlock, SEOCheckResult } from '../../types';
import { analyzePageSEO } from '../../services/seoAnalyzer';
import {
  Compass,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Sparkles,
  Globe,
  Share2,
  Code2,
  ExternalLink,
  Wand2,
  Smartphone,
  Monitor,
  Copy,
  Check
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';

interface SEOPanelProps {
  seoMeta: SEOMeta;
  onChange: (meta: SEOMeta) => void;
  title: string;
  slug: string;
  onSlugChange?: (newSlug: string) => void;
  blocks: PageBlock[];
  heroTitle?: string;
  heroHighlight?: string;
  onAutoFixH1?: () => void;
}

export const SEOPanel: React.FC<SEOPanelProps> = ({
  seoMeta,
  onChange,
  title,
  slug,
  onSlugChange,
  blocks,
  heroTitle,
  heroHighlight,
  onAutoFixH1
}) => {
  const [activeTab, setActiveTab] = useState<'audit' | 'basic' | 'social' | 'schema'>('audit');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);

  // Run SEO analysis
  const seoAudit: SEOCheckResult = analyzePageSEO({
    title,
    slug,
    seoMeta,
    blocks,
    heroTitle,
    heroHighlight
  });

  const metaTitle = seoMeta.meta_title || title || '';
  const metaDesc = seoMeta.meta_description || '';
  const canonicalUrl = seoMeta.canonical_url || `https://sunraisesolutions.com/p/${slug}`;

  // Title character recommendations
  const titleLen = metaTitle.length;
  const titleStatus = titleLen === 0 ? 'empty' : titleLen < 40 ? 'short' : titleLen <= 65 ? 'optimal' : 'long';

  // Description character recommendations
  const descLen = metaDesc.length;
  const descStatus = descLen === 0 ? 'empty' : descLen < 120 ? 'short' : descLen <= 165 ? 'optimal' : 'long';

  // Auto-generate Schema markup
  const handleGenerateSchema = (type: 'Service' | 'LocalBusiness' | 'FAQ' | 'Article') => {
    let schemaObj: any = {
      '@context': 'https://schema.org',
      '@type': type,
      name: metaTitle || title,
      description: metaDesc,
      url: canonicalUrl
    };

    if (type === 'LocalBusiness') {
      schemaObj = {
        ...schemaObj,
        '@type': 'LocalBusiness',
        name: 'Sunraise Solutions',
        image: seoMeta.og_image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        telephone: '+91-9123456789',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'HITEC City Cyber Towers',
          addressLocality: 'Hyderabad',
          addressRegion: 'Telangana',
          postalCode: '500081',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '17.4474',
          longitude: '78.3762'
        }
      };
    } else if (type === 'Service') {
      schemaObj = {
        ...schemaObj,
        provider: {
          '@type': 'LocalBusiness',
          name: 'Sunraise Solutions',
          url: 'https://sunraisesolutions.com'
        },
        areaServed: ['Hyderabad', 'Rajahmundry', 'Andhra Pradesh', 'Telangana'],
        serviceType: seoMeta.focus_keyword || title
      };
    } else if (type === 'FAQ') {
      const faqBlock = blocks.find((b) => b.component_name === 'FAQAccordion' && b.props?.faqs);
      const faqs = faqBlock?.props?.faqs || [
        { q: 'What is the implementation timeline?', a: 'Typical turnaround is 2 to 4 weeks depending on scope.' }
      ];
      schemaObj = {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f: any) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a
          }
        }))
      };
    }

    onChange({
      ...seoMeta,
      schema_type: type,
      schema_json: JSON.stringify(schemaObj, null, 2)
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-warm overflow-hidden flex flex-col">
      {/* Top Header with Score */}
      <div className="p-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 text-white flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black font-heading">
                Dedicated SEO Management &amp; Audit Engine
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 text-[10px] font-mono font-bold uppercase">
                Zero Regression
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">
              Targeted ranking optimization, Google SERP telemetry, schema injection &amp; live health score.
            </p>
          </div>
        </div>

        {/* SEO Score Pill */}
        <div className="flex items-center gap-3 bg-gray-800/80 px-4 py-2.5 rounded-2xl border border-gray-700">
          <div className="text-right">
            <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              Internal Guidance Score
            </div>
            <div className="text-xs text-gray-300">
              {seoAudit.passedChecks} of {seoAudit.totalChecks} standards passed
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg font-heading shadow-inner ${
              seoAudit.score >= 85
                ? 'bg-emerald-500 text-white'
                : seoAudit.score >= 65
                ? 'bg-amber-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {seoAudit.score}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-50/70 px-6 gap-2 pt-3">
        {[
          { id: 'audit', label: 'SEO Audit & Checker', icon: CheckCircle2, badge: `${seoAudit.score}%` },
          { id: 'basic', label: 'Meta & Search SERP', icon: Search },
          { id: 'social', label: 'Open Graph & Social', icon: Share2 },
          { id: 'schema', label: 'Schema Structured Data', icon: Code2 }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition border-b-2 -mb-px ${
                isActive
                  ? 'bg-white border-orange-600 text-orange-600 shadow-sm'
                  : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                    seoAudit.score >= 85
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* TAB 1: AUDIT & CHECKER */}
        {activeTab === 'audit' && (
          <div className="space-y-6">
            {/* Quick Focus Keyword Input */}
            <div className="p-4 rounded-2xl bg-orange-50/60 border border-orange-200/80 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-orange-600" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">Primary Target Focus Keyword</h4>
                  <p className="text-[11px] text-gray-500">
                    The core search term you want this page to dominate in Google search results.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="e.g. SEO Services in Hyderabad"
                  value={seoMeta.focus_keyword || ''}
                  onChange={(e) => onChange({ ...seoMeta, focus_keyword: e.target.value })}
                  className="px-3.5 py-2 rounded-xl border border-orange-300 text-xs font-semibold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20 w-full sm:w-64"
                />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                Comprehensive Content &amp; Structural Checklist
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {seoAudit.items.map((item) => (
                  <div
                    key={item.id}
                    className={`p-4 rounded-2xl border transition ${
                      item.passed
                        ? 'bg-emerald-50/40 border-emerald-200/80'
                        : item.category === 'critical'
                        ? 'bg-red-50/50 border-red-200'
                        : 'bg-amber-50/40 border-amber-200/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        {item.passed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : item.category === 'critical' ? (
                          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-gray-900">{item.label}</p>
                          <p className="text-[11px] text-gray-600 mt-0.5">{item.message}</p>
                          {!item.passed && (
                            <p className="text-[10px] text-orange-700 font-semibold mt-1 bg-white/70 p-1.5 rounded-lg border border-orange-100">
                              Suggestion: {item.recommendation}
                            </p>
                          )}
                        </div>
                      </div>

                      {item.id === 'heading_hierarchy' && !item.passed && onAutoFixH1 && (
                        <button
                          type="button"
                          onClick={onAutoFixH1}
                          className="px-2.5 py-1 rounded-lg bg-orange-600 text-white text-[10px] font-bold hover:bg-orange-700 shadow-sm shrink-0"
                        >
                          Auto-Fix H1s
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: BASIC SEO & SERP PREVIEW */}
        {activeTab === 'basic' && (
          <div className="space-y-6">
            {/* Live Google Search Result Preview */}
            <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wide">
                    Live Google Search Result Preview
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setSerpDevice('desktop')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      serpDevice === 'desktop' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Monitor className="w-3 h-3" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSerpDevice('mobile')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition ${
                      serpDevice === 'mobile' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <Smartphone className="w-3 h-3" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>

              {/* SERP Card Box */}
              <div
                className={`p-4 rounded-xl bg-white border border-gray-200 shadow-sm font-sans transition-all ${
                  serpDevice === 'mobile' ? 'max-w-md mx-auto' : 'w-full'
                }`}
              >
                <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                  <div className="w-4 h-4 rounded-full bg-orange-600 flex items-center justify-center text-white text-[9px] font-bold">
                    S
                  </div>
                  <span className="font-semibold text-gray-900">Sunraise Solutions</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 truncate">{canonicalUrl}</span>
                </div>
                <div className="text-lg font-medium text-blue-800 hover:underline cursor-pointer leading-snug">
                  {metaTitle || 'Page Title Goes Here | Sunraise Solutions'}
                </div>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2 leading-relaxed">
                  {metaDesc ||
                    'Add a descriptive meta description summarizing the value proposition and target keywords for searchers.'}
                </p>
              </div>
            </div>

            {/* Inputs Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Meta Title */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">SEO Meta Title</label>
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      titleStatus === 'optimal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : titleStatus === 'long'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {titleLen} / 65 chars ({titleStatus})
                  </span>
                </div>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => onChange({ ...seoMeta, meta_title: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500 font-medium"
                  placeholder="e.g. Best SEO Services in Hyderabad | Sunraise Solutions"
                />
                <p className="text-[11px] text-gray-400">
                  Recommended: 40–65 characters. Include primary target keyword near the beginning.
                </p>
              </div>

              {/* URL Slug */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">URL Slug</label>
                <div className="flex rounded-xl border border-gray-200 overflow-hidden focus-within:border-orange-500">
                  <span className="px-3 py-2.5 bg-gray-50 text-gray-500 text-xs font-mono border-r border-gray-200 select-none">
                    /p/
                  </span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => onSlugChange && onSlugChange(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                    className="flex-1 p-2.5 text-xs font-mono font-medium focus:outline-none"
                    placeholder="my-landing-page"
                  />
                </div>
                <p className="text-[11px] text-gray-400">
                  Changing slug will automatically register an SEO 301 permanent redirect.
                </p>
              </div>

              {/* Meta Description */}
              <div className="space-y-1.5 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">Meta Description</label>
                  <span
                    className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded-full ${
                      descStatus === 'optimal'
                        ? 'bg-emerald-100 text-emerald-800'
                        : descStatus === 'long'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {descLen} / 165 chars ({descStatus})
                  </span>
                </div>
                <textarea
                  rows={3}
                  value={metaDesc}
                  onChange={(e) => onChange({ ...seoMeta, meta_description: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500 leading-relaxed font-medium"
                  placeholder="Provide a compelling 120–165 character summary describing your solution and encouraging searchers to click."
                />
              </div>

              {/* Canonical URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Canonical URL</label>
                <input
                  type="url"
                  value={seoMeta.canonical_url || ''}
                  onChange={(e) => onChange({ ...seoMeta, canonical_url: e.target.value })}
                  placeholder={`https://sunraisesolutions.com/p/${slug}`}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Secondary Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700">Secondary LSI Keywords (comma separated)</label>
                <input
                  type="text"
                  value={seoMeta.secondary_keywords || ''}
                  onChange={(e) => onChange({ ...seoMeta, secondary_keywords: e.target.value })}
                  placeholder="Local SEO Hyderabad, Web App Development AP"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Robots & Sitemap Toggles */}
              <div className="md:col-span-2 p-4 rounded-2xl bg-gray-50 border border-gray-200 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoMeta.robots_index ?? true}
                      onChange={(e) => onChange({ ...seoMeta, robots_index: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-700">Index in Google (index)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoMeta.robots_follow ?? true}
                      onChange={(e) => onChange({ ...seoMeta, robots_follow: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-700">Follow Page Links (follow)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={seoMeta.sitemap_include ?? true}
                      onChange={(e) => onChange({ ...seoMeta, sitemap_include: e.target.checked })}
                      className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-xs font-bold text-gray-700">Include in XML Sitemap</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SOCIAL OPEN GRAPH */}
        {activeTab === 'social' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Preview Box */}
              <div className="md:col-span-5 space-y-2">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Social Sharing Card Preview
                </h4>
                <div className="rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
                  <div className="aspect-[1.91/1] bg-gray-100 relative overflow-hidden">
                    {seoMeta.og_image ? (
                      <img
                        src={seoMeta.og_image}
                        alt="Social preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 p-4 text-center">
                        <Share2 className="w-8 h-8 mb-2 opacity-50" />
                        <span className="text-xs">No Social Image Selected</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-[10px] text-gray-400 uppercase font-bold">sunraisesolutions.com</p>
                    <p className="text-xs font-bold text-gray-900 truncate mt-0.5">
                      {seoMeta.og_title || metaTitle || title}
                    </p>
                    <p className="text-[11px] text-gray-500 line-clamp-2 mt-0.5">
                      {seoMeta.og_description || metaDesc || 'Discover engineered digital solutions.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Inputs */}
              <div className="md:col-span-7 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Open Graph Title</label>
                  <input
                    type="text"
                    value={seoMeta.og_title || ''}
                    onChange={(e) => onChange({ ...seoMeta, og_title: e.target.value })}
                    placeholder={metaTitle}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Open Graph Description</label>
                  <textarea
                    rows={2}
                    value={seoMeta.og_description || ''}
                    onChange={(e) => onChange({ ...seoMeta, og_description: e.target.value })}
                    placeholder={metaDesc}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Social Share Image (1200x630)</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={seoMeta.og_image || ''}
                      onChange={(e) => onChange({ ...seoMeta, og_image: e.target.value })}
                      placeholder="https://..."
                      className="flex-1 p-2.5 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsMediaModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200 transition shrink-0"
                    >
                      Choose Media
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: SCHEMA STRUCTURED DATA */}
        {activeTab === 'schema' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200">
              <div>
                <h4 className="text-xs font-bold text-gray-900">1-Click Schema Generator</h4>
                <p className="text-[11px] text-gray-600">
                  Generate valid JSON-LD structured data for Google Knowledge Graph and Rich Snippets.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleGenerateSchema('LocalBusiness')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-orange-300 text-orange-700 text-xs font-bold hover:bg-orange-600 hover:text-white transition shadow-sm"
                >
                  Local Business
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateSchema('Service')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-orange-300 text-orange-700 text-xs font-bold hover:bg-orange-600 hover:text-white transition shadow-sm"
                >
                  Service Schema
                </button>
                <button
                  type="button"
                  onClick={() => handleGenerateSchema('FAQ')}
                  className="px-3 py-1.5 rounded-xl bg-white border border-orange-300 text-orange-700 text-xs font-bold hover:bg-orange-600 hover:text-white transition shadow-sm"
                >
                  FAQ Schema
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">JSON-LD Structured Data (Schema.org)</label>
                <button
                  type="button"
                  onClick={() => {
                    if (seoMeta.schema_json) {
                      navigator.clipboard.writeText(seoMeta.schema_json);
                      setCopiedSchema(true);
                      setTimeout(() => setCopiedSchema(false), 2000);
                    }
                  }}
                  className="flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700"
                >
                  {copiedSchema ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSchema ? 'Copied' : 'Copy JSON'}</span>
                </button>
              </div>

              <textarea
                rows={10}
                value={seoMeta.schema_json || ''}
                onChange={(e) => onChange({ ...seoMeta, schema_json: e.target.value })}
                placeholder={`{\n  "@context": "https://schema.org",\n  "@type": "Service",\n  "name": "..."\n}`}
                className="w-full p-4 rounded-2xl bg-gray-900 text-orange-300 font-mono text-xs border border-gray-800 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        )}
      </div>

      {/* Media Library Modal for OG Image */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={(med) => onChange({ ...seoMeta, og_image: med.url })}
        currentUrl={seoMeta.og_image}
      />
    </div>
  );
};
