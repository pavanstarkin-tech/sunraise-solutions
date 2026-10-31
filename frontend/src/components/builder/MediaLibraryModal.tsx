import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { SunraiseAPI } from '../../services/api';
import { MediaItem } from '../../types';
import {
  Upload,
  Search,
  Filter,
  Image as ImageIcon,
  Check,
  X,
  Trash2,
  Folder,
  Eye,
  FileText,
  Copy,
  Info
} from 'lucide-react';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (media: MediaItem) => void;
  currentUrl?: string;
}

export const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  currentUrl
}) => {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [search, setSearch] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [copiedNotice, setCopiedNotice] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadMedia();
    }
  }, [isOpen]);

  const loadMedia = async () => {
    const list = await SunraiseAPI.getMediaItems();
    setItems(list);
    if (currentUrl) {
      const match = list.find((m) => m.url === currentUrl);
      if (match) setSelectedItem(match);
    }
  };

  if (!isOpen) return null;

  const folders = ['all', ...Array.from(new Set(items.map((i) => i.folder).filter(Boolean))) as string[]];

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.alt.toLowerCase().includes(search.toLowerCase()) ||
      item.filename.toLowerCase().includes(search.toLowerCase());
    const matchesFolder = selectedFolder === 'all' || item.folder === selectedFolder;
    return matchesSearch && matchesFolder;
  });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const folder = selectedFolder !== 'all' ? selectedFolder : 'Uploads';
      const newItem = await SunraiseAPI.uploadMediaFile(file, folder);
      await loadMedia();
      setSelectedItem(newItem);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveItemDetails = async () => {
    if (!selectedItem) return;
    await SunraiseAPI.updateMediaItem(selectedItem.id, {
      title: selectedItem.title,
      alt: selectedItem.alt,
      caption: selectedItem.caption
    });
    await loadMedia();
  };

  const handleDeleteItem = async (id: string) => {
    if (confirm('Delete this asset from media library?')) {
      await SunraiseAPI.deleteMediaItem(id);
      setSelectedItem(null);
      await loadMedia();
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedNotice(true);
    setTimeout(() => setCopiedNotice(false), 2000);
  };

  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-5xl h-[88vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base font-heading">
                Centralized Media &amp; Asset Library
              </h3>
              <p className="text-xs text-gray-500">
                SEO-optimized images with WebP support, alt metadata, and instant replacement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sunraise hover:bg-orange-700 cursor-pointer transition">
              <Upload className="w-4 h-4" />
              <span>{isUploading ? 'Uploading...' : 'Upload Media'}</span>
              <input
                type="file"
                accept="image/*,video/mp4"
                onChange={handleFileUpload}
                className="hidden"
                disabled={isUploading}
              />
            </label>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3 bg-white">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search media by title, alt text or filename..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-bold text-gray-600">Folder:</span>
            <select
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-orange-500 capitalize"
            >
              {folders.map((f) => (
                <option key={f} value={f}>
                  {f === 'all' ? 'All Folders' : f}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Body: Media Grid + Right Details Panel */}
        <div className="flex-1 flex overflow-hidden">
          {/* Grid of Images */}
          <div className="flex-1 p-6 overflow-y-auto">
            {filteredItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16">
                <ImageIcon className="w-12 h-12 text-gray-300 mb-3" />
                <p className="text-sm font-bold text-gray-700">No media assets match your criteria</p>
                <p className="text-xs text-gray-400 mt-1">Upload a new image or adjust search filters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className={`group relative rounded-2xl border-2 overflow-hidden cursor-pointer transition aspect-square bg-gray-100 ${
                        isSelected
                          ? 'border-orange-600 shadow-sunraise ring-2 ring-orange-500/30'
                          : 'border-transparent hover:border-gray-300'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-cover transition group-hover:scale-105 duration-200"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center shadow">
                          <Check className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-2 text-white">
                        <p className="text-[11px] font-semibold truncate">{item.title}</p>
                        <p className="text-[9px] text-gray-300 uppercase">{item.format || 'WEBP'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Selected Image Sidebar */}
          {selectedItem ? (
            <div className="w-80 border-l border-gray-200 bg-gray-50/50 p-5 overflow-y-auto space-y-4">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Asset Details
                </h4>
                <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white aspect-video relative">
                  <img
                    src={selectedItem.url}
                    alt={selectedItem.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-gray-600">Asset Title</label>
                  <input
                    type="text"
                    value={selectedItem.title}
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, title: e.target.value })
                    }
                    onBlur={handleSaveItemDetails}
                    className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-600">Alt Text (Crucial for SEO)</label>
                    <span className="text-[10px] text-orange-600 font-bold">SEO Critical</span>
                  </div>
                  <input
                    type="text"
                    value={selectedItem.alt}
                    placeholder="Describe image for search engines & screen readers..."
                    onChange={(e) =>
                      setSelectedItem({ ...selectedItem, alt: e.target.value })
                    }
                    onBlur={handleSaveItemDetails}
                    className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="pt-2 border-t border-gray-200 space-y-1 text-[11px] text-gray-500">
                  <div className="flex justify-between">
                    <span>Dimensions:</span>
                    <span className="font-mono text-gray-900">{selectedItem.width || 1200} x {selectedItem.height || 800}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Format:</span>
                    <span className="font-mono uppercase text-gray-900">{selectedItem.format || 'WEBP'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="font-mono text-gray-900">
                      {selectedItem.sizeBytes ? `${Math.round(selectedItem.sizeBytes / 1024)} KB` : '185 KB'}
                    </span>
                  </div>
                </div>

                {/* Copy URL */}
                <button
                  type="button"
                  onClick={() => handleCopyUrl(selectedItem.url)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-100 transition"
                >
                  <Copy className="w-3.5 h-3.5 text-orange-500" />
                  <span>{copiedNotice ? 'URL Copied to Clipboard!' : 'Copy Public Media URL'}</span>
                </button>

                {/* Delete Asset */}
                <button
                  type="button"
                  onClick={() => handleDeleteItem(selectedItem.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Asset</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    onSelect(selectedItem);
                    onClose();
                  }}
                  className="w-full py-3 rounded-2xl bg-sunraise-gradient text-white font-extrabold text-xs shadow-sunraise hover:scale-[1.02] transition"
                >
                  Insert Selected Asset &rarr;
                </button>
              </div>
            </div>
          ) : (
            <div className="w-80 border-l border-gray-200 bg-gray-50/50 p-6 flex flex-col items-center justify-center text-center text-gray-400">
              <Info className="w-8 h-8 mb-2" />
              <p className="text-xs font-semibold text-gray-600">Select an asset</p>
              <p className="text-[11px] text-gray-400 mt-1">
                Click any thumbnail to inspect dimensions, edit SEO alt attributes, or insert it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};
