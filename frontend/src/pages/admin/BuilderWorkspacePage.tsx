import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { SunraiseAPI } from '../../services/api';
import { Service, CustomPage, PageBlock, SEOMeta, HeroConfig } from '../../types';
import { ElementorPageBuilder } from '../../components/builder/ElementorPageBuilder';
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export const BuilderWorkspacePage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get('type') as 'service' | 'page' | null;
  const idStr = searchParams.get('id');
  const id = idStr ? Number(idStr) : null;

  const [service, setService] = useState<Service | null>(null);
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTarget();
  }, [type, id]);

  const loadTarget = async () => {
    if (!type || !id) {
      setError('Invalid page identifier. Missing target parameter.');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      if (type === 'service') {
        const services = await SunraiseAPI.getServices();
        const found = services.find((s) => s.id === id);
        if (found) {
          setService(found);
        } else {
          setError(`Service #${id} not found.`);
        }
      } else {
        const pages = await SunraiseAPI.getPages();
        const found = pages.find((p) => p.id === id);
        if (found) {
          setPage(found);
        } else {
          setError(`Landing Page #${id} not found.`);
        }
      }
    } catch (err: any) {
      setError(err?.message || 'Failed to load page content.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    if (type === 'service') {
      navigate('/admin/services');
    } else {
      navigate('/admin/builder');
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-950 flex flex-col items-center justify-center text-white z-50">
        <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
        <h3 className="text-lg font-bold font-heading">Initializing Visual Studio Workspace...</h3>
        <p className="text-xs text-gray-400 mt-1">
          Loading layout blocks, typography tokens, and SEO telemetry...
        </p>
      </div>
    );
  }

  if (error || (!service && !page)) {
    return (
      <div className="fixed inset-0 bg-gray-900 flex flex-col items-center justify-center text-white p-6 z-50">
        <div className="max-w-md w-full bg-gray-800 rounded-3xl p-8 border border-gray-700 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold font-heading">Workspace Loading Error</h3>
          <p className="text-xs text-gray-300">{error || 'Unable to locate page record.'}</p>
          <button
            type="button"
            onClick={handleBackToDashboard}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-orange-600 text-white font-bold text-xs shadow hover:bg-orange-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Pages Dashboard</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-gray-950 overflow-hidden flex flex-col">
      {/* Visual Workspace Canvas */}
      {type === 'service' && service && (
        <ElementorPageBuilder
          key={`service-${service.id}`}
          pageId={service.id}
          pageType="service"
          title={service.title}
          slug={service.slug}
          initialBlocks={service.page_blocks || []}
          initialSeoMeta={service.seo_meta}
          heroConfig={service.hero_config}
          status={service.is_published ? 'published' : 'draft'}
          onBack={handleBackToDashboard}
          onSaveDraft={async ({ blocks, seoMeta, heroConfig, slug, title }) => {
            const updated = await SunraiseAPI.upsertService({
              ...service,
              title,
              slug,
              page_blocks: blocks,
              seo_meta: seoMeta,
              hero_config: heroConfig || service.hero_config,
              is_published: false
            });
            setService(updated);
          }}
          onPublish={async ({ blocks, seoMeta, heroConfig, slug, title }) => {
            const updated = await SunraiseAPI.upsertService({
              ...service,
              title,
              slug,
              page_blocks: blocks,
              seo_meta: seoMeta,
              hero_config: heroConfig || service.hero_config,
              is_published: true
            });
            setService(updated);
          }}
        />
      )}

      {type === 'page' && page && (
        <ElementorPageBuilder
          key={`page-${page.id}`}
          pageId={page.id}
          pageType="page"
          title={page.title}
          slug={page.slug}
          initialBlocks={page.page_blocks || []}
          initialSeoMeta={page.seo_meta}
          heroConfig={page.hero_config}
          status={page.status}
          onBack={handleBackToDashboard}
          onSaveDraft={async ({ blocks, seoMeta, heroConfig, slug, title }) => {
            const updated = await SunraiseAPI.upsertPage({
              ...page,
              title,
              slug,
              page_blocks: blocks,
              seo_meta: seoMeta,
              hero_config: heroConfig,
              status: 'draft'
            });
            setPage(updated);
          }}
          onPublish={async ({ blocks, seoMeta, heroConfig, slug, title }) => {
            const updated = await SunraiseAPI.upsertPage({
              ...page,
              title,
              slug,
              page_blocks: blocks,
              seo_meta: seoMeta,
              hero_config: heroConfig,
              status: 'published'
            });
            setPage(updated);
          }}
        />
      )}
    </div>
  );
};
