import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, ArrowUpRight, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-16 pb-12 border-t border-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-gray-800">
          {/* Brand & Summary (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center group py-1">
              <img
                src="/logo.png"
                alt="Sunraise Solutions"
                className="h-10 w-auto object-contain brightness-0 invert transition group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm">
              Premier corporate digital agency & custom software powerhouse operating in Hyderabad and Rajahmundry. Delivering 18+ years of high-performance SEO, cloud software, mobile applications, and aggressive performance marketing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ISO 9001:2015 Process Compliant</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <span>98% Retention</span>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Company
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="hover:text-orange-400 transition flex items-center gap-1">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-orange-400 transition flex items-center gap-1">
                  <span>About Us</span>
                </Link>
              </li>
              <li>
                <Link to="/projects" className="hover:text-orange-400 transition flex items-center gap-1">
                  <span>Case Studies</span>
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-orange-400 transition flex items-center gap-1">
                  <span>SEO & Tech Blog</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-400 transition flex items-center gap-1">
                  <span>Request Proposal</span>
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-orange-400 hover:text-orange-300 transition flex items-center gap-1 text-xs font-semibold pt-1">
                  <span>Admin CMS</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Capabilities
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services/seo-services-in-hyderabad" className="hover:text-orange-400 transition">
                  SEO in Hyderabad
                </Link>
              </li>
              <li>
                <Link to="/services/web-development" className="hover:text-orange-400 transition">
                  Web & Cloud Apps
                </Link>
              </li>
              <li>
                <Link to="/services/mobile-app-development" className="hover:text-orange-400 transition">
                  Mobile Apps (iOS/Android)
                </Link>
              </li>
              <li>
                <Link to="/services/hospital-management-software" className="hover:text-orange-400 transition">
                  Hospital Management (HMS)
                </Link>
              </li>
              <li>
                <Link to="/services/digital-marketing" className="hover:text-orange-400 transition">
                  Performance Ads
                </Link>
              </li>
              <li>
                <Link to="/services/political-branding" className="hover:text-orange-400 transition">
                  Political Branding
                </Link>
              </li>
            </ul>
          </div>

          {/* Dual Offices */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white font-heading">
              Our Offices
            </h4>

            {/* Hyderabad */}
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-orange-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Hyderabad Head Office</span>
              </div>
              <p className="text-xs text-gray-400">
                Madhapur, Hitec City, Hyderabad, Telangana 500081
              </p>
            </div>

            {/* Rajahmundry */}
            <div className="p-3 rounded-xl bg-gray-900 border border-gray-800 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>Rajahmundry Regional Hub</span>
              </div>
              <p className="text-xs text-gray-400">
                Danavaipeta Main Road, Rajahmundry, Andhra Pradesh 533103
              </p>
            </div>

            {/* Phone & Email */}
            <div className="space-y-1.5 text-xs">
              <a href="tel:+919959639539" className="flex items-center gap-2 hover:text-orange-400 transition">
                <Phone className="w-3.5 h-3.5 text-orange-500" />
                <span>+91 99596 39539</span>
              </a>
              <a href="mailto:hello@sunraisesolutions.com" className="flex items-center gap-2 hover:text-orange-400 transition">
                <Mail className="w-3.5 h-3.5 text-orange-500" />
                <span>hello@sunraisesolutions.com</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Sunraise Solutions Pvt. Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Built with precision for Hyderabad & AP enterprises</span>
            <span className="flex items-center gap-1">
              Engineered with <Heart className="w-3.5 h-3.5 text-orange-500 fill-orange-500" /> in India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
