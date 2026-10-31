import React, { useState, useEffect, useRef } from 'react';
import {
  BookOpen, Plus, Edit, Trash2, X, Sparkles, ExternalLink, Eye, Search,
  Filter, CheckSquare, Square, ArrowUpDown, Calendar, Clock, Image, Tag,
  Layers, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Globe, Share2,
  FileText, ArrowRight, UploadCloud, ChevronRight, Hash, Link as LinkIcon,
  RotateCcw, Monitor, Smartphone, Check, AlertTriangle, ArrowUpRight, ArrowLeft,
  Grid, List
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Blog, Service, BlogCategory, BlogAnalytics } from '../../types';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

export const AdminBlogs: React.FC = () => {
  // Tabs: 'manage' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'manage' | 'dashboard'>('manage');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Core Data
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [analytics, setAnalytics] = useState<BlogAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search for Manage Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'title'>('newest');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Compose / Edit Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  const [formCategory, setFormCategory] = useState('SEO & Organic Growth');
  const [formServiceCode, setFormServiceCode] = useState('SRV-SEO-01');
  const [formExcerpt, setFormExcerpt] = useState('');
  const [formContentHtml, setFormContentHtml] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formImageAlt, setFormImageAlt] = useState('');
  const [formImageCaption, setFormImageCaption] = useState('');
  const [formImageFocal, setFormImageFocal] = useState<'center' | 'top' | 'bottom'>('center');
  const [formTags, setFormTags] = useState<string[]>(['SEO', 'Growth', 'Digital Strategy']);
  const [tagInput, setTagInput] = useState('');
  const [formAuthor, setFormAuthor] = useState('Sunraise Editorial Team');
  const [formStatus, setFormStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [formScheduledAt, setFormScheduledAt] = useState('');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // In-Post Advanced SEO Suite State
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');
  const [formRobots, setFormRobots] = useState('index, follow');
  const [formOgTitle, setFormOgTitle] = useState('');
  const [formOgDesc, setFormOgDesc] = useState('');
  const [formOgImage, setFormOgImage] = useState('');

  // Internal Link Helper
  const [selectedArticleLink, setSelectedArticleLink] = useState('');
  const [selectedCategoryLink, setSelectedCategoryLink] = useState('');
  const [selectedPageLink, setSelectedPageLink] = useState('');

  // UI Modals & Editor Controls
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingPost, setSavingPost] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState('All changes saved');
  const [editorViewMode, setEditorViewMode] = useState<'write' | 'preview' | 'split'>('write');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedDraftFound, setSavedDraftFound] = useState<{ title: string; timestamp: string } | null>(null);

  const slugCheckTimeout = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const editorTextareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  useEffect(() => {
    loadAllData();
    checkForLocalDraft();
  }, []);

  // Autosave to localStorage
  useEffect(() => {
    if (!isDirty || editingId) return;
    const timer = setTimeout(() => {
      if (formTitle.trim()) {
        const draftData = {
          title: formTitle,
          slug: formSlug,
          category: formCategory,
          excerpt: formExcerpt,
          content: formContentHtml,
          coverImage: formCoverImage,
          tags: formTags,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        localStorage.setItem('sunraise_blogger_draft', JSON.stringify(draftData));
        setAutosaveStatus(`Draft autosaved at ${draftData.timestamp}`);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [formTitle, formSlug, formExcerpt, formContentHtml, formCoverImage, formTags, isDirty, editingId]);

  const checkForLocalDraft = () => {
    try {
      const raw = localStorage.getItem('sunraise_blogger_draft');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.title) {
          setSavedDraftFound({ title: parsed.title, timestamp: parsed.timestamp || 'earlier' });
        }
      }
    } catch (e) {}
  };

  // Lock background scroll when update studio is open
  useEffect(() => {
    if (isEditorOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isEditorOpen]);

  const restoreSavedDraft = () => {
    try {
      const raw = localStorage.getItem('sunraise_blogger_draft');
      if (raw) {
        const d = JSON.parse(raw);
        setFormTitle(d.title || '');
        setFormSlug(d.slug || '');
        setFormCategory(d.category || 'SEO & Organic Growth');
        setFormExcerpt(d.excerpt || '');
        setFormContentHtml(d.content || '');
        setFormCoverImage(d.coverImage || '');
        setFormTags(d.tags || []);
        setSavedDraftFound(null);
        setIsDirty(true);
        setIsEditorOpen(true);
        showToast('Autosaved draft restored successfully!');
      }
    } catch (e) {}
  };

  const discardSavedDraft = () => {
    localStorage.removeItem('sunraise_blogger_draft');
    setSavedDraftFound(null);
    showToast('Saved draft discarded.');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allBlogs, allServices, allCats, stats] = await Promise.all([
        SunraiseAPI.getBlogs({ include_drafts: true }),
        SunraiseAPI.getServices(),
        SunraiseAPI.getCategories(),
        SunraiseAPI.getBlogAnalytics()
      ]);
      setBlogs(allBlogs);
      setServices(allServices);
      setCategories(allCats);
      setAnalytics(stats);
    } catch (e) {
      console.error('Error loading blogs:', e);
    } finally {
      setLoading(false);
    }
  };

  // Slug generator helper
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Title change -> Auto-slug if not manual
  const handleTitleChange = (val: string) => {
    setFormTitle(val);
    setIsDirty(true);
    if (!isSlugManual && !editingId) {
      const s = generateSlug(val);
      setFormSlug(s);
      verifySlug(s, editingId || undefined);
    }
    if (!formMetaTitle) {
      setFormMetaTitle(`${val} | Sunraise Solutions`);
    }
    if (!formOgTitle) {
      setFormOgTitle(val);
    }
  };

  // Verify slug availability
  const verifySlug = (slugToTest: string, currentId?: number) => {
    if (!slugToTest) {
      setIsSlugAvailable(null);
      return;
    }
    if (slugCheckTimeout.current) {
      clearTimeout(slugCheckTimeout.current);
    }
    setCheckingSlug(true);
    slugCheckTimeout.current = window.setTimeout(async () => {
      try {
        const available = await SunraiseAPI.checkBlogSlug(slugToTest, currentId);
        setIsSlugAvailable(available);
      } catch (e) {
        setIsSlugAvailable(true);
      } finally {
        setCheckingSlug(false);
      }
    }, 400);
  };

  // Reset form
  const resetForm = () => {
    setEditingId(null);
    setFormTitle('');
    setFormSlug('');
    setIsSlugManual(false);
    setIsSlugAvailable(null);
    setFormCategory(categories[0]?.name || 'SEO & Organic Growth');
    setFormServiceCode('SRV-SEO-01');
    setFormExcerpt('');
    setFormContentHtml('');
    setFormCoverImage('');
    setFormImageAlt('');
    setFormImageCaption('');
    setFormImageFocal('center');
    setFormTags(['SEO', 'Growth', 'Digital Strategy']);
    setTagInput('');
    setFormAuthor('Sunraise Editorial Team');
    setFormStatus('published');
    setFormScheduledAt('');
    setFormIsFeatured(false);
    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormKeywords('');
    setFormCanonicalUrl('');
    setFormRobots('index, follow');
    setFormOgTitle('');
    setFormOgDesc('');
    setFormOgImage('');
    setIsDirty(false);
    setAutosaveStatus('All changes saved');
  };

  // Start Edit
  const handleStartEdit = (b: Blog) => {
    setEditingId(b.id);
    setFormTitle(b.title);
    setFormSlug(b.slug);
    setIsSlugManual(true);
    setIsSlugAvailable(true);
    setFormCategory(b.category || 'SEO & Organic Growth');
    setFormServiceCode(b.service_code || 'SRV-SEO-01');
    setFormExcerpt(b.excerpt || '');
    setFormCoverImage(b.cover_image || '');
    setFormImageAlt(b.image_alt || '');
    setFormImageCaption(b.image_caption || '');
    setFormImageFocal('center');

    // Extract tags
    if (b.tags) {
      const parsed = b.tags.split(',').map(t => t.trim()).filter(Boolean);
      setFormTags(parsed);
    } else {
      setFormTags([]);
    }

    setFormAuthor(b.author || 'Sunraise Editorial Team');
    setFormStatus(b.status || (b.is_published ? 'published' : 'draft'));
    setFormScheduledAt(b.scheduled_at ? b.scheduled_at.replace(' ', 'T').substring(0, 16) : '');
    setFormIsFeatured(!!b.is_featured);

    // Extract HTML
    if (b.content_html) {
      setFormContentHtml(b.content_html);
    } else if (b.content_blocks && b.content_blocks.length > 0) {
      const joined = b.content_blocks.map(cb => cb.html_content || '').join('\n');
      setFormContentHtml(joined);
    } else {
      setFormContentHtml('');
    }

    setFormMetaTitle(b.seo_meta?.meta_title || `${b.title} | Sunraise Solutions`);
    setFormMetaDesc(b.seo_meta?.meta_description || b.excerpt || '');
    setFormKeywords(b.seo_meta?.keywords || '');
    setFormCanonicalUrl(b.seo_meta?.canonical_url || `https://sunraisesolutions.com/blog/${b.slug}`);
    setFormRobots('index, follow');
    setFormOgTitle(b.title);
    setFormOgDesc(b.excerpt || '');
    setFormOgImage(b.cover_image || '');

    setIsDirty(false);
    setAutosaveStatus('Editing active article');
    setIsEditorOpen(true);
  };

  // Start Create New Post
  const handleStartCreate = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  // Close Editor and return to Admin Panel
  const handleCloseEditor = () => {
    if (isDirty) {
      const confirmLeave = window.confirm(
        'You have unsaved modifications in this article. Are you sure you want to go back to the admin panel?'
      );
      if (!confirmLeave) return;
    }
    setIsEditorOpen(false);
    resetForm();
  };

  // Thumbnail File Upload with Dual Support
  const handleUploadFile = async (file: File) => {
    if (!file) return;
    try {
      setUploadingImage(true);
      const res = await SunraiseAPI.uploadMedia(file);
      setFormCoverImage(res.url);
      if (!formOgImage) setFormOgImage(res.url);
      setIsDirty(true);
      showToast('Thumbnail image uploaded successfully!');
    } catch (err: any) {
      alert(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUploadFile(file);
  };

  // Tag helper
  const handleAddTag = () => {
    const t = tagInput.trim().replace(/^#+/, '');
    if (t && !formTags.includes(t)) {
      setFormTags([...formTags, t]);
      setTagInput('');
      setIsDirty(true);
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormTags(formTags.filter(x => x !== tag));
    setIsDirty(true);
  };

  // Add Category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      const res = await SunraiseAPI.createCategory(newCategoryName.trim());
      setCategories([...categories, { id: res.id, name: res.name, slug: res.slug, post_count: 0 }]);
      setFormCategory(res.name);
      setNewCategoryName('');
      setCategoryModalOpen(false);
      showToast(`Category "${res.name}" created!`);
    } catch (err: any) {
      alert(err.message || 'Failed to create category');
    }
  };

  // Internal Link Helper: Insert link at cursor
  const handleInsertLinkToEditor = (url: string, label: string) => {
    if (!url) return;
    const linkHtml = `<a href="${url}" class="text-orange-600 font-bold hover:underline" title="${label}">${label}</a>`;
    const textarea = editorTextareaRef.current;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = formContentHtml.substring(0, start);
      const after = formContentHtml.substring(end);
      const updated = before + linkHtml + after;
      setFormContentHtml(updated);
      setIsDirty(true);
      showToast(`Inserted link to "${label}"`);
    } else {
      setFormContentHtml(prev => prev + '\n' + linkHtml);
      setIsDirty(true);
      showToast(`Inserted link to "${label}"`);
    }
  };

  // Quick formatting buttons for editor
  const handleFormatText = (openTag: string, closeTag: string = '') => {
    const textarea = editorTextareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formContentHtml.substring(start, end) || 'Sample text';
    const before = formContentHtml.substring(0, start);
    const after = formContentHtml.substring(end);
    const updated = `${before}${openTag}${selected}${closeTag}${after}`;
    setFormContentHtml(updated);
    setIsDirty(true);
  };

  // Save Post
  const handleSavePost = async () => {
    if (!formTitle.trim()) {
      alert('Article title is required');
      return;
    }
    const finalSlug = formSlug.trim() || generateSlug(formTitle);

    try {
      setSavingPost(true);
      const payload: Partial<Blog> = {
        id: editingId || undefined,
        title: formTitle.trim(),
        slug: finalSlug,
        category: formCategory,
        service_code: formServiceCode || null,
        excerpt: formExcerpt.trim(),
        cover_image: formCoverImage,
        image_alt: formImageAlt,
        image_caption: formImageCaption,
        tags: formTags.join(', '),
        author: formAuthor,
        status: formStatus,
        scheduled_at: formStatus === 'scheduled' ? formScheduledAt : null,
        is_featured: formIsFeatured,
        content_html: formContentHtml,
        content_blocks: [
          {
            id: 'blk-html-' + Date.now(),
            type: 'html',
            sort_order: 1,
            html_content: formContentHtml
          }
        ],
        seo_meta: {
          meta_title: formMetaTitle || `${formTitle} | Sunraise Solutions`,
          meta_description: formMetaDesc || formExcerpt,
          keywords: formKeywords || formTags.join(', '),
          canonical_url: formCanonicalUrl || `https://sunraisesolutions.com/blog/${finalSlug}`,
          og_image: formOgImage || formCoverImage
        }
      };

      await SunraiseAPI.upsertBlog(payload);
      localStorage.removeItem('sunraise_blogger_draft');
      await loadAllData();
      setIsDirty(false);
      showToast(editingId ? 'Article updated successfully!' : 'Article published successfully!');
      setIsEditorOpen(false);
      setActiveTab('manage');
    } catch (err: any) {
      alert(err.message || 'Failed to save blog post');
    } finally {
      setSavingPost(false);
    }
  };

  // Bulk Actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredBlogs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredBlogs.map(b => b.id));
    }
  };

  const toggleSelectId = (id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleBulkOperation = async (op: 'publish' | 'draft' | 'delete') => {
    if (selectedIds.length === 0) return;
    if (op === 'delete' && !confirm(`Permanently delete ${selectedIds.length} articles?`)) {
      return;
    }

    try {
      setBulkLoading(true);
      await SunraiseAPI.bulkActionBlogs(selectedIds, op);
      setSelectedIds([]);
      await loadAllData();
      showToast(`Bulk operation "${op}" completed for ${selectedIds.length} articles.`);
    } catch (e: any) {
      alert(e.message || 'Bulk action failed');
    } finally {
      setBulkLoading(false);
    }
  };

  // Single delete
  const handleDeletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    try {
      await SunraiseAPI.deleteBlog(id);
      await loadAllData();
      showToast('Article deleted successfully.');
    } catch (e: any) {
      alert(e.message || 'Delete failed');
    }
  };

  // Quick status toggle (Save action on card)
  const handleTogglePublish = async (b: Blog) => {
    try {
      const newStatus = b.status === 'published' ? 'draft' : 'published';
      await SunraiseAPI.upsertBlog({
        id: b.id,
        title: b.title,
        slug: b.slug,
        status: newStatus
      });
      await loadAllData();
      showToast(newStatus === 'published' ? `"${b.title}" published!` : `"${b.title}" saved to drafts.`);
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    }
  };

  // Word count and reading time calculation
  const wordCount = formContentHtml.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  // Filtered and sorted blogs
  const filteredBlogs = blogs.filter((b) => {
    if (selectedCategory !== 'all' && b.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && b.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = b.title.toLowerCase().includes(q);
      const matchExcerpt = (b.excerpt || '').toLowerCase().includes(q);
      const matchTags = (b.tags || '').toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchTags) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'oldest') return a.id - b.id;
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    return b.id - a.id;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-gray-950 text-white rounded-2xl shadow-2xl border border-orange-500/30 flex items-center gap-3 text-xs font-bold animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Clean Minimal Header Bar (Removed verbose publishing studio message & bulky compose button) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-5 rounded-3xl bg-white border border-gray-100 shadow-warm">
        <div>
          <h1 className="text-xl font-black text-gray-950 font-heading flex items-center gap-2">
            <span>Blog Posts &amp; Stories</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-100 text-orange-700">
              {blogs.length}
            </span>
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your articles, track engagement, and publish stories.
          </p>
        </div>

        {/* Global Tab Navigation */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'manage' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Articles Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Overview &amp; Stats</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recovered Autosaved Draft Banner */}
      {savedDraftFound && !editingId && !isEditorOpen && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-4 h-4 text-amber-600" />
            <span>
              An autosaved draft from <strong>{savedDraftFound.timestamp}</strong> ("{savedDraftFound.title}") was recovered.
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={restoreSavedDraft}
              className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-xs transition"
            >
              Resume Draft
            </button>
            <button
              onClick={discardSavedDraft}
              className="px-3 py-1.5 text-amber-700 hover:underline font-bold text-xs"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* ================= TAB 1: DASHBOARD OVERVIEW ================= */}
      {activeTab === 'dashboard' && analytics && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Articles</div>
              <div className="text-3xl font-black text-gray-950 mt-1">{analytics.total_posts}</div>
              <div className="text-[10px] text-gray-500 mt-1">Published editorial library</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Reads / Views</div>
              <div className="text-3xl font-black text-orange-600 mt-1">{analytics.total_views.toLocaleString()}</div>
              <div className="text-[10px] text-gray-500 mt-1">Verified organic impressions</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Live Published</div>
              <div className="text-3xl font-black text-emerald-600 mt-1">{analytics.status_counts.published}</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1">Publicly indexed &amp; visible</div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Drafts &amp; Scheduled</div>
              <div className="text-3xl font-black text-amber-600 mt-1">
                {analytics.status_counts.draft + analytics.status_counts.scheduled}
              </div>
              <div className="text-[10px] text-gray-500 mt-1">
                {analytics.status_counts.scheduled} scheduled, {analytics.status_counts.draft} in draft
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm">
            <h3 className="font-heading font-black text-gray-900 text-base mb-4">
              Category Distribution
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.category_breakdown.map((cat) => (
                <div key={cat.category} className="p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="text-xs font-bold text-gray-800 truncate">{cat.category}</div>
                  <div className="text-xl font-black text-orange-600 mt-1">{cat.count} Posts</div>
                  <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-orange-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, (cat.count / Math.max(1, analytics.total_posts)) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: MANAGE POSTS ================= */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-warm flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search articles by title, excerpt or tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Drafts</option>
              <option value="scheduled">Scheduled</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="views">Sort: Most Read</option>
              <option value="title">Sort: Title A-Z</option>
            </select>

            {/* View Mode Toggle: Cards vs Table */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-2xl border border-gray-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'grid' ? 'bg-white text-orange-600 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Instagram Post Cards"
              >
                <Grid className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline">Cards</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  viewMode === 'table' ? 'bg-white text-orange-600 shadow-2xs' : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Table List"
              >
                <List className="w-4 h-4" />
                <span className="text-[11px] hidden sm:inline">List</span>
              </button>
            </div>
          </div>

          {/* Bulk Operations Toolbar */}
          {selectedIds.length > 0 && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between text-xs font-bold text-orange-950 animate-in fade-in">
              <span className="px-2">{selectedIds.length} Articles Selected</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleBulkOperation('publish')}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-orange-300 text-emerald-700 hover:bg-emerald-50 transition"
                >
                  Bulk Publish
                </button>
                <button
                  onClick={() => handleBulkOperation('draft')}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-orange-300 text-amber-700 hover:bg-amber-50 transition"
                >
                  Bulk Draft
                </button>
                <button
                  onClick={() => handleBulkOperation('delete')}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-red-300 text-red-600 hover:bg-red-50 transition"
                >
                  Bulk Delete
                </button>
              </div>
            </div>
          )}

          {/* INSTAGRAM POST CARDS FEED (DEFAULT VIEW) */}
          {viewMode === 'grid' ? (
            loading ? (
              <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-warm">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-orange-500" />
                <span>Loading your stories...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Instagram-Style "+ Create New Blog" Card */}
                <div
                  onClick={handleStartCreate}
                  className="border-2 border-dashed border-gray-300 hover:border-orange-500 bg-white hover:bg-orange-50/20 rounded-3xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[420px] group shadow-warm hover:shadow-lg"
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xs">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-black text-gray-900 text-base group-hover:text-orange-600 transition">
                    Create New Blog
                  </h4>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-[220px] leading-relaxed">
                    Draft a fresh story, add rich visual content, configure SEO, and publish
                  </p>
                  <span className="mt-5 px-5 py-2.5 rounded-xl bg-orange-600 group-hover:bg-orange-700 text-white font-black text-xs shadow-sunraise transition flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Compose Story</span>
                  </span>
                </div>

                {/* 2. Blog Post Cards (Instagram Post Card Layout) */}
                {filteredBlogs.map((b) => (
                  <div
                    key={b.id}
                    className="bg-white rounded-3xl border border-gray-100 shadow-warm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                  >
                    {/* Header: Author, Date, Category & Status */}
                    <div className="p-4 flex items-center justify-between border-b border-gray-50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-2xs shrink-0">
                          <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                            {b.cover_image ? (
                              <img src={b.cover_image} alt={b.author || 'Author'} className="w-full h-full object-cover rounded-full" />
                            ) : (
                              <div className="w-full h-full rounded-full bg-orange-100 text-orange-600 font-black text-xs flex items-center justify-center">
                                {(b.author || 'Sunraise').charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                            <span className="truncate">{b.author || 'Sunraise Team'}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                            <span className="text-[11px] text-gray-400 font-normal shrink-0">
                              {b.created_at ? new Date(b.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'Recent'}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono truncate max-w-[170px]">
                            /blog/{b.slug}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
                          {b.category || 'General'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          b.status === 'published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : b.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {b.status || 'published'}
                        </span>
                      </div>
                    </div>

                    {/* Media / Featured Image (Aspect 16:9 with smooth zoom) */}
                    <div
                      className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer"
                      onClick={() => handleStartEdit(b)}
                    >
                      {b.cover_image ? (
                        <img
                          src={b.cover_image}
                          alt={b.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-500 to-rose-500 flex flex-col items-center justify-center p-6 text-white text-center">
                          <BookOpen className="w-10 h-10 mb-2 opacity-80" />
                          <span className="font-bold text-xs opacity-90 line-clamp-2">{b.title}</span>
                        </div>
                      )}

                      {/* Reads Counter overlay on image */}
                      <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                        <Eye className="w-3.5 h-3.5 text-orange-400" />
                        <span>{(b.views || 0).toLocaleString()} reads</span>
                      </div>
                    </div>

                    {/* Caption Body */}
                    <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                      <div>
                        <h3
                          onClick={() => handleStartEdit(b)}
                          className="font-bold text-gray-900 text-sm hover:text-orange-600 transition cursor-pointer line-clamp-2 leading-snug font-heading"
                          title={b.title}
                        >
                          {b.title}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                          {b.excerpt || 'No summary excerpt provided for this article.'}
                        </p>

                        {/* Hashtags */}
                        <div className="flex flex-wrap gap-1 mt-2.5">
                          {b.tags ? (
                            b.tags.split(',').slice(0, 3).map((tag, idx) => (
                              <span key={idx} className="text-[11px] font-bold text-orange-600 hover:underline">
                                #{tag.trim()}
                              </span>
                            ))
                          ) : (
                            <span className="text-[11px] text-gray-400 font-semibold">#Sunraise #Insights</span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons at the Bottom (Edit, Save, Go, Delete) */}
                      <div className="pt-3 border-t border-gray-100 grid grid-cols-4 gap-1.5 text-xs font-bold">
                        {/* 1. Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleStartEdit(b)}
                          className="py-2 px-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 transition flex items-center justify-center gap-1 shadow-2xs group/btn"
                          title="Edit Article"
                        >
                          <Edit className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                          <span className="text-[11px]">Edit</span>
                        </button>

                        {/* 2. Save / Quick Toggle Status Button */}
                        <button
                          type="button"
                          onClick={() => handleTogglePublish(b)}
                          className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-2xs group/btn ${
                            b.status === 'published'
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-700'
                          }`}
                          title={b.status === 'published' ? 'Saved (Click to switch to Draft)' : 'Draft (Click to Publish)'}
                        >
                          <Check className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                          <span className="text-[11px]">{b.status === 'published' ? 'Saved' : 'Save'}</span>
                        </button>

                        {/* 3. Go Button (View Public Article) */}
                        <a
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="py-2 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition flex items-center justify-center gap-1 shadow-2xs group/btn text-center"
                          title="Go to Live Article"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-gray-500" />
                          <span className="text-[11px]">Go</span>
                        </a>

                        {/* 4. Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeletePost(b.id)}
                          className="py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition flex items-center justify-center gap-1 shadow-2xs group/btn"
                          title="Delete Article"
                        >
                          <Trash2 className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                          <span className="text-[11px]">Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            /* Table View */
            <div className="bg-white rounded-3xl border border-gray-100 shadow-warm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-50/80 text-gray-500 uppercase tracking-wider font-extrabold border-b border-gray-100">
                    <tr>
                      <th className="py-3.5 px-4 w-10">
                        <button onClick={handleSelectAll} className="text-gray-400 hover:text-gray-900">
                          {selectedIds.length > 0 && selectedIds.length === filteredBlogs.length ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Article Details</th>
                      <th className="py-3.5 px-4">Category</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Author</th>
                      <th className="py-3.5 px-4 text-center">Reads</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                          <span>Loading articles...</span>
                        </td>
                      </tr>
                    ) : filteredBlogs.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          No articles found. Click "Create New Blog" to draft one.
                        </td>
                      </tr>
                    ) : (
                      filteredBlogs.map((b) => {
                        const isSelected = selectedIds.includes(b.id);
                        return (
                          <tr
                            key={b.id}
                            className={`hover:bg-gray-50/80 transition ${isSelected ? 'bg-orange-50/40' : ''}`}
                          >
                            <td className="py-3.5 px-4">
                              <button onClick={() => toggleSelectId(b.id)} className="text-gray-400 hover:text-gray-900">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-orange-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {b.cover_image && (
                                  <img
                                    src={b.cover_image}
                                    alt={b.title}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                                  />
                                )}
                                <div>
                                  <div className="font-bold text-gray-900 hover:text-orange-600 cursor-pointer" onClick={() => handleStartEdit(b)}>
                                    {b.title}
                                  </div>
                                  <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                                    /blog/{b.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-gray-100 text-gray-700">
                                {b.category}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  b.status === 'published'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : b.status === 'scheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {b.status || 'published'}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-gray-600 text-[11px] font-medium">
                              {b.author || 'Sunraise Team'}
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-gray-800">
                              {(b.views || 0).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={`/blog/${b.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
                                  title="View Public Article"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  onClick={() => handleStartEdit(b)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                  title="Edit Article"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeletePost(b.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                  title="Delete Article"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= DEDICATED FULL-SCREEN UPDATE STUDIO / SEPARATE BOX ================= */}
      {/* On this page everything else in the admin panel is hidden, with a Back button to return */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 bg-[#F6F8FA] overflow-y-auto flex flex-col animate-in fade-in duration-200">
          {/* Centered Structured Top Navbar Menu (Not stretching to edges, with rounded-b-[10px]) */}
          <div className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-[1400px] mx-auto">
              <header className="bg-white/95 backdrop-blur-md border-b border-x border-gray-200/90 rounded-b-[10px] shadow-sm px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
                {/* Back to Admin Panel button & Info */}
                <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                  <button
                    type="button"
                    onClick={handleCloseEditor}
                    className="group inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-gray-100 hover:bg-orange-50 text-gray-800 hover:text-orange-600 font-bold text-xs transition border border-gray-200 hover:border-orange-200 shadow-2xs shrink-0"
                    title="Return to Admin Panel"
                  >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 text-gray-600 group-hover:text-orange-600" />
                    <span>Back to Admin Panel</span>
                  </button>

                  <div className="h-6 w-px bg-gray-200 hidden sm:block shrink-0" />

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider shrink-0 ${
                        editingId ? 'bg-blue-100 text-blue-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {editingId ? `Update Mode #${editingId}` : 'New Article Studio'}
                      </span>
                      <span className="text-xs font-bold text-gray-900 truncate max-w-xs sm:max-w-md lg:max-w-xl">
                        {formTitle || 'Untitled Story'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5 flex-wrap">
                      <span className="font-mono text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                        {editingId ? `/blog/${formSlug || 'slug'}` : 'Drafting new story'}
                      </span>
                      <span>•</span>
                      <span className={`font-semibold shrink-0 ${isDirty ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {autosaveStatus}
                      </span>
                      <span>•</span>
                      <span className="shrink-0">{wordCount} words ({readingTime} min read)</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    className="px-3.5 py-2 rounded-lg bg-white hover:bg-orange-50 border border-gray-200 hover:border-orange-200 text-gray-700 hover:text-orange-600 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-orange-600" />
                    <span>Live Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleSavePost}
                    disabled={savingPost}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-105 text-white text-xs font-extrabold shadow-sunraise flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {savingPost ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingId ? 'Update Article' : 'Publish Article'}</span>
                      </>
                    )}
                  </button>
                </div>
              </header>
            </div>
          </div>

          {/* Dedicated Full Workspace Container - Properly utilizes 1400px site width */}
          <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6 flex-1">
            {/* Two-Column Responsive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* LEFT COLUMN: Main Editorial Content & In-Post SEO (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Headline & Story Identity Panel */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shadow-2xs">
                        H1
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                          Story Headline &amp; Identity Panel
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          Primary article title, custom permanent URL, and summary excerpt
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        formTitle.length >= 40 && formTitle.length <= 70
                          ? 'bg-emerald-100 text-emerald-800'
                          : formTitle.length > 70
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {formTitle.length} / 100 Chars (Ideal: 40-70)
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-800 block mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Why Technical SEO Drives 380% More Qualified Leads for Hyderabad Enterprises"
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-base font-bold text-gray-950 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  {/* Custom Slug with Live Availability */}
                  <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-center gap-2 text-xs">
                    <span className="font-bold text-gray-500 shrink-0">Permalink:</span>
                    <span className="text-gray-400 font-mono shrink-0">/blog/</span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => {
                        setFormSlug(generateSlug(e.target.value));
                        setIsSlugManual(true);
                        verifySlug(e.target.value, editingId || undefined);
                      }}
                      placeholder="article-url-slug"
                      className="flex-1 bg-transparent font-mono font-bold text-gray-900 outline-none"
                    />
                    {checkingSlug ? (
                      <span className="text-[10px] text-gray-400 shrink-0">checking...</span>
                    ) : isSlugAvailable === false ? (
                      <span className="text-[10px] font-bold text-red-500 shrink-0">In use</span>
                    ) : isSlugAvailable === true ? (
                      <span className="text-[10px] font-bold text-emerald-600 shrink-0">✓ Available</span>
                    ) : null}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-extrabold text-gray-800">
                        Summary Excerpt *
                      </label>
                      <span className="text-[11px] text-gray-400 font-bold">
                        {formExcerpt.length} / 250 Chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Provide a concise 1-2 sentence executive overview for search snippets and blog cards..."
                      value={formExcerpt}
                      onChange={(e) => {
                        setFormExcerpt(e.target.value);
                        setIsDirty(true);
                        if (!formMetaDesc) setFormMetaDesc(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:bg-white focus:border-orange-500 resize-none transition"
                    />
                  </div>
                </div>

              {/* Internal Link Helper (AmazingAP Parity) */}
              <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm space-y-3">
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-orange-600" />
                  <span className="text-xs font-extrabold text-gray-900">
                    Internal Link Helper
                  </span>
                  <span className="text-[11px] text-gray-400">
                    — Insert contextual SEO hyperlinks directly into your article
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Link to existing article */}
                  <select
                    value={selectedArticleLink}
                    onChange={(e) => {
                      setSelectedArticleLink(e.target.value);
                      if (e.target.value) {
                        const found = blogs.find(b => b.slug === e.target.value);
                        if (found) handleInsertLinkToEditor(`/blog/${found.slug}`, found.title);
                        setSelectedArticleLink('');
                      }
                    }}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                  >
                    <option value="">-- Link to Existing Article --</option>
                    {blogs.map(b => (
                      <option key={b.slug} value={b.slug}>{b.title.substring(0, 36)}...</option>
                    ))}
                  </select>

                  {/* Link to Category */}
                  <select
                    value={selectedCategoryLink}
                    onChange={(e) => {
                      setSelectedCategoryLink(e.target.value);
                      if (e.target.value) {
                        handleInsertLinkToEditor(`/blog?category=${encodeURIComponent(e.target.value)}`, e.target.value);
                        setSelectedCategoryLink('');
                      }
                    }}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                  >
                    <option value="">-- Link to Category --</option>
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>

                  {/* Link to Site Page */}
                  <select
                    value={selectedPageLink}
                    onChange={(e) => {
                      setSelectedPageLink(e.target.value);
                      if (e.target.value) {
                        const labels: Record<string, string> = {
                          '/': 'Sunraise Solutions Home',
                          '/about': 'About Sunraise',
                          '/services': 'Services Catalog',
                          '/hms-software': 'Hospital Management System (HMS)',
                          '/portfolio': 'Client Case Studies',
                          '/contact': 'Consultation & Contact'
                        };
                        handleInsertLinkToEditor(e.target.value, labels[e.target.value] || 'Learn More');
                        setSelectedPageLink('');
                      }
                    }}
                    className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                  >
                    <option value="">-- Link to Site Page --</option>
                    <option value="/">Home Page (/)</option>
                    <option value="/about">About Us (/about)</option>
                    <option value="/services">Services Catalog (/services)</option>
                    <option value="/hms-software">HMS Software Portal (/hms-software)</option>
                    <option value="/portfolio">Case Studies (/portfolio)</option>
                    <option value="/contact">Contact &amp; Audit (/contact)</option>
                  </select>
                </div>
              </div>

              {/* Rich Content Editor (AmazingAP Visual WYSIWYG) */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-gray-900 block">
                      Article Content &amp; HTML Body *
                    </span>
                    <span className="text-[11px] text-gray-500">
                      Visual WYSIWYG canvas with live formatting, headings, inline image uploads, tables, embeds, and HTML source toggle.
                    </span>
                  </div>
                </div>

                <RichTextEditor
                  value={formContentHtml}
                  onChange={(html) => {
                    setFormContentHtml(html);
                    setIsDirty(true);
                  }}
                  onSaveDraft={() => handleSavePost()}
                  onUploadImage={async (file) => {
                    const res = await SunraiseAPI.uploadMedia(file);
                    return res.url;
                  }}
                />
              </div>

              {/* Advanced In-Post SEO Settings Accordion */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-orange-600" />
                    <h3 className="text-sm font-extrabold text-gray-900 font-heading">
                      Search Engine Optimization (SEO) &amp; Social Graph
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    Google SERP Sync
                  </span>
                </div>

                {/* Live SERP Preview */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-gray-700">
                    <span>Google Search Result Preview</span>
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setSerpDevice('desktop')}
                        className={`p-1 rounded ${serpDevice === 'desktop' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-400'}`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setSerpDevice('mobile')}
                        className={`p-1 rounded ${serpDevice === 'mobile' ? 'bg-orange-50 text-orange-700 font-bold' : 'text-gray-400'}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-gray-200 shadow-xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-4 h-4 rounded-full bg-orange-600 text-white flex items-center justify-center text-[9px] font-bold">
                        S
                      </div>
                      <div className="text-[11px] text-gray-600 font-sans truncate">
                        https://sunraisesolutions.com <span className="text-gray-400">/blog/{formSlug || 'article-slug'}</span>
                      </div>
                    </div>
                    <div className="text-blue-800 font-medium text-base hover:underline line-clamp-1 cursor-pointer font-sans">
                      {formMetaTitle || formTitle || 'Article Title'}
                    </div>
                    <div className="text-gray-600 text-xs mt-1 line-clamp-2 leading-relaxed font-sans">
                      {formMetaDesc || formExcerpt || 'Article summary description for search engine listing.'}
                    </div>
                  </div>
                </div>

                {/* Meta Title */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900">
                      SEO Meta Title (Title Tag)
                    </label>
                    <span
                      className={`text-[11px] font-bold ${
                        formMetaTitle.length >= 40 && formMetaTitle.length <= 60
                          ? 'text-emerald-600'
                          : formMetaTitle.length > 60
                          ? 'text-red-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {formMetaTitle.length} / 60 Chars (Ideal: 50-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    value={formMetaTitle}
                    onChange={(e) => {
                      setFormMetaTitle(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="e.g. Why Technical SEO Drives 380% More Leads | Sunraise Solutions"
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:border-orange-500"
                  />
                </div>

                {/* Meta Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-gray-900">
                      SEO Meta Description
                    </label>
                    <span
                      className={`text-[11px] font-bold ${
                        formMetaDesc.length >= 130 && formMetaDesc.length <= 160
                          ? 'text-emerald-600'
                          : formMetaDesc.length > 160
                          ? 'text-red-500'
                          : 'text-amber-500'
                      }`}
                    >
                      {formMetaDesc.length} / 160 Chars (Ideal: 140-160)
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    value={formMetaDesc}
                    onChange={(e) => {
                      setFormMetaDesc(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="Enticing summary that compels clicks on Google SERP listings..."
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-900 focus:outline-none focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Focus Keywords & Canonical */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-900 block mb-1">
                      Focus Keywords
                    </label>
                    <input
                      type="text"
                      value={formKeywords}
                      onChange={(e) => {
                        setFormKeywords(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="e.g. technical seo, lead generation, hyderabad software"
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-none focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-900 block mb-1">
                      Canonical URL
                    </label>
                    <input
                      type="text"
                      value={formCanonicalUrl}
                      onChange={(e) => {
                        setFormCanonicalUrl(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder={`https://sunraisesolutions.com/blog/${formSlug || ''}`}
                      className="w-full px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* OpenGraph Tags */}
                <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Share2 className="w-3.5 h-3.5 text-orange-600" />
                      <span>Social Sharing (OG Tags)</span>
                    </span>
                    {formCoverImage && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormOgImage(formCoverImage);
                          showToast('Thumbnail copied to OG Image!');
                        }}
                        className="text-[10px] font-bold text-orange-600 hover:underline"
                      >
                        Copy Thumbnail URL
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">OG Title</label>
                      <input
                        type="text"
                        value={formOgTitle}
                        onChange={(e) => setFormOgTitle(e.target.value)}
                        placeholder="Title for LinkedIn / WhatsApp previews"
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-700 block mb-1">OG Image URL</label>
                      <input
                        type="text"
                        value={formOgImage}
                        onChange={(e) => setFormOgImage(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Publishing Actions, Category, Thumbnail & Tags (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              {/* Publishing Control Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                <h3 className="text-sm font-black text-gray-950 font-heading">
                  Publishing Status
                </h3>

                {/* Status Toggle (Published / Draft / Scheduled) */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-gray-100 rounded-2xl">
                  {(['published', 'draft', 'scheduled'] as const).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        setFormStatus(st);
                        setIsDirty(true);
                      }}
                      className={`py-2 text-[11px] font-extrabold capitalize rounded-xl transition ${
                        formStatus === st
                          ? 'bg-white text-gray-950 shadow-xs'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {formStatus === 'scheduled' && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl space-y-1.5 animate-in fade-in">
                    <label className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Publication Date &amp; Time</span>
                    </label>
                    <input
                      type="datetime-local"
                      value={formScheduledAt}
                      onChange={(e) => {
                        setFormScheduledAt(e.target.value);
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2 bg-white border border-blue-200 rounded-xl text-xs font-medium text-gray-800 focus:outline-none"
                    />
                  </div>
                )}

                {/* Featured Story Toggle */}
                <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
                  <div>
                    <div className="text-xs font-bold text-gray-900">Featured Authority Story</div>
                    <div className="text-[10px] text-gray-500">Pinned to top of blog index</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => {
                      setFormIsFeatured(e.target.checked);
                      setIsDirty(true);
                    }}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                </div>

                {/* Author Byline */}
                <div>
                  <label className="text-xs font-bold text-gray-700 block mb-1">Author Byline</label>
                  <input
                    type="text"
                    value={formAuthor}
                    onChange={(e) => {
                      setFormAuthor(e.target.value);
                      setIsDirty(true);
                    }}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleSavePost}
                  disabled={savingPost}
                  className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs shadow-sunraise hover:brightness-105 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{editingId ? 'Update Article' : 'Publish Article'}</span>
                </button>
              </div>

              {/* Topic Category Card */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-950 font-heading">
                    Topic Category
                  </h3>
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(true)}
                    className="text-[11px] font-bold text-orange-600 hover:text-orange-700"
                  >
                    + New Category
                  </button>
                </div>

                <select
                  value={formCategory}
                  onChange={(e) => {
                    setFormCategory(e.target.value);
                    setIsDirty(true);
                  }}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                >
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Featured Thumbnail Media (Dropzone Parity) */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-black text-gray-950 font-heading">
                    Featured Thumbnail
                  </h3>
                  {formCoverImage && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormCoverImage('');
                        setIsDirty(true);
                      }}
                      className="text-[11px] font-bold text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  className="hidden"
                />

                {formCoverImage ? (
                  <div className="space-y-3">
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-40 bg-gray-100 group">
                      <img
                        src={formCoverImage}
                        alt={formImageAlt || formTitle}
                        className={`w-full h-full object-cover object-${formImageFocal}`}
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white text-xs font-bold gap-1.5"
                      >
                        <UploadCloud className="w-4 h-4" />
                        <span>Change Image</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-1">Focal Position</label>
                        <select
                          value={formImageFocal}
                          onChange={(e) => setFormImageFocal(e.target.value as any)}
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                        >
                          <option value="center">Center</option>
                          <option value="top">Top</option>
                          <option value="bottom">Bottom</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 block mb-1">Alt Tag (SEO)</label>
                        <input
                          type="text"
                          value={formImageAlt}
                          onChange={(e) => setFormImageAlt(e.target.value)}
                          placeholder="Alt description"
                          className="w-full p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleUploadFile(file);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-300 hover:border-orange-500 bg-gray-50/60 hover:bg-orange-50/20 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                      {uploadingImage ? (
                        <RefreshCw className="w-6 h-6 animate-spin" />
                      ) : (
                        <UploadCloud className="w-6 h-6" />
                      )}
                    </div>
                    <div className="text-xs font-bold text-gray-900">
                      {uploadingImage ? 'Uploading Image...' : 'Click to Upload Thumbnail or Drag & Drop'}
                    </div>
                    <div className="text-[10px] text-gray-400">
                      PNG, JPG, WebP up to 15MB
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-gray-500 block mb-1">Or Direct Image URL</label>
                  <input
                    type="text"
                    value={formCoverImage}
                    onChange={(e) => {
                      setFormCoverImage(e.target.value);
                      setIsDirty(true);
                    }}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800"
                  />
                </div>
              </div>

              {/* Tags & Hashtags Manager */}
              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-3">
                <h3 className="text-sm font-black text-gray-950 font-heading">
                  Tags &amp; Hashtags
                </h3>

                <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-gray-50 border border-gray-200 rounded-2xl">
                  {formTags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-800 shadow-xs"
                    >
                      <span>#{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="text-gray-400 hover:text-red-500 ml-0.5"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Add tag and press Enter..."
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ',') {
                        e.preventDefault();
                        handleAddTag();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-3 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-black transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      )}

      {/* CREATE CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900 font-heading">
                Create New Category
              </h3>
              <button onClick={() => setCategoryModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artificial Intelligence"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sunraise"
                >
                  Create Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REALISTIC PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Article Preview
              </span>
              <button onClick={() => setPreviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formCoverImage && (
              <img
                src={formCoverImage}
                alt={formImageAlt || formTitle}
                className="w-full h-72 object-cover rounded-2xl border"
              />
            )}

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                {formCategory}
              </span>
              <h1 className="text-2xl font-black text-gray-900 font-heading mt-3">
                {formTitle || 'Untitled Article'}
              </h1>
              <div className="text-xs text-gray-500 mt-2">
                By {formAuthor} • {readingTime} min read
              </div>
            </div>

            <div className="p-4 bg-orange-50/50 border-l-4 border-orange-500 rounded-r-2xl text-xs text-gray-700 italic">
              {formExcerpt || 'No summary excerpt provided.'}
            </div>

            <div
              className="prose prose-orange max-w-none text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formContentHtml || '<p>Article content will render here...</p>' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
