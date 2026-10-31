import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  ShieldCheck,
  Star,
  Users,
  Award,
  Search,
  Sparkles,
  ChevronDown,
  Building2,
  MapPin,
  Send,
  Zap,
  Globe,
  Smartphone,
  Megaphone,
  Code2,
  Vote,
  Film,
  Activity,
  Play
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEOHead } from '../components/common/SEOHead';
import { SunraiseAPI, LEADERSHIP_TEAM } from '../services/api';
import { Service, Project, Testimonial, CustomPage } from '../types';
import { VisualBlockRenderer } from '../components/builder/VisualBlockRenderer';

const ICON_MAP: Record<string, React.ElementType> = {
  Search,
  Globe,
  Smartphone,
  Megaphone,
  Code2,
  Vote,
  Film,
  Activity,
};

export const HomePage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [customPageData, setCustomPageData] = useState<CustomPage | null>(null);
  const [activeProjectFilter, setActiveProjectFilter] = useState('All');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Proposal Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_code: 'SRV-SEO-01',
    budget_range: '₹25k–₹50k',
    message: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    SunraiseAPI.getServices().then(setServices);
    SunraiseAPI.getProjects().then(setProjects);
    SunraiseAPI.getTestimonials().then(setTestimonials);
    SunraiseAPI.getPageBySlug('home').then((res) => {
      if (res && res.page_blocks && res.page_blocks.length > 0) {
        setCustomPageData(res);
      }
    });
  }, []);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await SunraiseAPI.submitLead({
        ...formData,
        source_page: '/'
      });
      setFormLoading(false);
      setFormSubmitted(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (err) {
      setFormLoading(false);
    }
  };

  const filteredProjects = activeProjectFilter === 'All'
    ? projects
    : projects.filter(p => p.category_badge.toLowerCase().includes(activeProjectFilter.toLowerCase()));

  return (
    <>
      <SEOHead
        title={customPageData?.seo_meta?.meta_title || "Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry"}
        description={customPageData?.seo_meta?.meta_description || "Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing."}
        canonicalPath="/"
      />

      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 border border-orange-200 text-orange-700 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-orange-600 animate-spin" />
                <span>{customPageData?.hero_config?.badge || "Top Digital Marketing Agency in Andhra Pradesh"}</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 tracking-tight leading-[1.1] font-heading">
                {customPageData?.hero_config?.title || "Grow Your Business with"}{' '}
                <span className="text-sunraise-gradient">{customPageData?.hero_config?.highlight_text || "Sunraise Solutions"}</span>
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed max-w-2xl font-normal">
                {customPageData?.hero_config?.subtitle || "With 18+ years of expertise in digital marketing and software innovation, we help startups, growing brands, and established businesses build a powerful digital presence that drives real results. Headquartered in Hyderabad with a regional center in Rajahmundry."}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#proposal-form"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg hover:scale-105 transition-all duration-200"
                >
                  <span>Get a Free Proposal</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <Link
                  to="/projects"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-warm hover:bg-gray-50 hover:text-orange-600 transition"
                >
                  <Play className="w-4 h-4 text-orange-500 fill-orange-500" />
                  <span>Explore Projects</span>
                </Link>
              </div>

              {/* 3 KPI Counters */}
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
              </div>
            </div>

            {/* Right Interactive Composition (5 cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card with Mockup composition */}
                <div className="rounded-3xl bg-white p-6 shadow-warm-hover border border-gray-100 relative z-10">
                  <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                    </div>
                    <span className="text-xs font-mono text-gray-400">sunraisesolutions.com/analytics</span>
                  </div>

                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80"
                    alt="Growth Analytics Engine"
                    className="rounded-2xl w-full h-56 object-cover mb-4"
                  />

                  {/* Growth Metric Strip */}
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold">
                        <TrendingUp className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-gray-500">Client Revenue Surge</div>
                        <div className="text-xl font-extrabold text-gray-900 font-heading">+250% YoY</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-orange-600 bg-white px-2.5 py-1 rounded-full border border-orange-200">
                      Verified
                    </span>
                  </div>
                </div>

                {/* Floating Top Badge */}
                <div className="absolute -top-6 -right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-warm-hover border border-gray-100 flex items-center gap-3 z-20">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-gray-900">#1 SEO &amp; Software</div>
                    <div className="text-[11px] text-gray-500">Hyderabad &amp; Rajahmundry</div>
                  </div>
                </div>

                {/* Floating Bottom Left Badge */}
                <div className="absolute -bottom-6 -left-4 bg-gray-900 text-white p-3.5 rounded-2xl shadow-warm-hover flex items-center gap-3 z-20">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-orange-500 border-2 border-gray-900 flex items-center justify-center text-xs font-bold">K</div>
                    <div className="w-8 h-8 rounded-full bg-amber-500 border-2 border-gray-900 flex items-center justify-center text-xs font-bold">S</div>
                    <div className="w-8 h-8 rounded-full bg-emerald-500 border-2 border-gray-900 flex items-center justify-center text-xs font-bold">N</div>
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      <span>4.8 Rating</span>
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    </div>
                    <div className="text-[10px] text-gray-400">5,000+ Business Reviews</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. CORE VALUE TRIO */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-warm-gray-50 border border-gray-100 shadow-warm hover:shadow-warm-hover transition group">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-sunraise-gradient group-hover:text-white transition shadow-sm">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">
                Innovation with Purpose
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We engineer scalable architectures and AI-assisted workflows tailored to solve concrete operational hurdles and maximize capital efficiency.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-warm-gray-50 border border-gray-100 shadow-warm hover:shadow-warm-hover transition group">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-sunraise-gradient group-hover:text-white transition shadow-sm">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">
                Strategic Solutions
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Algorithmic SEO, hyper-local search mapping, and full-funnel ad campaigns constructed to dominate Andhra Pradesh and national search rankings.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-warm-gray-50 border border-gray-100 shadow-warm hover:shadow-warm-hover transition group">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-6 group-hover:bg-sunraise-gradient group-hover:text-white transition shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 font-heading mb-3">
                Dedicated to Excellence
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                18+ years of reliable delivery, zero-regression software maintenance, and round-the-clock senior engineering leadership for peace of mind.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. WHO WE ARE (ABOUT PREVIEW) */}
      <section className="py-20 bg-gray-50/70 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Split Left Image + Floating Satisfied Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80"
                  alt="Sunraise Solutions Engineering Team"
                  className="rounded-3xl shadow-warm-hover object-cover w-full h-[440px]"
                />

                {/* Circular Satisfied Badge */}
                <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-gradient-to-tr from-orange-600 to-amber-500 text-white p-4 shadow-sunraise-lg flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black font-heading leading-none">92%</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider mt-1 leading-tight">
                    Satisfied Clients
                  </span>
                </div>
              </div>
            </div>

            {/* Split Right Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                <span>Who We Are</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading leading-tight">
                Architecting High-Yield Software &amp; Digital Growth Across South India
              </h2>

              <p className="text-gray-600 leading-relaxed">
                Sunraise Solutions stands as a benchmark of technical reliability and strategic innovation. Headquartered in Hyderabad's premier tech corridor with an expansive regional footprint in Rajahmundry, Andhra Pradesh, we partner with healthcare giants, educational institutions, political campaigns, and mid-market enterprises.
              </p>

              {/* Checklist */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-800">18+ Years Industry Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-800">Custom Enterprise Software</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-800">SEO &amp; Sub-Second Performance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-orange-500 shrink-0" />
                  <span className="text-sm font-bold text-gray-800">Result-Driven Conversion Pipelines</span>
                </div>
              </div>

              {/* Office Presence Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-warm flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Hyderabad Head Office</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Madhapur, Hitec City Corridor</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200/80 shadow-warm flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">Rajahmundry Regional Hub</h4>
                    <p className="text-xs text-gray-500 mt-0.5">Danavaipeta Commercial Centre</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC SERVICES BENTO GRID */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Dynamic Capabilities
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
                Full-Suite Corporate Digital Services
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-md">
              Configured dynamically in our CMS. Each service offers dedicated service codes, sub-second SLAs, and integrated completed projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service) => {
              const IconComp = ICON_MAP[service.icon_name] || Globe;
              return (
                <div
                  key={service.id}
                  className="rounded-2xl p-6 bg-warm-gray-50 border border-gray-100 shadow-warm hover:shadow-warm-hover hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center group-hover:bg-sunraise-gradient group-hover:text-white transition shadow-sm">
                        <IconComp className="w-6 h-6" />
                      </div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-gray-200 text-gray-500 font-bold">
                        {service.service_code}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-gray-900 font-heading group-hover:text-orange-600 transition mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {service.short_description}
                    </p>
                  </div>

                  <div className="pt-6 mt-4 border-t border-gray-100 flex items-center justify-between">
                    <Link
                      to={`/services/${service.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition"
                    >
                      <span>Explore Service</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DEDICATED HIGHLIGHT STRIP: SEO SERVICES IN HYDERABAD */}
          <div className="mt-12 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-8 sm:p-10 text-white shadow-sunraise-lg">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider">
                  Hyderabad SEO Powerhouse
                </span>
                <h3 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
                  Rank #1 on Google for High-Intent Hyderabad Searches
                </h3>
                <p className="text-white/90 text-sm leading-relaxed max-w-2xl">
                  Our dedicated Hyderabad SEO squad executes full-scale Technical SEO, Local 3-Pack Google Maps optimization, semantic Telugu-English keyword research, high-authority digital PR, and on-page CRO.
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  {[
                    'Technical SEO Audits',
                    'Google Maps 3-Pack',
                    'Keyword Research',
                    'On-Page Optimization',
                    'High-DA Link Building',
                    'Content Strategy'
                  ].map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-semibold px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm border border-white/20"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-start lg:justify-end">
                <Link
                  to="/services/seo-services-in-hyderabad"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-orange-600 font-extrabold text-sm shadow-xl hover:bg-gray-50 hover:scale-105 transition"
                >
                  <span>View Hyderabad SEO Specs</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FILTERABLE CASE STUDIES / LATEST PROJECTS */}
      <section className="py-20 bg-warm-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Proven Track Record
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
                Featured Completed Projects
              </h2>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              {['All', 'SEO', 'Web Development', 'Hospital Management'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveProjectFilter(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                    activeProjectFilter === cat
                      ? 'bg-orange-600 text-white shadow-sunraise'
                      : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-warm overflow-hidden hover:shadow-warm-hover hover:-translate-y-1.5 transition duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative overflow-hidden h-52">
                    <img
                      src={project.thumbnail_url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-gray-900/85 backdrop-blur-md text-white text-xs font-bold">
                        {project.category_badge}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="text-xs font-semibold text-orange-600 mb-1">
                      {project.client_name}
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 font-heading mb-2 group-hover:text-orange-600 transition">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WORKING PROCESS TIMELINE */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Engineered Delivery
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
              Our 4-Step Working Process
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              From initial technical discovery to exponential revenue optimization.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {[
              { step: '01', title: 'Brand Discovery / Audit', desc: 'In-depth algorithmic analysis of current architecture, organic rankings, and market positioning.' },
              { step: '02', title: 'Creative Planning / Strategy', desc: 'Architecting custom technical roadmaps, high-converting prototypes, and target keyword clusters.' },
              { step: '03', title: 'Digital Execution', desc: 'Agile development, sub-second speed optimization, and multi-channel campaign rollout.' },
              { step: '04', title: 'Growth Optimization', desc: 'Continuous telemetry measurement, automated 301 safeguards, and ongoing conversion scale.' }
            ].map((p, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-warm-gray-50 border border-gray-100 shadow-warm relative group hover:bg-white hover:shadow-warm-hover transition duration-200"
              >
                <span className="text-5xl font-black text-orange-500/20 group-hover:text-orange-500/40 transition font-heading mb-3 block">
                  {p.step}
                </span>
                <h3 className="text-lg font-bold text-gray-900 font-heading mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. WHY CHOOSE US TRUST BANNER */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
                <Users className="w-3.5 h-3.5" />
                <span>300+ Happy Customers</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-heading leading-tight">
                Why Industry Leaders Choose Sunraise Solutions
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                We bridge the gap between technical rigor and aggressive commercial results. No cookie-cutter templates—only bespoke engineering.
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700 space-y-2">
                <ShieldCheck className="w-6 h-6 text-orange-500" />
                <h4 className="text-base font-bold text-white font-heading">Long-Term Dedicated Support</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Direct SLA access to senior architects with proactive security patching and ongoing feature sprints.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700 space-y-2">
                <TrendingUp className="w-6 h-6 text-amber-500" />
                <h4 className="text-base font-bold text-white font-heading">Data-Driven ROI Strategy</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Every rupee of ad spend and every line of code is tracked with strict conversion attribution.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS CAROUSEL */}
      <section className="py-20 bg-warm-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span>4.8 (5k+ Customer Reviews)</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading">
                Endorsed by Andhra Pradesh &amp; Hyderabad Leaders
              </h2>
            </div>
            <p className="text-sm text-gray-500 max-w-sm">
              Real testimonials from corporate directors, healthcare chiefs, and technology partners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="p-8 rounded-2xl bg-white border border-gray-100 shadow-warm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 italic leading-relaxed mb-6">
                    "{item.review_text}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <img
                    src={item.avatar_url}
                    alt={item.client_name}
                    className="w-11 h-11 rounded-full object-cover border border-orange-200"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{item.client_name}</h4>
                    <p className="text-xs text-gray-500">{item.client_role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. LEADERSHIP TEAM */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
              Executive Guidance
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
              Meet Our Executive Leadership
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Driven by seasoned architects and strategists dedicated to your digital supremacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-warm-gray-50 border border-gray-100 p-5 shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition duration-200"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-xl w-full h-56 object-cover mb-4"
                />
                <h3 className="text-base font-bold text-gray-900 font-heading">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-orange-600 mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. FAQ ACCORDION + SPLIT LEAD CAPTURE FORM */}
      <section id="proposal-form" className="py-20 bg-gray-50/80 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left FAQ Accordion (6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  Answers to Common Queries
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How does Sunraise Solutions ensure Google Top 3 rankings in Hyderabad?',
                    a: 'We leverage deep Core Web Vitals optimization, semantic schema markup linking your Hyderabad addresses, high-DA localized link building, and conversion-optimized content clusters.'
                  },
                  {
                    q: 'Do you offer custom software development with local Rajahmundry support?',
                    a: 'Yes! Our Rajahmundry branch provides immediate on-site consultation and ongoing support for enterprises and hospitals across coastal Andhra Pradesh.'
                  },
                  {
                    q: 'What is your Hospital Management Software (HMS) deployment timeline?',
                    a: 'A standard NABH-ready HMS deployment across OPD, IPD, and pharmacy modules is completed within 3 to 6 weeks, including data migration and medical staff training.'
                  },
                  {
                    q: 'How do you safeguard client rankings when restructuring a website?',
                    a: 'We employ our Zero-Regression SEO framework with automated 301 redirects, URL slug preservation, and strict heading hierarchy checks.'
                  }
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl bg-white border border-gray-100 shadow-warm overflow-hidden"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full p-5 text-left font-bold text-gray-900 flex items-center justify-between gap-4 text-sm"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-orange-500 shrink-0 transition-transform duration-200 ${
                          openFaq === idx ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <div className="px-5 pb-5 text-xs text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right Split Lead Capture Form (6 cols) */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-3xl bg-white border border-gray-100 shadow-warm-hover">
                <div className="mb-6">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Free Architectural Consultation</span>
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 font-heading">
                    Get a Free SEO &amp; Software Proposal
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Receive a comprehensive competitive audit and commercial roadmap within 24 hours.
                  </p>
                </div>

                {formSubmitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-bold text-emerald-900 font-heading">
                      Proposal Request Received!
                    </h4>
                    <p className="text-xs text-emerald-700 leading-relaxed max-w-sm mx-auto">
                      Thank you! One of our principal architects from Hyderabad or Rajahmundry will review your project and contact you directly.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-emerald-800 font-bold underline pt-2"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleLeadSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.full_name}
                          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                          placeholder="e.g. Ramesh Varma"
                          className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Phone Number *
                        </label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 99596 39539"
                          className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Corporate Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="you@company.com"
                        className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Service of Interest
                        </label>
                        <select
                          value={formData.service_code}
                          onChange={(e) => setFormData({ ...formData, service_code: e.target.value })}
                          className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-white"
                        >
                          {services.map((s) => (
                            <option key={s.id} value={s.service_code}>
                              {s.title} ({s.service_code})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Project Budget
                        </label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {['₹10k–₹25k', '₹25k–₹50k', '₹50k–₹1L', '₹1L+'].map((budget) => (
                            <button
                              type="button"
                              key={budget}
                              onClick={() => setFormData({ ...formData, budget_range: budget })}
                              className={`p-2 rounded-lg text-xs font-bold border transition ${
                                formData.budget_range === budget
                                  ? 'bg-orange-50 border-orange-500 text-orange-600'
                                  : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                              }`}
                            >
                              {budget}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                        Project Scope or Challenge
                      </label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Briefly describe what you would like to accomplish..."
                        className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={formLoading}
                      className="w-full py-4 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{formLoading ? 'Submitting...' : 'Submit Request for Free Proposal'}</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
