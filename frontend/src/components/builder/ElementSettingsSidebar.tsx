import React, { useState } from 'react';
import { PageBlock, BlockStyles } from '../../types';
import {
  Settings,
  Palette,
  Sliders,
  Type,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Eye,
  Trash2,
  Copy,
  FolderOpen,
  Plus,
  ChevronUp,
  ChevronDown,
  Layers,
  Sparkles,
  Maximize2,
  Grid,
  Columns,
  HelpCircle,
  CreditCard,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Phone,
  BarChart3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Video,
  Upload,
  Loader2
} from 'lucide-react';
import { MediaLibraryModal } from './MediaLibraryModal';
import { LayoutColumnsEditor } from './LayoutColumnsEditor';
import { ImageInputControl } from './ImageInputControl';
import { LayoutColumnSlot } from './LayoutColumnRenderer';
import { SunraiseAPI } from '../../services/api';

interface ElementSettingsSidebarProps {
  block: PageBlock;
  onUpdate: (updatedBlock: PageBlock) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (block: PageBlock) => void;
  userRole?: string;
}

export const ElementSettingsSidebar: React.FC<ElementSettingsSidebarProps> = ({
  block,
  onUpdate,
  onClose,
  onDelete,
  onDuplicate,
  userRole = 'super_admin'
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'style' | 'advanced'>('content');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [activeMediaTargetProp, setActiveMediaTargetProp] = useState<string>('url');
  const [mediaCallback, setMediaCallback] = useState<((url: string) => void) | null>(null);
  const [isDirectUploading, setIsDirectUploading] = useState(false);

  const handleDirectUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    targetProp: string = 'url',
    customCb?: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsDirectUploading(true);
    try {
      const item = await SunraiseAPI.uploadMediaFile(file, 'Page Elements');
      if (customCb) {
        customCb(item.url);
      } else {
        handlePropChange(targetProp, item.url);
        if (item.alt && !props.alt) {
          handlePropChange('alt', item.alt);
        }
      }
    } catch (err) {
      console.error('Direct upload failed:', err);
    } finally {
      setIsDirectUploading(false);
      e.target.value = '';
    }
  };

  const props = block.props || {};
  const styles: BlockStyles = block.styles || {};

  const handlePropChange = (key: string, val: any) => {
    onUpdate({
      ...block,
      props: {
        ...props,
        [key]: val
      }
    });
  };

  const handleStyleChange = (key: keyof BlockStyles, val: any) => {
    onUpdate({
      ...block,
      styles: {
        ...styles,
        [key]: val
      }
    });
  };

  const handleMediaSelect = (media: any) => {
    if (mediaCallback) {
      mediaCallback(media.url);
      setMediaCallback(null);
      setIsMediaModalOpen(false);
      return;
    }
    if (activeMediaTargetProp === 'url') {
      handlePropChange('url', media.url);
      if (media.alt && !props.alt) {
        handlePropChange('alt', media.alt);
      }
    } else if (activeMediaTargetProp === 'image') {
      handlePropChange('image', media.url);
    }
  };

  const colorPresets = [
    { label: 'White', val: '#ffffff' },
    { label: 'Light Gray', val: '#f9fafb' },
    { label: 'Slate 50', val: '#f8fafc' },
    { label: 'Warm Cream', val: '#fffbf5' },
    { label: 'Orange 50', val: '#fff7ed' },
    { label: 'Charcoal 900', val: '#111827' }
  ];

  return (
    <div className="w-80 md:w-96 bg-white border-l border-gray-200 flex flex-col h-full shrink-0 shadow-xl z-20 overflow-hidden animate-in slide-in-from-right-4 duration-200">
      {/* Top Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shadow-sm">
            {block.component_name?.charAt(0) || 'E'}
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 font-heading truncate max-w-[170px]">
              {block.component_name || block.type.toUpperCase()}
            </h4>
            <p className="text-[10px] text-gray-400 font-mono">ID: {block.id}</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onDuplicate(block)}
            title="Duplicate Block"
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(block.id)}
            title="Delete Block"
            className="p-1.5 rounded-lg text-red-400 hover:text-red-700 hover:bg-red-50 transition"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-gray-100/70 p-1">
        <button
          type="button"
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'content'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          <span>Content</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('style')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'style'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Style &amp; Size</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition ${
            activeTab === 'advanced'
              ? 'bg-white text-orange-600 shadow-sm'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Advanced</span>
        </button>
      </div>

      {/* Settings Form Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* ==================================================== */}
        {/* 1. CONTENT TAB */}
        {/* ==================================================== */}
        {activeTab === 'content' && (
          <div className="space-y-4">
            {/* RAW HTML & CUSTOM CODE BLOCK */}
            {(block.type === 'html' || block.component_name === 'RawHTML') && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700">HTML Code & Markup</label>
                  <span className="text-[10px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded">Tailwind Ready</span>
                </div>

                {/* Quick HTML Templates */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-500">Insert Ready-Made Template</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const template = `<div class="p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center">
  <span class="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase mb-3">CONVERSION ENGINE</span>
  <h2 class="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Accelerate Your Digital Revenue Today</h2>
  <p class="text-sm text-gray-600 max-w-xl mx-auto mb-6">Partner with senior architects in Hyderabad & Rajahmundry for verified ROI.</p>
  <a href="/contact" class="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-sm shadow-lg transition">Claim Free Strategy Audit &rarr;</a>
</div>`;
                        onUpdate({ ...block, html_content: template, props: { ...props, html_content: template } });
                      }}
                      className="p-2 rounded-lg border border-gray-200 hover:border-orange-400 text-[11px] text-gray-700 font-semibold bg-white text-left transition"
                    >
                      + Conversion CTA
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const template = `<div class="grid grid-cols-1 md:grid-cols-3 gap-6 py-6">
  <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
    <div class="text-3xl font-black text-orange-600 mb-1">99.9%</div>
    <div class="text-xs font-bold text-gray-900 uppercase">Uptime SLA</div>
    <p class="text-xs text-gray-500 mt-1">High-availability cloud architecture</p>
  </div>
  <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
    <div class="text-3xl font-black text-orange-600 mb-1">4.6x</div>
    <div class="text-xs font-bold text-gray-900 uppercase">Average ROAS</div>
    <p class="text-xs text-gray-500 mt-1">Verified commercial ad campaigns</p>
  </div>
  <div class="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm text-center">
    <div class="text-3xl font-black text-orange-600 mb-1">18+</div>
    <div class="text-xs font-bold text-gray-900 uppercase">Years Mastery</div>
    <p class="text-xs text-gray-500 mt-1">AP & Telangana regional dominance</p>
  </div>
</div>`;
                        onUpdate({ ...block, html_content: template, props: { ...props, html_content: template } });
                      }}
                      className="p-2 rounded-lg border border-gray-200 hover:border-orange-400 text-[11px] text-gray-700 font-semibold bg-white text-left transition"
                    >
                      + 3-Stat Ribbon
                    </button>
                  </div>
                </div>

                <textarea
                  rows={8}
                  value={block.html_content || props.html_content || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onUpdate({ ...block, html_content: val, props: { ...props, html_content: val } });
                  }}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 focus:outline-none focus:border-orange-500"
                  placeholder="<div>Place HTML & Tailwind classes here</div>"
                />

                <label className="text-xs font-bold text-gray-700">Scoped CSS</label>
                <textarea
                  rows={3}
                  value={block.css_content || ''}
                  onChange={(e) => onUpdate({ ...block, css_content: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono bg-gray-50 focus:outline-none focus:border-orange-500"
                  placeholder=".my-custom-class { color: orange; }"
                />
              </div>
            )}

            {/* ==================================================== */}
            {/* IMAGE SLIDER SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'ImageSlider' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title (Optional)</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Featured Visual Gallery"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="e.g. High-resolution showcase of recent creative deployments."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Slider Height</label>
                    <select
                      value={props.height || '420px'}
                      onChange={(e) => handlePropChange('height', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="320px">Compact (320px)</option>
                      <option value="420px">Standard (420px)</option>
                      <option value="520px">Tall (520px)</option>
                      <option value="600px">Hero Cinematic (600px)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Image Overlay</label>
                    <select
                      value={props.overlay || 'gradient'}
                      onChange={(e) => handlePropChange('overlay', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="gradient">Gradient Overlay</option>
                      <option value="dark">Dark Tint</option>
                      <option value="none">No Overlay</option>
                    </select>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">Autoplay Slides</span>
                    <input
                      type="checkbox"
                      checked={props.autoplay !== false}
                      onChange={(e) => handlePropChange('autoplay', e.target.checked)}
                      className="w-4 h-4 text-orange-600 rounded"
                    />
                  </div>
                  {props.autoplay !== false && (
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-xs">
                      <span className="text-gray-600 font-medium">Interval (seconds):</span>
                      <input
                        type="number"
                        min={2}
                        max={15}
                        value={props.interval || 4}
                        onChange={(e) => handlePropChange('interval', Number(e.target.value))}
                        className="w-16 p-1 text-center font-bold font-mono rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                {/* Slides List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Slides ({(props.slides || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const curSlides = props.slides || [];
                        handlePropChange('slides', [
                          ...curSlides,
                          {
                            id: `slide-${Date.now()}`,
                            url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
                            title: 'New Slide Capability',
                            caption: 'Description of your featured project or deployment.',
                            link_url: '/contact',
                            link_text: 'Learn More'
                          }
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Slide</span>
                    </button>
                  </div>

                  {(props.slides || []).map((slide: any, sIdx: number) => (
                    <div key={slide.id || sIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-gray-900 font-heading">
                          Slide #{sIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.slides || [])];
                            cur.splice(sIdx, 1);
                            handlePropChange('slides', cur);
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Remove slide"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <ImageInputControl
                        label="Slide Image"
                        value={slide.url || ''}
                        onChange={(url) => {
                          const cur = [...(props.slides || [])];
                          cur[sIdx] = { ...cur[sIdx], url };
                          handlePropChange('slides', cur);
                        }}
                        folder="Page Elements"
                        placeholder="https://... or upload image"
                      />

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Slide Title</label>
                        <input
                          type="text"
                          value={slide.title || ''}
                          onChange={(e) => {
                            const cur = [...(props.slides || [])];
                            cur[sIdx] = { ...cur[sIdx], title: e.target.value };
                            handlePropChange('slides', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-gray-600">Caption / Description</label>
                        <textarea
                          rows={2}
                          value={slide.caption || ''}
                          onChange={(e) => {
                            const cur = [...(props.slides || [])];
                            cur[sIdx] = { ...cur[sIdx], caption: e.target.value };
                            handlePropChange('slides', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">CTA Link</label>
                          <input
                            type="text"
                            value={slide.link_url || ''}
                            onChange={(e) => {
                              const cur = [...(props.slides || [])];
                              cur[sIdx] = { ...cur[sIdx], link_url: e.target.value };
                              handlePropChange('slides', cur);
                            }}
                            placeholder="/services"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Button Label</label>
                          <input
                            type="text"
                            value={slide.link_text || ''}
                            onChange={(e) => {
                              const cur = [...(props.slides || [])];
                              cur[sIdx] = { ...cur[sIdx], link_text: e.target.value };
                              handlePropChange('slides', cur);
                            }}
                            placeholder="Learn More"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* CARD SLIDER SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'CardSlider' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Strategic Solutions & Capabilities"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="e.g. Explore our multi-disciplinary digital growth frameworks."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Cards ({(props.cards || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const curCards = props.cards || [];
                      handlePropChange('cards', [
                        ...curCards,
                        {
                          id: `card-${Date.now()}`,
                          badge: 'SOLUTIONS',
                          title: 'New Service Capability',
                          description: 'Engineered architecture with high-converting user experience.',
                          link_url: '/services',
                          link_text: 'Explore'
                        }
                      ]);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Card</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(props.cards || []).map((card: any, cIdx: number) => (
                    <div key={card.id || cIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-gray-900 font-heading">
                          Card #{cIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.cards || [])];
                            cur.splice(cIdx, 1);
                            handlePropChange('cards', cur);
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Badge</label>
                          <input
                            type="text"
                            value={card.badge || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], badge: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            placeholder="ENGINEERING"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold uppercase focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Card Title</label>
                          <input
                            type="text"
                            value={card.title || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], title: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Description</label>
                        <textarea
                          rows={2}
                          value={card.description || ''}
                          onChange={(e) => {
                            const cur = [...(props.cards || [])];
                            cur[cIdx] = { ...cur[cIdx], description: e.target.value };
                            handlePropChange('cards', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Link URL</label>
                          <input
                            type="text"
                            value={card.link_url || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], link_url: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            placeholder="/contact"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Link Text</label>
                          <input
                            type="text"
                            value={card.link_text || ''}
                            onChange={(e) => {
                              const cur = [...(props.cards || [])];
                              cur[cIdx] = { ...cur[cIdx], link_text: e.target.value };
                              handlePropChange('cards', cur);
                            }}
                            placeholder="Learn More"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* TEXT SLIDER SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'TextSlider' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title (Optional)</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. What Industry Leaders Say"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Subtitle</label>
                  <input
                    type="text"
                    value={props.subtitle || ''}
                    onChange={(e) => handlePropChange('subtitle', e.target.value)}
                    placeholder="e.g. Direct feedback and milestones from our partners."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-800">Autoplay Quote Ticker</span>
                  <input
                    type="checkbox"
                    checked={props.autoplay !== false}
                    onChange={(e) => handlePropChange('autoplay', e.target.checked)}
                    className="w-4 h-4 text-orange-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Quotes &amp; Slides ({(props.items || []).length})
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      const curItems = props.items || [];
                      handlePropChange('items', [
                        ...curItems,
                        {
                          id: `item-${Date.now()}`,
                          badge: 'CLIENT RESULT',
                          quote: 'Working with Sunraise Solutions transformed our organic traffic velocity.',
                          author: 'Partner Executive',
                          company: 'Corporate Client',
                          metric: '+250% Growth'
                        }
                      ]);
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Quote</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {(props.items || []).map((item: any, itIdx: number) => (
                    <div key={item.id || itIdx} className="p-3.5 rounded-2xl bg-white border border-gray-200 shadow-sm space-y-2.5">
                      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
                        <span className="text-xs font-extrabold text-gray-900 font-heading">
                          Quote #{itIdx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.items || [])];
                            cur.splice(itIdx, 1);
                            handlePropChange('items', cur);
                          }}
                          className="p-1 rounded-lg text-red-500 hover:bg-red-50 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Badge</label>
                          <input
                            type="text"
                            value={item.badge || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], badge: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="VERIFIED RESULT"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold uppercase focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Metric Tag</label>
                          <input
                            type="text"
                            value={item.metric || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], metric: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="+380% ROAS"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono font-bold text-emerald-700 focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-gray-600">Quote Text</label>
                        <textarea
                          rows={3}
                          value={item.quote || ''}
                          onChange={(e) => {
                            const cur = [...(props.items || [])];
                            cur[itIdx] = { ...cur[itIdx], quote: e.target.value };
                            handlePropChange('items', cur);
                          }}
                          className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Author</label>
                          <input
                            type="text"
                            value={item.author || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], author: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="Kiran Kumar"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-gray-600">Company / Role</label>
                          <input
                            type="text"
                            value={item.company || ''}
                            onChange={(e) => {
                              const cur = [...(props.items || [])];
                              cur[itIdx] = { ...cur[itIdx], company: e.target.value };
                              handlePropChange('items', cur);
                            }}
                            placeholder="Managing Director"
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* MARKUP TAGS & CHIPS SETTINGS */}
            {/* ==================================================== */}
            {block.component_name === 'MarkupTags' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge</label>
                  <input
                    type="text"
                    value={props.badge || 'CORE COMPETENCIES'}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    placeholder="CORE COMPETENCIES"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold uppercase focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Technology Stack & Frameworks"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Subtitle</label>
                  <input
                    type="text"
                    value={props.description || ''}
                    onChange={(e) => handlePropChange('description', e.target.value)}
                    placeholder="e.g. We engineer with modern battle-tested technologies."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-gray-700">Tag Styling</label>
                    <select
                      value={props.style_variant || 'gradient'}
                      onChange={(e) => handlePropChange('style_variant', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="gradient">Orange Gradient</option>
                      <option value="dark">Dark Enterprise</option>
                      <option value="outline">Outlined Pill</option>
                      <option value="minimal">Minimal Gray</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700">Alignment</label>
                    <select
                      value={props.alignment || 'center'}
                      onChange={(e) => handlePropChange('alignment', e.target.value)}
                      className="w-full mt-1 p-2 rounded-xl border border-gray-200 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                    >
                      <option value="center">Centered</option>
                      <option value="left">Left Aligned</option>
                    </select>
                  </div>
                </div>

                {/* Tags List */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                      Tags &amp; Chips ({(props.tags || []).length})
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const curTags = props.tags || [];
                        handlePropChange('tags', [
                          ...curTags,
                          { label: 'New Tag', category: 'General' }
                        ]);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[11px] shadow-sm hover:bg-orange-700 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Tag</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {(props.tags || []).map((tag: any, tIdx: number) => (
                      <div key={tIdx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={tag.label || ''}
                          onChange={(e) => {
                            const cur = [...(props.tags || [])];
                            cur[tIdx] = { ...cur[tIdx], label: e.target.value };
                            handlePropChange('tags', cur);
                          }}
                          placeholder="Tag Label (e.g. React 19)"
                          className="flex-1 p-1.5 rounded-lg border border-gray-300 text-xs font-bold bg-white focus:outline-none focus:border-orange-500"
                        />
                        <input
                          type="text"
                          value={tag.category || ''}
                          onChange={(e) => {
                            const cur = [...(props.tags || [])];
                            cur[tIdx] = { ...cur[tIdx], category: e.target.value };
                            handlePropChange('tags', cur);
                          }}
                          placeholder="Category"
                          className="w-24 p-1.5 rounded-lg border border-gray-300 text-[11px] font-mono bg-white focus:outline-none focus:border-orange-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const cur = [...(props.tags || [])];
                            cur.splice(tIdx, 1);
                            handlePropChange('tags', cur);
                          }}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition"
                          title="Remove tag"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PROCESS TIMELINE (The exact 4-stage protocol component) */}
            {block.component_name === 'ProcessTimeline' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Timeline Badge</label>
                  <input
                    type="text"
                    value={props.badge || 'STEP-BY-STEP BLUEPRINT'}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    placeholder="e.g. STEP-BY-STEP BLUEPRINT"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Main Headline Title</label>
                  <textarea
                    rows={2}
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Our 4-Stage Search Domination Protocol"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Steps Array Editor */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {(() => {
                    const defaultSteps = [
                      { step: '01', title: 'Algorithmic Audit & Competitor Gap Analysis', desc: 'In-depth crawler analysis identifying crawl budget issues, index bloat, and keyword cannibalization.' },
                      { step: '02', title: 'Information Architecture & On-Page Engineering', desc: 'Schema markup injection, semantic heading alignment, and Core Web Vitals speed optimization.' },
                      { step: '03', title: 'Local Map Pack & High-Authority PR Link Building', desc: 'Hyper-local citation synchronization across Hyderabad & AP alongside top-tier digital PR links.' },
                      { step: '04', title: 'Conversion Tracking & Revenue Analytics', desc: 'Bi-weekly keyword tracking, GA4 funnel attribution, and continuous CRO iteration.' }
                    ];
                    const currentSteps = (props.steps && props.steps.length > 0) ? props.steps : defaultSteps;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">Timeline Steps (Cards)</label>
                          <span className="text-[10px] text-gray-500 font-bold">
                            {currentSteps.length} Steps
                          </span>
                        </div>

                        <div className="space-y-2.5">
                          {currentSteps.map((st: any, idx: number) => (
                            <div
                              key={idx}
                              className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-2 relative group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-bold text-gray-500 uppercase">Step</span>
                                  <input
                                    type="text"
                                    value={st.step || `0${idx + 1}`}
                                    onChange={(e) => {
                                      const updated = [...currentSteps];
                                      updated[idx] = { ...updated[idx], step: e.target.value };
                                      handlePropChange('steps', updated);
                                    }}
                                    className="w-12 px-1.5 py-0.5 rounded-lg border border-gray-200 text-xs font-mono font-bold text-orange-600 bg-white"
                                  />
                                </div>

                                <div className="flex items-center gap-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (idx === 0) return;
                                      const updated = [...currentSteps];
                                      const temp = updated[idx - 1];
                                      updated[idx - 1] = updated[idx];
                                      updated[idx] = temp;
                                      handlePropChange('steps', updated);
                                    }}
                                    disabled={idx === 0}
                                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                    title="Move Up"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (idx === currentSteps.length - 1) return;
                                      const updated = [...currentSteps];
                                      const temp = updated[idx + 1];
                                      updated[idx + 1] = updated[idx];
                                      updated[idx] = temp;
                                      handlePropChange('steps', updated);
                                    }}
                                    disabled={idx === currentSteps.length - 1}
                                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-30"
                                    title="Move Down"
                                  >
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = currentSteps.filter((_: any, i: number) => i !== idx);
                                      handlePropChange('steps', updated);
                                    }}
                                    className="p-1 text-red-400 hover:text-red-600"
                                    title="Delete Step"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div>
                                <input
                                  type="text"
                                  value={st.title || ''}
                                  onChange={(e) => {
                                    const updated = [...currentSteps];
                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                    handlePropChange('steps', updated);
                                  }}
                                  placeholder="Step headline..."
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-bold text-gray-900 bg-white focus:border-orange-500"
                                />
                              </div>

                              <div>
                                <textarea
                                  rows={2}
                                  value={st.desc || ''}
                                  onChange={(e) => {
                                    const updated = [...currentSteps];
                                    updated[idx] = { ...updated[idx], desc: e.target.value };
                                    handlePropChange('steps', updated);
                                  }}
                                  placeholder="Step description details..."
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 bg-white focus:border-orange-500"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Step Button */}
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...currentSteps];
                            const nextNum = updated.length + 1;
                            updated.push({
                              step: nextNum < 10 ? `0${nextNum}` : `${nextNum}`,
                              title: `Phase ${nextNum} Tactical Rollout`,
                              desc: 'Add high-impact tactical implementation details for this phase.'
                            });
                            handlePropChange('steps', updated);
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New Timeline Step</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* FEATURE GRID */}
            {block.component_name === 'FeatureGrid' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge Label</label>
                  <input
                    type="text"
                    value={props.badge || 'ENGINEERED CAPABILITIES'}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Headline Title</label>
                  <textarea
                    rows={2}
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Subtitle / Description</label>
                  <textarea
                    rows={2}
                    value={props.description || ''}
                    onChange={(e) => handlePropChange('description', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs focus:border-orange-500"
                  />
                </div>

                {/* Features List */}
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {(() => {
                    const defaultFeatures = [
                      { title: 'Technical Core Web Vitals Optimization', description: 'Sub-second speeds with Lighthouse 95+ score guaranteed.' },
                      { title: 'Google Business Profile 3-Pack Rank', description: 'Local entity optimization for top local search dominance.' },
                      { title: 'Laser-targeted Telugu & English Keyword Clustering', description: 'Intent-driven keyword architecture capturing high-value traffic.' },
                      { title: 'High-DA White-Hat PR Backlink Outreach', description: 'Authoritative editorial placements that build permanent domain rating.' }
                    ];
                    const currentFeatures = (props.features && props.features.length > 0) ? props.features : defaultFeatures;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">Feature Cards</label>
                          <span className="text-[10px] text-gray-500 font-bold">
                            {currentFeatures.length} Cards
                          </span>
                        </div>

                        <div className="space-y-2">
                          {currentFeatures.map((feat: any, idx: number) => {
                            const featTitle = typeof feat === 'string' ? feat : (feat.title || '');
                            const featDesc = typeof feat === 'string'
                              ? 'Designed and deployed by our senior engineers adhering to strict performance benchmarks.'
                              : (feat.description || feat.desc || '');

                            return (
                              <div
                                key={idx}
                                className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1.5"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-orange-600">Card #{idx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = currentFeatures.filter((_: any, i: number) => i !== idx);
                                      handlePropChange('features', updated);
                                    }}
                                    className="text-red-400 hover:text-red-600 p-0.5"
                                    title="Delete Card"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <input
                                  type="text"
                                  value={featTitle}
                                  onChange={(e) => {
                                    const updated = [...currentFeatures];
                                    if (typeof updated[idx] === 'string') {
                                      updated[idx] = { title: e.target.value, description: featDesc };
                                    } else {
                                      updated[idx] = { ...updated[idx], title: e.target.value };
                                    }
                                    handlePropChange('features', updated);
                                  }}
                                  placeholder="Feature title..."
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                                />
                                <textarea
                                  rows={2}
                                  value={featDesc}
                                  onChange={(e) => {
                                    const updated = [...currentFeatures];
                                    if (typeof updated[idx] === 'string') {
                                      updated[idx] = { title: featTitle, description: e.target.value };
                                    } else {
                                      updated[idx] = { ...updated[idx], description: e.target.value };
                                    }
                                    handlePropChange('features', updated);
                                  }}
                                  placeholder="Feature card copy..."
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 bg-white"
                                />
                              </div>
                            );
                          })}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...currentFeatures];
                            updated.push({
                              title: 'Enterprise Scalability Protocol',
                              description: 'Custom engineered architecture built to handle millions of search requests with zero latency.'
                            });
                            handlePropChange('features', updated);
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Feature Card</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* THREE COLUMN LAYOUT */}
            {block.component_name === 'ThreeColumn' && (
              <LayoutColumnsEditor
                columns={props.columns || []}
                onChange={(cols) => handlePropChange('columns', cols)}
                title={props.title}
                onTitleChange={(t) => handlePropChange('title', t)}
                expectedCount={3}
              />
            )}

            {/* TWO COLUMN LAYOUT */}
            {block.component_name === 'TwoColumn' && (
              <LayoutColumnsEditor
                columns={props.columns || []}
                onChange={(cols) => handlePropChange('columns', cols)}
                title={props.title}
                onTitleChange={(t) => handlePropChange('title', t)}
                expectedCount={2}
              />
            )}

            {/* GRID LAYOUT */}
            {block.component_name === 'Grid' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Engineered Growth Framework"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Grid Column Count</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((col) => (
                      <button
                        key={col}
                        type="button"
                        onClick={() => handlePropChange('columns', col)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          Number(props.columns || 4) === col
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {col} Col
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {(() => {
                    const defaultGrid = [
                      { title: 'Scalable Architecture', desc: 'React 19 & Cloud DB' },
                      { title: 'Local 3-Pack Rank', desc: 'Google Maps Dominance' },
                      { title: 'Zero Downtime', desc: '99.9% High Availability' },
                      { title: 'Bespoke CMS', desc: 'Visual Drag & Drop Editing' }
                    ];
                    const currentGrid = (props.items && props.items.length > 0)
                      ? props.items
                      : ((props.columns && Array.isArray(props.columns) && props.columns.length > 0) ? props.columns : defaultGrid);

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">Grid Cards</label>
                          <span className="text-[10px] text-gray-500 font-bold">{currentGrid.length} Cards</span>
                        </div>

                        <div className="space-y-3">
                          {currentGrid.map((it: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-black text-orange-600">Card #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentGrid.filter((_: any, i: number) => i !== idx);
                                    handlePropChange('items', updated);
                                  }}
                                  className="text-red-400 hover:text-red-600 p-0.5"
                                  title="Delete Card"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {/* Card Image */}
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <label className="text-[10px] font-bold text-gray-600">Card Image (Optional)</label>
                                  {it.image && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const updated = currentGrid.map((c: any, i: number) => i === idx ? { ...c, image: '' } : c);
                                        handlePropChange('items', updated);
                                      }}
                                      className="text-[9px] text-red-500 hover:underline"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </div>
                                <div className="flex gap-1.5">
                                  <input
                                    type="text"
                                    value={it.image || ''}
                                    onChange={(e) => {
                                      const updated = currentGrid.map((card: any, i: number) => i === idx ? { ...card, image: e.target.value } : card);
                                      handlePropChange('items', updated);
                                    }}
                                    placeholder="Image URL https://..."
                                    className="flex-1 p-1.5 rounded-lg border border-gray-200 text-[11px] font-mono bg-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setMediaCallback(() => (url: string) => {
                                        const updated = currentGrid.map((card: any, i: number) => i === idx ? { ...card, image: url } : card);
                                        handlePropChange('items', updated);
                                      });
                                      setIsMediaModalOpen(true);
                                    }}
                                    className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200"
                                    title="Choose from Media Library"
                                  >
                                    <FolderOpen className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              {/* Icon & Badge */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-600">Icon</label>
                                  <select
                                    value={it.icon || 'check'}
                                    onChange={(e) => {
                                      const updated = currentGrid.map((c: any, i: number) => i === idx ? { ...c, icon: e.target.value } : c);
                                      handlePropChange('items', updated);
                                    }}
                                    className="w-full p-1.5 rounded-lg border border-gray-200 text-xs bg-white font-medium"
                                  >
                                    <option value="check">Checkmark</option>
                                    <option value="sparkles">Sparkles</option>
                                    <option value="star">Star</option>
                                    <option value="shield">Shield</option>
                                    <option value="zap">Zap / Lightning</option>
                                    <option value="award">Award</option>
                                    <option value="none">None (Hide Icon)</option>
                                  </select>
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-600">Badge Tag</label>
                                  <input
                                    type="text"
                                    value={it.badge || ''}
                                    onChange={(e) => {
                                      const updated = currentGrid.map((c: any, i: number) => i === idx ? { ...c, badge: e.target.value } : c);
                                      handlePropChange('items', updated);
                                    }}
                                    placeholder="e.g. Phase 1"
                                    className="w-full p-1.5 rounded-lg border border-gray-200 text-xs bg-white font-semibold"
                                  />
                                </div>
                              </div>

                              {/* Card Title */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600">Card Title</label>
                                <input
                                  type="text"
                                  value={it.title || ''}
                                  onChange={(e) => {
                                    const updated = currentGrid.map((card: any, i: number) => i === idx ? { ...card, title: e.target.value } : card);
                                    handlePropChange('items', updated);
                                  }}
                                  placeholder="Card Title..."
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                                />
                              </div>

                              {/* Description */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600">Card Description</label>
                                <textarea
                                  rows={2}
                                  value={it.desc || ''}
                                  onChange={(e) => {
                                    const updated = currentGrid.map((card: any, i: number) => i === idx ? { ...card, desc: e.target.value } : card);
                                    handlePropChange('items', updated);
                                  }}
                                  placeholder="Card Description..."
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 bg-white"
                                />
                              </div>

                              {/* Card CTA Button */}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-600">Button Text</label>
                                  <input
                                    type="text"
                                    value={it.button_text || ''}
                                    onChange={(e) => {
                                      const updated = currentGrid.map((card: any, i: number) => i === idx ? { ...card, button_text: e.target.value } : card);
                                      handlePropChange('items', updated);
                                    }}
                                    placeholder="e.g. View Details &rarr;"
                                    className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-600">Button Link</label>
                                  <input
                                    type="text"
                                    value={it.button_url || ''}
                                    onChange={(e) => {
                                      const updated = currentGrid.map((card: any, i: number) => i === idx ? { ...card, button_url: e.target.value } : card);
                                      handlePropChange('items', updated);
                                    }}
                                    placeholder="/contact"
                                    className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-mono bg-white"
                                  />
                                </div>
                              </div>

                              {/* Card Background Color */}
                              <div className="space-y-1">
                                <label className="text-[10px] font-bold text-gray-600">Card Background</label>
                                <div className="grid grid-cols-4 gap-1">
                                  {[
                                    { id: 'gray', label: 'Gray' },
                                    { id: 'white', label: 'White' },
                                    { id: 'orange', label: 'Orange' },
                                    { id: 'dark', label: 'Dark' }
                                  ].map((bg) => (
                                    <button
                                      key={bg.id}
                                      type="button"
                                      onClick={() => {
                                        const updated = currentGrid.map((c: any, i: number) => i === idx ? { ...c, bg: bg.id } : c);
                                        handlePropChange('items', updated);
                                      }}
                                      className={`py-1 rounded text-[10px] font-bold border transition ${
                                        (it.bg || 'gray') === bg.id
                                          ? 'bg-orange-600 text-white border-orange-600'
                                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                      }`}
                                    >
                                      {bg.label}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...currentGrid,
                              {
                                title: 'New Strategic Vector',
                                desc: 'Targeted algorithmic asset optimized for conversion.',
                                icon: 'check',
                                button_text: 'Explore Strategy &rarr;',
                                button_url: '/contact'
                              }
                            ];
                            handlePropChange('items', updated);
                          }}
                          className="w-full py-2.5 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Grid Card</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* CONTAINER LAYOUT */}
            {block.component_name === 'Container' && (
              <div className="space-y-3.5">
                {/* Featured Banner Image */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">Banner Image (Optional)</label>
                    {props.image && (
                      <button
                        type="button"
                        onClick={() => handlePropChange('image', '')}
                        className="text-[10px] text-red-500 hover:underline"
                      >
                        Remove Image
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={props.image || ''}
                      onChange={(e) => handlePropChange('image', e.target.value)}
                      placeholder="Image URL https://..."
                      className="flex-1 p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setMediaCallback(() => (url: string) => handlePropChange('image', url));
                        setIsMediaModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
                      title="Choose from Media Library"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge Label</label>
                  <input
                    type="text"
                    value={props.badge || ''}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    placeholder="Optional badge..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Headline Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="Container headline..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Body Content</label>
                  <textarea
                    rows={4}
                    value={props.content || ''}
                    onChange={(e) => handlePropChange('content', e.target.value)}
                    placeholder="Container body text..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs leading-relaxed"
                  />
                </div>

                {/* Primary CTA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Primary Button</label>
                    <input
                      type="text"
                      value={props.button_text || ''}
                      onChange={(e) => handlePropChange('button_text', e.target.value)}
                      placeholder="e.g. Learn More"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Button Link</label>
                    <input
                      type="text"
                      value={props.button_url || ''}
                      onChange={(e) => handlePropChange('button_url', e.target.value)}
                      placeholder="/contact"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Button</label>
                    <input
                      type="text"
                      value={props.secondary_button_text || ''}
                      onChange={(e) => handlePropChange('secondary_button_text', e.target.value)}
                      placeholder="e.g. Schedule Call"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Link</label>
                    <input
                      type="text"
                      value={props.secondary_button_url || ''}
                      onChange={(e) => handlePropChange('secondary_button_url', e.target.value)}
                      placeholder="/contact"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Container Background Style */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Container Theme</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'gray', label: 'Soft Gray' },
                      { id: 'white', label: 'Clean White' },
                      { id: 'orange', label: 'Warm Orange' },
                      { id: 'dark', label: 'Dark Navy' }
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => handlePropChange('bg', bg.id)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          (props.bg || 'gray') === bg.id
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* SPLIT IMAGE & TEXT COMBO LAYOUT */}
            {(block.component_name === 'SplitImageText' || block.component_name === 'ImageAndText') && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Built for Speed, Scalability, and Search Domination"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge Label</label>
                  <input
                    type="text"
                    value={props.badge || ''}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    placeholder="e.g. STRATEGIC EXCELLENCE"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>

                {/* Media Side & URL */}
                <div className="space-y-2 p-3 rounded-2xl bg-gray-50 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-800">Media Position</label>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => handlePropChange('image_position', 'left')}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                          props.image_position === 'left'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Media Left
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePropChange('image_position', 'right')}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition ${
                          props.image_position !== 'left'
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        Media Right
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-600">Feature Image</label>
                      {props.image && (
                        <button
                          type="button"
                          onClick={() => handlePropChange('image', '')}
                          className="text-[9px] text-red-500 hover:underline"
                        >
                          Remove Image
                        </button>
                      )}
                    </div>
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        value={props.image || ''}
                        onChange={(e) => handlePropChange('image', e.target.value)}
                        placeholder="Image URL https://..."
                        className="flex-1 p-1.5 rounded-lg border border-gray-200 text-xs font-mono bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setMediaCallback(() => (url: string) => handlePropChange('image', url));
                          setIsMediaModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition"
                        title="Choose from Media Library"
                      >
                        <FolderOpen className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-gray-600">Video Embed (Optional)</label>
                      {props.video && (
                        <button
                          type="button"
                          onClick={() => handlePropChange('video', '')}
                          className="text-[9px] text-red-500 hover:underline"
                        >
                          Remove Video
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={props.video || ''}
                      onChange={(e) => handlePropChange('video', e.target.value)}
                      placeholder="https://www.youtube.com/embed/..."
                      className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-mono bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Description / Paragraph</label>
                  <textarea
                    rows={3}
                    value={props.text || props.description || props.content || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    placeholder="We merge rigorous engineering standards..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs leading-relaxed"
                  />
                </div>

                {/* Key Checklist Points */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">Checklist Points</label>
                    <button
                      type="button"
                      onClick={() => {
                        const existing = props.bullets || props.points || [];
                        handlePropChange('bullets', [...existing, 'New Strategic Capability']);
                      }}
                      className="text-[10px] font-bold text-orange-600 hover:text-orange-700 flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Point</span>
                    </button>
                  </div>
                  {((props.bullets || props.points || [
                    'Enterprise Performance Guarantee',
                    'Zero Downtime Deployment',
                    'Dedicated Senior Architect Lead'
                  ]) as string[]).map((bullet: string, bIdx: number) => (
                    <div key={bIdx} className="flex gap-1.5 items-center">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...(props.bullets || props.points || [
                            'Enterprise Performance Guarantee',
                            'Zero Downtime Deployment',
                            'Dedicated Senior Architect Lead'
                          ])];
                          newBullets[bIdx] = e.target.value;
                          handlePropChange('bullets', newBullets);
                        }}
                        className="flex-1 p-1.5 rounded-lg border border-gray-200 text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newBullets = (props.bullets || props.points || [
                            'Enterprise Performance Guarantee',
                            'Zero Downtime Deployment',
                            'Dedicated Senior Architect Lead'
                          ]).filter((_: any, i: number) => i !== bIdx);
                          handlePropChange('bullets', newBullets);
                        }}
                        className="p-1 text-red-400 hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Primary CTA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Primary Button</label>
                    <input
                      type="text"
                      value={props.button_text || ''}
                      onChange={(e) => handlePropChange('button_text', e.target.value)}
                      placeholder="e.g. Schedule Audit"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Button Link</label>
                    <input
                      type="text"
                      value={props.button_url || ''}
                      onChange={(e) => handlePropChange('button_url', e.target.value)}
                      placeholder="/contact"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Secondary CTA */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Button</label>
                    <input
                      type="text"
                      value={props.secondary_button_text || ''}
                      onChange={(e) => handlePropChange('secondary_button_text', e.target.value)}
                      placeholder="e.g. View Case Studies"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Secondary Link</label>
                    <input
                      type="text"
                      value={props.secondary_button_url || ''}
                      onChange={(e) => handlePropChange('secondary_button_url', e.target.value)}
                      placeholder="/contact"
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Section Theme */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Theme</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'white', label: 'White' },
                      { id: 'gray', label: 'Soft Gray' },
                      { id: 'orange', label: 'Warm Orange' },
                      { id: 'dark', label: 'Dark Navy' }
                    ].map((bg) => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => handlePropChange('bg', bg.id)}
                        className={`py-1.5 rounded-lg text-xs font-bold border transition ${
                          (props.bg || 'white') === bg.id
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {bg.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* HEADING BLOCK */}
            {block.component_name === 'Heading' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Heading Tag Level</label>
                  <select
                    value={props.level || 'h2'}
                    onChange={(e) => handlePropChange('level', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold focus:border-orange-500"
                  >
                    <option value="h1">H1 (Hero / Primary Title only)</option>
                    <option value="h2">H2 (Section Headline - Recommended)</option>
                    <option value="h3">H3 (Sub-heading)</option>
                    <option value="h4">H4 (Card Headline)</option>
                    <option value="h5">H5 (Minor Heading)</option>
                    <option value="h6">H6 (Category Badge)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Headline Text</label>
                  <textarea
                    rows={3}
                    value={props.text || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold focus:border-orange-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Font Size Scale</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { id: 'sm', label: 'Small' },
                      { id: 'md', label: 'Medium' },
                      { id: 'lg', label: 'Large' },
                      { id: 'xl', label: 'Extra Lg' }
                    ].map((sz) => (
                      <button
                        key={sz.id}
                        type="button"
                        onClick={() => handlePropChange('sizeScale', sz.id)}
                        className={`py-1.5 rounded-lg text-[11px] font-bold border ${
                          (props.sizeScale || 'md') === sz.id
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {sz.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PARAGRAPH BLOCK */}
            {block.component_name === 'Paragraph' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Body Copy / Text</label>
                  <textarea
                    rows={6}
                    value={props.text || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs leading-relaxed focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Text Size</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { id: 'sm', label: 'Compact (14px)' },
                      { id: 'md', label: 'Standard (16px)' },
                      { id: 'lg', label: 'Lead (18px)' }
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => handlePropChange('sizeScale', s.id)}
                        className={`py-1.5 rounded-lg text-[11px] font-bold border ${
                          (props.sizeScale || 'md') === s.id
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* IMAGE BLOCK */}
            {block.component_name === 'Image' && (
              <div className="space-y-3">
                <ImageInputControl
                  label="Image Source / Upload"
                  value={props.url || ''}
                  onChange={(url) => handlePropChange('url', url)}
                  folder="Page Elements"
                  placeholder="https://... or upload local image"
                  helperText="Uploads directly to Hostinger server via upload.php and records to media database"
                />

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-gray-700">Alt Text (SEO)</label>
                    <span className="text-[10px] text-orange-600 font-bold">SEO Critical</span>
                  </div>
                  <input
                    type="text"
                    value={props.alt || ''}
                    onChange={(e) => handlePropChange('alt', e.target.value)}
                    placeholder="Descriptive alt text for Google Image SEO..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Caption</label>
                  <input
                    type="text"
                    value={props.caption || ''}
                    onChange={(e) => handlePropChange('caption', e.target.value)}
                    placeholder="Optional image caption..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>

                {/* Image Sizing Controls */}
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-100 space-y-2.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-orange-950">
                    <Maximize2 className="w-3.5 h-3.5 text-orange-600" />
                    <span>Image Size & Frame Controls</span>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Image Width</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {['25%', '50%', '75%', '100%'].map((w) => (
                        <button
                          key={w}
                          type="button"
                          onClick={() => handlePropChange('width', w)}
                          className={`py-1 rounded-lg text-xs font-bold border ${
                            (props.width || '100%') === w
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white text-gray-700 border-gray-200'
                          }`}
                        >
                          {w}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Max Height (px)</label>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: '250px', val: 250 },
                        { label: '380px', val: 380 },
                        { label: '500px', val: 500 },
                        { label: 'Auto', val: undefined }
                      ].map((h, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handlePropChange('maxHeight', h.val)}
                          className={`py-1 rounded-lg text-xs font-bold border ${
                            props.maxHeight === h.val
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white text-gray-700 border-gray-200'
                          }`}
                        >
                          {h.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-600">Object Fit</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {['cover', 'contain', 'fill'].map((fit) => (
                        <button
                          key={fit}
                          type="button"
                          onClick={() => handlePropChange('objectFit', fit)}
                          className={`py-1 rounded-lg text-[11px] font-bold capitalize border ${
                            (props.objectFit || 'cover') === fit
                              ? 'bg-orange-600 text-white border-orange-600'
                              : 'bg-white text-gray-700 border-gray-200'
                          }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* BUTTON BLOCK */}
            {block.component_name === 'Button' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Button Label</label>
                  <input
                    type="text"
                    value={props.text || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Destination Link (URL)</label>
                  <input
                    type="text"
                    value={props.url || ''}
                    onChange={(e) => handlePropChange('url', e.target.value)}
                    placeholder="/contact or https://..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Button Style</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'primary', label: 'Sunraise Gradient' },
                      { id: 'secondary', label: 'Clean White' },
                      { id: 'dark', label: 'Charcoal Dark' },
                      { id: 'outline', label: 'Orange Outline' }
                    ].map((v) => (
                      <button
                        key={v.id}
                        type="button"
                        onClick={() => handlePropChange('variant', v.id)}
                        className={`py-1.5 rounded-lg text-xs font-bold border ${
                          (props.variant || 'primary') === v.id
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {v.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Button Size</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['small', 'medium', 'large'].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handlePropChange('btnSize', s)}
                        className={`py-1.5 rounded-lg text-xs font-bold capitalize border ${
                          (props.btnSize || 'medium') === s
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-white text-gray-700 border-gray-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* CTA BANNER */}
            {block.component_name === 'CTABanner' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge</label>
                  <input
                    type="text"
                    value={props.badge || ''}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Banner Headline</label>
                  <textarea
                    rows={2}
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Description</label>
                  <textarea
                    rows={2}
                    value={props.description || props.subtitle || ''}
                    onChange={(e) => handlePropChange('description', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Button Text</label>
                    <input
                      type="text"
                      value={props.button_text || props.cta_text || ''}
                      onChange={(e) => {
                        handlePropChange('button_text', e.target.value);
                        handlePropChange('cta_text', e.target.value);
                      }}
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">Button URL</label>
                    <input
                      type="text"
                      value={props.button_url || props.cta_link || ''}
                      onChange={(e) => {
                        handlePropChange('button_url', e.target.value);
                        handlePropChange('cta_link', e.target.value);
                      }}
                      className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SPLIT IMAGE TEXT */}
            {(block.component_name === 'ImageAndText' || block.component_name === 'SplitImageText') && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge</label>
                  <input
                    type="text"
                    value={props.badge || ''}
                    onChange={(e) => handlePropChange('badge', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Headline Title</label>
                  <textarea
                    rows={2}
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Text</label>
                  <textarea
                    rows={3}
                    value={props.text || ''}
                    onChange={(e) => handlePropChange('text', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs leading-relaxed"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Featured Image URL</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={props.image || ''}
                      onChange={(e) => handlePropChange('image', e.target.value)}
                      className="flex-1 p-2 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setActiveMediaTargetProp('image');
                        setIsMediaModalOpen(true);
                      }}
                      className="p-2 rounded-xl bg-orange-100 text-orange-600 hover:bg-orange-200"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ ACCORDION */}
            {block.component_name === 'FAQAccordion' && (
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {(() => {
                    const defaultFaqs = [
                      { q: 'How long until we see measurable rankings in Hyderabad?', a: 'Clients typically experience significant keyword momentum within 45 to 60 days.' },
                      { q: 'Do you provide dedicated account management?', a: 'Yes! Our direct technical leads manage client communications with weekly progress reviews.' }
                    ];
                    const currentFaqs = (props.faqs && props.faqs.length > 0) ? props.faqs : defaultFaqs;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">FAQ Questions &amp; Answers</label>
                          <span className="text-[10px] text-gray-500 font-bold">{currentFaqs.length} FAQs</span>
                        </div>

                        <div className="space-y-2">
                          {currentFaqs.map((f: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200/80 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-orange-600">Q#{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentFaqs.filter((_: any, i: number) => i !== idx);
                                    handlePropChange('faqs', updated);
                                  }}
                                  className="text-red-400 hover:text-red-600 p-0.5"
                                  title="Delete FAQ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <input
                                type="text"
                                value={f.q || ''}
                                onChange={(e) => {
                                  const updated = currentFaqs.map((item: any, i: number) =>
                                    i === idx ? { ...item, q: e.target.value } : item
                                  );
                                  handlePropChange('faqs', updated);
                                }}
                                placeholder="Question..."
                                className="w-full p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                              />
                              <textarea
                                rows={2}
                                value={f.a || ''}
                                onChange={(e) => {
                                  const updated = currentFaqs.map((item: any, i: number) =>
                                    i === idx ? { ...item, a: e.target.value } : item
                                  );
                                  handlePropChange('faqs', updated);
                                }}
                                placeholder="Answer..."
                                className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 bg-white"
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...currentFaqs,
                              {
                                q: 'What makes Sunraise Solutions different from other agencies?',
                                a: 'We combine rigorous senior software engineering standards with algorithmic search intelligence for verifiable revenue growth.'
                              }
                            ];
                            handlePropChange('faqs', updated);
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add New FAQ Item</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* PRICING TABLE */}
            {block.component_name === 'PricingTable' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Engineered Growth Investment Tiers"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {(() => {
                    const defaultTiers = [
                      {
                        name: 'Starter Growth',
                        price: '₹25,000',
                        period: '/month',
                        desc: 'For local businesses establishing map pack dominance.',
                        features: ['Google Business 3-Pack Optimization', '15 Target Keyword Clusters', 'Technical On-Page Fixes', 'Monthly Telemetry Call'],
                        featured: false
                      },
                      {
                        name: 'Enterprise Scale',
                        price: '₹65,000',
                        period: '/month',
                        featured: true,
                        desc: 'Complete full-funnel digital domination for regional leaders.',
                        features: ['Core Web Vitals INP Sub-Second Guarantee', '40 High-Intent Keyword Clusters', 'High-DA Digital PR Outreach', 'Weekly War Room Strategy Briefings']
                      },
                      {
                        name: 'Custom Architecture',
                        price: 'Custom',
                        period: 'Scope',
                        desc: 'Full-stack software engineering and multi-state branding.',
                        features: ['Custom Web Application in React', 'HIPAA/NABH Compliance (HMS)', 'Constituency Political War Room', 'Dedicated Senior Architect SLA'],
                        featured: false
                      }
                    ];
                    const currentTiers = (props.tiers && props.tiers.length > 0) ? props.tiers : defaultTiers;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">Pricing Packages</label>
                          <span className="text-[10px] text-gray-500 font-bold">{currentTiers.length} Plans</span>
                        </div>

                        <div className="space-y-3">
                          {currentTiers.map((tier: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-orange-600">Plan #{idx + 1}</span>
                                <div className="flex items-center gap-2">
                                  <label className="flex items-center gap-1 text-[10px] font-bold text-gray-600 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={!!tier.featured}
                                      onChange={(e) => {
                                        const updated = currentTiers.map((t: any, i: number) =>
                                          i === idx ? { ...t, featured: e.target.checked } : t
                                        );
                                        handlePropChange('tiers', updated);
                                      }}
                                      className="rounded text-orange-600 accent-orange-600"
                                    />
                                    <span>Popular</span>
                                  </label>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = currentTiers.filter((_: any, i: number) => i !== idx);
                                      handlePropChange('tiers', updated);
                                    }}
                                    className="text-red-400 hover:text-red-600 p-0.5"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={tier.name || ''}
                                  onChange={(e) => {
                                    const updated = currentTiers.map((t: any, i: number) =>
                                      i === idx ? { ...t, name: e.target.value } : t
                                    );
                                    handlePropChange('tiers', updated);
                                  }}
                                  placeholder="Plan Name"
                                  className="p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                                />
                                <div className="flex gap-1">
                                  <input
                                    type="text"
                                    value={tier.price || ''}
                                    onChange={(e) => {
                                      const updated = currentTiers.map((t: any, i: number) =>
                                        i === idx ? { ...t, price: e.target.value } : t
                                      );
                                      handlePropChange('tiers', updated);
                                    }}
                                    placeholder="Price (₹)"
                                    className="w-2/3 p-1.5 rounded-lg border border-gray-200 text-xs font-bold text-orange-600 bg-white"
                                  />
                                  <input
                                    type="text"
                                    value={tier.period || ''}
                                    onChange={(e) => {
                                      const updated = currentTiers.map((t: any, i: number) =>
                                        i === idx ? { ...t, period: e.target.value } : t
                                      );
                                      handlePropChange('tiers', updated);
                                    }}
                                    placeholder="/mo"
                                    className="w-1/3 p-1.5 rounded-lg border border-gray-200 text-xs text-gray-500 bg-white"
                                  />
                                </div>
                              </div>

                              <textarea
                                rows={2}
                                value={tier.desc || ''}
                                onChange={(e) => {
                                  const updated = currentTiers.map((t: any, i: number) =>
                                    i === idx ? { ...t, desc: e.target.value } : t
                                  );
                                  handlePropChange('tiers', updated);
                                }}
                                placeholder="Short description..."
                                className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-600 bg-white"
                              />

                              <div>
                                <label className="text-[10px] font-bold text-gray-500 block mb-1">
                                  Features (One per line)
                                </label>
                                <textarea
                                  rows={3}
                                  value={Array.isArray(tier.features) ? tier.features.join('\n') : (tier.features || '')}
                                  onChange={(e) => {
                                    const featuresArray = e.target.value.split('\n').filter(Boolean);
                                    const updated = currentTiers.map((t: any, i: number) =>
                                      i === idx ? { ...t, features: featuresArray } : t
                                    );
                                    handlePropChange('tiers', updated);
                                  }}
                                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                                  className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] font-mono text-gray-700 bg-white"
                                />
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...currentTiers,
                              {
                                name: 'New Custom Tier',
                                price: '₹35,000',
                                period: '/month',
                                desc: 'Engineered for rapid growth and authority.',
                                features: ['Custom On-Page Engineering', 'Dedicated Account Lead', 'Weekly SEO Reports'],
                                featured: false
                              }
                            ];
                            handlePropChange('tiers', updated);
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Pricing Plan</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* TESTIMONIALS */}
            {block.component_name === 'Testimonials' && (
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Section Title</label>
                  <input
                    type="text"
                    value={props.title || ''}
                    onChange={(e) => handlePropChange('title', e.target.value)}
                    placeholder="e.g. Trusted by Institutional Leaders"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-gray-100">
                  {(() => {
                    const defaultReviews = [
                      {
                        name: 'MAKSIM Infotech',
                        role: 'Technology Operations',
                        text: 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance.',
                        rating: 5
                      },
                      {
                        name: 'Hotel Jaya Residency',
                        role: 'Hospitality Management',
                        text: 'Direct bookings surged by 3.4x within five months of our local SEO campaign in Rajahmundry.',
                        rating: 5
                      }
                    ];
                    const currentReviews = (props.reviews && props.reviews.length > 0) ? props.reviews : defaultReviews;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">Testimonials</label>
                          <span className="text-[10px] text-gray-500 font-bold">{currentReviews.length} Reviews</span>
                        </div>

                        <div className="space-y-3">
                          {currentReviews.map((rev: any, idx: number) => (
                            <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-200 space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-bold text-orange-600">Review #{idx + 1}</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = currentReviews.filter((_: any, i: number) => i !== idx);
                                    handlePropChange('reviews', updated);
                                  }}
                                  className="text-red-400 hover:text-red-600 p-0.5"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              <ImageInputControl
                                label="Client Photo / Avatar"
                                value={rev.avatar_url || rev.image_url || ''}
                                onChange={(url) => {
                                  const updated = currentReviews.map((r: any, i: number) =>
                                    i === idx ? { ...r, avatar_url: url, image_url: url } : r
                                  );
                                  handlePropChange('reviews', updated);
                                }}
                                folder="Testimonials"
                                placeholder="https://... or upload client photo"
                              />

                              <div className="grid grid-cols-2 gap-2">
                                <input
                                  type="text"
                                  value={rev.name || ''}
                                  onChange={(e) => {
                                    const updated = currentReviews.map((r: any, i: number) =>
                                      i === idx ? { ...r, name: e.target.value } : r
                                    );
                                    handlePropChange('reviews', updated);
                                  }}
                                  placeholder="Client Name / Company"
                                  className="p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                                />
                                <input
                                  type="text"
                                  value={rev.role || ''}
                                  onChange={(e) => {
                                    const updated = currentReviews.map((r: any, i: number) =>
                                      i === idx ? { ...r, role: e.target.value } : r
                                    );
                                    handlePropChange('reviews', updated);
                                  }}
                                  placeholder="Role / Industry"
                                  className="p-1.5 rounded-lg border border-gray-200 text-xs text-gray-600 bg-white"
                                />
                              </div>

                              <textarea
                                rows={3}
                                value={rev.text || ''}
                                onChange={(e) => {
                                  const updated = currentReviews.map((r: any, i: number) =>
                                    i === idx ? { ...r, text: e.target.value } : r
                                  );
                                  handlePropChange('reviews', updated);
                                }}
                                placeholder="Testimonial quote text..."
                                className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] text-gray-700 bg-white"
                              />
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...currentReviews,
                              {
                                name: 'Dr. Ramesh K.',
                                role: 'Prime Healthcare',
                                text: 'Organic patient inquiries doubled after Sunraise engineered our local hospital landing pages.',
                                rating: 5
                              }
                            ];
                            handlePropChange('reviews', updated);
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Testimonial Card</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* KPI COUNTERS */}
            {block.component_name === 'KPICounter' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  {(() => {
                    const defaultStats = [
                      { label: 'Organic Traffic Surge', val: '+380%' },
                      { label: 'Keywords Page 1', val: '1,450+' },
                      { label: 'Client Retention Rate', val: '98%' },
                      { label: 'Years Serving TS & AP', val: '18+' }
                    ];
                    const currentStats = (props.stats && props.stats.length > 0) ? props.stats : defaultStats;

                    return (
                      <>
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-gray-800">Key Performance Counters</label>
                          <span className="text-[10px] text-gray-500 font-bold">{currentStats.length} Metrics</span>
                        </div>

                        <div className="space-y-2">
                          {currentStats.map((st: any, idx: number) => (
                            <div key={idx} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
                              <input
                                type="text"
                                value={st.val || ''}
                                onChange={(e) => {
                                  const updated = currentStats.map((s: any, i: number) =>
                                    i === idx ? { ...s, val: e.target.value } : s
                                  );
                                  handlePropChange('stats', updated);
                                }}
                                placeholder="+380%"
                                className="w-24 p-1.5 rounded-lg border border-gray-200 text-xs font-black text-orange-600 bg-white"
                              />
                              <input
                                type="text"
                                value={st.label || ''}
                                onChange={(e) => {
                                  const updated = currentStats.map((s: any, i: number) =>
                                    i === idx ? { ...s, label: e.target.value } : s
                                  );
                                  handlePropChange('stats', updated);
                                }}
                                placeholder="Metric label..."
                                className="flex-1 p-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const updated = currentStats.filter((_: any, i: number) => i !== idx);
                                  handlePropChange('stats', updated);
                                }}
                                className="text-red-400 hover:text-red-600 p-1"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const updated = [
                              ...currentStats,
                              { label: 'Conversion Lift', val: '2.8x' }
                            ];
                            handlePropChange('stats', updated);
                          }}
                          className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 hover:bg-orange-100 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Metric Counter</span>
                        </button>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* SPACER BLOCK */}
            {block.component_name === 'Spacer' && (
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-700">
                  Spacer Height: {props.height || 40}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="160"
                  step="5"
                  value={props.height || 40}
                  onChange={(e) => handlePropChange('height', Number(e.target.value))}
                  className="w-full accent-orange-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>10px</span>
                  <span>80px</span>
                  <span>160px</span>
                </div>
              </div>
            )}

            {/* UNIVERSAL FALLBACK PROPERTY EDITOR FOR CUSTOM / LEGACY BLOCKS */}
            {![
              'Heading', 'Paragraph', 'Image', 'Video', 'Button', 'CTABanner',
              'ImageAndText', 'SplitImageText', 'FAQAccordion', 'Spacer',
              'ProcessTimeline', 'FeatureGrid', 'ThreeColumn', 'TwoColumn',
              'Grid', 'Container', 'PricingTable', 'Testimonials', 'KPICounter'
            ].includes(block.component_name || '') && (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-orange-50/60 border border-orange-200 text-xs text-orange-950 font-medium">
                  Editing custom properties for <span className="font-bold">{block.component_name || block.type}</span>:
                </div>

                <div className="space-y-3">
                  {Object.entries(props).map(([key, val]) => {
                    if (typeof val === 'object' && val !== null) return null;
                    return (
                      <div key={key} className="space-y-1">
                        <label className="text-xs font-bold text-gray-700 capitalize">
                          {key.replace(/_/g, ' ')}
                        </label>
                        {typeof val === 'string' && val.length > 60 ? (
                          <textarea
                            rows={3}
                            value={String(val || '')}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-medium"
                          />
                        ) : (
                          <input
                            type="text"
                            value={String(val !== undefined ? val : '')}
                            onChange={(e) => handlePropChange(key, e.target.value)}
                            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-medium"
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Alignment Controls */}
            <div className="space-y-1.5 pt-3 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700">Content Alignment</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'left', icon: AlignLeft, label: 'Left' },
                  { id: 'center', icon: AlignCenter, label: 'Center' },
                  { id: 'right', icon: AlignRight, label: 'Right' }
                ].map((align) => {
                  const Icon = align.icon;
                  return (
                    <button
                      key={align.id}
                      type="button"
                      onClick={() => {
                        handlePropChange('alignment', align.id);
                        handleStyleChange('align', align.id as any);
                      }}
                      className={`py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition border ${
                        (styles.align || props.alignment || 'left') === align.id
                          ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{align.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 2. STYLE & SIZE TAB */}
        {/* ==================================================== */}
        {activeTab === 'style' && (
          <div className="space-y-4">
            {/* ==================================================== */}
            {/* SECTION BACKGROUND IMAGE & OVERLAYS                 */}
            {/* ==================================================== */}
            <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                  <ImageIcon className="w-3.5 h-3.5 text-orange-600" />
                  <span>Section Background Image</span>
                </div>
                {styles.backgroundImage && (
                  <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                    Active
                  </span>
                )}
              </div>

              <ImageInputControl
                label="Upload or Pick Background Image"
                value={styles.backgroundImage || ''}
                onChange={(url) => handleStyleChange('backgroundImage', url)}
                folder="Section Backgrounds"
                placeholder="https://... or upload image"
                helperText="Upload any JPG, PNG or WebP image to render as a full section background."
              />

              {/* Sizing, Position & Overlay Controls if Image Selected */}
              {styles.backgroundImage && (
                <div className="space-y-3 pt-2 border-t border-gray-200/80">
                  {/* Background Sizing */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Display Size</label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { label: 'Cover (Fill)', val: 'cover' },
                        { label: 'Contain', val: 'contain' },
                        { label: 'Auto (Actual)', val: 'auto' }
                      ].map((s) => (
                        <button
                          key={s.val}
                          type="button"
                          onClick={() => handleStyleChange('backgroundSize', s.val as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (styles.backgroundSize || 'cover') === s.val
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Position */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Image Position</label>
                    <div className="grid grid-cols-5 gap-1">
                      {[
                        { label: 'Center', val: 'center' },
                        { label: 'Top', val: 'top' },
                        { label: 'Bottom', val: 'bottom' },
                        { label: 'Left', val: 'left' },
                        { label: 'Right', val: 'right' }
                      ].map((pos) => (
                        <button
                          key={pos.val}
                          type="button"
                          onClick={() => handleStyleChange('backgroundPosition', pos.val as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (styles.backgroundPosition || 'center') === pos.val
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Background Repeat */}
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Tiling / Repeat</label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {[
                        { label: 'No Repeat', val: 'no-repeat' },
                        { label: 'Tile Repeat', val: 'repeat' }
                      ].map((rep) => (
                        <button
                          key={rep.val}
                          type="button"
                          onClick={() => handleStyleChange('backgroundRepeat', rep.val as any)}
                          className={`py-1 rounded-lg text-[10px] font-bold border transition ${
                            (styles.backgroundRepeat || 'no-repeat') === rep.val
                              ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          {rep.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Contrast Overlay Controls */}
                  <div className="space-y-2 pt-2 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-800">Contrast Color Overlay</label>
                      <span className="text-[10px] font-mono font-bold text-orange-600">
                        {styles.backgroundOverlayOpacity !== undefined ? `${styles.backgroundOverlayOpacity}%` : (styles.backgroundOverlay ? '50%' : 'None')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={styles.backgroundOverlay && styles.backgroundOverlay.startsWith('#') ? styles.backgroundOverlay : '#000000'}
                        onChange={(e) => {
                          handleStyleChange('backgroundOverlay', e.target.value);
                          if (styles.backgroundOverlayOpacity === undefined) {
                            handleStyleChange('backgroundOverlayOpacity', 50);
                          }
                        }}
                        className="w-8 h-8 rounded-lg border border-gray-300 cursor-pointer p-0.5"
                        title="Choose Overlay Tint Color"
                      />
                      <input
                        type="range"
                        min="0"
                        max="95"
                        step="5"
                        value={styles.backgroundOverlayOpacity !== undefined ? styles.backgroundOverlayOpacity : (styles.backgroundOverlay ? 50 : 0)}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          handleStyleChange('backgroundOverlayOpacity', val);
                          if (val > 0) {
                            if (!styles.backgroundOverlay) {
                              handleStyleChange('backgroundOverlay', '#000000');
                            }
                          } else {
                            handleStyleChange('backgroundOverlay', undefined);
                          }
                        }}
                        className="flex-1 accent-orange-600"
                      />
                    </div>

                    {/* Quick Text Contrast Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleStyleChange('textColor', '#ffffff')}
                        className="flex-1 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] font-bold hover:bg-black transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <span>Set White Text</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStyleChange('textColor', '#111827')}
                        className="flex-1 py-1.5 rounded-lg bg-white border border-gray-300 text-gray-800 text-[10px] font-bold hover:bg-gray-50 transition shadow-xs flex items-center justify-center gap-1"
                      >
                        <span>Set Dark Text</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {/* Card & Grid Columns Density */}
            <div className="p-3 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-gray-900">
                <Grid className="w-3.5 h-3.5 text-orange-600" />
                <span>Card Layout &amp; Columns</span>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Grid Column Count</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { label: '1 Col', val: 1 },
                    { label: '2 Cols', val: 2 },
                    { label: '3 Cols', val: 3 },
                    { label: '4 Cols', val: 4 }
                  ].map((col) => (
                    <button
                      key={col.val}
                      type="button"
                      onClick={() => handlePropChange('columns', col.val)}
                      className={`py-1 rounded-lg text-xs font-bold border ${
                        (props.columns || 3) === col.val
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {col.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Card Padding / Density</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Compact', val: 'compact' },
                    { label: 'Standard', val: 'normal' },
                    { label: 'Spacious', val: 'spacious' }
                  ].map((dens) => (
                    <button
                      key={dens.val}
                      type="button"
                      onClick={() => handlePropChange('cardSize', dens.val)}
                      className={`py-1 rounded-lg text-xs font-bold border ${
                        (props.cardSize || 'normal') === dens.val
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {dens.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-bold text-gray-600">Card Elevation / Shadow</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: 'Flat', val: 'none' },
                    { label: 'Warm Soft', val: 'warm' },
                    { label: 'Sunraise Glow', val: 'sunraise' }
                  ].map((sh) => (
                    <button
                      key={sh.val}
                      type="button"
                      onClick={() => handlePropChange('cardShadow', sh.val)}
                      className={`py-1 rounded-lg text-[11px] font-bold border ${
                        (props.cardShadow || 'warm') === sh.val
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-200'
                      }`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Corner Radius Controls */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">Corner Rounding (Radius)</label>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Square (0)', val: '0' },
                  { label: 'Soft (12px)', val: '12' },
                  { label: 'Round (20px)', val: '20' },
                  { label: 'Pill (9999)', val: '9999' }
                ].map((r) => (
                  <button
                    key={r.val}
                    type="button"
                    onClick={() => {
                      handleStyleChange('borderRadius', r.val);
                      handlePropChange('cardRadius', r.val);
                    }}
                    className={`py-1 rounded-lg text-[11px] font-bold border ${
                      (styles.borderRadius || props.cardRadius) === r.val
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Background Color & Swatches */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700">Section Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#ffffff'}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  className="w-9 h-9 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={styles.backgroundColor || ''}
                  onChange={(e) => handleStyleChange('backgroundColor', e.target.value)}
                  placeholder="Transparent or #ffffff"
                  className="flex-1 p-2 rounded-xl border border-gray-200 text-xs font-mono"
                />
              </div>

              {/* Color Swatches */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {colorPresets.map((swatch) => (
                  <button
                    key={swatch.val}
                    type="button"
                    onClick={() => handleStyleChange('backgroundColor', swatch.val)}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 text-[10px] font-semibold hover:border-orange-500 transition"
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-gray-300"
                      style={{ backgroundColor: swatch.val }}
                    />
                    <span>{swatch.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Section Padding Controls */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-gray-700">Vertical Padding (Top/Bottom)</label>
                <span className="text-[11px] font-mono text-gray-500">{styles.paddingY || '48'}px</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { label: 'Compact', val: '24' },
                  { label: 'Normal', val: '48' },
                  { label: 'Generous', val: '72' },
                  { label: 'Spacious', val: '96' }
                ].map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => handleStyleChange('paddingY', p.val)}
                    className={`py-1 rounded-lg text-xs font-bold border ${
                      (styles.paddingY || '48') === p.val
                        ? 'bg-orange-600 text-white border-orange-600'
                        : 'bg-white text-gray-700 border-gray-200'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Color */}
            <div className="space-y-1 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.textColor || '#111827'}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  className="w-9 h-9 rounded-xl border border-gray-200 cursor-pointer p-0.5"
                />
                <input
                  type="text"
                  value={styles.textColor || ''}
                  onChange={(e) => handleStyleChange('textColor', e.target.value)}
                  placeholder="Inherit or #111827"
                  className="flex-1 p-2 rounded-xl border border-gray-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* 3. ADVANCED TAB */}
        {/* ==================================================== */}
        {activeTab === 'advanced' && (
          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Custom CSS Classes</label>
              <input
                type="text"
                value={styles.customClass || ''}
                onChange={(e) => handleStyleChange('customClass', e.target.value)}
                placeholder="custom-card shadow-warm"
                className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">HTML Anchor ID</label>
              <input
                type="text"
                value={styles.elementId || ''}
                onChange={(e) => handleStyleChange('elementId', e.target.value)}
                placeholder="services-features"
                className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
              />
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold text-gray-700">Device Visibility</label>
              <div className="space-y-2 text-xs text-gray-700">
                <label className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styles.responsiveHide?.mobile || false}
                    onChange={(e) =>
                      handleStyleChange('responsiveHide', {
                        ...styles.responsiveHide,
                        mobile: e.target.checked
                      })
                    }
                    className="accent-orange-600 rounded"
                  />
                  <span>Hide on Mobile Devices (&lt; 768px)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styles.responsiveHide?.tablet || false}
                    onChange={(e) =>
                      handleStyleChange('responsiveHide', {
                        ...styles.responsiveHide,
                        tablet: e.target.checked
                      })
                    }
                    className="accent-orange-600 rounded"
                  />
                  <span>Hide on Tablet Devices (768px - 1024px)</span>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 border border-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={styles.responsiveHide?.desktop || false}
                    onChange={(e) =>
                      handleStyleChange('responsiveHide', {
                        ...styles.responsiveHide,
                        desktop: e.target.checked
                      })
                    }
                    className="accent-orange-600 rounded"
                  />
                  <span>Hide on Desktop Screens (&gt; 1024px)</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Media Library Modal */}
      {isMediaModalOpen && (
        <MediaLibraryModal
          isOpen={isMediaModalOpen}
          onClose={() => setIsMediaModalOpen(false)}
          onSelect={handleMediaSelect}
        />
      )}
    </div>
  );
};
