import React, { useState, useRef } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Upload,
  FolderOpen,
  ArrowRight,
  Image as ImageIcon,
  Type,
  FileText,
  MousePointerClick,
  Columns2,
  Rows,
  ExternalLink,
  MoveVertical,
  Minus,
  Sparkles
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { MediaLibraryModal } from './MediaLibraryModal';

export interface LayoutSubElement {
  id: string;
  type: 'Heading' | 'Paragraph' | 'Image' | 'Button' | 'Row' | 'Column' | 'Spacer' | 'Divider';
  text?: string;
  level?: 'h2' | 'h3' | 'h4' | 'h5';
  alignment?: 'left' | 'center' | 'right';
  url?: string;
  alt?: string;
  variant?: 'primary' | 'secondary';
  height?: number;
  direction?: 'col' | 'row';
  elements?: LayoutSubElement[];
}

export interface LayoutColumnSlot {
  id: string;
  title?: string;
  direction?: 'col' | 'row';
  gap?: string;
  align?: 'left' | 'center' | 'right';
  elements: LayoutSubElement[];
}

interface LayoutColumnRendererProps {
  column: LayoutColumnSlot;
  colIndex: number;
  totalColumns: number;
  isEditable?: boolean;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
  onUpdateColumn: (updated: LayoutColumnSlot) => void;
}

