import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, ArrowRight, User, Share2 } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { SunraiseAPI } from '../services/api';
import { Blog, Service } from '../types';
import { BlockCanvas } from '../components/builder/BlockCanvas';

export const BlogDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedService, setRelatedService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      SunraiseAPI.getBlogBySlug(slug).then(async (res) => {
        setBlog(res);
        if (res?.service_code) {
          const services = await SunraiseAPI.getServices();
          const matched = services.find(s => s.service_code === res.service_code);
          if (matched) setRelatedService(matched);
        }
        setLoading(false);
      });
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 text-center">
        <div className="inline-block w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Loading Article...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="py-32 text-center max-w-md mx-auto px-4">
        <h2 className="text-2xl font-black text-gray-900 font-heading">Article Not Found</h2>
        <Link to="/blog" className="inline-flex items-center gap-2 mt-4 text-orange-600 font-bold text-xs">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Blog</span>
        </Link>
      </div>
    );
  }

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    image: blog.cover_image,
    datePublished: blog.published_at || '2026-10-25',
    author: {
      '@type': 'Organization',
      name: 'Sunraise Solutions Engineering'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Sunraise Solutions',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sunraisesolutions.com/logo.png'
      }
    },
    description: blog.excerpt
  };

  return (
    <>
      <SEOHead
        meta={blog.seo_meta}
        title={blog.seo_meta?.meta_title || `${blog.title} | Sunraise Solutions`}
        description={blog.seo_meta?.meta_description || blog.excerpt}
        canonicalPath={`/blog/${blog.slug}`}
        type="article"
        ogImage={blog.cover_image}
        jsonLd={articleSchema}
      />

      <article className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-orange-600 transition mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Insights</span>
          </Link>

          <div className="flex items-center gap-2 mb-4">
            <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
              {blog.category}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-gray-900 font-heading leading-tight mb-6">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-gray-100 gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <User className="w-3.5 h-3.5 text-orange-500" />
                <span>Sunraise Technical Editorial</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Oct 2026</span>
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>5 min read</span>
              </span>
            </div>
          </div>

          <img
            src={blog.cover_image}
            alt={blog.title}
            className="rounded-3xl w-full h-[400px] object-cover mb-10 shadow-warm"
          />

          {/* Content Blocks */}
          <div className="prose prose-orange max-w-none">
            <BlockCanvas blocks={blog.content_blocks} />
          </div>

          {/* Related Internal Service Link for SEO Link Equity */}
          {relatedService && (
            <div className="mt-16 p-6 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 block mb-1">
                  Related Architecture Offering
                </span>
                <h4 className="text-base font-bold text-gray-900 font-heading">
                  {relatedService.title} ({relatedService.service_code})
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  Learn how our Hyderabad engineering team implements this for enterprise clients.
                </p>
              </div>
              <Link
                to={`/services/${relatedService.slug}`}
                className="shrink-0 px-5 py-2.5 rounded-full bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition flex items-center gap-1.5"
              >
                <span>View Service Details</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </article>
    </>
  );
};
