import React, { useState, useEffect, useRef } from 'react';
import {
  FolderKanban, Plus, Edit, Trash2, X, Sparkles, ExternalLink, Eye, Search,
  Filter, CheckSquare, Square, ArrowUpDown, Calendar, Clock, Image, Tag,
  Layers, CheckCircle2, AlertCircle, RefreshCw, BarChart3, Globe, Share2,
  FileText, ArrowRight, UploadCloud, ChevronRight, Hash, Link as LinkIcon,
  RotateCcw, Monitor, Smartphone, Check, AlertTriangle, ArrowUpRight, ArrowLeft,
  Grid, List, Briefcase, Award, TrendingUp, Code2
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { Project, Service, ProjectMetric, ProjectAnalytics } from '../../types';
import { RichTextEditor } from '../../components/admin/RichTextEditor';

export const AdminProjects: React.FC = () => {
  // Tabs: 'manage' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'manage' | 'dashboard'>('manage');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Core Data
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [analytics, setAnalytics] = useState<ProjectAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters & Search for Manage Tab
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedServiceCode, setSelectedServiceCode] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'views' | 'title'>('newest');

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);

  // Compose / Edit Project Form State
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSlug, setFormSlug] = useState('');
  const [isSlugManual, setIsSlugManual] = useState(false);
  const [isSlugAvailable, setIsSlugAvailable] = useState<boolean | null>(null);
  const [checkingSlug, setCheckingSlug] = useState(false);
  
  // Project-specific attributes
  const [formClientName, setFormClientName] = useState('Enterprise Client');
  const [formClientIndustry, setFormClientIndustry] = useState('Corporate Enterprise');
  const [formProjectYear, setFormProjectYear] = useState('2026');
  const [formServiceCode, setFormServiceCode] = useState('SRV-SEO-01');
  const [formCategoryBadge, setFormCategoryBadge] = useState('Completed Project');
  const [formProjectUrl, setFormProjectUrl] = useState('');
  const [formStatus, setFormStatus] = useState<'completed' | 'featured' | 'in_progress'>('completed');
  const [formIsFeatured, setFormIsFeatured] = useState(false);

  // Content & Media
  const [formSummary, setFormSummary] = useState('');
  const [formContentHtml, setFormContentHtml] = useState('');
  const [formThumbnailUrl, setFormThumbnailUrl] = useState('');
  const [formImageAlt, setFormImageAlt] = useState('');
  const [formImageFocal, setFormImageFocal] = useState<'center' | 'top' | 'bottom'>('center');

  // Tech stack & Metrics
  const [formTechnologies, setFormTechnologies] = useState<string[]>(['React', 'TypeScript', 'TailwindCSS']);
  const [techInput, setTechInput] = useState('');
  const [formMetrics, setFormMetrics] = useState<ProjectMetric[]>([
    { label: 'Performance Score', val: '99/100' },
    { label: 'Organic Traffic Surge', val: '+380%' }
  ]);
  const [metricLabel, setMetricLabel] = useState('');
  const [metricVal, setMetricVal] = useState('');

  // In-Project Advanced SEO Suite State
  const [formMetaTitle, setFormMetaTitle] = useState('');
  const [formMetaDesc, setFormMetaDesc] = useState('');
  const [formKeywords, setFormKeywords] = useState('');
  const [formCanonicalUrl, setFormCanonicalUrl] = useState('');
  const [formRobots, setFormRobots] = useState('index, follow');
  const [formOgTitle, setFormOgTitle] = useState('');
  const [formOgDesc, setFormOgDesc] = useState('');
  const [formOgImage, setFormOgImage] = useState('');

  // Internal Link Helper
  const [selectedProjectLink, setSelectedProjectLink] = useState('');
  const [selectedServiceLink, setSelectedServiceLink] = useState('');
  const [selectedPageLink, setSelectedPageLink] = useState('');

  // UI Modals & Editor Controls
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [savingProject, setSavingProject] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [autosaveStatus, setAutosaveStatus] = useState('All changes saved');
  const [serpDevice, setSerpDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedDraftFound, setSavedDraftFound] = useState<{ title: string; timestamp: string } | null>(null);

  const slugCheckTimeout = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          clientName: formClientName,
          industry: formClientIndustry,
          year: formProjectYear,
          serviceCode: formServiceCode,
          summary: formSummary,
          content: formContentHtml,
          thumbnailUrl: formThumbnailUrl,
          technologies: formTechnologies,
          metrics: formMetrics,
          projectUrl: formProjectUrl,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        localStorage.setItem('sunraise_project_draft', JSON.stringify(draftData));
        setAutosaveStatus(`Draft autosaved at ${draftData.timestamp}`);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [
    formTitle, formSlug, formClientName, formClientIndustry, formProjectYear,
    formServiceCode, formSummary, formContentHtml, formThumbnailUrl,
    formTechnologies, formMetrics, formProjectUrl, isDirty, editingId
  ]);

  const checkForLocalDraft = () => {
    try {
      const raw = localStorage.getItem('sunraise_project_draft');
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
      const raw = localStorage.getItem('sunraise_project_draft');
      if (raw) {
        const d = JSON.parse(raw);
        setFormTitle(d.title || '');
        setFormSlug(d.slug || '');
        setFormClientName(d.clientName || 'Enterprise Client');
        setFormClientIndustry(d.industry || 'Corporate Enterprise');
        setFormProjectYear(d.year || '2026');
        setFormServiceCode(d.serviceCode || 'SRV-SEO-01');
        setFormSummary(d.summary || '');
        setFormContentHtml(d.content || '');
        setFormThumbnailUrl(d.thumbnailUrl || '');
        setFormTechnologies(d.technologies || ['React', 'TypeScript', 'TailwindCSS']);
        setFormMetrics(d.metrics || []);
        setFormProjectUrl(d.projectUrl || '');
        setSavedDraftFound(null);
        setIsDirty(true);
        setIsEditorOpen(true);
        showToast('Autosaved project draft restored successfully!');
      }
    } catch (e) {}
  };

  const discardSavedDraft = () => {
    localStorage.removeItem('sunraise_project_draft');
    setSavedDraftFound(null);
    showToast('Saved draft discarded.');
  };

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allProjects, allServices, stats] = await Promise.all([
        SunraiseAPI.getProjects(),
        SunraiseAPI.getServices(),
        SunraiseAPI.getProjectAnalytics()
      ]);
      setProjects(allProjects);
      setServices(allServices);
      setAnalytics(stats);
    } catch (e) {
      console.error('Error loading projects:', e);
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
        const available = await SunraiseAPI.checkProjectSlug(slugToTest, currentId);
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
    setFormClientName('Enterprise Client');
    setFormClientIndustry('Corporate Enterprise');
    setFormProjectYear(new Date().getFullYear().toString());
    setFormServiceCode(services[0]?.service_code || 'SRV-SEO-01');
    setFormCategoryBadge('Completed Project');
    setFormProjectUrl('');
    setFormSummary('');
    setFormContentHtml('');
    setFormThumbnailUrl('');
    setFormImageAlt('');
    setFormImageFocal('center');
    setFormTechnologies(['React', 'TypeScript', 'TailwindCSS']);
    setTechInput('');
    setFormMetrics([
      { label: 'Performance Score', val: '99/100' },
      { label: 'Organic Traffic Surge', val: '+380%' }
    ]);
    setMetricLabel('');
    setMetricVal('');
    setFormStatus('completed');
    setFormIsFeatured(false);

    // SEO
    setFormMetaTitle('');
    setFormMetaDesc('');
    setFormKeywords('');
    setFormCanonicalUrl('');
    setFormRobots('index, follow');
    setFormOgTitle('');
    setFormOgDesc('');
    setFormOgImage('');
    setIsDirty(false);
    setAutosaveStatus('Ready');
  };

  // Open Create Studio
  const handleStartCreate = () => {
    resetForm();
    setIsEditorOpen(true);
  };

  // Open Edit Studio
  const handleStartEdit = (p: Project) => {
    setEditingId(p.id);
    setFormTitle(p.title || '');
    setFormSlug(p.slug || '');
    setIsSlugManual(true);
    setIsSlugAvailable(true);
    setFormClientName(p.client_name || 'Enterprise Client');
    setFormClientIndustry(p.client_industry || 'Corporate Enterprise');
    setFormProjectYear(p.project_year || '2026');
    setFormServiceCode(p.service_code || 'SRV-SEO-01');
    setFormCategoryBadge(p.category_badge || 'Completed Project');
    setFormProjectUrl(p.project_url || '');
    setFormSummary(p.summary || '');
    
    // Rich content html extraction
    let richHtml = p.content_html || p.solution || '';
    if (!richHtml && p.case_study_blocks && p.case_study_blocks.length > 0) {
      richHtml = p.case_study_blocks
        .filter(b => b.html_content)
        .map(b => b.html_content)
        .join('\n');
    }
    setFormContentHtml(richHtml);

    setFormThumbnailUrl(p.thumbnail_url || '');
    setFormImageAlt(p.image_alt || '');
    setFormImageFocal('center');

    // Technologies
    if (typeof p.technologies === 'string') {
      setFormTechnologies(p.technologies.split(',').map(t => t.trim()).filter(Boolean));
    } else if (Array.isArray(p.technologies)) {
      setFormTechnologies(p.technologies);
    } else {
      setFormTechnologies(['React', 'TypeScript', 'TailwindCSS']);
    }

    // Metrics
    setFormMetrics(p.metrics && p.metrics.length > 0 ? p.metrics : [
      { label: 'Performance Score', val: '99/100' },
      { label: 'Organic Traffic Surge', val: '+380%' }
    ]);

    setFormStatus((p.status as any) || (p.is_featured ? 'featured' : 'completed'));
    setFormIsFeatured(!!p.is_featured);

    // SEO
    setFormMetaTitle(p.seo_meta?.meta_title || `${p.title} | Sunraise Solutions`);
    setFormMetaDesc(p.seo_meta?.meta_description || p.summary || '');
    setFormKeywords(p.seo_meta?.keywords || '');
    setFormCanonicalUrl(p.seo_meta?.canonical_url || '');
    setFormRobots(p.seo_meta?.robots || 'index, follow');
    setFormOgTitle(p.seo_meta?.og_title || p.title || '');
    setFormOgDesc(p.seo_meta?.og_description || p.summary || '');
    setFormOgImage(p.seo_meta?.og_image || p.thumbnail_url || '');

    setIsDirty(false);
    setAutosaveStatus('Ready');
    setIsEditorOpen(true);
  };

  const handleCloseEditor = () => {
    if (isDirty) {
      if (!window.confirm('You have unsaved changes in this project. Return to projects list?')) {
        return;
      }
    }
    setIsEditorOpen(false);
  };

  // Add Tag
  const handleAddTech = () => {
    const trimmed = techInput.trim().replace(/^#/, '');
    if (trimmed && !formTechnologies.includes(trimmed)) {
      setFormTechnologies([...formTechnologies, trimmed]);
      setTechInput('');
      setIsDirty(true);
    }
  };

  // Remove Tag
  const handleRemoveTech = (tech: string) => {
    setFormTechnologies(formTechnologies.filter(t => t !== tech));
    setIsDirty(true);
  };

  // Add Metric
  const handleAddMetric = () => {
    if (metricLabel.trim() && metricVal.trim()) {
      setFormMetrics([...formMetrics, { label: metricLabel.trim(), val: metricVal.trim() }]);
      setMetricLabel('');
      setMetricVal('');
      setIsDirty(true);
    }
  };

  // Remove Metric
  const handleRemoveMetric = (index: number) => {
    setFormMetrics(formMetrics.filter((_, i) => i !== index));
    setIsDirty(true);
  };

  // Handle Internal Link Insert
  const handleInsertLinkToEditor = (url: string, anchorText: string) => {
    const linkSnippet = ` <a href="${url}" class="text-orange-600 font-bold hover:underline" title="${anchorText}">${anchorText}</a> `;
    setFormContentHtml(prev => prev + linkSnippet);
    setIsDirty(true);
    showToast(`Linked: ${anchorText}`);
  };

  // Upload Thumbnail File
  const handleUploadFile = async (file: File) => {
    setUploadingImage(true);
    try {
      const res = await SunraiseAPI.uploadMedia(file);
      if (res && res.url) {
        setFormThumbnailUrl(res.url);
        if (!formOgImage) setFormOgImage(res.url);
        setIsDirty(true);
        showToast('Project thumbnail uploaded successfully!');
      } else {
        showToast('Image upload failed. Check API response.');
      }
    } catch (err: any) {
      console.error('Image upload error:', err);
      showToast(err?.message || 'Error uploading image to server');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUploadFile(file);
    }
  };

  // Save / Update Project
  const handleSaveProject = async () => {
    if (!formTitle.trim()) {
      showToast('Project title is required.');
      return;
    }
    if (!formSlug.trim()) {
      showToast('URL slug is required.');
      return;
    }
    if (isSlugAvailable === false) {
      showToast('The specified URL slug is already taken. Please choose another.');
      return;
    }

    setSavingProject(true);
    setAutosaveStatus('Saving to server...');

    try {
      const payload: Partial<Project> = {
        id: editingId || undefined,
        title: formTitle.trim(),
        slug: formSlug.trim(),
        client_name: formClientName.trim() || 'Enterprise Client',
        client_industry: formClientIndustry.trim() || 'Corporate Enterprise',
        project_year: formProjectYear.trim() || '2026',
        service_code: formServiceCode,
        category_badge: formCategoryBadge || 'Completed Project',
        project_url: formProjectUrl.trim(),
        summary: formSummary.trim(),
        content_html: formContentHtml,
        solution: formContentHtml, // Keep synchronized
        case_study_blocks: [
          {
            id: 'blk-html-' + Date.now(),
            type: 'html',
            sort_order: 1,
            html_content: formContentHtml
          }
        ],
        thumbnail_url: formThumbnailUrl.trim(),
        image_alt: formImageAlt.trim(),
        technologies: formTechnologies.join(', '),
        metrics: formMetrics,
        status: formStatus,
        is_featured: formIsFeatured || formStatus === 'featured',
        seo_meta: {
          meta_title: formMetaTitle.trim() || `${formTitle.trim()} | Sunraise Solutions`,
          meta_description: formMetaDesc.trim() || formSummary.trim(),
          keywords: formKeywords.trim(),
          canonical_url: formCanonicalUrl.trim(),
          robots: formRobots,
          og_title: formOgTitle.trim() || formTitle.trim(),
          og_description: formOgDesc.trim() || formSummary.trim(),
          og_image: formOgImage.trim() || formThumbnailUrl.trim()
        }
      };

      await SunraiseAPI.upsertProject(payload);

      // Clean local storage draft
      localStorage.removeItem('sunraise_project_draft');
      setIsDirty(false);
      setAutosaveStatus('All changes saved');
      showToast(editingId ? 'Project updated successfully!' : 'Project published successfully!');
      
      await loadAllData();
      setIsEditorOpen(false);
    } catch (err: any) {
      console.error('Error saving project:', err);
      showToast(err?.message || 'Failed to save project. Please check network.');
      setAutosaveStatus('Error saving');
    } finally {
      setSavingProject(false);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }
    try {
      await SunraiseAPI.deleteProject(id);
      showToast('Project deleted successfully.');
      await loadAllData();
      if (editingId === id) {
        setIsEditorOpen(false);
      }
    } catch (err: any) {
      showToast('Failed to delete project.');
    }
  };

  // Toggle Featured / Quick Save
  const handleToggleFeatured = async (p: Project) => {
    try {
      const nextFeatured = !p.is_featured;
      const nextStatus = nextFeatured ? 'featured' : 'completed';
      await SunraiseAPI.upsertProject({
        ...p,
        is_featured: nextFeatured,
        status: nextStatus
      });
      showToast(nextFeatured ? 'Project marked as Featured!' : 'Project saved as Completed.');
      await loadAllData();
    } catch (e) {
      showToast('Failed to update status.');
    }
  };

  // Bulk Actions
  const handleSelectAll = () => {
    if (selectedIds.length === filteredProjects.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProjects.map(p => p.id));
    }
  };

  const toggleSelectId = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleBulkOperation = async (op: 'delete' | 'feature' | 'unfeature') => {
    if (selectedIds.length === 0) return;
    if (op === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected projects?`)) return;

    setBulkLoading(true);
    try {
      await SunraiseAPI.bulkActionProjects(selectedIds, op);
      showToast(`Bulk operation completed on ${selectedIds.length} projects.`);
      setSelectedIds([]);
      await loadAllData();
    } catch (e) {
      showToast('Bulk operation failed.');
    } finally {
      setBulkLoading(false);
    }
  };

  // Filter & Search
  const filteredProjects = projects.filter(p => {
    if (selectedServiceCode !== 'all' && p.service_code !== selectedServiceCode) return false;
    if (selectedStatus !== 'all') {
      const st = p.status || (p.is_featured ? 'featured' : 'completed');
      if (st !== selectedStatus) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (p.title || '').toLowerCase().includes(q);
      const matchClient = (p.client_name || '').toLowerCase().includes(q);
      const matchSummary = (p.summary || '').toLowerCase().includes(q);
      const matchTech = (p.technologies || '').toLowerCase().includes(q);
      if (!matchTitle && !matchClient && !matchSummary && !matchTech) return false;
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'newest') return (b.id || 0) - (a.id || 0);
    if (sortBy === 'oldest') return (a.id || 0) - (b.id || 0);
    if (sortBy === 'views') return (b.views || 0) - (a.views || 0);
    if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
    return 0;
  });

  // Calculate Reading Time & Word Count
  const wordCount = (formContentHtml || '').replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 180));

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 text-xs font-bold border border-gray-800">
          <Sparkles className="w-4 h-4 text-orange-400" />
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-gray-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* RESTORE DRAFT BANNER (If available & not in editor) */}
      {savedDraftFound && !isEditorOpen && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-center gap-3 text-xs">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <div>
              <span className="font-black text-amber-900">Unsaved Project Draft Found:</span>{' '}
              <span className="font-semibold text-amber-800">"{savedDraftFound.title}"</span>{' '}
              <span className="text-amber-600 font-medium">({savedDraftFound.timestamp})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={restoreSavedDraft}
              className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition"
            >
              Resume Draft
            </button>
            <button
              onClick={discardSavedDraft}
              className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-bold hover:bg-amber-50 transition"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {/* ================= NORMAL ADMIN PANEL HEADER & CONTROLS ================= */}
      {!isEditorOpen && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-sunraise">
                <FolderKanban className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-black text-gray-950 font-heading flex items-center gap-2">
                  <span>Projects &amp; Showcase</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-bold">
                    {projects.length} Total
                  </span>
                </h1>
                <p className="text-xs text-gray-400">
                  Manage completed client deployments, UI showcases, system architectures, and live project demos
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-1 bg-gray-100 rounded-xl border border-gray-200">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-orange-600 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Instagram Grid Cards"
              >
                <Grid className="w-4 h-4" />
                <span className="hidden sm:inline">Cards</span>
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                  viewMode === 'table'
                    ? 'bg-white text-orange-600 shadow-2xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
                title="Table List View"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Table</span>
              </button>
            </div>

            {/* Dashboard / Analytics toggle */}
            <button
              onClick={() => setActiveTab(activeTab === 'manage' ? 'dashboard' : 'manage')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border ${
                activeTab === 'dashboard'
                  ? 'bg-orange-50 border-orange-200 text-orange-600'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span>{activeTab === 'dashboard' ? 'Back to Projects' : 'Stats & Performance'}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= ANALYTICS DASHBOARD VIEW ================= */}
      {activeTab === 'dashboard' && !isEditorOpen && (
        <div className="space-y-6 animate-in fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Completed Projects</span>
                <Briefcase className="w-5 h-5 text-orange-500" />
              </div>
              <div className="text-2xl font-black text-gray-950 font-heading">
                {analytics?.total_projects || projects.length}
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1">
                Active Client Showcase
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Showcase Impressions</span>
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div className="text-2xl font-black text-gray-950 font-heading">
                {(analytics?.total_views || projects.reduce((acc, c) => acc + (c.views || 0), 0)).toLocaleString()}
              </div>
              <div className="text-[11px] text-gray-400 font-medium mt-1">
                Verified portfolio page visits
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Featured Highlights</span>
                <Award className="w-5 h-5 text-purple-500" />
              </div>
              <div className="text-2xl font-black text-gray-950 font-heading">
                {analytics?.featured_count || projects.filter(p => p.is_featured).length}
              </div>
              <div className="text-[11px] text-purple-600 font-bold mt-1">
                Featured on Homepage &amp; Header
              </div>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-100 shadow-warm">
              <div className="flex items-center justify-between text-gray-400 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider">Service Coverage</span>
                <Layers className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="text-2xl font-black text-gray-950 font-heading">
                {services.length}
              </div>
              <div className="text-[11px] text-gray-400 font-medium mt-1">
                Primary business verticals
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MANAGE PROJECTS FEED (DEFAULT) ================= */}
      {activeTab === 'manage' && !isEditorOpen && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="p-4 rounded-3xl bg-white border border-gray-100 shadow-warm flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[260px]">
              {/* Search Bar */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, client, tech stack, summary..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-medium text-gray-900 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Service Filter */}
              <select
                value={selectedServiceCode}
                onChange={(e) => setSelectedServiceCode(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="all">All Services</option>
                {services.map((s) => (
                  <option key={s.service_code} value={s.service_code}>{s.title}</option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="all">All Statuses</option>
                <option value="completed">Completed</option>
                <option value="featured">Featured</option>
                <option value="in_progress">In Progress</option>
              </select>

              {/* Sort By */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-700 focus:outline-none"
              >
                <option value="newest">Sort: Newest First</option>
                <option value="oldest">Sort: Oldest First</option>
                <option value="views">Sort: Most Viewed</option>
                <option value="title">Sort: Alphabetical</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={loadAllData}
                disabled={loading}
                className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition border border-gray-200"
                title="Refresh projects"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bulk Actions Bar */}
          {selectedIds.length > 0 && (
            <div className="p-3.5 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-between gap-3 animate-in fade-in">
              <div className="flex items-center gap-2 text-xs font-bold text-orange-950">
                <CheckSquare className="w-4 h-4 text-orange-600" />
                <span>{selectedIds.length} projects selected</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold">
                <button
                  onClick={() => handleBulkOperation('feature')}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-purple-300 text-purple-700 hover:bg-purple-50 transition"
                >
                  Feature Selected
                </button>
                <button
                  onClick={() => handleBulkOperation('unfeature')}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
                >
                  Unfeature Selected
                </button>
                <button
                  onClick={() => handleBulkOperation('delete')}
                  disabled={bulkLoading}
                  className="px-3 py-1.5 rounded-xl bg-white border border-red-300 text-red-600 hover:bg-red-50 transition"
                >
                  Delete Selected
                </button>
              </div>
            </div>
          )}

          {/* INSTAGRAM POST CARDS FEED (DEFAULT VIEW) */}
          {viewMode === 'grid' ? (
            loading ? (
              <div className="py-20 text-center text-gray-400 bg-white rounded-3xl border border-gray-100 shadow-warm">
                <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-orange-500" />
                <span>Loading your project showcase...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Instagram-Style "+ Create New Project" Card */}
                <div
                  onClick={handleStartCreate}
                  className="border-2 border-dashed border-gray-300 hover:border-orange-500 bg-white hover:bg-orange-50/20 rounded-3xl p-6 transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer min-h-[420px] group shadow-warm hover:shadow-lg"
                >
                  <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-xs">
                    <Plus className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-black text-gray-900 text-base group-hover:text-orange-600 transition">
                    Create New Project
                  </h4>
                  <p className="text-xs text-gray-400 mt-1.5 max-w-[220px] leading-relaxed">
                    Showcase a completed project, add project images, UI references, system flow, metrics &amp; specs
                  </p>
                  <span className="mt-5 px-5 py-2.5 rounded-xl bg-orange-600 group-hover:bg-orange-700 text-white font-black text-xs shadow-sunraise transition flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>New Project</span>
                  </span>
                </div>

                {/* 2. Project Post Cards (Instagram Post Card Layout) */}
                {filteredProjects.map((p) => {
                  const currentStatus = p.status || (p.is_featured ? 'featured' : 'completed');
                  const serviceObj = services.find(s => s.service_code === p.service_code);

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-3xl border border-gray-100 shadow-warm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
                    >
                      {/* Header: Client Avatar with Instagram Ring, Client Name, Year, Category & Status */}
                      <div className="p-4 flex items-center justify-between border-b border-gray-50">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 p-0.5 shadow-2xs shrink-0">
                            <div className="w-full h-full rounded-full bg-white p-0.5 flex items-center justify-center overflow-hidden">
                              <div className="w-full h-full rounded-full bg-orange-100 text-orange-600 font-black text-xs flex items-center justify-center">
                                {(p.client_name || 'Project').charAt(0).toUpperCase()}
                              </div>
                            </div>
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
                              <span className="truncate">{p.client_name || 'Enterprise Client'}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-300 shrink-0" />
                              <span className="text-[11px] text-gray-400 font-normal shrink-0">
                                {p.project_year || '2026'}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 font-mono truncate max-w-[170px]">
                              /portfolio/{p.slug}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
                            {serviceObj ? serviceObj.title.split(' ')[0] : (p.category_badge || 'Project')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                            currentStatus === 'featured'
                              ? 'bg-purple-100 text-purple-800'
                              : currentStatus === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {currentStatus}
                          </span>
                        </div>
                      </div>

                      {/* Media / Featured UI Reference (Aspect 16:9 with smooth zoom) */}
                      <div
                        className="relative aspect-video bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={() => handleStartEdit(p)}
                      >
                        {p.thumbnail_url ? (
                          <img
                            src={p.thumbnail_url}
                            alt={p.title}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-orange-400 via-amber-500 to-rose-500 flex flex-col items-center justify-center p-6 text-white text-center">
                            <FolderKanban className="w-10 h-10 mb-2 opacity-80" />
                            <span className="font-bold text-xs opacity-90 line-clamp-2">{p.title}</span>
                          </div>
                        )}

                        {/* Views counter overlay on image */}
                        <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/60 backdrop-blur-md text-white text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                          <Eye className="w-3.5 h-3.5 text-orange-400" />
                          <span>{(p.views || 0).toLocaleString()} views</span>
                        </div>
                      </div>

                      {/* Project Caption & Details Body */}
                      <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                        <div>
                          <h3
                            onClick={() => handleStartEdit(p)}
                            className="font-bold text-gray-900 text-sm hover:text-orange-600 transition cursor-pointer line-clamp-2 leading-snug font-heading"
                            title={p.title}
                          >
                            {p.title}
                          </h3>

                          <p className="text-xs text-gray-500 mt-1.5 line-clamp-2 leading-relaxed">
                            {p.summary || 'Completed enterprise deployment engineered by Sunraise Solutions.'}
                          </p>

                          {/* Tech Stack & Hashtags */}
                          <div className="flex flex-wrap gap-1 mt-2.5">
                            {p.technologies ? (
                              p.technologies.split(',').slice(0, 3).map((tech, idx) => (
                                <span key={idx} className="text-[11px] font-bold text-orange-600 hover:underline">
                                  #{tech.trim()}
                                </span>
                              ))
                            ) : (
                              <span className="text-[11px] text-gray-400 font-semibold">#React #Architecture #Deployed</span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons at the Bottom (Edit, Save, Go, Delete) */}
                        <div className="pt-3 border-t border-gray-100 grid grid-cols-4 gap-1.5 text-xs font-bold">
                          {/* 1. Edit Button */}
                          <button
                            type="button"
                            onClick={() => handleStartEdit(p)}
                            className="py-2 px-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 transition flex items-center justify-center gap-1 shadow-2xs group/btn"
                            title="Edit Project"
                          >
                            <Edit className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                            <span className="text-[11px]">Edit</span>
                          </button>

                          {/* 2. Save / Quick Toggle Status Button */}
                          <button
                            type="button"
                            onClick={() => handleToggleFeatured(p)}
                            className={`py-2 px-2.5 rounded-xl transition flex items-center justify-center gap-1 shadow-2xs group/btn ${
                              p.is_featured
                                ? 'bg-purple-50 hover:bg-purple-100 text-purple-700'
                                : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700'
                            }`}
                            title={p.is_featured ? 'Featured (Click to switch to Standard Completed)' : 'Completed (Click to Feature)'}
                          >
                            <Check className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                            <span className="text-[11px]">{p.is_featured ? 'Featured' : 'Save'}</span>
                          </button>

                          {/* 3. Go Button (View Live Project or Showcase Page) */}
                          <a
                            href={p.project_url || `/portfolio/${p.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="py-2 px-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 transition flex items-center justify-center gap-1 shadow-2xs group/btn text-center"
                            title="Go to Live Project / Demo"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 text-gray-500" />
                            <span className="text-[11px]">Go</span>
                          </a>

                          {/* 4. Delete Button */}
                          <button
                            type="button"
                            onClick={() => handleDeleteProject(p.id)}
                            className="py-2 px-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition flex items-center justify-center gap-1 shadow-2xs group/btn"
                            title="Delete Project"
                          >
                            <Trash2 className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                            <span className="text-[11px]">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
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
                          {selectedIds.length > 0 && selectedIds.length === filteredProjects.length ? (
                            <CheckSquare className="w-4 h-4 text-orange-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </th>
                      <th className="py-3.5 px-4">Project Details</th>
                      <th className="py-3.5 px-4">Client &amp; Year</th>
                      <th className="py-3.5 px-4">Service</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-center">Views</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-orange-500" />
                          <span>Loading projects...</span>
                        </td>
                      </tr>
                    ) : filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-gray-400">
                          No projects found. Click "Create New Project" to add one.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((p) => {
                        const isSelected = selectedIds.includes(p.id);
                        const currentStatus = p.status || (p.is_featured ? 'featured' : 'completed');
                        return (
                          <tr
                            key={p.id}
                            className={`hover:bg-gray-50/80 transition ${isSelected ? 'bg-orange-50/40' : ''}`}
                          >
                            <td className="py-3.5 px-4">
                              <button onClick={() => toggleSelectId(p.id)} className="text-gray-400 hover:text-gray-900">
                                {isSelected ? (
                                  <CheckSquare className="w-4 h-4 text-orange-600" />
                                ) : (
                                  <Square className="w-4 h-4" />
                                )}
                              </button>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                {p.thumbnail_url && (
                                  <img
                                    src={p.thumbnail_url}
                                    alt={p.title}
                                    className="w-12 h-12 rounded-xl object-cover border border-gray-100 shrink-0"
                                  />
                                )}
                                <div>
                                  <div className="font-bold text-gray-900 hover:text-orange-600 cursor-pointer" onClick={() => handleStartEdit(p)}>
                                    {p.title}
                                  </div>
                                  <div className="text-[11px] font-mono text-gray-400 mt-0.5">
                                    /portfolio/{p.slug}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-gray-900">{p.client_name}</div>
                              <div className="text-[11px] text-gray-400">{p.project_year} • {p.client_industry}</div>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-gray-100 text-gray-700">
                                {p.service_code}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                  currentStatus === 'featured'
                                    ? 'bg-purple-100 text-purple-800'
                                    : currentStatus === 'completed'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-800'
                                }`}
                              >
                                {currentStatus}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-center font-bold text-gray-800">
                              {(p.views || 0).toLocaleString()}
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handleStartEdit(p)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition"
                                  title="Edit Project"
                                >
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <a
                                  href={p.project_url || `/portfolio/${p.slug}`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition"
                                  title="View Project"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteProject(p.id)}
                                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                                  title="Delete Project"
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
                        {editingId ? `Update Mode #${editingId}` : 'New Project Studio'}
                      </span>
                      <span className="text-xs font-bold text-gray-900 truncate max-w-xs sm:max-w-md lg:max-w-xl">
                        {formTitle || 'Untitled Project'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 mt-0.5 flex-wrap">
                      <span className="font-mono text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                        {editingId ? `/portfolio/${formSlug || 'slug'}` : 'Drafting new project'}
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
                    onClick={handleSaveProject}
                    disabled={savingProject}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:brightness-105 text-white text-xs font-extrabold shadow-sunraise flex items-center gap-1.5 transition disabled:opacity-50"
                  >
                    {savingProject ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>{editingId ? 'Update Project' : 'Publish Project'}</span>
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
              {/* LEFT COLUMN: Main Editorial Content & In-Project SEO (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* Headline & Project Identity Panel */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-black text-xs shadow-2xs">
                        H1
                      </div>
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-900 block">
                          Project Headline &amp; Identity Panel
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          Primary project title, custom permanent URL, and summary excerpt
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        formTitle.length >= 25 && formTitle.length <= 80
                          ? 'bg-emerald-100 text-emerald-800'
                          : formTitle.length > 80
                          ? 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {formTitle.length} / 100 Chars (Ideal: 30-70)
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-extrabold text-gray-800 block mb-1">
                      Project Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Modern Hospital Management System with Real-Time Telemetry &amp; NABH Compliance"
                      value={formTitle}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-2xl text-base font-bold text-gray-950 focus:outline-none focus:bg-white focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 transition"
                    />
                  </div>

                  {/* Custom Slug with Live Availability */}
                  <div className="p-3 bg-gray-50/80 border border-gray-200 rounded-2xl flex items-center gap-2 text-xs">
                    <span className="font-bold text-gray-500 shrink-0">Permalink:</span>
                    <span className="text-gray-400 font-mono shrink-0">/portfolio/</span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => {
                        setFormSlug(generateSlug(e.target.value));
                        setIsSlugManual(true);
                        verifySlug(e.target.value, editingId || undefined);
                      }}
                      placeholder="project-url-slug"
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
                        Executive Summary *
                      </label>
                      <span className="text-[11px] text-gray-400 font-bold">
                        {formSummary.length} / 250 Chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Provide a concise 1-2 sentence executive overview for search snippets and project cards..."
                      value={formSummary}
                      onChange={(e) => {
                        setFormSummary(e.target.value);
                        setIsDirty(true);
                        if (!formMetaDesc) setFormMetaDesc(e.target.value);
                      }}
                      className="w-full px-4 py-2.5 bg-gray-50/80 border border-gray-200 rounded-2xl text-xs font-medium focus:outline-none focus:bg-white focus:border-orange-500 resize-none transition"
                    />
                  </div>
                </div>

                {/* Internal Link Helper */}
                <div className="p-4 rounded-2xl bg-white border border-gray-100 shadow-warm space-y-3">
                  <div className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-extrabold text-gray-900">
                      Internal Link Helper
                    </span>
                    <span className="text-[11px] text-gray-400">
                      — Insert contextual SEO hyperlinks directly into your project description
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Link to existing project */}
                    <select
                      value={selectedProjectLink}
                      onChange={(e) => {
                        setSelectedProjectLink(e.target.value);
                        if (e.target.value) {
                          const found = projects.find(p => p.slug === e.target.value);
                          if (found) handleInsertLinkToEditor(`/portfolio/${found.slug}`, found.title);
                          setSelectedProjectLink('');
                        }
                      }}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                    >
                      <option value="">-- Link to Existing Project --</option>
                      {projects.map(p => (
                        <option key={p.slug} value={p.slug}>{p.title.substring(0, 36)}...</option>
                      ))}
                    </select>

                    {/* Link to Service */}
                    <select
                      value={selectedServiceLink}
                      onChange={(e) => {
                        setSelectedServiceLink(e.target.value);
                        if (e.target.value) {
                          const found = services.find(s => s.service_code === e.target.value);
                          if (found) handleInsertLinkToEditor(`/services/${found.slug}`, found.title);
                          setSelectedServiceLink('');
                        }
                      }}
                      className="p-2 rounded-xl bg-gray-50 border border-gray-200 text-xs font-semibold text-gray-700"
                    >
                      <option value="">-- Link to Service --</option>
                      {services.map(s => (
                        <option key={s.service_code} value={s.service_code}>{s.title}</option>
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
                            '/portfolio': 'Projects Showcase',
                            '/blog': 'Engineering & Growth Insights',
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
                      <option value="/portfolio">Projects Showcase (/portfolio)</option>
                      <option value="/blog">Blogs &amp; Insights (/blog)</option>
                      <option value="/contact">Contact &amp; Audit (/contact)</option>
                    </select>
                  </div>
                </div>

                {/* Rich Project Content Editor (Visual WYSIWYG for Project Images, UI References, Flow, Screenshots, Tables) */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Code2 className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                          Project Content &amp; Visual Showcase Body
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          Document project flow, embed UI reference screenshots, highlight technical specs, architectures, and outcomes
                        </p>
                      </div>
                    </div>
                    <div className="text-[11px] font-bold text-gray-400">
                      {wordCount} Words • {readingTime} min read
                    </div>
                  </div>

                  {/* WYSIWYG Editor with Full Toolbar */}
                  <RichTextEditor
                    value={formContentHtml}
                    onChange={(html) => {
                      setFormContentHtml(html);
                      setIsDirty(true);
                    }}
                    placeholder="Document your completed project flow, embed UI screenshots, describe system architecture, technical challenges solved, and operational impact..."
                  />
                </div>

                {/* In-Project Advanced SEO Suite */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
                          In-Project Advanced SEO Suite
                        </h3>
                        <p className="text-[11px] text-gray-400">
                          SERP preview, Google ranking meta attributes, and OpenGraph tags
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setSerpDevice('desktop')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          serpDevice === 'desktop' ? 'bg-white text-orange-600 shadow-xs' : 'text-gray-500'
                        }`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setSerpDevice('mobile')}
                        className={`p-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          serpDevice === 'mobile' ? 'bg-white text-orange-600 shadow-xs' : 'text-gray-500'
                        }`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Real-Time Google SERP Snippet Preview */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1.5">
                    <div className="text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-1">
                      Live Google Search Snippet Preview
                    </div>
                    <div className="text-xs text-emerald-800 font-mono truncate">
                      https://sunraisesolutions.com/portfolio/{formSlug || 'project-slug'}
                    </div>
                    <div className="text-base font-semibold text-blue-800 hover:underline cursor-pointer truncate font-sans">
                      {formMetaTitle || (formTitle ? `${formTitle} | Sunraise Solutions` : 'Project Title Preview | Sunraise Solutions')}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {formMetaDesc || formSummary || 'Explore this enterprise project delivered by Sunraise Solutions, showcasing state-of-the-art UI architectures, reliable systems, and real business results.'}
                    </div>
                  </div>

                  {/* Meta Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700">SEO Meta Title</label>
                        <span className="text-[10px] text-gray-400">{formMetaTitle.length} / 60</span>
                      </div>
                      <input
                        type="text"
                        value={formMetaTitle}
                        onChange={(e) => {
                          setFormMetaTitle(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="Optimized page title for search engines"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-gray-700">Focus Target Keywords</label>
                        <span className="text-[10px] text-gray-400">Comma-separated</span>
                      </div>
                      <input
                        type="text"
                        value={formKeywords}
                        onChange={(e) => {
                          setFormKeywords(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="e.g. Healthcare Software, React Portfolio, HMS"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-gray-700">Meta Description</label>
                      <span className="text-[10px] text-gray-400">{formMetaDesc.length} / 160</span>
                    </div>
                    <textarea
                      rows={2}
                      value={formMetaDesc}
                      onChange={(e) => {
                        setFormMetaDesc(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="Concise 150-160 character summary for search engine results pages"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    />
                  </div>

                  {/* Canonical URL & Robots */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Canonical URL</label>
                      <input
                        type="text"
                        value={formCanonicalUrl}
                        onChange={(e) => {
                          setFormCanonicalUrl(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="https://sunraisesolutions.com/portfolio/..."
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-bold text-gray-700">Robots Directive</label>
                      <select
                        value={formRobots}
                        onChange={(e) => {
                          setFormRobots(e.target.value);
                          setIsDirty(true);
                        }}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800"
                      >
                        <option value="index, follow">index, follow (Standard Recommended)</option>
                        <option value="noindex, follow">noindex, follow</option>
                        <option value="noindex, nofollow">noindex, nofollow</option>
                      </select>
                    </div>
                  </div>

                  {/* OpenGraph Social Preview */}
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-3">
                    <div className="flex items-center gap-2">
                      <Share2 className="w-4 h-4 text-orange-600" />
                      <span className="text-xs font-extrabold text-gray-900">
                        OpenGraph Social Sharing Preview
                      </span>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white overflow-hidden max-w-sm shadow-xs">
                      {formThumbnailUrl ? (
                        <img
                          src={formThumbnailUrl}
                          alt={formTitle}
                          className="w-full h-36 object-cover"
                        />
                      ) : (
                        <div className="w-full h-32 bg-gradient-to-r from-orange-400 to-amber-500 flex items-center justify-center text-white text-xs font-bold">
                          Sunraise Project Showcase
                        </div>
                      )}
                      <div className="p-3">
                        <div className="text-[10px] font-bold text-gray-400 uppercase">
                          sunraisesolutions.com
                        </div>
                        <div className="font-bold text-xs text-gray-900 truncate mt-0.5">
                          {formOgTitle || formTitle || 'Project Title'}
                        </div>
                        <div className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {formOgDesc || formSummary || 'Executive overview of project results and technologies.'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: Sidebar Settings & Attributes (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* Publish & Status Card */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-950 font-heading">
                      Project Status &amp; Client
                    </h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      formStatus === 'featured'
                        ? 'bg-purple-100 text-purple-800'
                        : formStatus === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {formStatus}
                    </span>
                  </div>

                  {/* Status Selector */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">Lifecycle Status</label>
                    <select
                      value={formStatus}
                      onChange={(e) => {
                        const next = e.target.value as any;
                        setFormStatus(next);
                        if (next === 'featured') setFormIsFeatured(true);
                        setIsDirty(true);
                      }}
                      className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-xs font-semibold text-gray-900"
                    >
                      <option value="completed">Completed (Standard)</option>
                      <option value="featured">Featured (Top of Showcase)</option>
                      <option value="in_progress">In Progress</option>
                    </select>
                  </div>

                  {/* Featured Toggle */}
                  <div className="p-3 bg-gray-50/80 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-gray-900 block">Featured Highlight</span>
                      <span className="text-[10px] text-gray-400">Pin to homepage banner &amp; top row</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const next = !formIsFeatured;
                        setFormIsFeatured(next);
                        if (next) setFormStatus('featured');
                        setIsDirty(true);
                      }}
                      className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                        formIsFeatured ? 'bg-orange-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white transition-transform ${
                          formIsFeatured ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Client Name & Industry */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 block mb-1">Client Name *</label>
                      <input
                        type="text"
                        value={formClientName}
                        onChange={(e) => {
                          setFormClientName(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="e.g. Apex Hospitals"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 block mb-1">Client Industry</label>
                      <input
                        type="text"
                        value={formClientIndustry}
                        onChange={(e) => {
                          setFormClientIndustry(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="e.g. Healthcare"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>

                  {/* Project Year & Primary Service */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 block mb-1">Year Deployed</label>
                      <input
                        type="text"
                        value={formProjectYear}
                        onChange={(e) => {
                          setFormProjectYear(e.target.value);
                          setIsDirty(true);
                        }}
                        placeholder="2026"
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-gray-500 block mb-1">Primary Service</label>
                      <select
                        value={formServiceCode}
                        onChange={(e) => {
                          setFormServiceCode(e.target.value);
                          setIsDirty(true);
                        }}
                        className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold"
                      >
                        {services.map((s) => (
                          <option key={s.service_code} value={s.service_code}>
                            {s.title.split(' ')[0]} ({s.service_code})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Live Project URL */}
                  <div>
                    <label className="text-[11px] font-bold text-gray-500 block mb-1">Live Project / Demo URL</label>
                    <input
                      type="url"
                      value={formProjectUrl}
                      onChange={(e) => {
                        setFormProjectUrl(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="https://clientportal.com or live app"
                      className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono"
                    />
                  </div>

                  {/* Save Button */}
                  <button
                    type="button"
                    onClick={handleSaveProject}
                    disabled={savingProject}
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 text-white font-extrabold text-xs shadow-sunraise hover:brightness-105 transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{editingId ? 'Update Project' : 'Publish Project'}</span>
                  </button>
                </div>

                {/* Featured UI Media / Thumbnail Dropzone */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-950 font-heading">
                      Project Showcase Image
                    </h3>
                    {formThumbnailUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormThumbnailUrl('');
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

                  {formThumbnailUrl ? (
                    <div className="space-y-3">
                      <div className="relative rounded-2xl overflow-hidden border border-gray-200 h-40 bg-gray-100 group">
                        <img
                          src={formThumbnailUrl}
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
                      value={formThumbnailUrl}
                      onChange={(e) => {
                        setFormThumbnailUrl(e.target.value);
                        setIsDirty(true);
                      }}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono text-gray-800"
                    />
                  </div>
                </div>

                {/* Tech Stack & Hashtags Manager */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-3">
                  <h3 className="text-sm font-black text-gray-950 font-heading">
                    Tech Stack &amp; Tags
                  </h3>

                  <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 bg-gray-50 border border-gray-200 rounded-2xl">
                    {formTechnologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-white border border-gray-200 text-gray-800 shadow-xs"
                      >
                        <span>#{t}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveTech(t)}
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
                      placeholder="Add tech (e.g. Next.js, Node.js) and press Enter..."
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          handleAddTech();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800"
                    />
                    <button
                      type="button"
                      onClick={handleAddTech}
                      className="px-3 py-2 rounded-xl bg-gray-900 text-white font-bold text-xs hover:bg-black transition"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Key Result Metrics Builder */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-warm space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-gray-950 font-heading">
                      Key Result Metrics
                    </h3>
                    <span className="text-[11px] text-gray-400 font-bold">
                      {formMetrics.length} Active
                    </span>
                  </div>

                  <div className="space-y-2">
                    {formMetrics.map((m, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 border border-gray-200 rounded-2xl flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-extrabold text-orange-600 text-sm">{m.val}</div>
                          <div className="text-[11px] text-gray-600 font-semibold">{m.label}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveMetric(idx)}
                          className="text-gray-400 hover:text-red-500 p-1"
                          title="Remove Metric"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="Metric (e.g. +380%)"
                      value={metricVal}
                      onChange={(e) => setMetricVal(e.target.value)}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold"
                    />
                    <input
                      type="text"
                      placeholder="Label (e.g. Traffic Surge)"
                      value={metricLabel}
                      onChange={(e) => setMetricLabel(e.target.value)}
                      className="p-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleAddMetric}
                    className="w-full py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs transition"
                  >
                    + Add Metric Highlight
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REALISTIC LIVE PREVIEW MODAL */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8 space-y-6 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b pb-4">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                Live Project Showcase Preview
              </span>
              <button onClick={() => setPreviewModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {formThumbnailUrl && (
              <img
                src={formThumbnailUrl}
                alt={formImageAlt || formTitle}
                className="w-full h-72 object-cover rounded-2xl border"
              />
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                  {formCategoryBadge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  {formClientName} • {formProjectYear}
                </span>
              </div>
              <h1 className="text-2xl font-black text-gray-900 font-heading mt-3">
                {formTitle || 'Untitled Project'}
              </h1>
              {formProjectUrl && (
                <div className="text-xs text-blue-600 font-mono mt-1">
                  Live: <a href={formProjectUrl} target="_blank" rel="noreferrer" className="underline">{formProjectUrl}</a>
                </div>
              )}
            </div>

            <div className="p-4 bg-orange-50/50 border-l-4 border-orange-500 rounded-r-2xl text-xs text-gray-700 italic">
              {formSummary || 'No executive overview provided.'}
            </div>

            {/* Metrics Preview */}
            {formMetrics.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {formMetrics.map((m, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-xl text-center border">
                    <div className="text-lg font-black text-orange-600">{m.val}</div>
                    <div className="text-[11px] text-gray-600 font-bold">{m.label}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Content Body */}
            <div
              className="prose prose-orange max-w-none text-xs leading-relaxed"
              dangerouslySetInnerHTML={{ __html: formContentHtml || '<p>Project showcase content will render here...</p>' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
