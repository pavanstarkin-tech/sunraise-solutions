import React, { useState, useEffect } from 'react';
import { SunraiseAPI } from '../services/api';
import { CustomPage } from '../types';
import { VisualBlockRenderer } from '../components/builder/VisualBlockRenderer';
import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  Building2,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  ArrowRight,
  Sparkles,
  Phone,
  Mail
} from 'lucide-react';
import { SEOHead } from '../components/common/SEOHead';
import { LEADERSHIP_TEAM } from '../services/api';

export const AboutPage: React.FC = () => {
  const [customPageData, setCustomPageData] = useState<CustomPage | null>(null);

  useEffect(() => {
    SunraiseAPI.getPageBySlug('about').then((res) => {
      if (res && res.page_blocks && res.page_blocks.length > 0) {
        setCustomPageData(res);
      }
    });
  }, []);

  

  return (
    <>
      <SEOHead
        title="About Us | Sunraise Solutions - 18+ Years Corporate Digital Legacy"
        description="Learn about Sunraise Solutions, our executive leadership, 18+ years of digital transformation, and our dual hubs in Hyderabad and Rajahmundry."
        canonicalPath="/about"
      />

      {/* Hero Header */}
      <section className="py-20 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>18+ Years of Corporate Excellence</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 font-heading leading-tight mb-4">
            Building High-Performance Digital Equity Across South India
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Founded with an unwavering commitment to engineering mastery and business growth, Sunraise Solutions unites visionary digital marketing with enterprise-grade cloud software.
          </p>
        </div>
      </section>

      {/* Corporate Story & Dual Presence */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                Our Evolution
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading leading-tight">
                From Regional Pioneers to Full-Spectrum Digital Powerhouse
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Over nearly two decades, Sunraise Solutions has navigated every algorithmic shift and architectural revolution—from the early web to modern headless microservices, reactive cross-platform mobile apps, and deep technical SEO.
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                Today, our dual presence in Hyderabad (Telangana's tech capital) and Rajahmundry (Andhra Pradesh's thriving commercial corridor) allows us to provide both high-tier corporate scalability and personalized, rapid on-the-ground client engagement.
              </p>

              {/* Dual Offices Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-warm-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <Building2 className="w-4 h-4 text-orange-600" />
                    <span>Hyderabad Head Office</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Madhapur, Hitec City, Hyderabad, Telangana 500081
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-warm-gray-50 border border-gray-100 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                    <MapPin className="w-4 h-4 text-amber-600" />
                    <span>Rajahmundry Regional Hub</span>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Danavaipeta Main Road, Rajahmundry, Andhra Pradesh 533103
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80"
                alt="Sunraise Solutions Team Strategy"
                className="rounded-3xl shadow-warm-hover object-cover w-full h-[440px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Executive Leadership Team */}
      <section id="team" className="py-20 bg-warm-gray-50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full">
              Leadership
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
              Executive Board &amp; Directors
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Seasoned industry pioneers spearheading innovation and client prosperity.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {LEADERSHIP_TEAM.map((member, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-gray-100 p-6 shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition duration-200"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="rounded-xl w-full h-60 object-cover mb-4"
                />
                <h3 className="text-lg font-bold text-gray-900 font-heading">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-orange-600 mb-2">
                  {member.role}
                </p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Strip */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black font-heading">
            Partner with South India’s Most Proven Digital Team
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto">
            Let's discuss how our technical architectures and search strategies can accelerate your corporate objectives.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg transition"
            >
              <span>Initiate Conversation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};
