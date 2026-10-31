import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Shield,
  Phone,
  Sparkles,
  Search,
  Globe,
  Smartphone,
  Megaphone,
  Code2,
  Vote,
  Film,
  Activity,
  Users,
  Award,
  Building2,
  FolderKanban,
  BookOpen
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Service, NavigationItem, NavigationSettings } from '../../types';

const ICON_MAP: Record<string, React.ElementType> = {
  Search,
  Globe,
  Smartphone,
  Megaphone,
  Code2,
  Vote,
  Film,
  Activity,
  Users,
  Award,
  Building2,
  FolderKanban,
  BookOpen,
  Phone,
  Sparkles
};

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [navTree, setNavTree] = useState<NavigationItem[]>([]);
  const [navSettings, setNavSettings] = useState<NavigationSettings>({});
  const [activeDropdownId, setActiveDropdownId] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedIds, setMobileExpandedIds] = useState<number[]>([]);
  const location = useLocation();

  useEffect(() => {
    SunraiseAPI.getNavigation().then((res) => {
      if (res && res.tree) {
        setNavTree(res.tree);
      }
      if (res && res.settings) {
        setNavSettings(res.settings);
      }
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdownId(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileExpand = (id: number) => {
    setMobileExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const activeNavItems = navTree.filter((item) => item.is_active);

  return (
    <>
      {/* Top Banner Strip */}
      <div className="bg-gray-900 text-gray-300 text-xs py-2 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {navSettings.top_bar_announcement ||
                'Dual Presence: Hyderabad HQ & Rajahmundry Regional Hub | 18+ Years Corporate Digital Excellence'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${(navSettings.top_bar_phone || '+91 99596 39539').replace(/\s+/g, '')}`}
              className="hover:text-orange-400 transition flex items-center gap-1 font-medium"
            >
              <Phone className="w-3.5 h-3.5 text-orange-400" />
              <span>{navSettings.top_bar_phone || '+91 99596 39539'}</span>
            </a>
            {navSettings.top_bar_show_admin_link !== '0' && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[11px] font-semibold hover:bg-orange-500 hover:text-white transition"
                title="Open Admin CMS Dashboard"
              >
                <Shield className="w-3 h-3" />
                <span>Admin CMS</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-warm py-3 border-b border-gray-100'
            : 'bg-white/95 backdrop-blur-md py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group py-1">
            <img
              src={navSettings.navbar_logo_url || '/logo.png'}
              alt="Sunraise Solutions"
              className="h-10 sm:h-12 w-auto object-contain transition group-hover:scale-[1.02]"
              onError={(e) => {
                const target = e.target as HTMLElement;
                target.style.display = 'none';
              }}
            />
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7">
            {activeNavItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isCurrent =
                item.url === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.url);

              if (!hasChildren) {
                return (
                  <Link
                    key={item.id}
                    to={item.url}
                    target={item.target || '_self'}
                    className={`text-sm font-semibold transition ${
                      isCurrent
                        ? 'text-orange-600'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    {item.title}
                  </Link>
                );
              }

              // Flyout / Megamenu Item with Submenus
              const isOpen = activeDropdownId === item.id;
              const activeChildren = item.children?.filter((c) => c.is_active) || [];

              return (
                <div
                  key={item.id}
                  className="relative"
                  onMouseEnter={() => setActiveDropdownId(item.id)}
                  onMouseLeave={() => setActiveDropdownId(null)}
                >
                  <button
                    type="button"
                    onClick={() => setActiveDropdownId(isOpen ? null : item.id)}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition py-2 ${
                      isCurrent
                        ? 'text-orange-600'
                        : 'text-gray-700 hover:text-orange-600'
                    }`}
                  >
                    <span>{item.title}</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-orange-600' : ''
                      }`}
                    />
                  </button>

                  {/* Dropdown Flyout Dialog */}
                  {isOpen && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 w-[720px] bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-orange-500" />
                          <span className="text-xs font-bold text-gray-900 tracking-wider uppercase">
                            {item.title} Directory
                          </span>
                        </div>
                        <span className="text-xs text-orange-600 font-bold">
                          {activeChildren.length} Specializations
                        </span>
                      </div>

                      {/* Submenu Grid */}
                      <div className="grid grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                        {activeChildren.map((sub) => {
                          const IconComp = ICON_MAP[sub.icon_name || 'Globe'] || Globe;
                          return (
                            <Link
                              key={sub.id}
                              to={sub.url}
                              target={sub.target || '_self'}
                              className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-orange-50/80 transition group border border-transparent hover:border-orange-100"
                            >
                              {/* Submenu Item Thumbnail Image or Icon */}
                              {sub.image_url ? (
                                <img
                                  src={sub.image_url}
                                  alt={sub.title}
                                  className="w-11 h-11 rounded-xl object-cover shrink-0 border border-gray-100 shadow-sm group-hover:scale-105 transition"
                                />
                              ) : (
                                <div className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-tr group-hover:from-orange-500 group-hover:to-amber-500 group-hover:text-white transition shadow-sm">
                                  <IconComp className="w-5 h-5" />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition truncate">
                                    {sub.title}
                                  </span>
                                  {sub.badge && (
                                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold shrink-0">
                                      {sub.badge}
                                    </span>
                                  )}
                                </div>
                                {sub.description && (
                                  <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                    {sub.description}
                                  </p>
                                )}
                              </div>
                            </Link>
                          );
                        })}
                      </div>

                      {/* Optional Bottom Promo Dialog Card */}
                      {navSettings.services_dropdown_promo_title && (
                        <div className="mt-4 pt-3 border-t border-gray-100">
                          <div className="flex items-center justify-between bg-gradient-to-r from-orange-50 to-amber-50 p-3.5 rounded-2xl border border-orange-100/80">
                            <div className="flex items-center gap-3">
                              {navSettings.services_dropdown_promo_image && (
                                <img
                                  src={navSettings.services_dropdown_promo_image}
                                  alt="Promo Card"
                                  className="w-10 h-10 rounded-xl object-cover border border-orange-200 shrink-0"
                                />
                              )}
                              <div>
                                <p className="text-xs font-bold text-gray-900">
                                  {navSettings.services_dropdown_promo_title}
                                </p>
                                <p className="text-[10px] text-gray-500">
                                  Enterprise advisory for scalable ROI &amp; bespoke software.
                                </p>
                              </div>
                            </div>
                            <Link
                              to={navSettings.services_dropdown_promo_url || '/contact'}
                              className="text-xs font-extrabold text-orange-600 hover:text-orange-700 flex items-center gap-1 shrink-0 ml-3 bg-white px-3 py-1.5 rounded-full shadow-sm"
                            >
                              <span>{navSettings.services_dropdown_promo_cta || 'Consult Our Architects'}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <Link
              to={navSettings.navbar_cta_url || '/contact'}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunraise-gradient text-white font-bold text-sm shadow-sunraise hover:shadow-sunraise-lg hover:scale-105 transition-all duration-200"
            >
              <span>{navSettings.navbar_cta_text || 'Get Proposal'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-gray-700 hover:bg-gray-100"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 bg-white px-4 pt-4 pb-6 space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex flex-col space-y-2">
              {activeNavItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = mobileExpandedIds.includes(item.id);
                const activeChildren = item.children?.filter((c) => c.is_active) || [];

                if (!hasChildren) {
                  return (
                    <Link
                      key={item.id}
                      to={item.url}
                      target={item.target || '_self'}
                      className="font-bold text-gray-800 text-sm py-2 hover:text-orange-600"
                    >
                      {item.title}
                    </Link>
                  );
                }

                return (
                  <div key={item.id} className="border-b border-gray-100 pb-2">
                    <button
                      type="button"
                      onClick={() => toggleMobileExpand(item.id)}
                      className="w-full flex items-center justify-between font-bold text-gray-800 text-sm py-2"
                    >
                      <span>{item.title}</span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180 text-orange-600' : 'text-gray-400'
                        }`}
                      />
                    </button>

                    {isExpanded && (
                      <div className="space-y-2 pl-3 pt-1 pb-2 border-l-2 border-orange-200 ml-1">
                        {activeChildren.map((sub) => (
                          <Link
                            key={sub.id}
                            to={sub.url}
                            target={sub.target || '_self'}
                            className="flex items-center gap-2.5 py-1 text-xs font-semibold text-gray-700 hover:text-orange-600"
                          >
                            {sub.image_url ? (
                              <img
                                src={sub.image_url}
                                alt={sub.title}
                                className="w-6 h-6 rounded-md object-cover border border-gray-200 shrink-0"
                              />
                            ) : null}
                            <span>{sub.title}</span>
                            {sub.badge && (
                              <span className="text-[9px] bg-orange-100 text-orange-700 px-1.5 py-0.2 rounded font-bold">
                                {sub.badge}
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              <Link
                to="/admin"
                className="font-bold text-orange-600 text-sm py-2 flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                <span>Admin CMS Dashboard</span>
              </Link>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <Link
                to={navSettings.navbar_cta_url || '/contact'}
                className="w-full justify-center inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunraise-gradient text-white font-bold text-sm shadow-sunraise"
              >
                <span>{navSettings.navbar_cta_text || 'Get a Free Proposal'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
