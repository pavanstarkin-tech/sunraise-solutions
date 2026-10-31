import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Calendar, Clock, ArrowRight, Tag } from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { SunraiseAPI } from '../services/api';
import { Blog } from '../types';

export const BlogPage: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    SunraiseAPI.getBlogs().then(setBlogs);
  }, []);

  const categories = ['All', 'SEO & Organic Growth', 'Healthcare Technology'];

  const filtered = selectedCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === selectedCategory);

  return (
    <>
      <SEOHead
        title="SEO & Software Insights Blog | Sunraise Solutions Hyderabad"
        description="Actionable engineering blueprints, local Hyderabad SEO strategies, and hospital software best practices authored by the Sunraise technical team."
        canonicalPath="/blog"
      />

      <section className="py-20 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Technical Authority</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 font-heading leading-tight mb-4">
            SEO &amp; Enterprise Architecture Insights
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            In-depth guides, benchmark studies, and search engine telemetry authored by our senior architects in Hyderabad and Rajahmundry.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
                  selectedCategory === cat
                    ? 'bg-orange-600 text-white shadow-sunraise'
                    : 'bg-warm-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {filtered.map((blog) => (
              <article
                key={blog.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-warm overflow-hidden hover:shadow-warm-hover hover:-translate-y-1 transition duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={blog.cover_image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 rounded-full bg-orange-600 text-white text-xs font-bold">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Oct 2026</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>5 min read</span>
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-900 font-heading mb-3 group-hover:text-orange-600 transition">
                      <Link to={`/blog/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-3">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-2 border-t border-gray-50 flex items-center justify-between">
                  <Link
                    to={`/blog/${blog.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