export const LayoutColumnRenderer: React.FC<LayoutColumnRendererProps> = ({
  column,
  colIndex,
  totalColumns,
  isEditable = false,
  viewportMode = 'desktop',
  onUpdateColumn
}) => {
  const [activeMediaTarget, setActiveMediaTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingTargetId, setUploadingTargetId] = useState<string | null>(null);

  const isMobile = viewportMode === 'mobile';
  const isTablet = viewportMode === 'tablet';

  const elements = column.elements || [];
  const colDirection = column.direction || 'col';

  // Add sub-element
  const handleAddElement = (type: LayoutSubElement['type'], parentList: LayoutSubElement[] = elements, parentSetter?: (updated: LayoutSubElement[]) => void) => {
    const newEl: LayoutSubElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      alignment: 'left'
    };

    if (type === 'Heading') {
      newEl.text = 'New Section Heading';
      newEl.level = 'h3';
    } else if (type === 'Paragraph') {
      newEl.text = 'Write your compelling copy or feature description here...';
    } else if (type === 'Image') {
      newEl.url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80';
      newEl.alt = 'Column visual asset';
      newEl.alignment = 'center';
    } else if (type === 'Button') {
      newEl.text = 'Explore Service';
      newEl.url = '/contact';
      newEl.variant = 'primary';
    } else if (type === 'Row') {
      newEl.direction = 'row';
      newEl.elements = [];
    } else if (type === 'Column') {
      newEl.direction = 'col';
      newEl.elements = [];
    } else if (type === 'Spacer') {
      newEl.height = 24;
    }

    if (parentSetter) {
      parentSetter([...parentList, newEl]);
    } else {
      onUpdateColumn({ ...column, elements: [...elements, newEl] });
    }
  };

  // Update specific element
  const handleUpdateElement = (id: string, updates: Partial<LayoutSubElement>) => {
    const updateRecursive = (list: LayoutSubElement[]): LayoutSubElement[] => {
      return list.map((item) => {
        if (item.id === id) {
          return { ...item, ...updates };
        }
        if (item.elements && item.elements.length > 0) {
          return { ...item, elements: updateRecursive(item.elements) };
        }
        return item;
      });
    };
    onUpdateColumn({ ...column, elements: updateRecursive(elements) });
  };

  // Delete element
  const handleDeleteElement = (id: string) => {
    const deleteRecursive = (list: LayoutSubElement[]): LayoutSubElement[] => {
      return list
        .filter((item) => item.id !== id)
        .map((item) => {
          if (item.elements && item.elements.length > 0) {
            return { ...item, elements: deleteRecursive(item.elements) };
          }
          return item;
        });
    };
    onUpdateColumn({ ...column, elements: deleteRecursive(elements) });
  };

  // Move element up/down
  const handleMoveElement = (index: number, direction: 'up' | 'down', list: LayoutSubElement[], setter: (up: LayoutSubElement[]) => void) => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const reordered = [...list];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    setter(reordered);
  };

  // Real-time file upload via upload.php for image sub-elements
  const handleDirectUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingTargetId(targetId);
    try {
      const mediaItem = await SunraiseAPI.uploadMediaFile(file, 'Columns');
      if (mediaItem && mediaItem.url) {
        handleUpdateElement(targetId, { url: mediaItem.url });
      }
    } catch (err) {
      console.error('Direct upload failed:', err);
    } finally {
      setUploadingTargetId(null);
      if (e.target) e.target.value = '';
    }
  };

  // Render individual sub-element
  const renderItem = (
    el: LayoutSubElement,
    index: number,
    siblings: LayoutSubElement[],
    setSiblings: (up: LayoutSubElement[]) => void,
    isInsideSubbox = false
  ) => {
    const align = el.alignment || 'left';
    const alignTextClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
    const alignFlexClass = align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start';

    return (
      <div
        key={el.id}
        className={`group/subel relative rounded-xl transition duration-150 ${
          isEditable ? 'hover:ring-1 hover:ring-orange-400 p-2 my-1 bg-white/70' : ''
        }`}
      >
        {/* Floating Mini Action Toolbar on Hover in Edit Mode */}
        {isEditable && (
          <div className="absolute -top-3.5 right-2 z-20 opacity-0 group-hover/subel:opacity-100 transition flex items-center gap-1 bg-gray-900 text-white px-2 py-0.5 rounded-lg shadow-md border border-gray-700 text-[10px]">
            {/* Alignment Toggles */}
            <button
              type="button"
              onClick={() => handleUpdateElement(el.id, { alignment: 'left' })}
              className={`p-0.5 rounded ${align === 'left' ? 'text-orange-400 font-bold' : 'text-gray-400 hover:text-white'}`}
              title="Align Left"
            >
              <AlignLeft className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateElement(el.id, { alignment: 'center' })}
              className={`p-0.5 rounded ${align === 'center' ? 'text-orange-400 font-bold' : 'text-gray-400 hover:text-white'}`}
              title="Align Center"
            >
              <AlignCenter className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => handleUpdateElement(el.id, { alignment: 'right' })}
              className={`p-0.5 rounded ${align === 'right' ? 'text-orange-400 font-bold' : 'text-gray-400 hover:text-white'}`}
              title="Align Right"
            >
              <AlignRight className="w-3 h-3" />
            </button>

            <span className="text-gray-600">|</span>

            {/* Move Up */}
            <button
              type="button"
              disabled={index === 0}
              onClick={() => handleMoveElement(index, 'up', siblings, setSiblings)}
              className={`p-0.5 ${index === 0 ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
              title="Move Up"
            >
              <ChevronUp className="w-3 h-3" />
            </button>
            {/* Move Down */}
            <button
              type="button"
              disabled={index === siblings.length - 1}
              onClick={() => handleMoveElement(index, 'down', siblings, setSiblings)}
              className={`p-0.5 ${index === siblings.length - 1 ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-white'}`}
              title="Move Down"
            >
              <ChevronDown className="w-3 h-3" />
            </button>

            <span className="text-gray-600">|</span>

            {/* Delete */}
            <button
              type="button"
              onClick={() => handleDeleteElement(el.id)}
              className="p-0.5 text-red-400 hover:text-red-300"
              title="Delete element"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}

        {/* 1. HEADING */}
        {el.type === 'Heading' && (
          <div className={`w-full ${alignTextClass}`}>
            {isEditable ? (
              <input
                type="text"
                value={el.text || ''}
                onChange={(e) => handleUpdateElement(el.id, { text: e.target.value })}
                className={`w-full bg-transparent font-heading font-extrabold text-gray-900 border-b border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none ${alignTextClass} ${
                  el.level === 'h2'
                    ? isMobile ? 'text-2xl' : 'text-3xl'
                    : el.level === 'h4'
                    ? 'text-lg font-bold'
                    : isMobile ? 'text-xl' : 'text-2xl'
                }`}
                placeholder="Heading text..."
              />
            ) : (
              <h3
                className={`font-heading font-extrabold text-gray-900 leading-snug ${alignTextClass} ${
                  el.level === 'h2'
                    ? isMobile ? 'text-2xl' : 'text-3xl'
                    : el.level === 'h4'
                    ? 'text-lg font-bold'
                    : isMobile ? 'text-xl' : 'text-2xl'
                }`}
              >
                {el.text}
              </h3>
            )}
          </div>
        )}

        {/* 2. PARAGRAPH */}
        {el.type === 'Paragraph' && (
          <div className={`w-full ${alignTextClass}`}>
            {isEditable ? (
              <textarea
                rows={2}
                value={el.text || ''}
                onChange={(e) => handleUpdateElement(el.id, { text: e.target.value })}
                className={`w-full bg-transparent text-gray-600 leading-relaxed font-normal text-sm sm:text-base border-b border-transparent hover:border-gray-300 focus:border-orange-500 focus:outline-none resize-none ${alignTextClass}`}
                placeholder="Paragraph text..."
              />
            ) : (
              <p className={`text-gray-600 leading-relaxed font-normal text-sm sm:text-base ${alignTextClass}`}>
                {el.text}
              </p>
            )}
          </div>
        )}

        {/* 3. BUTTON */}
        {el.type === 'Button' && (
          <div className={`flex w-full ${alignFlexClass}`}>
            {isEditable ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <input
                  type="text"
                  value={el.text || ''}
                  onChange={(e) => handleUpdateElement(el.id, { text: e.target.value })}
                  className="px-4 py-2 rounded-full bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise max-w-[180px] focus:outline-none text-center"
                  placeholder="Button label..."
                />
                <input
                  type="text"
                  value={el.url || ''}
                  onChange={(e) => handleUpdateElement(el.id, { url: e.target.value })}
                  placeholder="URL /contact..."
                  className="px-2 py-1 text-[11px] font-mono rounded-lg border border-gray-200 w-28 bg-white focus:outline-none focus:border-orange-500"
                />
                <button
                  type="button"
                  onClick={() => handleUpdateElement(el.id, { variant: el.variant === 'secondary' ? 'primary' : 'secondary' })}
                  className="text-[10px] text-gray-500 hover:text-orange-600 font-bold px-1.5 py-0.5 rounded border border-gray-200"
                >
                  {el.variant || 'primary'}
                </button>
              </div>
            ) : (
              <a
                href={el.url || '#'}
                className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs shadow-warm transition hover:scale-105 duration-200 ${
                  el.variant === 'secondary'
                    ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                    : 'bg-sunraise-gradient text-white shadow-sunraise hover:shadow-sunraise-lg'
                }`}
              >
                <span>{el.text || 'Explore'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

        {/* 4. IMAGE (With Real-Time Direct Upload via upload.php) */}
        {el.type === 'Image' && (
          <div className={`flex flex-col w-full ${alignFlexClass}`}>
            <div
              className={`relative overflow-hidden rounded-2xl border border-gray-200/80 bg-gray-100 group/img ${
                isMobile ? 'w-full max-h-56' : 'w-full max-h-72'
              }`}
            >
              <img
                src={el.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'}
                alt={el.alt || 'Column asset'}
                className="w-full h-full object-cover transition duration-300"
                loading="lazy"
              />

              {/* Upload Overlay on Hover in Edit Mode */}
              {isEditable && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition flex items-center justify-center gap-2 p-2">
                  <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold transition flex items-center gap-1 shadow-sm">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingTargetId === el.id ? 'Uploading...' : 'Direct Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleDirectUpload(e, el.id)}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveMediaTarget(el.id)}
                    className="px-3 py-1.5 rounded-xl bg-white hover:bg-gray-100 text-gray-800 text-xs font-bold transition flex items-center gap-1 shadow-sm"
                  >
                    <FolderOpen className="w-3.5 h-3.5" />
                    <span>Media Library</span>
                  </button>
                </div>
              )}
            </div>
            {isEditable && (
              <input
                type="text"
                value={el.url || ''}
                onChange={(e) => handleUpdateElement(el.id, { url: e.target.value })}
                placeholder="Image URL https://..."
                className="mt-1 px-2 py-1 text-[10px] font-mono rounded-lg border border-gray-200 w-full bg-white focus:outline-none focus:border-orange-500"
              />
            )}
          </div>
        )}

        {/* 5. ROW SUB-BOX (Row-wise elements container) */}
        {el.type === 'Row' && (
          <div className="p-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 my-1 space-y-2">
            {isEditable && (
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider pb-1 border-b border-gray-200/80">
                <span className="flex items-center gap-1 text-orange-600">
                  <Rows className="w-3 h-3" />
                  <span>Row Sub-Box (Horizontal Elements)</span>
                </span>
                <span className="text-[9px] text-gray-400">{(el.elements || []).length} Items</span>
              </div>
            )}

            <div className={`flex flex-wrap items-center gap-3 w-full ${alignFlexClass}`}>
              {(el.elements || []).length === 0 ? (
                <div className="p-3 border border-dashed border-gray-200 rounded-xl w-full text-center text-xs text-gray-400">
                  Empty Row Box — Add sub-elements below
                </div>
              ) : (
                (el.elements || []).map((child, cIdx) =>
                  renderItem(
                    child,
                    cIdx,
                    el.elements || [],
                    (up) => handleUpdateElement(el.id, { elements: up }),
                    true
                  )
                )
              )}
            </div>

            {/* Quick Add into Row */}
            {isEditable && (
              <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-gray-200/60">
                <span className="text-[9px] font-bold text-gray-400 mr-1">+ Add to Row:</span>
                <button
                  type="button"
                  onClick={() => handleAddElement('Button', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Button
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Paragraph', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Heading', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Heading
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Image', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Image
                </button>
              </div>
            )}
          </div>
        )}

        {/* 6. COLUMN SUB-BOX (Column-wise elements container) */}
        {el.type === 'Column' && (
          <div className="p-3 rounded-2xl border border-dashed border-gray-300 bg-gray-50/70 my-1 space-y-2">
            {isEditable && (
              <div className="flex items-center justify-between text-[10px] font-bold text-gray-500 uppercase tracking-wider pb-1 border-b border-gray-200/80">
                <span className="flex items-center gap-1 text-orange-600">
                  <Columns2 className="w-3 h-3" />
                  <span>Column Sub-Box (Vertical Stack)</span>
                </span>
                <span className="text-[9px] text-gray-400">{(el.elements || []).length} Items</span>
              </div>
            )}

            <div className="flex flex-col gap-2 w-full">
              {(el.elements || []).length === 0 ? (
                <div className="p-3 border border-dashed border-gray-200 rounded-xl w-full text-center text-xs text-gray-400">
                  Empty Column Box — Add sub-elements below
                </div>
              ) : (
                (el.elements || []).map((child, cIdx) =>
                  renderItem(
                    child,
                    cIdx,
                    el.elements || [],
                    (up) => handleUpdateElement(el.id, { elements: up }),
                    true
                  )
                )
              )}
            </div>

            {/* Quick Add into Column */}
            {isEditable && (
              <div className="flex flex-wrap items-center gap-1 pt-1.5 border-t border-gray-200/60">
                <span className="text-[9px] font-bold text-gray-400 mr-1">+ Add to Column:</span>
                <button
                  type="button"
                  onClick={() => handleAddElement('Heading', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Heading
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Paragraph', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Text
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Image', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Image
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Button', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Button
                </button>
                <button
                  type="button"
                  onClick={() => handleAddElement('Row', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                  className="px-2 py-0.5 rounded bg-white hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
                >
                  + Row
                </button>
              </div>
            )}
          </div>
        )}

        {/* 7. SPACER */}
        {el.type === 'Spacer' && (
          <div style={{ height: `${el.height || 24}px` }} className="w-full relative group/sp">
            {isEditable && (
              <div className="absolute inset-0 border border-dashed border-gray-200 rounded flex items-center justify-center text-[10px] text-gray-400">
                Spacer: {el.height || 24}px
              </div>
            )}
          </div>
        )}

        {/* 8. DIVIDER */}
        {el.type === 'Divider' && (
          <hr className="my-3 border-t border-gray-200 w-full" />
        )}
      </div>
    );
  };

  return (
    <div
      className={`flex flex-col justify-between rounded-3xl transition duration-200 w-full ${
        isEditable ? 'p-4 border-2 border-dashed border-gray-200 hover:border-orange-300 bg-white/40' : 'p-2'
      }`}
    >
      {/* Column Header in Edit Mode */}
      {isEditable && (
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200/80">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-md bg-orange-100 text-orange-700 font-black text-[10px] flex items-center justify-center">
              {colIndex + 1}
            </span>
            <span className="text-xs font-bold text-gray-800">{column.title || `Column ${colIndex + 1}`}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onUpdateColumn({ ...column, direction: colDirection === 'col' ? 'row' : 'col' })}
              className="text-[10px] font-bold text-gray-500 hover:text-orange-600 px-2 py-0.5 rounded border border-gray-200 bg-white flex items-center gap-1"
              title="Toggle Layout Direction (Vertical Stack vs Horizontal Row)"
            >
              {colDirection === 'col' ? <Columns2 className="w-3 h-3" /> : <Rows className="w-3 h-3" />}
              <span>{colDirection === 'col' ? 'Stack (Col)' : 'Flex (Row)'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Elements List inside Column */}
      <div className={`flex ${colDirection === 'row' ? 'flex-row flex-wrap gap-4 items-center' : 'flex-col gap-3'} w-full flex-1`}>
        {elements.length === 0 ? (
          /* EMPTY COLUMN SLOT STATE */
          <div className="w-full py-8 px-4 rounded-2xl border-2 border-dashed border-gray-300 hover:border-orange-400 bg-gray-50/60 hover:bg-orange-50/20 transition flex flex-col items-center justify-center text-center my-2">
            <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 text-gray-400 flex items-center justify-center mb-2 shadow-xs">
              <Plus className="w-5 h-5 text-orange-500" />
            </div>
            <p className="text-xs font-bold text-gray-800">{column.title || `Empty Column #${colIndex + 1}`}</p>
            <p className="text-[11px] text-gray-400 mt-0.5 mb-3">Add elements or sub-boxes to this column:</p>

            {/* Quick Add Element Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm">
              <button
                type="button"
                onClick={() => handleAddElement('Heading')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-gray-700 border border-gray-200 text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <Type className="w-3 h-3" />
                <span>Heading</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Paragraph')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-gray-700 border border-gray-200 text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <FileText className="w-3 h-3" />
                <span>Paragraph</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Image')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-gray-700 border border-gray-200 text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Button')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-gray-700 border border-gray-200 text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <MousePointerClick className="w-3 h-3" />
                <span>Button</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Row')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-gray-700 border border-gray-200 text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <Rows className="w-3 h-3" />
                <span>Row Box</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Column')}
                className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-500 hover:text-white text-gray-700 border border-gray-200 text-xs font-bold transition shadow-xs flex items-center gap-1"
              >
                <Columns2 className="w-3 h-3" />
                <span>Column Box</span>
              </button>
            </div>
          </div>
        ) : (
          elements.map((el, i) =>
            renderItem(el, i, elements, (up) => onUpdateColumn({ ...column, elements: up }))
          )
        )}
      </div>

      {/* Footer Add Bar when elements exist */}
      {isEditable && elements.length > 0 && (
        <div className="pt-3 mt-2 border-t border-dashed border-gray-200 flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[10px] font-bold text-gray-400 mr-1">+ Add:</span>
          <button
            type="button"
            onClick={() => handleAddElement('Heading')}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
          >
            Heading
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('Paragraph')}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
          >
            Paragraph
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('Image')}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
          >
            Image
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('Button')}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
          >
            Button
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('Row')}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
          >
            Row Box
          </button>
          <button
            type="button"
            onClick={() => handleAddElement('Column')}
            className="px-2 py-0.5 rounded bg-gray-50 hover:bg-orange-50 text-gray-700 hover:text-orange-600 border border-gray-200 text-[10px] font-bold"
          >
            Column Box
          </button>
        </div>
      )}

      {/* Media Library Modal if active */}
      {activeMediaTarget && (
        <MediaLibraryModal
          isOpen={Boolean(activeMediaTarget)}
          onClose={() => setActiveMediaTarget(null)}
          onSelect={(media) => {
            handleUpdateElement(activeMediaTarget, { url: media.url });
            setActiveMediaTarget(null);
          }}
        />
      )}
    </div>
  );
};

