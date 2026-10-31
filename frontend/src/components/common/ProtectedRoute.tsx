import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] flex flex-col items-center justify-center">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5722] to-[#FF8A00] flex items-center justify-center text-white font-bold text-2xl shadow-xl shadow-orange-500/30 animate-pulse">
            S
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-orange-600 animate-spin" />
          </div>
        </div>
        <p className="mt-4 text-sm font-semibold text-gray-600 tracking-wide">
          Verifying Sunraise Firebase Credentials...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : null;
};
