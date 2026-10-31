import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Columns2,
  Rows,
  Type,
  FileText,
  MousePointerClick,
  Image as ImageIcon,
  MoveVertical,
  Minus,
  Sparkles
} from 'lucide-react';
import { LayoutColumnSlot, LayoutSubElement } from './LayoutColumnRenderer';
import { ImageInputControl } from './ImageInputControl';

interface LayoutColumnsEditorProps {
  columns: LayoutColumnSlot[];
  onChange: (columns: LayoutColumnSlot[]) => void;
  title?: string;
  onTitleChange?: (title: string) => void;
  expectedCount?: number;
}

export const LayoutColumnsEditor: React.FC<LayoutColumnsEditorProps> = ({
  columns,
  onChange,
  title = '',
  onTitleChange,
  expectedCount = 2
}) => {
  const [activeColIndex, setActiveColIndex] = useState(0);

  // Ensure initial slots match expectedCount
  const slots: LayoutColumnSlot[] = React.useMemo(() => {
    const list = [...(columns || [])];
    while (list.length < expectedCount) {
      list.push({
        id: `col-${Date.now()}-${list.length + 1}`,
        title: `Column ${list.length + 1}`,
        direction: 'col',
        elements: []
      });
    }
    return list;
  }, [columns, expectedCount]);

  const activeCol = slots[activeColIndex] || slots[0];

  const handleUpdateActiveCol = (updated: LayoutColumnSlot) => {
    const next = [...slots];
    next[activeColIndex] = updated;
    onChange(next);
  };

  const handleAddElement = (type: LayoutSubElement['type'], parentList: LayoutSubElement[] = activeCol.elements, parentSetter?: (up: LayoutSubElement[]) => void) => {
    const newEl: LayoutSubElement = {
      id: `el-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type,
      alignment: 'left'
    };

    if (type === 'Heading') {
      newEl.text = 'New Section Heading';
      newEl.level = 'h3';
    } else if (type === 'Paragraph') {
      newEl.text = 'Write your descriptive copy here...';
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
      handleUpdateActiveCol({
        ...activeCol,
        elements: [...(activeCol.elements || []), newEl]
      });
    }
  };

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
    handleUpdateActiveCol({
      ...activeCol,
      elements: updateRecursive(activeCol.elements || [])
    });
  };

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
    handleUpdateActiveCol({
      ...activeCol,
      elements: deleteRecursive(activeCol.elements || [])
    });
  };

  const handleMoveElement = (index: number, direction: 'up' | 'down') => {
    const list = [...(activeCol.elements || [])];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const [moved] = list.splice(index, 1);
    list.splice(targetIdx, 0, moved);
    handleUpdateActiveCol({ ...activeCol, elements: list });
  };

  return (
    <div className="space-y-4">
      {/* Optional Section Headline */}
      {onTitleChange && (
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Section Headline Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder="e.g. Strategic Architecture & Execution"
            className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold focus:outline-none focus:border-orange-500"
          />
        </div>
      )}

      {/* Column Switcher Tabs */}
      <div className="p-1 rounded-xl bg-gray-100 flex gap-1">
        {slots.map((col, idx) => (
          <button
            key={col.id || idx}
            type="button"
            onClick={() => setActiveColIndex(idx)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 ${
              activeColIndex === idx
                ? 'bg-white text-orange-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center">
              {idx + 1}
            </span>
            <span className="truncate">{col.title || `Column ${idx + 1}`}</span>
            <span className="text-[10px] text-gray-400 font-normal">
              ({(col.elements || []).length})
            </span>
          </button>
        ))}
      </div>

      {/* Active Column Settings */}
      {activeCol && (
        <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200/90 space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <div>
              <span className="text-xs font-black text-gray-900">
                {activeCol.title || `Column ${activeColIndex + 1}`} Settings
              </span>
              <p className="text-[10px] text-gray-400">Manage sub-boxes and elements inside this column</p>
            </div>

            {/* Layout Direction Toggle: Vertical Stack vs Horizontal Row */}
            <button
              type="button"
              onClick={() =>
                handleUpdateActiveCol({
                  ...activeCol,
                  direction: activeCol.direction === 'row' ? 'col' : 'row'
                })
              }
              className="text-[10px] font-bold px-2 py-1 rounded-lg border border-gray-200 bg-white text-gray-700 hover:text-orange-600 flex items-center gap-1 shadow-xs transition"
              title="Toggle column layout flow"
            >
              {activeCol.direction === 'row' ? <Rows className="w-3 h-3 text-orange-600" /> : <Columns2 className="w-3 h-3 text-orange-600" />}
              <span>{activeCol.direction === 'row' ? 'Row Flow' : 'Column Stack'}</span>
            </button>
          </div>

          {/* Quick Add Buttons */}
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold text-gray-600 uppercase tracking-wider block">
              + Add Sub-Element:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleAddElement('Heading')}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <Type className="w-3 h-3" />
                <span>Heading</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Paragraph')}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <FileText className="w-3 h-3" />
                <span>Text</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Image')}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <ImageIcon className="w-3 h-3" />
                <span>Image</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Button')}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <MousePointerClick className="w-3 h-3" />
                <span>Button</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Row')}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <Rows className="w-3 h-3" />
                <span>Row Box</span>
              </button>
              <button
                type="button"
                onClick={() => handleAddElement('Column')}
                className="p-1.5 rounded-lg bg-white border border-gray-200 hover:border-orange-400 hover:text-orange-600 text-gray-700 text-[10px] font-bold flex items-center justify-center gap-1 transition shadow-xs"
              >
                <Columns2 className="w-3 h-3" />
                <span>Col Box</span>
              </button>
            </div>
          </div>

          {/* List of Current Elements in Active Column */}
          <div className="space-y-2 pt-2 border-t border-gray-200">
            {(activeCol.elements || []).length === 0 ? (
              <div className="p-4 rounded-xl border border-dashed border-gray-300 text-center text-xs text-gray-400">
                This column is currently empty. Use the buttons above to add content or sub-boxes.
              </div>
            ) : (
              (activeCol.elements || []).map((el, i) => (
                <div
                  key={el.id}
                  className="p-3 rounded-xl bg-white border border-gray-200 shadow-xs space-y-2"
                >
                  {/* Element Header & Reorder/Delete */}
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-800 flex items-center gap-1">
                      <span className="text-orange-600 font-mono">#{i + 1}</span>
                      <span>{el.type}</span>
                    </span>

                    <div className="flex items-center gap-1">
                      {/* Alignment Controls */}
                      <button
                        type="button"
                        onClick={() => handleUpdateElement(el.id, { alignment: 'left' })}
                        className={`p-1 rounded ${el.alignment === 'left' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Align Left"
                      >
                        <AlignLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateElement(el.id, { alignment: 'center' })}
                        className={`p-1 rounded ${el.alignment === 'center' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Align Center"
                      >
                        <AlignCenter className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateElement(el.id, { alignment: 'right' })}
                        className={`p-1 rounded ${el.alignment === 'right' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-gray-600'}`}
                        title="Align Right"
                      >
                        <AlignRight className="w-3 h-3" />
                      </button>

                      <span className="text-gray-300">|</span>

                      {/* Move buttons */}
                      <button
                        type="button"
                        disabled={i === 0}
                        onClick={() => handleMoveElement(i, 'up')}
                        className={`p-1 ${i === 0 ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-gray-700'}`}
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={i === (activeCol.elements || []).length - 1}
                        onClick={() => handleMoveElement(i, 'down')}
                        className={`p-1 ${i === (activeCol.elements || []).length - 1 ? 'opacity-20 cursor-not-allowed' : 'text-gray-400 hover:text-gray-700'}`}
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDeleteElement(el.id)}
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Delete element"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  {/* Element Specific Form Fields */}
                  {el.type === 'Heading' && (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <select
                          value={el.level || 'h3'}
                          onChange={(e) => handleUpdateElement(el.id, { level: e.target.value as any })}
                          className="p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white"
                        >
                          <option value="h2">H2</option>
                          <option value="h3">H3</option>
                          <option value="h4">H4</option>
                          <option value="h5">H5</option>
                        </select>
                        <input
                          type="text"
                          value={el.text || ''}
                          onChange={(e) => handleUpdateElement(el.id, { text: e.target.value })}
                          placeholder="Heading text..."
                          className="flex-1 p-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                        />
                      </div>
                    </div>
                  )}

                  {el.type === 'Paragraph' && (
                    <textarea
                      rows={2}
                      value={el.text || ''}
                      onChange={(e) => handleUpdateElement(el.id, { text: e.target.value })}
                      placeholder="Paragraph text..."
                      className="w-full p-2 rounded-lg border border-gray-200 text-xs leading-relaxed"
                    />
                  )}

                  {el.type === 'Button' && (
                    <div className="space-y-1.5">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={el.text || ''}
                          onChange={(e) => handleUpdateElement(el.id, { text: e.target.value })}
                          placeholder="Button Label"
                          className="flex-1 p-1.5 rounded-lg border border-gray-200 text-xs font-bold"
                        />
                        <select
                          value={el.variant || 'primary'}
                          onChange={(e) => handleUpdateElement(el.id, { variant: e.target.value as any })}
                          className="p-1.5 rounded-lg border border-gray-200 text-xs font-semibold bg-white"
                        >
                          <option value="primary">Primary</option>
                          <option value="secondary">Secondary</option>
                        </select>
                      </div>
                      <input
                        type="text"
                        value={el.url || ''}
                        onChange={(e) => handleUpdateElement(el.id, { url: e.target.value })}
                        placeholder="Link URL (/contact, https://...)"
                        className="w-full p-1.5 rounded-lg border border-gray-200 text-[11px] font-mono"
                      />
                    </div>
                  )}

                  {el.type === 'Image' && (
                    <ImageInputControl
                      label="Column Image"
                      value={el.url || ''}
                      onChange={(newUrl) => handleUpdateElement(el.id, { url: newUrl })}
                      folder="Columns"
                    />
                  )}

                  {(el.type === 'Row' || el.type === 'Column') && (
                    <div className="p-2.5 rounded-lg bg-gray-50 border border-dashed border-gray-300 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-bold text-gray-500">
                        <span>Nested {el.type === 'Row' ? 'Horizontal Row' : 'Vertical Column'} Box</span>
                        <span>{(el.elements || []).length} items</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          onClick={() => handleAddElement('Button', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                          className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-700 hover:text-orange-600"
                        >
                          + Button
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddElement('Paragraph', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                          className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-700 hover:text-orange-600"
                        >
                          + Text
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddElement('Heading', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                          className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-700 hover:text-orange-600"
                        >
                          + Heading
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAddElement('Image', el.elements || [], (up) => handleUpdateElement(el.id, { elements: up }))}
                          className="px-2 py-0.5 rounded bg-white border border-gray-200 text-[9px] font-bold text-gray-700 hover:text-orange-600"
                        >
                          + Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

