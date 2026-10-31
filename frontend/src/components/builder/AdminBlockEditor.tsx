import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { PageBlock } from '../../types';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Code,
  Layout,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  X,
  FileCode,
  Sparkles
} from 'lucide-react';
import { VisualBlockRenderer } from './VisualBlockRenderer';

interface AdminBlockEditorProps {
  blocks: PageBlock[];
  onSaveBlocks: (updated: PageBlock[]) => void;
}

export const AdminBlockEditor: React.FC<AdminBlockEditorProps> = ({ blocks, onSaveBlocks }) => {
  const [blockList, setBlockList] = useState<PageBlock[]>(blocks);
  const [previewMode, setPreviewMode] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedBlockForEdit, setSelectedBlockForEdit] = useState<PageBlock | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlockList((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const reordered = arrayMove(items, oldIndex, newIndex).map((b, idx) => ({
          ...b,
          sort_order: idx + 1,
        }));
        onSaveBlocks(reordered);
        return reordered;
      });
    }
  };

  const handleDelete = (id: string) => {
    const updated = blockList.filter((b) => b.id !== id).map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlockList(updated);
    onSaveBlocks(updated);
  };

  const handleDuplicate = (block: PageBlock) => {
    const newBlock: PageBlock = {
      ...block,
      id: `blk-${Date.now()}`,
      sort_order: blockList.length + 1,
    };
    const updated = [...blockList, newBlock];
    setBlockList(updated);
    onSaveBlocks(updated);
  };

  const handleAddPrebuiltBlock = (compName: PageBlock['component_name']) => {
    const newBlock: PageBlock = {
      id: `blk-${Date.now()}`,
      type: 'visual',
      component_name: compName,
      sort_order: blockList.length + 1,
      props: getDefaultPropsForComponent(compName),
    };
    const updated = [...blockList, newBlock];
    setBlockList(updated);
    onSaveBlocks(updated);
    setAddModalOpen(false);
  };

  const handleAddHTMLBlock = () => {
    const newBlock: PageBlock = {
      id: `blk-html-${Date.now()}`,
      type: 'html',
      component_name: 'RawHTML',
      sort_order: blockList.length + 1,
      html_content: `<div class="p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center">
  <h2 class="text-2xl font-bold text-gray-900 mb-2">Custom Conversion Widget</h2>
  <p class="text-gray-600 mb-4">Craft bespoke offers or interactive CTAs directly in this live editor.</p>
  <button class="px-6 py-2.5 rounded-full bg-orange-600 text-white font-semibold shadow hover:bg-orange-700">Click Here &rarr;</button>
</div>`,
      css_content: '',
    };
    const updated = [...blockList, newBlock];
    setBlockList(updated);
    onSaveBlocks(updated);
    setAddModalOpen(false);
  };

  const handleUpdateBlockProps = (updated: PageBlock) => {
    const list = blockList.map((b) => (b.id === updated.id ? updated : b));
    setBlockList(list);
    onSaveBlocks(list);
    setSelectedBlockForEdit(null);
  };

  // SEO Heading Hierarchy Check
  const h1Violations = blockList.filter(
    (b) => b.type === 'html' && b.html_content && /<h1(\s|>)/i.test(b.html_content)
  );

  const autoFixH1s = () => {
    const fixed = blockList.map((b) => {
      if (b.type === 'html' && b.html_content) {
        return {
          ...b,
          html_content: b.html_content
            .replace(/<h1(\s|>)/gi, '<h2$1')
            .replace(/<\/h1>/gi, '</h2>'),
        };
      }
      return b;
    });
    setBlockList(fixed);
    onSaveBlocks(fixed);
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-warm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base font-heading">
              Visual & Code Page Builder
            </h3>
            <p className="text-xs text-gray-500">
              Drag to reorder blocks, inject raw HTML/CSS, or embed interactive widgets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* SEO Hierarchy Status Indicator */}
          {h1Violations.length > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{h1Violations.length} duplicate &lt;h1&gt; detected!</span>
              <button
                onClick={autoFixH1s}
                className="ml-1 text-[11px] underline font-bold hover:text-amber-950"
              >
                Auto-fix to &lt;h2&gt;
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>SEO Heading Hierarchy Validated (Single H1)</span>
            </div>
          )}

          {/* Preview Toggle */}
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
              previewMode
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{previewMode ? 'Exit Preview' : 'Live Canvas Preview'}</span>
          </button>

          {/* Add Block Trigger */}
          <button
            onClick={() => setAddModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition"
          >
            <Plus className="w-4 h-4" />
            <span>Add Block</span>
          </button>
        </div>
      </div>

      {/* Main Canvas View / Drag-and-Drop Area */}
      {previewMode ? (
        <div className="p-6 bg-white rounded-2xl border border-gray-200 shadow-warm">
          <div className="mb-4 pb-2 border-b border-gray-100 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Live Preview Mode (Rendering exactly as public visitors will see)
          </div>
          {blockList.map((block) => (
            <VisualBlockRenderer key={block.id} block={block} />
          ))}
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blockList.map((b) => b.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {blockList.length === 0 ? (
                <div className="p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <Layout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <h4 className="font-bold text-gray-700 text-base">No page blocks added yet</h4>
                  <p className="text-xs text-gray-400 mt-1 mb-4">
                    Click "Add Block" above to insert pre-built UI components or custom HTML blocks.
                  </p>
                  <button
                    onClick={() => setAddModalOpen(true)}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-sunraise-gradient text-white font-bold text-xs shadow-sunraise"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Insert First Block</span>
                  </button>
                </div>
              ) : (
                blockList.map((block) => (
                  <SortableBlockItem
                    key={block.id}
                    block={block}
                    onDelete={() => handleDelete(block.id)}
                    onDuplicate={() => handleDuplicate(block)}
                    onEdit={() => setSelectedBlockForEdit(block)}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Add Block Modal */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                <h3 className="text-lg font-bold text-gray-900 font-heading">
                  Choose Block Type to Insert
                </h3>
              </div>
              <button
                onClick={() => setAddModalOpen(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Prebuilt Visual Blocks */}
              <div
                onClick={() => handleAddPrebuiltBlock('FeatureGrid')}
                className="p-4 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Layout className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Feature Grid</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Card grid highlighting technical capabilities and services.
                </p>
              </div>

              <div
                onClick={() => handleAddPrebuiltBlock('ProcessTimeline')}
                className="p-4 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Layout className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">4-Step Process Timeline</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Horizontal step-by-step roadmap from audit to execution.
                </p>
              </div>

              <div
                onClick={() => handleAddPrebuiltBlock('FAQAccordion')}
                className="p-4 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Layout className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">FAQ Accordion</h4>
                <p className="text-xs text-gray-500 mt-1">
                  Interactive expandable questions with SEO FAQ schema.
                </p>
              </div>

              <div
                onClick={() => handleAddPrebuiltBlock('CTABanner')}
                className="p-4 rounded-2xl border border-gray-200 hover:border-orange-500 hover:bg-orange-50/50 cursor-pointer transition group"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-2 group-hover:bg-orange-600 group-hover:text-white transition">
                  <Layout className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-gray-900 text-sm">Sunraise CTA Banner</h4>
                <p className="text-xs text-gray-500 mt-1">
                  High-converting vibrant gradient banner with proposal action.
                </p>
              </div>
            </div>

            {/* Code / HTML Injections */}
            <div className="pt-4 border-t border-gray-100">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-3">
                Technical Injection Blocks
              </span>
              <div
                onClick={handleAddHTMLBlock}
                className="p-4 rounded-2xl border border-purple-200 bg-purple-50/40 hover:bg-purple-50 hover:border-purple-500 cursor-pointer transition flex items-start gap-3.5 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                  <Code className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">
                    Raw HTML / Scoped CSS Injection
                  </h4>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Embed custom components, Tailwind utilities, or lead generators with live isolated preview.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Block Drawer / Modal */}
      {selectedBlockForEdit && (
        <EditBlockModal
          block={selectedBlockForEdit}
          onSave={handleUpdateBlockProps}
          onClose={() => setSelectedBlockForEdit(null)}
        />
      )}
    </div>
  );
};

// Sortable Row Component
const SortableBlockItem: React.FC<{
  block: PageBlock;
  onDelete: () => void;
  onDuplicate: () => void;
  onEdit: () => void;
}> = ({ block, onDelete, onDuplicate, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm flex items-center justify-between gap-4 group hover:border-orange-300 transition"
    >
      <div className="flex items-center gap-3">
        <button
          {...attributes}
          {...listeners}
          className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <GripVertical className="w-5 h-5" />
        </button>

        <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
          {block.type === 'html' ? <FileCode className="w-4 h-4 text-purple-600" /> : <Layout className="w-4 h-4" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-900 text-sm">
              {block.type === 'html'
                ? 'Raw HTML / CSS Injection'
                : block.component_name || 'Visual Block'}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-gray-100 text-gray-600 uppercase font-bold">
              {block.type}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">
            {block.type === 'html'
              ? 'Contains custom HTML and Tailwind markup'
              : block.props?.title || 'Configured properties'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onEdit}
          className="p-2 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition"
          title="Edit Block Content"
        >
          <Settings className="w-4 h-4" />
        </button>
        <button
          onClick={onDuplicate}
          className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition"
          title="Duplicate Block"
        >
          <Copy className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
          title="Delete Block"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Edit Block Modal
const EditBlockModal: React.FC<{
  block: PageBlock;
  onSave: (b: PageBlock) => void;
  onClose: () => void;
}> = ({ block, onSave, onClose }) => {
  const [currentBlock, setCurrentBlock] = useState<PageBlock>(block);

  const handlePropChange = (key: string, value: any) => {
    setCurrentBlock({
      ...currentBlock,
      props: {
        ...currentBlock.props,
        [key]: value,
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 font-heading">
            Configure {currentBlock.component_name || currentBlock.type.toUpperCase()} Block
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* If Raw HTML block */}
        {currentBlock.type === 'html' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                HTML Markup (Tailwind supported)
              </label>
              <textarea
                value={currentBlock.html_content || ''}
                onChange={(e) =>
                  setCurrentBlock({ ...currentBlock, html_content: e.target.value })
                }
                rows={10}
                className="w-full font-mono text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-950 text-emerald-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Scoped CSS Styles (Optional)
              </label>
              <textarea
                value={currentBlock.css_content || ''}
                onChange={(e) =>
                  setCurrentBlock({ ...currentBlock, css_content: e.target.value })
                }
                rows={4}
                className="w-full font-mono text-xs p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500 bg-gray-950 text-amber-400"
                placeholder=".custom-class { color: #FF5722; }"
              />
            </div>
          </div>
        ) : (
          /* Prebuilt Props */
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                Block Heading / Title
              </label>
              <input
                type="text"
                value={currentBlock.props?.title || ''}
                onChange={(e) => handlePropChange('title', e.target.value)}
                className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
              />
            </div>

            {currentBlock.props?.description !== undefined && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={currentBlock.props?.description || ''}
                  onChange={(e) => handlePropChange('description', e.target.value)}
                  rows={3}
                  className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                />
              </div>
            )}

            {currentBlock.props?.cta_text !== undefined && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={currentBlock.props?.cta_text || ''}
                    onChange={(e) => handlePropChange('cta_text', e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                    CTA Destination URL
                  </label>
                  <input
                    type="text"
                    value={currentBlock.props?.cta_link || ''}
                    onChange={(e) => handlePropChange('cta_link', e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100 transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(currentBlock)}
            className="px-6 py-2.5 rounded-xl bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};

function getDefaultPropsForComponent(compName?: string) {
  switch (compName) {
    case 'FeatureGrid':
      return {
        title: 'High-Impact Capabilities',
        description: 'Engineered for high conversion and market leadership.',
        features: [
          'High-Performance Speed Guarantee',
          'Search Engine First Architecture',
          'Mobile Native Fluid Experience',
          'Enterprise Grade Security'
        ]
      };
    case 'ProcessTimeline':
      return {
        title: 'Our 4-Stage Execution Protocol',
        steps: [
          { step: '01', title: 'Audit & Analysis', desc: 'Identify bottlenecks.' },
          { step: '02', title: 'Strategy Architecture', desc: 'Custom blueprint.' },
          { step: '03', title: 'Agile Implementation', desc: 'High-speed rollout.' },
          { step: '04', title: 'Optimization & Growth', desc: 'Conversion scaling.' }
        ]
      };
    case 'FAQAccordion':
      return {
        title: 'Frequently Asked Questions',
        faqs: [
          { q: 'How soon can we start the project?', a: 'Our technical team initiates audits within 48 hours.' },
          { q: 'Do you offer ongoing retainer maintenance?', a: 'Yes, full 24/7 dedicated engineer support.' }
        ]
      };
    case 'CTABanner':
      return {
        badge: 'READY TO GROW?',
        title: 'Scale Your Business With Sunraise Solutions',
        subtitle: 'Get in touch with our team today for an in-depth consultation.',
        cta_text: 'Get Started Now',
        cta_link: '/contact'
      };
    default:
      return {};
  }
}
