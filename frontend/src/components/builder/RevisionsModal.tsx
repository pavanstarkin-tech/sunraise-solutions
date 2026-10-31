import React, { useState } from 'react';
import { PageRevision } from '../../types';
import { History, RotateCcw, Clock, User, X, Check, ArrowRight } from 'lucide-react';

interface RevisionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisions: PageRevision[];
  onRestore: (rev: PageRevision) => void;
  pageTitle: string;
}

export const RevisionsModal: React.FC<RevisionsModalProps> = ({
  isOpen,
  onClose,
  revisions,
  onRestore,
  pageTitle
}) => {
  const [selectedRev, setSelectedRev] = useState<PageRevision | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-4xl h-[80vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base font-heading">
                Page Revision History &amp; Rollback
              </h3>
              <p className="text-xs text-gray-500">
                Restore previous versions of "{pageTitle}" safely without breaking active URLs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Revisions List + Detail View */}
        <div className="flex-1 flex overflow-hidden">
          {/* List */}
          <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-4 space-y-3">
            {revisions.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-xs">
                No past revisions captured yet. Changes are automatically snapshotted on save and publish.
              </div>
            ) : (
              revisions.map((rev) => {
                const isSelected = selectedRev?.id === rev.id;
                return (
                  <div
                    key={rev.id}
                    onClick={() => setSelectedRev(rev)}
                    className={`p-4 rounded-2xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/50 shadow-sm'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-900 truncate">
                        {rev.note || 'Snapshot Version'}
                      </span>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {new Date(rev.saved_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center gap-3 text-[11px] text-gray-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-orange-500" />
                        <span>{new Date(rev.saved_at).toLocaleDateString()}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-gray-400" />
                        <span>{rev.saved_by}</span>
                      </span>
                      <span>• {rev.blocks.length} sections</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Details & Restore */}
          <div className="w-1/2 p-6 flex flex-col justify-between overflow-y-auto bg-gray-50/30">
            {selectedRev ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Snapshot Details
                  </h4>
                  <p className="text-base font-bold text-gray-900 mt-1">{selectedRev.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Saved by {selectedRev.saved_by} on {new Date(selectedRev.saved_at).toLocaleString()}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-gray-200 space-y-2">
                  <div className="text-xs font-bold text-gray-700">SEO Title Snapshot:</div>
                  <div className="text-xs text-gray-600 font-mono bg-gray-50 p-2 rounded-lg">
                    {selectedRev.seo_meta.meta_title || selectedRev.title}
                  </div>
                  <div className="text-xs font-bold text-gray-700">Sections Included:</div>
                  <div className="text-xs text-gray-600">
                    {selectedRev.blocks.map((b) => b.component_name || b.type).join(', ')}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Restore version from ${new Date(selectedRev.saved_at).toLocaleString()}? Current unsaved work will be replaced.`)) {
                        onRestore(selectedRev);
                        onClose();
                      }
                    }}
                    className="w-full py-3.5 rounded-2xl bg-sunraise-gradient text-white font-extrabold text-xs shadow-sunraise hover:shadow-sunraise-lg transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Restore This Historical Version</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center text-gray-400">
                <History className="w-8 h-8 mb-2 opacity-50" />
                <p className="text-xs font-semibold">Select a revision from the left to view and restore.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
