import React, { useState, useEffect } from 'react';
import { Inbox, Download, Filter, Search, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Lead } from '../../types';

export const AdminLeads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const list = await SunraiseAPI.getLeads();
    setLeads(list);
  };

  const handleStatusChange = async (id: number, status: Lead['status']) => {
    await SunraiseAPI.updateLeadStatus(id, status);
    loadLeads();
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    const headers = ['ID', 'Full Name', 'Email', 'Phone', 'Service Code', 'Budget', 'Status', 'Date', 'Message'];
    const rows = leads.map(l => [
      l.id,
      `"${l.full_name}"`,
      `"${l.email}"`,
      `"${l.phone}"`,
      `"${l.service_code || ''}"`,
      `"${l.budget_range}"`,
      l.status,
      l.created_at || '',
      `"${(l.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sunraise_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = leads.filter(l => {
    const matchesStatus = filterStatus === 'All' || l.status === filterStatus;
    const matchesSearch =
      l.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.phone.includes(searchTerm);
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-warm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            Inbound Proposals &amp; Leads Inbox
          </h2>
          <p className="text-xs text-gray-500">
            Real-time pipeline of requests submitted through high-converting proposal forms.
          </p>
        </div>

        <button
          onClick={exportToCSV}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-900 text-white text-xs font-bold hover:bg-gray-800 transition shadow"
        >
          <Download className="w-4 h-4 text-orange-400" />
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-warm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <span className="text-xs font-bold text-gray-700">Filter Status:</span>
          {['All', 'new', 'contacted', 'qualified', 'closed'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition ${
                filterStatus === st
                  ? 'bg-orange-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-xs pl-9 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 w-56"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Contact &amp; Organization</th>
                <th className="py-3 px-4">Phone / Email</th>
                <th className="py-3 px-4">Service &amp; Budget</th>
                <th className="py-3 px-4">Submitted Message</th>
                <th className="py-3 px-4">Current Status</th>
                <th className="py-3 px-4 text-right">Workflow</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4 font-bold text-gray-900">
                    <div>{lead.full_name}</div>
                    <div className="text-[10px] text-gray-400 font-normal">
                      Source: {lead.source_page || '/'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3 text-orange-500" />
                      <a href={`tel:${lead.phone}`} className="hover:underline">{lead.phone}</a>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5 text-gray-400">
                      <Mail className="w-3 h-3" />
                      <a href={`mailto:${lead.email}`} className="hover:underline">{lead.email}</a>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-orange-600">
                      {lead.service_code || 'General'}
                    </div>
                    <div className="text-[11px] text-gray-600 font-semibold">{lead.budget_range}</div>
                  </td>
                  <td className="py-3.5 px-4 max-w-xs text-gray-600 leading-relaxed">
                    <div className="line-clamp-2" title={lead.message}>
                      {lead.message || 'No additional message provided.'}
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
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
                  <td className="py-3.5 px-4 text-right">
                    <select
                      value={lead.status}
                      onChange={(e) =>
                        handleStatusChange(lead.id, e.target.value as Lead['status'])
                      }
                      className="text-xs p-1.5 rounded-lg border border-gray-200 bg-white"
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
