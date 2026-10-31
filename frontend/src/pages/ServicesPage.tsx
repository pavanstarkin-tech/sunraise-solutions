import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Globe,
  Code2,
  Cpu,
  Database,
  Search,
  Smartphone,
  Layers,
  CheckCircle2,
  Zap,
  BarChart3,
  Building2
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { SunraiseAPI } from '../services/api';
import { Service } from '../types';

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Search,
  Code: Code2,
  Code2,
  Smartphone,
  Cpu,
  BarChart3,
  TrendingUp,
  Building2,
  Globe,
  Database,
  Layers,
};

export const ServicesPage: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    SunraiseAPI.getServices().then((data) => {
      setServices(data.filter((s) => s.is_published));
      setLoading(false);
    });
  }, []);

  return (
    <>
      <SEOHead
        title="Enterprise Digital Services & Software Architecture | Sunraise Solutions"
        description="Explore Sunraise Solutions' specialized services: SEO engineering, full-stack web applications, hospital management software, mobile apps, and enterprise platforms in Hyderabad and Rajahmundry."
        canonicalPath="/services"
      />

      {/* Hero Header */}
      <section className="relative overflow-hidden pt-16 pb-20 lg:pt-20 lg:pb-24 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Full-Stack Engineering &amp; Strategic Growth</span>
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 font-heading leading-tight tracking-tight">
              Enterprise Services &amp; <span className="text-sunraise-gradient">Digital Architecture</span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
              From sub-second web platforms and organic search authority to mission-critical healthcare systems, we deliver digital infrastructure built for market dominance.
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-gray-500">
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                Zero-Regression Codebase
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                <Zap className="w-4 h-4 text-orange-500" />
                Sub-Second Core Web Vitals
              </span>
              <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 shadow-xs">
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                Enterprise Security Standards
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                Core Specializations
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 font-heading mt-2">
                Specialized Solutions Portfolio
              </h2>
            </div>
            <p className="text-xs text-gray-500 max-w-md">
              Each solution is tailored to your business goals, backed by dedicated technical leadership and modern stack execution.
            </p>
          </div>

          {loading ? (
            <div className="py-24 text-center">
              <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                Loading Service Offerings...
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((srv) => {
                const IconComp = ICON_MAP[srv.icon_name] || Globe;
                return (
                  <div
                    key={srv.id}
                    className="group bg-white rounded-3xl border border-gray-100 shadow-warm hover:shadow-warm-hover hover:border-orange-200/80 transition-all duration-300 flex flex-col justify-between overflow-hidden p-8"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100/80 text-orange-600 flex items-center justify-center group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition-all duration-300 shadow-sm">
                          <IconComp className="w-7 h-7" />
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 font-mono text-[11px] font-bold">
                          {srv.service_code}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 font-heading group-hover:text-orange-600 transition mb-3">
                        {srv.title}
                      </h3>

                      {srv.hero_config?.highlight_text && (
                        <div className="text-xs font-bold text-orange-600 mb-2">
                          ✦ {srv.hero_config.highlight_text}
                        </div>
                      )}

                      <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-6">
                        {srv.short_description || srv.hero_config?.subtitle}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                      <Link
                        to={`/services/${srv.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 group-hover:text-orange-700 group-hover:translate-x-0.5 transition"
                      >
                        <span>Explore Capability</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {srv.page_blocks && srv.page_blocks.length > 0 && (
                        <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded">
                          {srv.page_blocks.length} Modules
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Enterprise CTA Ribbon */}
      <section className="py-16 bg-gray-950 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold tracking-widest text-orange-400 uppercase">
              Ready to Accelerate?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-heading leading-tight">
              Design, Engineer &amp; Scale with Sunraise Solutions
            </h2>
            <p className="text-xs text-gray-400">
              Speak directly with our technical architects in Hyderabad and Rajahmundry to scope your custom roadmap.
            </p>
          </div>

          <Link
            to="/contact"
            className="px-8 py-4 rounded-full bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition active:scale-95 shrink-0"
          >
            Schedule Technical Consultation
          </Link>
        </div>
      </section>
    </>
  );
};
