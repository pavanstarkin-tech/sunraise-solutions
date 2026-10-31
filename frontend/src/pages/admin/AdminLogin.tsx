import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const AdminLogin: React.FC = () => {
  const { signInWithEmail, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // If already authenticated, redirect
  React.useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide your corporate admin credentials.');
      return;
    }

    try {
      setError(null);
      setSubmitting(true);
      await signInWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error('Auth error:', err);
      let msg = 'Authentication failed. Please verify credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = 'Account temporarily locked due to failed attempts. Try again shortly.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFFDF9] via-[#FAF9F6] to-[#FFF3E8] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* ================= 1. LEFT-SIDE TOP: ORANGE-COLORED CIRCULAR PAINTINGS & ARTISTIC ELEMENTS ================= */}
      {/* Top-Left Ambient Orange Glow */}
      <div className="absolute -top-20 -left-20 sm:-top-28 sm:-left-28 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-br from-orange-400/25 via-amber-300/15 to-transparent blur-3xl pointer-events-none" />
      
      {/* Top-Left Concentric Orange Circles Composition */}
      <div className="absolute top-6 left-6 sm:top-12 sm:left-12 pointer-events-none select-none hidden md:block">
        <div className="relative">
          {/* Outer Ring with soft gradient */}
          <div className="w-64 h-64 rounded-full border-2 border-orange-400/30 bg-gradient-to-br from-orange-500/10 via-amber-400/5 to-transparent backdrop-blur-xs flex items-center justify-center transition-transform duration-700">
            {/* Middle Dashed Ring */}
            <div className="w-48 h-48 rounded-full border border-dashed border-orange-400/40 flex items-center justify-center">
              {/* Inner Glowing Gradient Disc */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-orange-500/30 to-amber-400/20 shadow-xl shadow-orange-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 opacity-40 blur-sm" />
              </div>
            </div>
          </div>

          {/* Floating Orb 1 */}
          <div className="absolute -bottom-6 -right-4 w-20 h-20 rounded-full bg-gradient-to-tr from-orange-500/35 via-amber-400/25 to-orange-600/25 border border-orange-300/40 shadow-lg shadow-orange-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-orange-400/70" />
          </div>

          {/* Floating Orb 2 */}
          <div className="absolute -top-3 right-10 w-12 h-12 rounded-full bg-gradient-to-br from-amber-400/40 to-orange-500/30 border border-orange-300/50 shadow-md shadow-orange-500/10" />
          
          {/* Accent Mini Dots */}
          <div className="absolute top-1/2 -left-4 w-3.5 h-3.5 rounded-full bg-orange-500/60 shadow-xs" />
          <div className="absolute bottom-12 left-6 w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        </div>
      </div>

      {/* ================= 2. RIGHT-SIDE BOTTOM: ORANGE-COLORED CIRCULAR PAINTINGS & ARTISTIC ELEMENTS ================= */}
      {/* Bottom-Right Ambient Orange Glow */}
      <div className="absolute -bottom-20 -right-20 sm:-bottom-28 sm:-right-28 w-[380px] h-[380px] sm:w-[520px] sm:h-[520px] rounded-full bg-gradient-to-tl from-orange-500/25 via-amber-400/15 to-transparent blur-3xl pointer-events-none" />

      {/* Bottom-Right Concentric Orange Circles Composition */}
      <div className="absolute bottom-6 right-6 sm:bottom-12 sm:right-12 pointer-events-none select-none hidden md:block">
        <div className="relative">
          {/* Outer Ring */}
          <div className="w-64 h-64 rounded-full border-2 border-orange-400/30 bg-gradient-to-tl from-orange-500/10 via-amber-400/5 to-transparent backdrop-blur-xs flex items-center justify-center transition-transform duration-700">
            {/* Middle Dashed Ring */}
            <div className="w-48 h-48 rounded-full border border-dashed border-orange-400/40 flex items-center justify-center">
              {/* Inner Glowing Gradient Disc */}
              <div className="w-32 h-32 rounded-full bg-gradient-to-bl from-orange-500/30 to-amber-400/20 shadow-xl shadow-orange-500/20 flex items-center justify-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 opacity-40 blur-sm" />
              </div>
            </div>
          </div>

          {/* Floating Orb 1 */}
          <div className="absolute -top-6 -left-4 w-20 h-20 rounded-full bg-gradient-to-bl from-orange-500/35 via-amber-400/25 to-orange-600/25 border border-orange-300/40 shadow-lg shadow-orange-500/20 backdrop-blur-sm flex items-center justify-center">
            <div className="w-6 h-6 rounded-full bg-orange-400/70" />
          </div>

          {/* Floating Orb 2 */}
          <div className="absolute -bottom-3 left-10 w-12 h-12 rounded-full bg-gradient-to-tl from-amber-400/40 to-orange-500/30 border border-orange-300/50 shadow-md shadow-orange-500/10" />

          {/* Accent Mini Dots */}
          <div className="absolute bottom-1/2 -right-4 w-3.5 h-3.5 rounded-full bg-orange-500/60 shadow-xs" />
          <div className="absolute top-12 right-6 w-2.5 h-2.5 rounded-full bg-amber-400/70" />
        </div>
      </div>

      {/* ================= FIXED CENTER LOGIN CONTAINER ================= */}
      <div className="w-full max-w-md relative z-10 my-auto">
        {/* Brand Logo & Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center group py-2" title="Sunraise Solutions">
            <img
              src="/logo.png"
              alt="Sunraise Solutions"
              className="h-12 w-auto object-contain transition group-hover:scale-105"
            />
          </Link>

          <h2 className="mt-3 text-2xl sm:text-3xl font-black text-gray-950 font-heading tracking-tight">
            Admin CMS Portal
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-gray-500">
            Sign in to manage services, projects, blogs &amp; leads
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white/95 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl shadow-orange-950/10 rounded-3xl border border-gray-100/90">
          {error && (
            <div className="mb-6 rounded-2xl bg-red-50 p-4 border border-red-200/80 flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs font-semibold text-red-800 leading-relaxed">{error}</div>
            </div>
          )}

          {/* EMAIL & PASSWORD FORM */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Corporate Email
              </label>
              <div className="relative rounded-2xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@sunraisesolutions.com"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs font-medium transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative rounded-2xl shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••••"
                  className="block w-full pl-10 pr-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 text-xs font-medium transition"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-2xl shadow-lg shadow-orange-500/25 text-xs font-extrabold text-white bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 hover:brightness-105 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span className="inline-flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                    </svg>
                    <span>Verifying Credentials...</span>
                  </span>
                ) : (
                  <>
                    <span>Enter Sunraise CMS</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
