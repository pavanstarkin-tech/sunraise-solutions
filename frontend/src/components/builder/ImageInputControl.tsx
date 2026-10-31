import React, { useState, useRef } from 'react';
import { Upload, FolderOpen, Loader2, X, Image as ImageIcon, ExternalLink, Check } from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { MediaLibraryModal } from './MediaLibraryModal';

interface ImageInputControlProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  helperText?: string;
}

export const ImageInputControl: React.FC<ImageInputControlProps> = ({
  label,
  value,
  onChange,
  folder = 'Uploads',
  placeholder = 'https://...',
  helperText
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const mediaItem = await SunraiseAPI.uploadMediaFile(file, folder);
      if (mediaItem && mediaItem.url) {
        onChange(mediaItem.url);
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 2500);
      } else {
        throw new Error('Upload succeeded but no public URL was returned');
      }
    } catch (err: any) {
      console.error('Real-time image upload failed:', err);
      setUploadError(err?.message || 'Upload failed. Please check network/file format.');
      setTimeout(() => setUploadError(null), 4000);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-1.5 p-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 transition-all">
      <div className="flex items-center justify-between">
        <label className="text-[11px] font-bold text-gray-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
          <span>{label}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[10px] font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      {/* Optional Thumbnail Preview */}
      {value && (
        <div className="relative group w-full h-24 rounded-xl overflow-hidden bg-gray-900 border border-gray-200">
          <img
            src={value}
            alt="Asset Preview"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-200"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
            <a
              href={value}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 rounded-lg bg-white/90 text-gray-800 hover:bg-white text-xs font-bold shadow"
              title="Open full size"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2 py-1 rounded-lg bg-orange-600 text-white text-[10px] font-bold shadow hover:bg-orange-700"
            >
              Replace
            </button>
          </div>
        </div>
      )}

      {/* Input Row with Direct File Upload & Media Library buttons */}
      <div className="flex items-center gap-1.5">
        <input
          type="text"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="flex-1 px-2.5 py-1.5 rounded-xl border border-gray-200 text-xs font-mono bg-white focus:outline-none focus:border-orange-500 truncate"
        />

        {/* Hidden File Input for Real-Time Upload */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/mp4"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          title="Upload direct from laptop via upload.php"
          className="px-2.5 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-xs active:scale-95 disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span className="text-[10px]">Uploading...</span>
            </>
          ) : uploadSuccess ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span className="text-[10px]">Uploaded!</span>
            </>
          ) : (
            <>
              <Upload className="w-3.5 h-3.5" />
              <span className="text-[10px]">Upload</span>
            </>
          )}
        </button>

        {/* Media Library Button */}
        <button
          type="button"
          onClick={() => setIsMediaModalOpen(true)}
          title="Choose from Centralized Media Library"
          className="p-1.5 rounded-xl bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-700 border border-gray-200 text-xs font-bold transition"
        >
          <FolderOpen className="w-4 h-4" />
        </button>
      </div>

      {/* Helper text or feedback notices */}
      {uploadError && (
        <p className="text-[10px] text-red-600 font-semibold">{uploadError}</p>
      )}
      {helperText && !uploadError && (
        <p className="text-[10px] text-gray-400">{helperText}</p>
      )}

      {/* Integrated Media Library Modal */}
      {isMediaModalOpen && (
        <MediaLibraryModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          currentUrl={value}
          onSelect={(media) => {
            onChange(media.url);
            setIsMediaModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

