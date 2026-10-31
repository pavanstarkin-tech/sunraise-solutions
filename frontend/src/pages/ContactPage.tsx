import React, { useState, useEffect } from 'react';
import { CustomPage } from '../types';
import { VisualBlockRenderer } from '../components/builder/VisualBlockRenderer';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Sparkles,
  CheckCircle2,
  Building2,
  Clock,
  MessageSquare
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SEOHead } from '../components/common/SEOHead';
import { SunraiseAPI } from '../services/api';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    service_code: 'SRV-SEO-01',
    budget_range: '₹25k–₹50k',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [customPageData, setCustomPageData] = useState<CustomPage | null>(null);

  useEffect(() => {
    SunraiseAPI.getPageBySlug('contact').then((res) => {
      if (res && res.page_blocks && res.page_blocks.length > 0) {
        setCustomPageData(res);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await SunraiseAPI.submitLead({
        ...formData,
        source_page: '/contact'
      });
      setLoading(false);
      setSubmitted(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {
      setLoading(false);
    }
  };

  

  return (
    <>
      <SEOHead
        title="Contact Sunraise Solutions | Offices in Hyderabad & Rajahmundry"
        description="Connect with Sunraise Solutions for SEO audits, web & mobile app scopes, and hospital management software consultations in Hyderabad & AP."
        canonicalPath="/contact"
      />

      <section className="py-20 sunraise-mesh-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Connect With Our Architects</span>
          </span>
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 font-heading leading-tight mb-4">
            Let’s Build Your Digital Growth Engine
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Reach out to our leadership and engineering teams in Hyderabad or Rajahmundry. We respond within 24 hours with an actionable roadmap.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Contact Info & Dual Office Cards (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                  Dual Office Locations
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading mt-3 mb-2">
                  Visit or Call Our Regional Hubs
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Both centers operate full development and client advisory squads.
                </p>
              </div>

              {/* Hyderabad Office Card */}
              <div className="p-6 rounded-2xl bg-warm-gray-50 border border-gray-100 space-y-3 shadow-warm">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <Building2 className="w-5 h-5 text-orange-600" />
                  <span>Hyderabad Head Office</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Level 4, Tech Park Boulevard, Madhapur, Hitec City, Hyderabad, Telangana 500081
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-2 pt-1 border-t border-gray-200/60">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              {/* Rajahmundry Office Card */}
              <div className="p-6 rounded-2xl bg-warm-gray-50 border border-gray-100 space-y-3 shadow-warm">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <span>Rajahmundry Regional Presence</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Main Commercial Road, Danavaipeta, Rajahmundry, Andhra Pradesh 533103
                </p>
                <div className="text-xs text-gray-500 flex items-center gap-2 pt-1 border-t border-gray-200/60">
                  <Clock className="w-3.5 h-3.5 text-gray-400" />
                  <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
                </div>
              </div>

              {/* Direct Triggers */}
              <div className="space-y-3 pt-2">
                <a
                  href="tel:+919959639539"
                  className="flex items-center gap-3 p-4 rounded-xl bg-orange-50 text-orange-800 border border-orange-200/80 hover:bg-orange-100 transition"
                >
                  <Phone className="w-5 h-5 text-orange-600" />
                  <div>
                    <div className="text-xs font-semibold">Direct Call Line</div>
                    <div className="text-sm font-bold">+91 99596 39539</div>
                  </div>
                </a>

                <a
                  href="mailto:hello@sunraisesolutions.com"
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 text-gray-800 border border-gray-200 hover:bg-gray-100 transition"
                >
                  <Mail className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-xs font-semibold">Executive Inquiries</div>
                    <div className="text-sm font-bold">hello@sunraisesolutions.com</div>
                  </div>
                </a>
              </div>
            </div>

            {/* Right Proposal Form (7 cols) */}
            <div className="lg:col-span-7">
              <div className="p-8 sm:p-10 rounded-3xl bg-white border border-gray-100 shadow-warm-hover">
                <div className="mb-6">
                  <h3 className="text-2xl font-black text-gray-900 font-heading">
                    Request a Custom Scope &amp; Proposal
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Fill out the form below and we will prepare a dedicated technical brief.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h4 className="text-xl font-bold text-emerald-900 font-heading">
                      Thank You! Inquiry Received
                    </h4>
                    <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                      Our senior team will review your requirements and reach out within 24 business hours.
                    </p>
                    <button
                      onClick={() => setSubmitted(false)}
                      className="text-xs text-emerald-800 font-bold underline pt-2"
                    >
                      Submit another inquiry
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
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
                          placeholder="e.g. Kiran Kumar"
                          className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
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
                          className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
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
                        className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
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
                          <option value="SRV-SEO-01">SEO Services in Hyderabad (SRV-SEO-01)</option>
                          <option value="SRV-WEB-02">Web Development & Apps (SRV-WEB-02)</option>
                          <option value="SRV-MOB-03">Mobile App Development (SRV-MOB-03)</option>
                          <option value="SRV-HMS-08">Hospital Management Software (SRV-HMS-08)</option>
                          <option value="SRV-MKT-04">Digital Marketing & Ads (SRV-MKT-04)</option>
                          <option value="SRV-SFT-05">Custom ERP / Software (SRV-SFT-05)</option>
                          <option value="SRV-POL-06">Political Branding (SRV-POL-06)</option>
                          <option value="SRV-CGI-07">CGI Advertising (SRV-CGI-07)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                          Estimated Budget
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
                        Brief Project Description
                      </label>
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Share your goals, current bottlenecks, or desired timeline..."
                        className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <Send className="w-4 h-4" />
                      <span>{loading ? 'Submitting Scope...' : 'Transmit Request'}</span>
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
