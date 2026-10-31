import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  FolderKanban,
  MessageSquareQuote,
  Inbox,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  FileCode,
  Shield,
  Sparkles,
  Menu
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Lead } from '../../types';

export const AdminDashboard: React.FC = () => {
  const [counts, setCounts] = useState({
    services: 0,
    projects: 0,
    testimonials: 0,
    leads: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);

  useEffect(() => {
    Promise.all([
      SunraiseAPI.getServices(),
      SunraiseAPI.getProjects(),
      SunraiseAPI.getTestimonials(),
      SunraiseAPI.getLeads(),
    ]).then(([s, p, t, l]) => {
      setCounts({
        services: s.length,
        projects: p.length,
        testimonials: t.length,
        leads: l.length,
      });
      setRecentLeads(l.slice(0, 5));
    });
  }, []);

  const handleStatusChange = async (leadId: number, status: Lead['status']) => {
    await SunraiseAPI.updateLeadStatus(leadId, status);
    const updated = await SunraiseAPI.getLeads();
    setRecentLeads(updated.slice(0, 5));
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 text-white shadow-sunraise flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-2 inline-block">
            Production Management Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">
            Welcome to Sunraise Solutions Visual CMS
          </h1>
          <p className="text-white/90 text-xs sm:text-sm mt-1 max-w-xl">
            Manage your service catalog, drag-and-drop page block canvases, review case studies, and safeguard Google rankings with zero-regression SEO.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/admin/navigation"
            className="px-5 py-3 rounded-full bg-white/20 text-white font-bold text-xs shadow hover:bg-white/30 transition flex items-center gap-1.5 border border-white/30"
          >
            <Menu className="w-4 h-4" />
            <span>Manage Navigation</span>
          </Link>
          <Link
            to="/admin/builder"
            className="px-5 py-3 rounded-full bg-white text-orange-600 font-bold text-xs shadow hover:bg-gray-50 transition flex items-center gap-1.5"
          >
            <FileCode className="w-4 h-4" />
            <span>Launch Page Builder</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Total Services
            </span>
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-heading">
            {counts.services}
          </div>
          <Link
            to="/admin/services"
            className="text-xs text-orange-600 font-semibold mt-2 inline-flex items-center gap-1 hover:underline"
          >
            <span>Manage Service Codes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Portfolio Projects
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <FolderKanban className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-heading">
            {counts.projects}
          </div>
          <Link
            to="/admin/projects"
            className="text-xs text-orange-600 font-semibold mt-2 inline-flex items-center gap-1 hover:underline"
          >
            <span>Linked to Service Codes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Client Reviews
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-heading">
            {counts.testimonials}
          </div>
          <Link
            to="/admin/testimonials"
            className="text-xs text-orange-600 font-semibold mt-2 inline-flex items-center gap-1 hover:underline"
          >
            <span>Manage Testimonials</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-warm">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
              Inbound Proposals
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-gray-900 font-heading">
            {counts.leads}
          </div>
          <Link
            to="/admin/leads"
            className="text-xs text-orange-600 font-semibold mt-2 inline-flex items-center gap-1 hover:underline"
          >
            <span>Review Lead Pipeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Recent Leads Inbox Preview */}
      <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-warm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-heading font-bold text-gray-900 text-lg">
              Recent Inbound Proposals &amp; Inquiries
            </h3>
            <p className="text-xs text-gray-500">
              Submitted from homepage, service pages, and contact audits.
            </p>
          </div>
          <Link
            to="/admin/leads"
            className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1"
          >
            <span>View Full Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-y border-gray-100">
              <tr>
                <th className="py-3 px-4">Contact Name</th>
                <th className="py-3 px-4">Email &amp; Phone</th>
                <th className="py-3 px-4">Service Code</th>
                <th className="py-3 px-4">Budget</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Triage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3 px-4 font-bold text-gray-900">{lead.full_name}</td>
                  <td className="py-3 px-4 text-gray-500">
                    <div>{lead.email}</div>
                    <div className="text-[11px] text-gray-400">{lead.phone}</div>
                  </td>
                  <td className="py-3 px-4 font-mono font-semibold text-orange-600">
                    {lead.service_code || 'General'}
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-700">{lead.budget_range}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        lead.status === 'new'
                          ? 'bg-blue-100 text-blue-700'
                          : lead.status === 'qualified'
                          ? 'bg-emerald-100 text-emerald-700'
                          : lead.status === 'contacted'
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {lead.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value as Lead['status'])
                      }
                      className="text-xs p-1 rounded-lg border border-gray-200 bg-white"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="closed">Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
