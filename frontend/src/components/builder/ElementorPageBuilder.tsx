import React, { useState, useEffect } from 'react';
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
import { PageBlock, BlockCategory, SEOMeta, HeroConfig, PageRevision } from '../../types';
import { VisualBlockRenderer } from './VisualBlockRenderer';
import { ElementPaletteSidebar } from './ElementPaletteSidebar';
import { ElementSettingsSidebar } from './ElementSettingsSidebar';
import { SEOPanel } from './SEOPanel';
import { RevisionsModal } from './RevisionsModal';
import { MediaLibraryModal } from './MediaLibraryModal';
import { ImageInputControl } from './ImageInputControl';
import {
  GripVertical,
  Plus,
  Trash2,
  Copy,
  Layout,
  CheckCircle,
  AlertTriangle,
  Eye,
  Settings,
  X,
  FileCode,
  Sparkles,
  Monitor,
  Tablet,
  Smartphone,
  Save,
  Compass,
  History,
  RotateCcw,
  Undo2,
  Redo2,
  ExternalLink,
  ChevronUp,
  ChevronDown
} from 'lucide-react';

interface ElementorPageBuilderProps {
  pageId: number;
  pageType: 'service' | 'page';
  title: string;
  slug: string;
  initialBlocks: PageBlock[];
  initialSeoMeta: SEOMeta;
  heroConfig?: HeroConfig;
  status?: string;
  onBack?: () => void;
  onSaveDraft: (data: { blocks: PageBlock[]; seoMeta: SEOMeta; heroConfig?: HeroConfig; slug: string; title: string }) => Promise<void>;
  onPublish: (data: { blocks: PageBlock[]; seoMeta: SEOMeta; heroConfig?: HeroConfig; slug: string; title: string }) => Promise<void>;
  userRole?: string;
}

