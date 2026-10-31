import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
  Phone,
  FileCode,
  Layers
} from 'lucide-react';
import { SunraiseAPI } from '../services/api';
import { Service } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { BlockCanvas } from '../components/builder/BlockCanvas';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const cleanSlug = slug.trim().toLowerCase().replace(/_/g, '-');
    if (cleanSlug !== slug) {
      navigate(`/services/${cleanSlug}`, { replace: true });
      return;
    }
    SunraiseAPI.getServiceBySlug(cleanSlug).then((res) => {
      setService(res);
      setLoading(false);
    }).catch(() => {
      setService(null);
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Loading Service Specs...
        </p>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="py-32 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 font-heading">Service Not Found</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          The requested service page does not exist or has been permanently moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunraise-gradient text-white font-bold text-xs"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const hero = service.hero_config;

  return (
    <>
      <SEOHead
        meta={service.seo_meta}
        title={service.seo_meta?.meta_title || `${service.title} | Sunraise Solutions`}
        description={service.seo_meta?.meta_description || service.short_description}
        canonicalPath={`/services/${service.slug}`}
        type="service"
        ogImage={service.thumbnail_url}
      />

      {/* 1. DYNAMIC HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hero.badge || 'SUNRAISE CAPABILITY'}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-white border border-gray-200 text-gray-600 font-mono text-xs font-bold">
                  Code: {service.service_code}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15] font-heading">
                {hero.title}{' '}
                <span className="text-sunraise-gradient">{hero.highlight_text}</span>
              </h1>

              <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                {hero.subtitle || service.short_description}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg hover:scale-105 transition-all duration-200"
                >
                  <span>{hero.primary_cta || 'Request Service Scope'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <a
                  href="#case-studies"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white border border-gray-200 text-gray-700 font-bold text-sm shadow-warm hover:bg-gray-50 transition"
                >
                  <span>{hero.secondary_cta || 'Explore Case Studies'}</span>
                </a>
              </div>

              {/* Stats Counters */}
              {hero.stats && hero.stats.length > 0 && (
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80">
                  {hero.stats.map((st, i) => (
                    <div key={i} className={i > 0 ? 'border-l border-gray-200 pl-4' : ''}>
                      <div className="text-2xl font-extrabold text-gray-900 font-heading">
                        {st.val}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">{st.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="rounded-3xl bg-white p-4 shadow-warm-hover border border-gray-100">
                  <img
                    src={hero.hero_image || service.thumbnail_url}
                    alt={service.title}
                    className="rounded-2xl w-full h-[360px] object-cover"
                  />
                  <div className="mt-4 p-4 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <ShieldCheck className="w-5 h-5 text-orange-600" />
                      <span className="text-xs font-bold text-gray-900">
                        Enterprise Performance &amp; SLA
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-orange-600">
                      Hyderabad &amp; AP
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DYNAMIC DRAG-AND-DROP BLOCK CANVAS */}
      <BlockCanvas blocks={service.page_blocks} />

      {/* 3. RELATED PROJECTS / CASE STUDIES LINKED TO THIS SERVICE CODE */}
      {service.projects && service.projects.length > 0 && (
        <section id="case-studies" className="py-20 bg-warm-gray-50 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
                  Verified Results
                </span>
                <h2 className="text-3xl font-extrabold text-gray-900 font-heading mt-2">
                  Featured {service.title} Case Studies
                </h2>
              </div>
              <Link
                to="/projects"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <span>View All Completed Projects</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.projects.map((proj) => (
                <div
                  key={proj.id}
                  className="rounded-2xl bg-white border border-gray-100 shadow-warm overflow-hidden hover:shadow-warm-hover transition duration-200"
                >
                  <img
                    src={proj.thumbnail_url}
                    alt={proj.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <span className="text-xs font-semibold text-orange-600">
                      {proj.client_name}
                    </span>
                    <h3 className="text-base font-bold text-gray-900 font-heading mt-1 mb-2">
                      {proj.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                      {proj.summary}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. LINKED TESTIMONIALS */}
      {service.testimonials && service.testimonials.length > 0 && (
        <section className="py-16 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-xl mx-auto mb-12">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
                Client Endorsements for {service.title}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {service.testimonials.slice(0, 2).map((t) => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl bg-warm-gray-50 border border-gray-100 shadow-warm"
                >
                  <div className="flex text-amber-400 mb-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                    "{t.review_text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={t.avatar_url}
                      alt={t.client_name}
                      className="w-10 h-10 rounded-full object-cover border border-orange-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-gray-900">{t.client_name}</h4>
                      <p className="text-[11px] text-gray-500">{t.client_role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 5. STICKY / BOTTOM LEAD CTA BANNER */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider">
            Ready to deploy {service.title}?
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-heading">
            Schedule an Architectural Discovery Session
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Directly collaborate with our Hyderabad and Rajahmundry teams to plan out technical specifications, timelines, and measurable KPIs.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg transition"
            >
              <span>Get Free Technical Scope</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
