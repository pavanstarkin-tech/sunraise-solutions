import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Layers,
  Plus,
  Edit,
  Trash2,
  FileCode,
  Compass,
  ArrowRight,
  Sparkles,
  X,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Service } from '../../types';

export const AdminServices: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<Partial<Service> | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    const list = await SunraiseAPI.getServices();
    setServices(list);
  };

  const handleCreateNew = () => {
    setCurrentService({
      service_code: `SRV-NEW-${(services.length + 1).toString().padStart(2, '0')}`,
      slug: `new-service-${services.length + 1}`,
      title: 'New Service Capability',
      short_description: 'Enter a concise description of this corporate capability.',
      icon_name: 'Globe',
      thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      hero_config: {
        badge: 'NEW CAPABILITY',
        title: 'High-Converting Services for',
        highlight_text: 'Corporate Scale',
        subtitle: 'Engineered for sub-second performance and search visibility.',
        primary_cta: 'Request Scope',
        secondary_cta: 'View Work',
        hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        stats: [
          { label: 'Uptime', val: '99.9%' },
          { label: 'Growth', val: '+200%' }
        ]
      },
      page_blocks: [],
      seo_meta: {
        meta_title: 'New Service | Sunraise Solutions',
        meta_description: 'Corporate digital solutions in Hyderabad and Rajahmundry.',
        lock_seo: false
      },
      is_published: true,
      display_order: services.length + 1
    });
    setEditModalOpen(true);
  };

  const handleEdit = (service: Service) => {
    setCurrentService({ ...service });
    setEditModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this service?')) {
      await SunraiseAPI.deleteService(id);
      loadServices();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentService) return;
    await SunraiseAPI.upsertService(currentService);
    setEditModalOpen(false);
    loadServices();
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-warm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            Services &amp; Service Code Manager
          </h2>
          <p className="text-xs text-gray-500">
            Create or edit services, manage Service Codes (`SRV-*`), configure hero headers, and launch the drag-and-drop block builder.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Service Offering</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-100">
              <tr>
                <th className="py-3 px-4">Service Code</th>
                <th className="py-3 px-4">Title &amp; Slug</th>
                <th className="py-3 px-4">Hero Highlight</th>
                <th className="py-3 px-4">Blocks</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-gray-50/70 transition">
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold px-2 py-1 rounded bg-orange-50 text-orange-700 border border-orange-200">
                      {srv.service_code}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-gray-900 text-sm">{srv.title}</div>
                    <div className="text-[11px] text-gray-400 font-mono">/services/{srv.slug}</div>
                  </td>
                  <td className="py-3.5 px-4 text-gray-600 font-medium">
                    {srv.hero_config?.highlight_text || '-'}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 font-bold">
                      {srv.page_blocks?.length || 0} Blocks
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full font-bold text-[11px] ${
                        srv.is_published
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {srv.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/admin/builder/workspace?type=service&id=${srv.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200/80 text-xs font-bold transition shadow-xs"
                        title="Open Visual Page Builder Workspace"
                      >
                        <FileCode className="w-3.5 h-3.5" />
                        <span>Page Builder</span>
                      </Link>
                      <Link
                        to={`/services/${srv.slug}`}
                        target="_blank"
                        className="inline-flex p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleEdit(srv)}
                        className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition"
                        title="Edit Service Info & SEO"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(srv.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Service Modal */}
      {editModalOpen && currentService && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-8 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 font-heading">
                {currentService.id ? `Edit ${currentService.title}` : 'Create New Service'}
              </h3>
              <button
                onClick={() => setEditModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
              {/* Core identifiers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Service Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentService.service_code || ''}
                    onChange={(e) =>
                      setCurrentService({ ...currentService, service_code: e.target.value })
                    }
                    className="w-full text-xs font-mono p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 font-bold"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    URL Slug * (Auto-301 protected on change)
                  </label>
                  <input
                    type="text"
                    required
                    value={currentService.slug || ''}
                    onChange={(e) =>
                      setCurrentService({ ...currentService, slug: e.target.value })
                    }
                    className="w-full text-xs font-mono p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Service Title *
                </label>
                <input
                  type="text"
                  required
                  value={currentService.title || ''}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, title: e.target.value })
                  }
                  className="w-full text-sm font-bold p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  value={currentService.short_description || ''}
                  onChange={(e) =>
                    setCurrentService({ ...currentService, short_description: e.target.value })
                  }
                  className="w-full text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Hero Configuration Sub-section */}
              <div className="p-5 rounded-2xl bg-gray-50 border border-gray-200 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-orange-600">
                  Dynamic Hero Section Configuration
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Hero Badge Text
                    </label>
                    <input
                      type="text"
                      value={currentService.hero_config?.badge || ''}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          hero_config: {
                            ...currentService.hero_config!,
                            badge: e.target.value,
                          },
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      Hero Highlight Text
                    </label>
                    <input
                      type="text"
                      value={currentService.hero_config?.highlight_text || ''}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          hero_config: {
                            ...currentService.hero_config!,
                            highlight_text: e.target.value,
                          },
                        })
                      }
                      className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Hero Main Heading
                  </label>
                  <input
                    type="text"
                    value={currentService.hero_config?.title || ''}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        hero_config: {
                          ...currentService.hero_config!,
                          title: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              {/* SEO Metadata Drawer */}
              <div className="p-5 rounded-2xl bg-orange-50/50 border border-orange-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-orange-700">
                    SEO Metadata Safeguard Layer
                  </h4>
                  <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentService.seo_meta?.lock_seo || false}
                      onChange={(e) =>
                        setCurrentService({
                          ...currentService,
                          seo_meta: {
                            ...currentService.seo_meta!,
                            lock_seo: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-semibold">Lock SEO (Prevent auto-overwrites)</span>
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Meta Title (Max 60 chars)
                  </label>
                  <input
                    type="text"
                    value={currentService.seo_meta?.meta_title || ''}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        seo_meta: {
                          ...currentService.seo_meta!,
                          meta_title: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    Meta Description (Max 160 chars)
                  </label>
                  <textarea
                    rows={2}
                    value={currentService.seo_meta?.meta_description || ''}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        seo_meta: {
                          ...currentService.seo_meta!,
                          meta_description: e.target.value,
                        },
                      })
                    }
                    className="w-full text-xs p-2.5 rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentService.is_published ?? true}
                    onChange={(e) =>
                      setCurrentService({
                        ...currentService,
                        is_published: e.target.checked,
                      })
                    }
                    className="rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Published on public site and sitemap</span>
                </label>

                <div className="flex items-center gap-3">
                  {currentService.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditModalOpen(false);
                        navigate(`/admin/builder/workspace?type=service&id=${currentService.id}`);
                      }}
                      className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold transition inline-flex items-center gap-1.5"
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>Open in Page Builder</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
