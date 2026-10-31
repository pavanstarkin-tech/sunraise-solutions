import React, { useState, useEffect } from 'react';
import { MessageSquareQuote, Plus, Edit, Trash2, X, Star } from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Testimonial, Service } from '../../types';
import { ImageInputControl } from '../../components/builder/ImageInputControl';

export const AdminTestimonials: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<Partial<Testimonial> | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [t, s] = await Promise.all([SunraiseAPI.getTestimonials(), SunraiseAPI.getServices()]);
    setTestimonials(t);
    setServices(s);
  };

  const handleCreate = () => {
    setCurrentTestimonial({
      client_name: 'Client Name',
      client_role: 'Managing Director / Executive',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5.0,
      review_text: 'Sunraise Solutions delivered exceptional results on time and with absolute transparency.',
      service_code: null,
      is_featured: true,
    });
    setModalOpen(true);
  };

  const handleEdit = (t: Testimonial) => {
    setCurrentTestimonial({ ...t });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Delete this testimonial?')) {
      await SunraiseAPI.deleteTestimonial(id);
      loadData();
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentTestimonial) return;
    await SunraiseAPI.upsertTestimonial(currentTestimonial);
    setModalOpen(false);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-warm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 font-heading">
            Client Reviews &amp; Testimonials
          </h2>
          <p className="text-xs text-gray-500">
            Manage reviews displayed on the homepage and dynamically filtered by Service Code on service pages.
          </p>
        </div>

        <button
          onClick={handleCreate}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-6 rounded-2xl bg-white border border-gray-100 shadow-warm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                {t.service_code && (
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-orange-50 text-orange-700 font-bold border border-orange-200">
                    {t.service_code}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-600 italic leading-relaxed mb-4">
                "{t.review_text}"
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2.5">
                <img
                  src={t.avatar_url}
                  alt={t.client_name}
                  className="w-9 h-9 rounded-full object-cover border border-orange-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{t.client_name}</h4>
                  <p className="text-[10px] text-gray-400">{t.client_role}</p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleEdit(t)}
                  className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {modalOpen && currentTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                {currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-1 rounded text-gray-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Client / Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={currentTestimonial.client_name || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({ ...currentTestimonial, client_name: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Role or Designation
                </label>
                <input
                  type="text"
                  value={currentTestimonial.client_role || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({ ...currentTestimonial, client_role: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <ImageInputControl
                label="Client Photo / Testimonial Avatar"
                value={currentTestimonial.avatar_url || ''}
                onChange={(url) =>
                  setCurrentTestimonial({ ...currentTestimonial, avatar_url: url })
                }
                folder="Testimonials"
                placeholder="https://... or upload client photo"
                helperText="Upload any JPG, PNG or WebP image. Stored on Hostinger and linked directly to the testimonial."
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Linked Service Code (Optional)
                </label>
                <select
                  value={currentTestimonial.service_code || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({
                      ...currentTestimonial,
                      service_code: e.target.value || null,
                    })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200 bg-white"
                >
                  <option value="">Global (All pages)</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.service_code}>
                      {s.service_code} - {s.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Review Text *
                </label>
                <textarea
                  rows={4}
                  required
                  value={currentTestimonial.review_text || ''}
                  onChange={(e) =>
                    setCurrentTestimonial({ ...currentTestimonial, review_text: e.target.value })
                  }
                  className="w-full text-xs p-2.5 rounded-xl border border-gray-200"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise"
                >
                  Save Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