const SortableCanvasBlock: React.FC<{
  block: PageBlock;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isFirst: boolean;
  isLast: boolean;
  viewportMode: 'desktop' | 'tablet' | 'mobile';
  onInlineUpdate: (props: Record<string, any>) => void;
}> = ({
  block,
  isSelected,
  onSelect,
  onDelete,
  onDuplicate,
  onMoveUp,
  onMoveDown,
  isFirst,
  isLast,
  viewportMode,
  onInlineUpdate
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : isSelected ? 30 : 1,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`group relative rounded-2xl transition-all duration-150 my-5 bg-white ${
        isSelected
          ? 'ring-2 ring-orange-500 shadow-xl'
          : 'border border-gray-200/80 hover:border-orange-300 hover:shadow-md'
      }`}
    >
      {/* Floating Toolbar on Hover / Select - sits on the top boundary without obscuring content */}
      <div
        className={`absolute -top-3.5 right-4 z-30 flex items-center gap-1 bg-gray-900 text-white px-2.5 py-1 rounded-lg shadow-xl border border-gray-700 transition-all duration-150 ${
          isSelected ? 'opacity-100 scale-100 ring-2 ring-orange-500' : 'opacity-0 group-hover:opacity-100 scale-95'
        }`}
      >
        {/* Drag Handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          title="Drag to reorder section"
          className="p-1 hover:text-orange-400 cursor-grab active:cursor-grabbing"
        >
          <GripVertical className="w-3.5 h-3.5" />
        </button>

        <span className="text-[10px] font-bold text-gray-300 uppercase px-1.5 border-r border-gray-700">
          {block.component_name || block.type}
        </span>

        {/* Move Up */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveUp();
          }}
          disabled={isFirst}
          title="Move Up"
          className={`p-1 hover:text-orange-400 ${isFirst ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>

        {/* Move Down */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMoveDown();
          }}
          disabled={isLast}
          title="Move Down"
          className={`p-1 hover:text-orange-400 ${isLast ? 'opacity-30 cursor-not-allowed' : ''}`}
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>

        {/* Duplicate */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDuplicate();
          }}
          title="Duplicate Section"
          className="p-1 hover:text-orange-400"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          title="Delete Section"
          className="p-1 text-red-400 hover:text-red-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Actual Rendered Content */}
      <div className="pointer-events-auto rounded-2xl overflow-hidden">
        <VisualBlockRenderer
          block={block}
          isEditable={true}
          viewportMode={viewportMode}
          onInlineUpdate={onInlineUpdate}
        />
      </div>
    </div>
  );
};

export const ElementorPageBuilder: React.FC<ElementorPageBuilderProps> = ({
  pageId,
  pageType,
  title,
  slug,
  initialBlocks,
  initialSeoMeta,
  heroConfig,
  status = 'published',
  onBack,
  onSaveDraft,
  onPublish,
  userRole = 'super_admin'
}) => {
  // State
  const [blocks, setBlocks] = useState<PageBlock[]>(initialBlocks);
  const [seoMeta, setSeoMeta] = useState<SEOMeta>(initialSeoMeta);
  const [pageTitle, setPageTitle] = useState(title);
  const [pageSlug, setPageSlug] = useState(slug);
  const [currentHero, setCurrentHero] = useState<HeroConfig | undefined>(heroConfig);

  // Canonical public path for live preview and header indicator
  const corePages = ['home', 'about', 'services', 'projects', 'blog', 'contact'];
  const publicPath = pageType === 'service'
    ? `/services/${pageSlug}`
    : (pageSlug === 'home' ? '/' : (corePages.includes(pageSlug) ? `/${pageSlug}` : `/p/${pageSlug}`));

  // Undo / Redo history
  const [history, setHistory] = useState<PageBlock[][]>([initialBlocks]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Active Selected Element for Right Sidebar
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [isEditingHero, setIsEditingHero] = useState(false);
  const [paletteDragOverIndex, setPaletteDragOverIndex] = useState<number | null>(null);

  // Viewport mode: desktop, tablet, mobile
  const [viewportMode, setViewportMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // UI Panels
  const [isSEOPanelOpen, setIsSEOPanelOpen] = useState(false);
  const [isRevisionsOpen, setIsRevisionsOpen] = useState(false);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [saveStatusNotice, setSaveStatusNotice] = useState<string | null>(null);

  // Clipboard for copy-paste
  const [copiedBlock, setCopiedBlock] = useState<PageBlock | null>(null);

  // Revisions mock/local list
  const [revisions, setRevisions] = useState<PageRevision[]>([
    {
      id: `rev-${Date.now()}`,
      target_id: pageId,
      target_type: pageType,
      slug: pageSlug,
      title: pageTitle,
      blocks: initialBlocks,
      seo_meta: initialSeoMeta,
      saved_by: 'SEO Strategy Lead',
      saved_at: new Date().toISOString(),
      note: 'Base version checkpoint'
    }
  ]);

  // Update history on change
  const recordHistory = (newBlocks: PageBlock[]) => {
    const updated = history.slice(0, historyIndex + 1);
    updated.push(newBlocks);
    setHistory(updated);
    setHistoryIndex(updated.length - 1);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setBlocks(prev);
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setBlocks(next);
      setHistoryIndex(historyIndex + 1);
    }
  };

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((b) => b.id === active.id);
      const newIndex = blocks.findIndex((b) => b.id === over.id);
      const reordered = arrayMove(blocks, oldIndex, newIndex).map((b, idx) => ({
        ...b,
        sort_order: idx + 1,
      }));
      setBlocks(reordered);
      recordHistory(reordered);
    }
  };

  // Add block from palette
  const handleAddBlock = (componentName: PageBlock['component_name'], category: BlockCategory) => {
    const newBlock: PageBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: 'visual',
      category,
      component_name: componentName,
      sort_order: blocks.length + 1,
      props: getDefaultProps(componentName),
      styles: {
        align: 'left',
        paddingY: '16',
        paddingX: '16'
      }
    };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    setSelectedBlockId(newBlock.id);
    recordHistory(updated);
  };

  const handleAddHtmlBlock = () => {
    const newBlock: PageBlock = {
      id: `blk-html-${Date.now()}`,
      type: 'html',
      category: 'basic',
      component_name: 'RawHTML',
      sort_order: blocks.length + 1,
      html_content: `<div class="p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center">
  <h2 class="text-2xl font-bold text-gray-900 mb-2">Custom Conversion Widget</h2>
  <p class="text-gray-600 mb-4">Engineered conversion block with zero styling leakage.</p>
  <a href="/contact" class="inline-flex items-center px-6 py-3 rounded-full bg-orange-600 text-white font-semibold shadow hover:bg-orange-700">Get Started &rarr;</a>
</div>`,
      css_content: ''
    };
    const updated = [...blocks, newBlock];
    setBlocks(updated);
    setSelectedBlockId(newBlock.id);
    recordHistory(updated);
  };

  const handlePaletteDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    e.stopPropagation();
    setPaletteDragOverIndex(null);

    let compName: PageBlock['component_name'] | undefined;
    let category: BlockCategory = 'business';

    const customData = e.dataTransfer.getData('application/sunraise-component');
    if (customData) {
      try {
        const parsed = JSON.parse(customData);
        if (parsed.name) compName = parsed.name;
        if (parsed.category) category = parsed.category;
      } catch (err) {}
    }

    if (!compName) {
      const textData = e.dataTransfer.getData('text/plain');
      if (textData) compName = textData as PageBlock['component_name'];
    }

    if (!compName) return;

    const newBlock: PageBlock = {
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      type: compName === 'RawHTML' ? 'html' : 'visual',
      category,
      component_name: compName,
      sort_order: targetIndex + 1,
      props: getDefaultProps(compName),
      styles: {
        align: 'left',
        paddingY: '16',
        paddingX: '16'
      }
    };

    const updated = [...blocks];
    const insertIdx = Math.max(0, Math.min(targetIndex, updated.length));
    updated.splice(insertIdx, 0, newBlock);
    const reordered = updated.map((b, i) => ({ ...b, sort_order: i + 1 }));

    setBlocks(reordered);
    recordHistory(reordered);
    setSelectedBlockId(newBlock.id);
    setIsEditingHero(false);
    setSaveStatusNotice(`Added ${compName} element at position #${insertIdx + 1}`);
    setTimeout(() => setSaveStatusNotice(null), 3000);
  };

  const handleDeleteBlock = (id: string) => {
    const updated = blocks.filter((b) => b.id !== id).map((b, idx) => ({ ...b, sort_order: idx + 1 }));
    setBlocks(updated);
    if (selectedBlockId === id) setSelectedBlockId(null);
    recordHistory(updated);
  };

  const handleDuplicateBlock = (block: PageBlock) => {
    const clone: PageBlock = {
      ...block,
      id: `blk-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
      sort_order: blocks.length + 1
    };
    const updated = [...blocks, clone];
    setBlocks(updated);
    setSelectedBlockId(clone.id);
    recordHistory(updated);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const reordered = arrayMove(blocks, index, index - 1).map((b, i) => ({ ...b, sort_order: i + 1 }));
    setBlocks(reordered);
    recordHistory(reordered);
  };

  const handleMoveDown = (index: number) => {
    if (index === blocks.length - 1) return;
    const reordered = arrayMove(blocks, index, index + 1).map((b, i) => ({ ...b, sort_order: i + 1 }));
    setBlocks(reordered);
    recordHistory(reordered);
  };

  const handleUpdateBlock = (updatedBlock: PageBlock) => {
    const list = blocks.map((b) => (b.id === updatedBlock.id ? updatedBlock : b));
    setBlocks(list);
  };

  // Auto-fix H1 violations
  const handleAutoFixH1 = () => {
    const fixed = blocks.map((b) => {
      if (b.type === 'visual' && b.component_name === 'Heading' && b.props?.level === 'h1') {
        return { ...b, props: { ...b.props, level: 'h2' } };
      }
      if (b.type === 'html' && b.html_content) {
        return {
          ...b,
          html_content: b.html_content
            .replace(/<h1(\s|>)/gi, '<h2$1')
            .replace(/<\/h1>/gi, '</h2>')
        };
      }
      return b;
    });
    setBlocks(fixed);
    recordHistory(fixed);
    setSaveStatusNotice('All sub-headings sanitized to H2 hierarchy.');
    setTimeout(() => setSaveStatusNotice(null), 3000);
  };

  // Save / Publish
  const handleSave = async (isPublishing = false) => {
    const data = {
      blocks,
      seoMeta,
      heroConfig: currentHero,
      slug: pageSlug,
      title: pageTitle
    };

    if (isPublishing) {
      await onPublish(data);
      setSaveStatusNotice('Page successfully published live to website!');
    } else {
      await onSaveDraft(data);
      setSaveStatusNotice('Draft changes saved securely.');
    }

    // Add revision snapshot
    setRevisions((prev) => [
      {
        id: `rev-${Date.now()}`,
        target_id: pageId,
        target_type: pageType,
        slug: pageSlug,
        title: pageTitle,
        blocks,
        seo_meta: seoMeta,
        hero_config: currentHero,
        saved_by: userRole === 'super_admin' ? 'Super Admin' : 'SEO Manager',
        saved_at: new Date().toISOString(),
        note: isPublishing ? 'Published Release' : 'Draft Snapshot'
      },
      ...prev
    ]);

    setTimeout(() => setSaveStatusNotice(null), 3000);
  };

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900 overflow-hidden select-none">
      {/* 1. TOP BUILDER TOOLBAR */}
      <header className="bg-gray-950 text-white px-5 py-3 border-b border-gray-800 flex flex-wrap items-center justify-between gap-3 shrink-0 z-30 shadow-md">
        {/* Left: Back Button + Page Title & Slug */}
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              title="Return to Dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-800 text-gray-200 hover:text-white hover:bg-orange-600 transition text-xs font-bold border border-gray-700"
            >
              <span>&larr;</span>
              <span>Back</span>
            </button>
          )}

          <div className="w-8 h-8 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-xs font-heading">
            EB
          </div>
          <div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={pageTitle}
                onChange={(e) => setPageTitle(e.target.value)}
                className="bg-transparent font-bold text-sm text-white focus:outline-none focus:border-b focus:border-orange-500 max-w-xs truncate"
              />
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-gray-800 text-gray-300">
                {status}
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-400">
              <span>Path:</span>
              <a
                href={publicPath}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-orange-400 hover:underline flex items-center gap-1"
                title="View live page in new tab"
              >
                <span>{publicPath}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Center: Responsive Viewport Switcher & Undo/Redo */}
        <div className="flex items-center gap-3">
          {/* Undo / Redo */}
          <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              title="Undo (Ctrl+Z)"
              className={`p-1.5 rounded-lg text-gray-400 hover:text-white transition ${
                historyIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              title="Redo (Ctrl+Y)"
              className={`p-1.5 rounded-lg text-gray-400 hover:text-white transition ${
                historyIndex >= history.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
              }`}
            >
              <Redo2 className="w-4 h-4" />
            </button>
          </div>

          {/* Viewport Modes */}
          <div className="flex items-center bg-gray-900 rounded-xl p-1 border border-gray-800">
            <button
              type="button"
              onClick={() => setViewportMode('desktop')}
              title="Desktop Preview (100% width)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewportMode === 'desktop' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('tablet')}
              title="Tablet Preview (768px)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewportMode === 'tablet' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Tablet className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewportMode('mobile')}
              title="Mobile Preview (375px)"
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                viewportMode === 'mobile' ? 'bg-orange-600 text-white' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </button>
          </div>
        </div>

        {/* Right: Actions (SEO Panel, Revisions, Save, Publish) */}
        <div className="flex items-center gap-2">
          {/* Notice */}
          {saveStatusNotice && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{saveStatusNotice}</span>
            </div>
          )}

          {/* Dedicated SEO Panel Toggle */}
          <button
            type="button"
            onClick={() => setIsSEOPanelOpen(!isSEOPanelOpen)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
              isSEOPanelOpen
                ? 'bg-orange-600 text-white shadow-sunraise'
                : 'bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800'
            }`}
          >
            <Compass className="w-4 h-4 text-orange-400" />
            <span>SEO Settings</span>
          </button>

          {/* Revisions History Modal Toggle */}
          <button
            type="button"
            onClick={() => setIsRevisionsOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gray-900 border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-800 text-xs font-bold transition"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Revisions</span>
          </button>

          {/* Save Draft */}
          <button
            type="button"
            onClick={() => handleSave(false)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-xs font-bold transition border border-gray-700"
          >
            <Save className="w-4 h-4" />
            <span>Save Draft</span>
          </button>

          {/* Publish Page */}
          <button
            type="button"
            onClick={() => handleSave(true)}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-sunraise-gradient text-white text-xs font-extrabold shadow-sunraise hover:shadow-sunraise-lg transition hover:scale-105 duration-150"
          >
            <span>Publish Page</span>
          </button>

          {/* Public Live Preview Link */}
          <a
            href={publicPath}
            target="_blank"
            rel="noreferrer"
            title="Open published URL in new tab"
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* 2. THREE-PANEL BUILDER BODY */}
      <div className="flex-1 flex overflow-hidden relative min-h-0 w-full">
        {/* LEFT SIDEBAR: ELEMENTS PALETTE */}
        <ElementPaletteSidebar
          onAddBlock={handleAddBlock}
          onAddHtmlBlock={handleAddHtmlBlock}
          userRole={userRole}
        />

        {/* CENTRAL CANVAS: TRUE WYSIWYG LIVE PREVIEW */}
        <div
          id="builder-canvas-scroll-container"
          onClick={() => setSelectedBlockId(null)}
          className="flex-1 bg-slate-200/80 p-4 md:p-8 overflow-y-auto overflow-x-hidden flex flex-col items-center min-w-0 z-10 scroll-smooth h-full"
        >
          {/* Viewport Indicator Badge */}
          {viewportMode !== 'desktop' && (
            <div className="mb-4 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gray-300 shadow-sm text-xs font-bold text-gray-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>{viewportMode === 'mobile' ? 'Mobile Viewport (375 × 812 px) · Touch Emulation' : 'Tablet Viewport (768 × 1024 px) · Responsive Grid'}</span>
            </div>
          )}

          {/* Responsive Viewport Container with True Viewport Dimensions */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : '100%',
              maxWidth:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : '1200px',
              minWidth:
                viewportMode === 'mobile'
                  ? '375px'
                  : viewportMode === 'tablet'
                  ? '768px'
                  : undefined,
            }}
            className={`bg-white transition-all duration-300 mb-32 shrink-0 flex flex-col ${
              viewportMode === 'mobile'
                ? 'builder-viewport-mobile rounded-[44px] ring-[12px] ring-gray-900 shadow-2xl overflow-hidden'
                : viewportMode === 'tablet'
                ? 'builder-viewport-tablet rounded-[32px] ring-[14px] ring-gray-800 shadow-2xl overflow-hidden'
                : 'builder-viewport-desktop w-full rounded-3xl shadow-2xl border border-gray-300/80'
            }`}
          >
            {/* Mobile Top Status Bar & Notch */}
            {viewportMode === 'mobile' && (
              <div className="w-full bg-black text-white px-6 py-2.5 flex items-center justify-between select-none shrink-0 border-b border-gray-800">
                <span className="text-[11px] font-semibold tracking-tight">9:41</span>
                <div className="w-24 h-4 bg-gray-900 rounded-full border border-gray-800 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-950 mr-2"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-950"></div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-300">
                  <span className="text-[9px] font-bold">5G</span>
                  <div className="w-4 h-2 border border-gray-400 rounded-xs p-0.5 flex items-center">
                    <div className="w-full h-full bg-white rounded-xs"></div>
                  </div>
                </div>
              </div>
            )}

            {/* Tablet Top Bezel */}
            {viewportMode === 'tablet' && (
              <div className="w-full bg-gray-900 text-white px-6 py-2 flex items-center justify-between text-xs select-none shrink-0 border-b border-gray-800">
                <span className="text-[11px] text-gray-400 font-medium">iPad Pro · 768px</span>
                <div className="w-2.5 h-2.5 bg-black rounded-full border border-gray-700"></div>
                <span className="text-[11px] text-gray-400">100%</span>
              </div>
            )}
            {/* Optional Hero Banner if present - Clickable to edit */}
            {currentHero && (
              <section
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBlockId(null);
                  setIsEditingHero(true);
                }}
                style={{
                  backgroundImage: currentHero.background_image
                    ? (currentHero.background_overlay
                        ? `linear-gradient(${currentHero.background_overlay}, ${currentHero.background_overlay}), url("${currentHero.background_image}")`
                        : `url("${currentHero.background_image}")`)
                    : undefined,
                  backgroundSize: currentHero.background_image ? 'cover' : undefined,
                  backgroundPosition: currentHero.background_image ? 'center' : undefined,
                  color: currentHero.background_image && currentHero.background_overlay ? '#ffffff' : undefined
                }}
                className={`relative w-full shrink-0 ${
                  viewportMode === 'mobile' ? 'pt-6 pb-8 px-4' : 'pt-12 pb-16 px-6 md:px-12'
                } ${currentHero.background_image ? '' : 'bg-mesh-bg sunraise-mesh-bg'} border-b border-gray-200 rounded-t-3xl cursor-pointer group transition-all duration-200 ${
                  isEditingHero ? 'ring-2 ring-orange-500 shadow-xl' : 'hover:border-orange-300'
                }`}
              >
                {/* Floating Edit Badge */}
                <div
                  className={`absolute top-3 right-4 z-20 flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    isEditingHero
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-gray-900/90 text-white opacity-0 group-hover:opacity-100 hover:bg-orange-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-orange-300" />
                  <span>{isEditingHero ? 'Editing Hero Banner' : 'Click to Edit Hero'}</span>
                </div>

                <div className="max-w-4xl mx-auto text-center space-y-4">
                  <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{currentHero.badge || 'HERO SECTION'}</span>
                  </span>
                  <h1 className={`${
                    viewportMode === 'mobile' ? 'text-2xl leading-tight' : 'text-3xl sm:text-4xl lg:text-5xl'
                  } font-black text-gray-900 font-heading leading-tight`}>
                    {currentHero.title}{' '}
                    <span className="text-sunraise-gradient">{currentHero.highlight_text}</span>
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
                    {currentHero.subtitle}
                  </p>
                  <div className={`${
                    viewportMode === 'mobile' ? 'flex flex-col gap-2' : 'flex justify-center gap-3'
                  } pt-3`}>
                    <span className="px-6 py-3 rounded-full bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise cursor-default">
                      {currentHero.primary_cta || 'Claim Strategy'}
                    </span>
                    {currentHero.secondary_cta && (
                      <span className="px-5 py-3 rounded-full bg-white border border-gray-200 text-gray-700 text-xs font-bold shadow-warm cursor-default">
                        {currentHero.secondary_cta}
                      </span>
                    )}
                  </div>

                  {currentHero.stats && currentHero.stats.length > 0 && (
                    <div className={`${
                      viewportMode === 'mobile' ? 'grid grid-cols-1 gap-2' : 'grid grid-cols-3 gap-4'
                    } pt-6 border-t border-gray-200/80 max-w-lg mx-auto`}>
                      {currentHero.stats.map((st, i) => (
                        <div key={i} className={viewportMode !== 'mobile' && i > 0 ? 'border-l border-gray-200 pl-4' : ''}>
                          <div className="text-xl sm:text-2xl font-black text-gray-900 font-heading">
                            {st.val}
                          </div>
                          <div className="text-[11px] text-gray-500 font-semibold">{st.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Droppable Canvas Blocks */}
            <div className={`w-full space-y-2 ${viewportMode === 'mobile' ? 'p-3' : 'p-4 sm:p-6 md:p-8'}`}>
              {blocks.length === 0 ? (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    setPaletteDragOverIndex(0);
                  }}
                  onDragLeave={() => setPaletteDragOverIndex(null)}
                  onDrop={(e) => handlePaletteDrop(e, 0)}
                  className={`py-24 text-center border-2 border-dashed rounded-3xl p-8 flex flex-col items-center justify-center transition-all ${
                    paletteDragOverIndex === 0
                      ? 'border-orange-500 bg-orange-50/80 shadow-inner scale-[1.01]'
                      : 'border-gray-200 hover:border-orange-300'
                  }`}
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center mb-4">
                    <Layout className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 font-heading">
                    {paletteDragOverIndex === 0 ? 'Release Mouse to Drop Element Here' : 'Your Canvas is Clean & Ready'}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 max-w-md">
                    Drag any element from the Left Palette and drop it directly onto this workspace.
                  </p>
                </div>
              ) : (
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragEnd={handleDragEnd}
                >
                  <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    {blocks.map((block, idx) => (
                      <React.Fragment key={block.id}>
                        {/* Drop slot before each block */}
                        <div
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.dataTransfer.dropEffect = 'copy';
                            if (paletteDragOverIndex !== idx) setPaletteDragOverIndex(idx);
                          }}
                          onDragLeave={(e) => {
                            if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                            setPaletteDragOverIndex(null);
                          }}
                          onDrop={(e) => handlePaletteDrop(e, idx)}
                          className={`transition-all duration-150 select-none ${
                            paletteDragOverIndex === idx
                              ? 'h-14 my-2.5 rounded-2xl border-2 border-dashed border-orange-500 bg-orange-100/90 flex items-center justify-center gap-2 text-orange-600 font-extrabold text-xs shadow-inner animate-pulse'
                              : 'h-2 my-0.5 opacity-0 hover:opacity-100 hover:h-8 hover:my-1 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 flex items-center justify-center text-[10px] text-orange-500'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5 text-orange-600" />
                          <span>{paletteDragOverIndex === idx ? `Drop element here to insert at position #${idx + 1}` : 'Drop here'}</span>
                        </div>

                        <SortableCanvasBlock
                          block={block}
                          isSelected={selectedBlockId === block.id}
                          onSelect={() => {
                            setIsEditingHero(false);
                            setSelectedBlockId(block.id);
                          }}
                          onDelete={() => handleDeleteBlock(block.id)}
                          onDuplicate={() => handleDuplicateBlock(block)}
                          onMoveUp={() => handleMoveUp(idx)}
                          onMoveDown={() => handleMoveDown(idx)}
                          isFirst={idx === 0}
                          isLast={idx === blocks.length - 1}
                          viewportMode={viewportMode}
                          onInlineUpdate={(updatedProps) => {
                            handleUpdateBlock({
                              ...block,
                              props: { ...block.props, ...updatedProps }
                            });
                          }}
                        />
                      </React.Fragment>
                    ))}
                  </SortableContext>
                </DndContext>
              )}

              {/* Drop slot after last block */}
              {blocks.length > 0 && (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                    if (paletteDragOverIndex !== blocks.length) setPaletteDragOverIndex(blocks.length);
                  }}
                  onDragLeave={(e) => {
                    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
                    setPaletteDragOverIndex(null);
                  }}
                  onDrop={(e) => handlePaletteDrop(e, blocks.length)}
                  className={`transition-all duration-150 select-none ${
                    paletteDragOverIndex === blocks.length
                      ? 'h-14 my-2.5 rounded-2xl border-2 border-dashed border-orange-500 bg-orange-100/90 flex items-center justify-center gap-2 text-orange-600 font-extrabold text-xs shadow-inner animate-pulse'
                      : 'h-2 my-0.5 opacity-0 hover:opacity-100 hover:h-8 hover:my-1 rounded-xl border border-dashed border-orange-300 bg-orange-50/40 flex items-center justify-center text-[10px] text-orange-500'
                  }`}
                >
                  <Plus className="w-3.5 h-3.5 text-orange-600" />
                  <span>{paletteDragOverIndex === blocks.length ? `Drop element here to insert at the end (#${blocks.length + 1})` : 'Drop here'}</span>
                </div>
              )}

              {/* Add Section Quick Bar at the bottom of the canvas */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  e.dataTransfer.dropEffect = 'copy';
                  if (paletteDragOverIndex !== blocks.length) setPaletteDragOverIndex(blocks.length);
                }}
                onDragLeave={() => setPaletteDragOverIndex(null)}
                onDrop={(e) => handlePaletteDrop(e, blocks.length)}
                className="pt-6 pb-2 text-center"
              >
                <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-dashed transition-all text-xs font-bold ${
                  paletteDragOverIndex === blocks.length
                    ? 'border-orange-500 bg-orange-100 text-orange-700 shadow-md scale-105'
                    : 'border-gray-300 hover:border-orange-500 hover:bg-orange-50/50 text-gray-500 hover:text-orange-600'
                }`}>
                  <Plus className="w-4 h-4 text-orange-600" />
                  <span>
                    {paletteDragOverIndex === blocks.length
                      ? 'Release mouse to add element to the end'
                      : 'Drag elements from the Left Palette or click to add'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: HERO SETTINGS */}
        {isEditingHero && currentHero && (
          <div className="w-80 md:w-96 bg-white border-l border-gray-200 flex flex-col h-full shrink-0 shadow-xl z-20 overflow-hidden animate-in slide-in-from-right-4 duration-200">
            <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shadow-sm">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900 font-heading">Hero Banner Settings</h4>
                  <p className="text-[10px] text-gray-400">Main Title &amp; Lead Conversion</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingHero(false)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Hero Badge</label>
                <input
                  type="text"
                  value={currentHero.badge || ''}
                  onChange={(e) => setCurrentHero({ ...currentHero, badge: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Headline Title</label>
                <textarea
                  rows={2}
                  value={currentHero.title || ''}
                  onChange={(e) => setCurrentHero({ ...currentHero, title: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Highlighted Gradient Text</label>
                <input
                  type="text"
                  value={currentHero.highlight_text || ''}
                  onChange={(e) => setCurrentHero({ ...currentHero, highlight_text: e.target.value })}
                  placeholder="e.g. SEO in Hyderabad"
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold text-orange-600 focus:border-orange-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Subtitle Copy</label>
                <textarea
                  rows={3}
                  value={currentHero.subtitle || ''}
                  onChange={(e) => setCurrentHero({ ...currentHero, subtitle: e.target.value })}
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs leading-relaxed focus:border-orange-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Primary CTA Text</label>
                  <input
                    type="text"
                    value={currentHero.primary_cta || ''}
                    onChange={(e) => setCurrentHero({ ...currentHero, primary_cta: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Secondary CTA Text</label>
                  <input
                    type="text"
                    value={currentHero.secondary_cta || ''}
                    onChange={(e) => setCurrentHero({ ...currentHero, secondary_cta: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>
              </div>

              {/* Hero Background Image */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <ImageInputControl
                  label="Hero Background Image"
                  value={currentHero.background_image || ''}
                  onChange={(url) => setCurrentHero({ ...currentHero, background_image: url })}
                  folder="Hero Backgrounds"
                  placeholder="https://... or upload image"
                  helperText="Optional high-resolution background image for the top hero banner."
                />

                {currentHero.background_image && (
                  <div className="p-3 rounded-2xl bg-orange-50/60 border border-orange-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-gray-700">Dark Contrast Overlay</label>
                      <span className="text-[10px] font-mono font-bold text-orange-600">
                        {currentHero.background_overlay_opacity !== undefined ? `${currentHero.background_overlay_opacity}%` : '50%'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="90"
                      step="5"
                      value={currentHero.background_overlay_opacity !== undefined ? currentHero.background_overlay_opacity : 50}
                      onChange={(e) => {
                        const op = Number(e.target.value);
                        const color = `rgba(0, 0, 0, ${op / 100})`;
                        setCurrentHero({
                          ...currentHero,
                          background_overlay: op > 0 ? color : undefined,
                          background_overlay_opacity: op
                        });
                      }}
                      className="w-full accent-orange-600"
                    />
                  </div>
                )}
              </div>

              {/* Stats Counters */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-800">Stats Counters</label>
                  <span className="text-[10px] text-gray-500 font-bold">{(currentHero.stats || []).length} Metrics</span>
                </div>

                <div className="space-y-2">
                  {(currentHero.stats || []).map((st, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center gap-2">
                      <input
                        type="text"
                        value={st.val}
                        onChange={(e) => {
                          const updated = [...(currentHero.stats || [])];
                          updated[i] = { ...updated[i], val: e.target.value };
                          setCurrentHero({ ...currentHero, stats: updated });
                        }}
                        placeholder="+380%"
                        className="w-20 p-1.5 rounded-lg border border-gray-200 text-xs font-bold bg-white text-orange-600"
                      />
                      <input
                        type="text"
                        value={st.label}
                        onChange={(e) => {
                          const updated = [...(currentHero.stats || [])];
                          updated[i] = { ...updated[i], label: e.target.value };
                          setCurrentHero({ ...currentHero, stats: updated });
                        }}
                        placeholder="Metric label..."
                        className="flex-1 p-1.5 rounded-lg border border-gray-200 text-xs bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (currentHero.stats || []).filter((_, idx) => idx !== i);
                          setCurrentHero({ ...currentHero, stats: updated });
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
                    const updated = [...(currentHero.stats || [])];
                    updated.push({ val: '100%', label: 'Retention Rate' });
                    setCurrentHero({ ...currentHero, stats: updated });
                  }}
                  className="w-full py-2 rounded-xl border border-dashed border-orange-300 bg-orange-50/50 text-orange-600 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-100 transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stat Counter</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT SIDEBAR: ELEMENT SETTINGS (WHEN AN ELEMENT IS SELECTED) */}
        {!isEditingHero && selectedBlock && (
          <ElementSettingsSidebar
            block={selectedBlock}
            onUpdate={handleUpdateBlock}
            onClose={() => setSelectedBlockId(null)}
            onDelete={handleDeleteBlock}
            onDuplicate={handleDuplicateBlock}
            userRole={userRole}
          />
        )}
      </div>

      {/* DEDICATED SEO MANAGEMENT PANEL (SLIDE-OVER / MODAL) */}
      {isSEOPanelOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl h-[88vh] overflow-hidden rounded-3xl shadow-2xl flex flex-col">
            <div className="flex justify-end p-2 bg-gray-950">
              <button
                type="button"
                onClick={() => setIsSEOPanelOpen(false)}
                className="p-1.5 rounded-xl text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SEOPanel
                seoMeta={seoMeta}
                onChange={setSeoMeta}
                title={pageTitle}
                slug={pageSlug}
                onSlugChange={setPageSlug}
                blocks={blocks}
                heroTitle={currentHero?.title}
                heroHighlight={currentHero?.highlight_text}
                onAutoFixH1={handleAutoFixH1}
              />
            </div>
          </div>
        </div>
      )}

      {/* REVISIONS HISTORY MODAL */}
      <RevisionsModal
        isOpen={isRevisionsOpen}
        onClose={() => setIsRevisionsOpen(false)}
        revisions={revisions}
        onRestore={(rev) => {
          setBlocks(rev.blocks);
          setSeoMeta(rev.seo_meta);
          if (rev.hero_config) setCurrentHero(rev.hero_config);
          setSaveStatusNotice('Historical revision restored.');
          setTimeout(() => setSaveStatusNotice(null), 3000);
        }}
        pageTitle={pageTitle}
      />
    </div>
  );
};

// Default props helper for components
function getDefaultProps(compName: PageBlock['component_name']): Record<string, any> {
  switch (compName) {
    case 'Heading':
      return { level: 'h2', text: 'Engage Your Audience with Authority', alignment: 'left' };
    case 'Paragraph':
      return { text: 'Engineered for exponential ROI in competitive regional and national markets with data-driven precision.' };
    case 'Image':
      return {
        url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        alt: 'Sunraise digital agency capability preview'
      };
    case 'Video':
      return { url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', title: 'Sunraise Corporate Video' };
    case 'Button':
      return { text: 'Claim Free Strategy Session', url: '/contact', variant: 'primary', alignment: 'center' };
    case 'CTABanner':
      return {
        badge: 'READY TO SCALE?',
        title: 'Dominate Your Industry with High-Performance Digital Architectures',
        description: 'Connect with our principal architects in Hyderabad or Rajahmundry for a comprehensive strategy audit.',
        button_text: 'Claim Free Proposal',
        button_url: '/contact'
      };
    case 'FeatureGrid':
      return {
        title: 'Complete 360° Strategic Capabilities',
        description: 'Engineered for exponential ROI and rapid market authority.',
        features: [
          'Technical Core Web Vitals Optimization',
          'Google Business Profile 3-Pack Rank',
          'High-DA White-Hat PR Link Building',
          'Conversion Rate Optimization (CRO)'
        ]
      };
    case 'ProcessTimeline':
      return {
        title: 'Our 4-Stage Search Domination Protocol',
        steps: [
          { step: '01', title: 'Diagnostic Crawl Audit', desc: 'In-depth crawler analysis identifying crawl budget issues.' },
          { step: '02', title: 'On-Page Architecture', desc: 'Schema markup injection and semantic heading alignment.' },
          { step: '03', title: 'PR Authority Outreach', desc: 'High-authority digital PR link building.' },
          { step: '04', title: 'Revenue Telemetry', desc: 'GA4 funnel attribution and continuous conversion iteration.' }
        ]
      };
    case 'FAQAccordion':
      return {
        title: 'Frequently Asked Questions',
        faqs: [
          { q: 'How long until we see measurable search ranking gains?', a: 'Clients typically experience significant keyword momentum within 45 to 60 days following our technical overhaul.' },
          { q: 'Do you provide dedicated account management?', a: 'Yes! Our executive team directly conducts monthly in-person strategy reviews.' }
        ]
      };
    case 'PricingTable':
      return {
        title: 'Transparent Growth Packages',
        tiers: [
          { name: 'Starter Growth', price: '₹25,000', period: '/month', features: ['Google 3-Pack Rank', '15 Target Keywords', 'Monthly Report'] },
          { name: 'Enterprise Scale', price: '₹65,000', period: '/month', featured: true, features: ['Core Web Vitals Guarantee', '40 Keyword Clusters', 'Weekly War Rooms'] },
          { name: 'Custom Systems', price: 'Custom', period: 'Scope', features: ['Full Stack React Portal', '24/7 SLA Engineering Lead'] }
        ]
      };
    case 'KPICounter':
      return {
        stats: [
          { label: 'Organic Traffic Surge', val: '+380%' },
          { label: 'Keywords Page 1', val: '1,450+' },
          { label: 'Client Retention Rate', val: '98%' },
          { label: 'Years Serving AP & TS', val: '18+' }
        ]
      };
    case 'WhatsAppButton':
      return { text: 'Chat with Us on WhatsApp', phone: '+919123456789' };
    case 'ContactForm':
      return { title: 'Request Confidential Strategy Proposal', subtitle: 'Our senior architects respond within 24 business hours.' };
    case 'Breadcrumbs':
      return { current: 'Active Page' };
    case 'ThreeColumn':
      return {
        title: '',
        columns: [
          { id: `col-${Date.now()}-1`, title: 'Column 1', direction: 'col', elements: [] },
          { id: `col-${Date.now()}-2`, title: 'Column 2', direction: 'col', elements: [] },
          { id: `col-${Date.now()}-3`, title: 'Column 3', direction: 'col', elements: [] }
        ]
      };
    case 'TwoColumn':
      return {
        title: '',
        columns: [
          { id: `col-${Date.now()}-1`, title: 'Column 1', direction: 'col', elements: [] },
          { id: `col-${Date.now()}-2`, title: 'Column 2', direction: 'col', elements: [] }
        ]
      };
    case 'Grid':
      return {
        title: 'Engineered Growth Framework',
        columns: 4,
        items: [
          { title: 'Scalable Architecture', desc: 'React 19 & Cloud DB' },
          { title: 'Local 3-Pack Rank', desc: 'Google Maps Dominance' },
          { title: 'Zero Downtime', desc: '99.9% High Availability' },
          { title: 'Bespoke CMS', desc: 'Visual Drag & Drop Editing' }
        ]
      };
    case 'Container':
      return {
        badge: 'ENTERPRISE ARCHITECTURE',
        title: 'Flexible Content Section',
        content: 'Place your tailored messaging, badges, and announcements inside this responsive container.'
      };
    case 'SplitImageText':
    case 'ImageAndText':
      return {
        badge: 'STRATEGIC EXCELLENCE',
        title: 'Built for Speed, Scalability, and Search Domination',
        text: 'We merge rigorous engineering standards with cutting-edge marketing funnels to deliver verifiable commercial ROI.',
        image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80',
        bullets: ['Enterprise Performance Guarantee', 'Zero Downtime Deployment', 'Dedicated Senior Architect Lead']
      };
    case 'Testimonials':
      return {
        title: 'Trusted by Institutional Leaders',
        reviews: [
          {
            name: 'MAKSIM Infotech',
            role: 'Technology Operations',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            text: 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance.',
            rating: 5
          },
          {
            name: 'Hotel Jaya Residency',
            role: 'Hospitality Management',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            text: 'Direct bookings surged by 3.4x within five months of our local SEO campaign in Rajahmundry.',
            rating: 5
          }
        ]
      };
    case 'FAQSchemaBlock':
      return {
        schema_json: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'How do you ensure zero ranking regressions?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'We employ automated 301 redirects, persistent entity schema markup, and Google Search Console telemetry.'
              }
            }
          ]
        }, null, 2)
      };
    case 'ImageSlider':
      return {
        title: 'Featured Visual Gallery',
        subtitle: 'High-resolution showcase of recent creative and enterprise deployments.',
        autoplay: true,
        interval: 4,
        height: '420px',
        show_arrows: true,
        show_dots: true,
        overlay: 'gradient',
        slides: [
          {
            id: 'slide-1',
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
            title: 'Enterprise Architecture & Cloud Systems',
            caption: 'High-availability full-stack infrastructure for high-growth firms.',
            link_url: '/services/web-development',
            link_text: 'View Capability'
          },
          {
            id: 'slide-2',
            url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1200&q=80',
            title: 'Hyper-Targeted Performance Ad Engines',
            caption: 'Verified multi-channel media spend yielding exponential return on ad spend.',
            link_url: '/services/digital-marketing',
            link_text: 'Explore Strategy'
          },
          {
            id: 'slide-3',
            url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1200&q=80',
            title: 'Precision SEO & Local 3-Pack Authority',
            caption: 'Dominate organic search rankings in Hyderabad, Andhra Pradesh & pan-India.',
            link_url: '/services/seo-services-in-hyderabad',
            link_text: 'See Proof'
          }
        ]
      };
    case 'CardSlider':
      return {
        title: 'Strategic Solutions & Capabilities',
        subtitle: 'Explore our multi-disciplinary digital growth and engineering frameworks.',
        cards: [
          {
            id: 'card-1',
            badge: 'ENGINEERING',
            icon: 'Code2',
            title: 'Custom Web & Mobile Apps',
            description: 'React 19, TypeScript & microservice backends engineered for speed and conversion.',
            link_url: '/services/web-development',
            link_text: 'Learn More'
          },
          {
            id: 'card-2',
            badge: 'SEARCH RANK',
            icon: 'Search',
            title: 'Enterprise SEO Dominance',
            description: 'Algorithmic audits, local 3-pack dominance, and high-authority link velocity.',
            link_url: '/services/seo-services-in-hyderabad',
            link_text: 'Explore SEO'
          },
          {
            id: 'card-3',
            badge: 'PERFORMANCE',
            icon: 'TrendingUp',
            title: 'Targeted Performance Ads',
            description: 'Multi-platform funnel optimization across Google, Meta, and LinkedIn with high ROAS.',
            link_url: '/services/digital-marketing',
            link_text: 'View Funnels'
          },
          {
            id: 'card-4',
            badge: 'CREATIVE',
            icon: 'Sparkles',
            title: 'Brand Identity & UI/UX',
            description: 'Corporate visual systems that build instant trust and authority across all channels.',
            link_url: '/contact',
            link_text: 'Book Consult'
          }
        ]
      };
    case 'TextSlider':
      return {
        title: 'What Industry Leaders Say',
        subtitle: 'Direct feedback and verified milestones from our enterprise partners.',
        autoplay: true,
        interval: 5,
        items: [
          {
            id: 'item-1',
            badge: 'VERIFIED RESULT',
            quote: 'Direct organic bookings surged by 3.4x within five months of launching the localized SEO campaign in Rajahmundry. Their strategic execution is unmatched.',
            author: 'Executive Management',
            company: 'Hotel Jaya Residency',
            metric: '+340% Growth'
          },
          {
            id: 'item-2',
            badge: 'ENTERPRISE TECH',
            quote: 'Sunraise overhauled our core digital systems with zero business downtime. The speed, security, and responsive architecture are exceptional.',
            author: 'Head of Operations',
            company: 'MAKSIM Infotech',
            metric: '99.9% Uptime'
          },
          {
            id: 'item-3',
            badge: 'PERFORMANCE ADS',
            quote: 'Our ad spend efficiency improved dramatically. They managed ₹12Cr+ in ad budget delivering consistent high ROAS and qualified B2B leads.',
            author: 'Marketing Director',
            company: 'Commercial Systems Ltd',
            metric: '4.6x Average ROAS'
          }
        ]
      };
    case 'MarkupTags':
      return {
        badge: 'CORE COMPETENCIES',
        title: 'Technology Stack & Modern Frameworks',
        description: 'We build with modern, secure, and battle-tested industry standard technologies.',
        style_variant: 'gradient',
        alignment: 'center',
        tags: [
          { label: 'React 19 & TypeScript', category: 'Frontend' },
          { label: 'Next.js & Vite', category: 'Frontend' },
          { label: 'Tailwind CSS 4', category: 'Styling' },
          { label: 'PHP 8.2 & Node.js', category: 'Backend' },
          { label: 'MySQL & PostgreSQL', category: 'Database' },
          { label: 'Google 3-Pack Local SEO', category: 'Search' },
          { label: 'Core Web Vitals 95+', category: 'Performance' },
          { label: 'Meta & Google Ads API', category: 'Marketing' },
          { label: 'RESTful API Architecture', category: 'Backend' },
          { label: 'Enterprise Security & SSL', category: 'Cloud' }
        ]
      };
    default:
      return {};
  }
}
