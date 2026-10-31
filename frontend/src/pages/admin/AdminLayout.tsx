import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Menu,
  Layers,
  FileCode,
  FolderKanban,
  MessageSquareQuote,
  BookOpen,
  Inbox,
  Compass,
  ArrowUpRight,
  Shield,
  RotateCcw,
  Sparkles,
  LogOut
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const navItems = [
    { label: 'Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Services & Codes', path: '/admin/services', icon: Layers },
    { label: 'Page Builder Canvas', path: '/admin/builder', icon: FileCode },
    { label: 'Navigation & Menus', path: '/admin/navigation', icon: Menu },
    { label: 'Completed Projects', path: '/admin/projects', icon: FolderKanban },
    { label: 'Client Testimonials', path: '/admin/testimonials', icon: MessageSquareQuote },
    { label: 'Blog & Articles', path: '/admin/blogs', icon: BookOpen },
    { label: 'Inbound Leads Inbox', path: '/admin/leads', icon: Inbox },
    { label: 'Zero-Regression SEO', path: '/admin/seo', icon: Compass },
  ];

  const handleResetData = () => {
    if (confirm('Reset CMS database to factory demo seed data? All custom edits will revert to original state.')) {
      SunraiseAPI.resetToDefaults();
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (e) {
      console.error('Sign out error:', e);
    }
  };

  const userInitial = user?.displayName ? user.displayName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'A';
  const userTitle = user?.displayName || user?.email || 'Authenticated Admin';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Fixed Independent Sidebar (Fixed to viewport, never stretches with main content) */}
      <aside className="fixed top-0 left-0 bottom-0 w-64 h-screen bg-gray-950 text-white z-30 flex flex-col justify-between border-r border-gray-800 select-none">
        <div className="flex flex-col min-h-0 flex-1">
          {/* Brand */}
          <div className="p-6 border-b border-gray-800 shrink-0 flex items-center justify-between">
            <Link to="/" className="flex items-center group py-1">
              <img
                src="/logo.png"
                alt="Sunraise"
                className="h-9 w-auto brightness-0 invert object-contain transition group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </Link>
          </div>

          {/* Navigation Links (Scrollable if viewport is short) */}
          <nav className="p-4 space-y-1 overflow-y-auto flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? 'bg-orange-600 text-white shadow-sunraise'
                      : 'text-gray-400 hover:text-white hover:bg-gray-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions (Pinned to bottom of viewport) */}
        <div className="p-4 border-t border-gray-800 space-y-2 shrink-0 bg-gray-950">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white hover:bg-gray-900 transition"
          >
            <span className="flex items-center gap-2">
              <ArrowUpRight className="w-3.5 h-3.5 text-orange-500" />
              <span>Public Live Site</span>
            </span>
            <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-400">Preview</span>
          </Link>

          <button
            onClick={handleResetData}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-amber-400 hover:bg-gray-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Seed Data</span>
          </button>

          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out Session</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area (Offset by 64 (16rem) so content scrolls independently) */}
      <div className="flex-1 pl-64 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-orange-500" />
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Sunraise Corporate CMS • Firebase Authenticated Session
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={userTitle} className="w-8 h-8 rounded-full border border-orange-200" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-bold font-heading">
                  {userInitial}
                </div>
              )}
              <div className="hidden sm:block text-left">
                <div className="text-xs font-bold text-gray-900 truncate max-w-[180px]">{userTitle}</div>
                <div className="text-[10px] text-gray-500">Firebase Authorized</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="p-6 flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
