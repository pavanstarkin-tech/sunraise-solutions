import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { ServicesPage } from './pages/ServicesPage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { BlogPage } from './pages/BlogPage';
import { BlogDetailPage } from './pages/BlogDetailPage';
import { ContactPage } from './pages/ContactPage';
import { CustomLandingPage } from './pages/CustomLandingPage';

// Auth & Admin CMS Pages
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { AdminLogin } from './pages/admin/AdminLogin';
import { AdminLayout } from './pages/admin/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminServices } from './pages/admin/AdminServices';
import { AdminPageEditor } from './pages/admin/AdminPageEditor';
import { BuilderWorkspacePage } from './pages/admin/BuilderWorkspacePage';
import { AdminProjects } from './pages/admin/AdminProjects';
import { AdminTestimonials } from './pages/admin/AdminTestimonials';
import { AdminBlogs } from './pages/admin/AdminBlogs';
import { AdminLeads } from './pages/admin/AdminLeads';
import { AdminSEOEngine } from './pages/admin/AdminSEOEngine';
import { AdminNavigationMenu } from './pages/admin/AdminNavigationMenu';

// Scroll to top helper on route transition
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// Public Website Layout Wrapper
const PublicLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-orange-500 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Public Corporate Routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
            <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
            <Route path="/projects" element={<PublicLayout><ProjectsPage /></PublicLayout>} />
            <Route path="/blog" element={<PublicLayout><BlogPage /></PublicLayout>} />
            <Route path="/blog/:slug" element={<PublicLayout><BlogDetailPage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/p/:slug" element={<PublicLayout><CustomLandingPage /></PublicLayout>} />

            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Dedicated Full-Screen Builder Workspace */}
            <Route
              path="/admin/builder/workspace"
              element={
                <ProtectedRoute>
                  <BuilderWorkspacePage />
                </ProtectedRoute>
              }
            />

            {/* Protected Admin CMS Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="builder" element={<AdminPageEditor />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="testimonials" element={<AdminTestimonials />} />
              <Route path="blogs" element={<AdminBlogs />} />
              <Route path="leads" element={<AdminLeads />} />
              <Route path="seo" element={<AdminSEOEngine />} />
              <Route path="navigation" element={<AdminNavigationMenu />} />
            </Route>

            {/* Catch-all Fallback */}
            <Route path="*" element={<PublicLayout><HomePage /></PublicLayout>} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  );
};

export default App;
