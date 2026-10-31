import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { SunraiseAPI } from '../services/api';
import { CustomPage } from '../types';
import { SEOHead } from '../components/common/SEOHead';
import { VisualBlockRenderer } from '../components/builder/VisualBlockRenderer';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CustomLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const cleanSlug = slug.trim().toLowerCase().replace(/_/g, '-');

    SunraiseAPI.getPageBySlug(cleanSlug).then(async (pageRes) => {
      if (pageRes) {
        setPage(pageRes);
        setLoading(false);
      } else {
        // Fallback: check if this is a Service slug accessed via /p/
        try {
          const serviceRes = await SunraiseAPI.getServiceBySlug(cleanSlug);
          if (serviceRes) {
            navigate(`/services/${cleanSlug}`, { replace: true });
            return;
          }
        } catch (e) {
          // ignore
        }
        setPage(null);
        setLoading(false);
      }
    }).catch(() => {
      setPage(null);
      setLoading(false);
    });
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Loading Page Content...
        </p>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="py-32 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 font-heading">Page Not Found</h2>
        <p className="text-sm text-gray-500 mt-2 mb-6">
          The requested page does not exist or has been permanently moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunraise-gradient text-white font-bold text-xs shadow-sunraise"
        >
          <span>Return to Homepage</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const hero = page.hero_config;

  return (
    <>
      <SEOHead
        meta={page.seo_meta}
        title={page.seo_meta?.meta_title || `${page.title} | Sunraise Solutions`}
        description={page.seo_meta?.meta_description || 'Corporate Digital Agency in Hyderabad & Rajahmundry'}
        canonicalPath={`/p/${page.slug}`}
        type="website"
        ogImage={page.seo_meta?.og_image || hero?.hero_image}
      />

      {/* JSON-LD Schema Script if provided */}
      {page.seo_meta?.schema_json && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: page.seo_meta.schema_json }}
        />
      )}

      {/* Dynamic Hero if present */}
      {hero && (
        <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-24 sunraise-mesh-bg border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{hero.badge || 'SUNRAISE CAPABILITY'}</span>
                </span>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 tracking-tight leading-[1.15] font-heading">
                  {hero.title}{' '}
                  <span className="text-sunraise-gradient">{hero.highlight_text}</span>
                </h1>

                <p className="text-base text-gray-600 leading-relaxed max-w-2xl">
                  {hero.subtitle}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <a
                    href="#proposal-form"
                    className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg hover:scale-105 transition duration-200"
                  >
                    <span>{hero.primary_cta || 'Claim Strategy Consultation'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>

                {hero.stats && hero.stats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200/80">
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

              {hero.hero_image && (
                <div className="lg:col-span-5 relative">
                  <div className="rounded-3xl bg-white p-4 shadow-warm-hover border border-gray-100">
                    <img
                      src={hero.hero_image}
                      alt={page.title}
                      className="rounded-2xl w-full h-[360px] object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Structured Page Blocks */}
      <div>
        {page.page_blocks &&
          page.page_blocks.map((block) => (
            <VisualBlockRenderer key={block.id} block={block} />
          ))}
      </div>
    </>
  );
};
