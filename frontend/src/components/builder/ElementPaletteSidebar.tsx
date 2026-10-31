import React, { useState } from 'react';
import { PageBlock, BlockCategory } from '../../types';
import {
  Type,
  FileText,
  Image as ImageIcon,
  Video,
  MousePointerClick,
  Sparkles,
  Minus,
  MoveVertical,
  Code2,
  Box,
  Columns2,
  Columns3,
  LayoutGrid,
  Layers,
  Split,
  Briefcase,
  ListFilter,
  CheckCircle2,
  CreditCard,
  Megaphone,
  MessageSquareQuote,
  HelpCircle,
  BarChart3,
  Send,
  MessageCircle,
  Link,
  ChevronRight,
  Search,
  Plus,
  SlidersHorizontal,
  Tag,
  GalleryHorizontalEnd
} from 'lucide-react';

interface ElementPaletteSidebarProps {
  onAddBlock: (componentName: PageBlock['component_name'], category: BlockCategory) => void;
  onAddHtmlBlock: () => void;
  userRole?: string;
}

interface PaletteItem {
  id: string;
  name: PageBlock['component_name'];
  label: string;
  desc: string;
  category: BlockCategory;
  icon: React.FC<{ className?: string }>;
  restricted?: boolean;
}

export const ElementPaletteSidebar: React.FC<ElementPaletteSidebarProps> = ({
  onAddBlock,
  onAddHtmlBlock,
  userRole = 'super_admin'
}) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const paletteElements: PaletteItem[] = [
    // 1. Basic Elements
    { id: 'el-heading', name: 'Heading', label: 'Heading', desc: 'H1-H6 SEO headings', category: 'basic', icon: Type },
    { id: 'el-paragraph', name: 'Paragraph', label: 'Paragraph / Rich Text', desc: 'Clean descriptive text', category: 'basic', icon: FileText },
    { id: 'el-image', name: 'Image', label: 'Image', desc: 'Responsive media with alt tag', category: 'basic', icon: ImageIcon },
    { id: 'el-video', name: 'Video', label: 'Video Embed', desc: 'YouTube or MP4 player', category: 'basic', icon: Video },
    { id: 'el-button', name: 'Button', label: 'Button', desc: 'High-converting link CTA', category: 'basic', icon: MousePointerClick },
    { id: 'el-icon', name: 'Icon', label: 'Feature Icon', desc: 'Lucide SVG icon badge', category: 'basic', icon: Sparkles },
    { id: 'el-divider', name: 'Divider', label: 'Divider', desc: 'Horizontal rule separator', category: 'basic', icon: Minus },
    { id: 'el-spacer', name: 'Spacer', label: 'Spacer', desc: 'Custom vertical whitespace', category: 'basic', icon: MoveVertical },
    { id: 'el-tags', name: 'MarkupTags', label: 'Markup Tags & Chips', desc: 'Technology & skill badges', category: 'basic', icon: Tag },
    { id: 'el-html', name: 'RawHTML', label: 'HTML Embed / Custom Code', desc: 'Custom HTML injection with live render', category: 'basic', icon: Code2 },

    // 2. Layout Elements
    { id: 'el-container', name: 'Container', label: 'Boxed Container', desc: 'Standard width wrapper', category: 'layout', icon: Box },
    { id: 'el-two-col', name: 'TwoColumn', label: '2-Column Layout', desc: 'Split 50/50 responsive', category: 'layout', icon: Columns2 },
    { id: 'el-three-col', name: 'ThreeColumn', label: '3-Column Layout', desc: '3 feature columns', category: 'layout', icon: Columns3 },
    { id: 'el-grid', name: 'Grid', label: 'Card Grid (4-Col)', desc: 'Responsive cards grid', category: 'layout', icon: LayoutGrid },
    { id: 'el-split-img', name: 'SplitImageText', label: 'Image & Text Combo', desc: 'Editorial split feature', category: 'layout', icon: Split },
    { id: 'el-img-slider', name: 'ImageSlider', label: 'Image Slider', desc: 'Multi-slide media carousel with captions', category: 'layout', icon: GalleryHorizontalEnd },
    { id: 'el-card-slider', name: 'CardSlider', label: 'Card Slider', desc: 'Feature & service cards carousel', category: 'layout', icon: SlidersHorizontal },
    { id: 'el-text-slider', name: 'TextSlider', label: 'Text / Quote Slider', desc: 'Announcement ticker & client reviews', category: 'layout', icon: MessageSquareQuote },

    // 3. Business / Service Elements
    { id: 'el-features', name: 'FeatureGrid', label: 'Features Grid', desc: 'Specialized 360 capabilities', category: 'business', icon: CheckCircle2 },
    { id: 'el-process', name: 'ProcessTimeline', label: 'Process / Steps', desc: '4-stage deployment timeline', category: 'business', icon: ListFilter },
    { id: 'el-pricing', name: 'PricingTable', label: 'Pricing Table', desc: '3-tier service packages', category: 'business', icon: CreditCard },
    { id: 'el-cta', name: 'CTABanner', label: 'Call to Action Banner', desc: 'High-impact conversion strip', category: 'business', icon: Megaphone },
    { id: 'el-reviews', name: 'Testimonials', label: 'Testimonials / Reviews', desc: 'Client ratings & social proof', category: 'business', icon: MessageSquareQuote },
    { id: 'el-faq', name: 'FAQAccordion', label: 'FAQ Accordion', desc: 'Collapsible QA answers', category: 'business', icon: HelpCircle },
    { id: 'el-kpi', name: 'KPICounter', label: 'Statistics / Counters', desc: 'Dark metric counters', category: 'business', icon: BarChart3 },
    { id: 'el-contact-form', name: 'ContactForm', label: 'Inbound Contact Form', desc: 'Direct lead capture', category: 'business', icon: Send },
    { id: 'el-whatsapp', name: 'WhatsAppButton', label: 'WhatsApp Contact', desc: 'Instant chat CTA button', category: 'business', icon: MessageCircle },
    { id: 'el-breadcrumbs', name: 'Breadcrumbs', label: 'Breadcrumb Navigation', desc: 'Hierarchical links', category: 'business', icon: ChevronRight },

    // 4. SEO Elements
    { id: 'el-faq-schema', name: 'FAQSchemaBlock', label: 'FAQ Schema Block', desc: 'Google FAQ rich snippet', category: 'seo', icon: Code2 },
    { id: 'el-bc-schema', name: 'BreadcrumbSchema', label: 'Breadcrumb Schema', desc: 'JSON-LD breadcrumbs', category: 'seo', icon: Code2 },
    { id: 'el-local-schema', name: 'LocalBusinessSchema', label: 'Local Business Schema', desc: 'Hyderabad/AP geo entity', category: 'seo', icon: Briefcase }
  ];

  const filteredElements = paletteElements.filter((el) => {
    const matchesSearch =
      el.label.toLowerCase().includes(search.toLowerCase()) ||
      el.desc.toLowerCase().includes(search.toLowerCase());
    const matchesCat = activeCategory === 'all' || el.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categories = [
    { id: 'all', label: 'All Elements' },
    { id: 'basic', label: 'Basic' },
    { id: 'layout', label: 'Layout' },
    { id: 'business', label: 'Business' },
    { id: 'seo', label: 'SEO' }
  ];

  return (
    <div className="w-72 lg:w-80 bg-white border-r border-gray-200 flex flex-col h-full shrink-0 shadow-sm select-none z-20">
      {/* Top Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/70">
        <h3 className="font-extrabold text-gray-900 text-sm font-heading">
          Elements &amp; Section Palette
        </h3>
        <p className="text-[11px] text-gray-500 mt-0.5">
          Click or drag any block directly into the central live canvas.
        </p>

        {/* Search */}
        <div className="mt-3 relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search elements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:border-orange-500 bg-white"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="px-3.5 py-2 border-b border-gray-100 flex flex-wrap items-center gap-1.5 bg-gray-50/40 no-scrollbar">
        {categories.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveCategory(c.id)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
              activeCategory === c.id
                ? 'bg-orange-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 bg-white border border-gray-100'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Elements Grid List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filteredElements.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => {
                if (item.name === 'RawHTML') {
                  onAddHtmlBlock();
                } else {
                  onAddBlock(item.name, item.category);
                }
              }}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData(
                  'application/sunraise-component',
                  JSON.stringify({ name: item.name, category: item.category, label: item.label })
                );
                e.dataTransfer.setData('text/plain', item.name || 'FeatureGrid');
                e.dataTransfer.effectAllowed = 'copy';
              }}
              className="p-3 rounded-2xl border border-gray-100 bg-white hover:border-orange-300 hover:shadow-warm transition-all cursor-grab active:cursor-grabbing group flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-gray-900 group-hover:text-orange-600 transition">
                    {item.label}
                  </h5>
                  <p className="text-[10px] text-gray-400 line-clamp-1">{item.desc}</p>
                </div>
              </div>

              <div className="w-6 h-6 rounded-lg bg-gray-50 group-hover:bg-orange-50 text-gray-400 group-hover:text-orange-600 flex items-center justify-center transition shrink-0">
                <Plus className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
