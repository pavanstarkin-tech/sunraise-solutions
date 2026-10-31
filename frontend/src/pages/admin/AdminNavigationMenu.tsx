import React, { useState, useEffect } from 'react';
import {
  Menu,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Save,
  Eye,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Phone,
  Shield,
  Layers,
  Check,
  RotateCcw,
  Upload,
  Globe,
  Smartphone,
  Megaphone,
  Code2,
  Vote,
  Film,
  Activity,
  Search,
  Users,
  Award,
  Building2,
  BookOpen,
  FolderKanban,
  HelpCircle,
  FolderOpen,
  Image as ImageIcon,
  Edit2
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { NavigationItem, NavigationSettings } from '../../types';
import { ImageInputControl } from '../../components/builder/ImageInputControl';

const AVAILABLE_ICONS = [
  { name: 'Home', label: 'Home' },
  { name: 'Globe', label: 'Globe / Web' },
  { name: 'Search', label: 'Search / SEO' },
  { name: 'Smartphone', label: 'Mobile App' },
  { name: 'Megaphone', label: 'Marketing' },
  { name: 'Code2', label: 'Code / Cloud' },
  { name: 'Vote', label: 'Electoral' },
  { name: 'Film', label: 'Media / Video' },
  { name: 'Activity', label: 'Healthcare' },
  { name: 'Users', label: 'Users / Team' },
  { name: 'Award', label: 'Award' },
  { name: 'Building2', label: 'Building' },
  { name: 'FolderKanban', label: 'Projects' },
  { name: 'BookOpen', label: 'Blog / Docs' },
  { name: 'Phone', label: 'Phone' },
  { name: 'Sparkles', label: 'Sparkles' }
];

export const AdminNavigationMenu: React.FC = () => {
  const [tree, setTree] = useState<NavigationItem[]>([]);
  const [settings, setSettings] = useState<NavigationSettings>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'menu' | 'settings' | 'preview'>('menu');

  // Modal for adding/editing a menu item
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<{
    id?: number;
    parent_id?: number | null;
    title: string;
    url: string;
    target: '_self' | '_blank';
    icon_name: string;
    image_url: string;
    badge: string;
    description: string;
    is_active: boolean;
  }>({
    title: '',
    url: '/',
    target: '_self',
    icon_name: 'Globe',
    image_url: '',
    badge: '',
    description: '',
    is_active: true,
    parent_id: null
  });

  useEffect(() => {
    loadNavigation();
  }, []);

  const loadNavigation = async () => {
    setIsLoading(true);
    const data = await SunraiseAPI.getNavigation();
    setTree(data.tree || []);
    setSettings(data.settings || {});
    setIsLoading(false);
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await SunraiseAPI.saveNavigationTree(tree, settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      console.error('Failed to save navigation:', e);
      alert('Failed to save navigation. Please check network.');
    } finally {
      setIsSaving(false);
    }
  };

  // Move top-level item up/down
  const moveTopItem = (index: number, direction: 'up' | 'down') => {
    const newTree = [...tree];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newTree.length) return;
    const temp = newTree[index];
    newTree[index] = newTree[targetIdx];
    newTree[targetIdx] = temp;
    // update sort_orders
    newTree.forEach((item, idx) => {
      item.sort_order = idx + 1;
    });
    setTree(newTree);
  };

  // Move submenu item up/down
  const moveSubItem = (parentIdx: number, subIdx: number, direction: 'up' | 'down') => {
    const newTree = [...tree];
    const parent = newTree[parentIdx];
    if (!parent || !parent.children) return;
    const newChildren = [...parent.children];
    const targetIdx = direction === 'up' ? subIdx - 1 : subIdx + 1;
    if (targetIdx < 0 || targetIdx >= newChildren.length) return;
    const temp = newChildren[subIdx];
    newChildren[subIdx] = newChildren[targetIdx];
    newChildren[targetIdx] = temp;
    newChildren.forEach((child, idx) => {
      child.sort_order = idx + 1;
    });
    parent.children = newChildren;
    setTree(newTree);
  };

  // Delete item
  const handleDeleteItem = (itemId: number, parentId: number | null) => {
    if (!confirm('Are you sure you want to delete this menu item and any attached submenus?')) return;
    if (parentId === null) {
      setTree(tree.filter((t) => t.id !== itemId));
    } else {
      const newTree = tree.map((top) => {
        if (top.id === parentId && top.children) {
          return {
            ...top,
            children: top.children.filter((c) => c.id !== itemId)
          };
        }
        return top;
      });
      setTree(newTree);
    }
  };

  // Open modal for new item
  const handleOpenAddModal = (parentId: number | null = null) => {
    setEditingItem({
      title: '',
      url: '/',
      target: '_self',
      icon_name: 'Globe',
      image_url: '',
      badge: '',
      description: '',
      is_active: true,
      parent_id: parentId
    });
    setEditModalOpen(true);
  };

  // Open modal to edit existing item
  const handleOpenEditModal = (item: NavigationItem) => {
    setEditingItem({
      id: item.id,
      parent_id: item.parent_id,
      title: item.title,
      url: item.url,
      target: item.target || '_self',
      icon_name: item.icon_name || 'Globe',
      image_url: item.image_url || '',
      badge: item.badge || '',
      description: item.description || '',
      is_active: item.is_active
    });
    setEditModalOpen(true);
  };

  // Save from modal into state tree
  const handleSaveModalItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.title.trim() || !editingItem.url.trim()) return;

    if (editingItem.id) {
      // Editing existing item
      if (editingItem.parent_id === null) {
        setTree(
          tree.map((top) =>
            top.id === editingItem.id
              ? {
                  ...top,
                  ...editingItem
                }
              : top
          )
        );
      } else {
        setTree(
          tree.map((top) => {
            if (top.id === editingItem.parent_id && top.children) {
              return {
                ...top,
                children: top.children.map((child) =>
                  child.id === editingItem.id
                    ? {
                        ...child,
                        ...editingItem
                      }
                    : child
                )
              };
            }
            return top;
          })
        );
      }
    } else {
      // Creating new item
      const newId = Date.now();
      const newItem: NavigationItem = {
        id: newId,
        parent_id: editingItem.parent_id ?? null,
        title: editingItem.title,
        url: editingItem.url,
        target: editingItem.target,
        icon_name: editingItem.icon_name,
        image_url: editingItem.image_url,
        badge: editingItem.badge,
        description: editingItem.description,
        sort_order: 99,
        is_active: editingItem.is_active,
        children: []
      };

      if (editingItem.parent_id === null) {
        setTree([...tree, newItem]);
      } else {
        setTree(
          tree.map((top) => {
            if (top.id === editingItem.parent_id) {
              return {
                ...top,
                children: [...(top.children || []), newItem]
              };
            }
            return top;
          })
        );
      }
    }

    setEditModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          Loading Navigation System...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 bg-white rounded-3xl border border-gray-100 shadow-warm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
            <Menu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 font-heading">
              Navigation Menu &amp; Submenu Manager
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Manage header menu items, multi-tier submenus, dropdown dialogs, image thumbnails, and top banner announcements.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleOpenAddModal(null)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 text-gray-800 font-bold text-xs hover:bg-gray-50 shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Add Top-Level Menu</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-sunraise-gradient text-white font-extrabold text-xs shadow-sunraise hover:shadow-sunraise-lg transition hover:scale-105 duration-200 disabled:opacity-50"
          >
            {isSaving ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saveSuccess ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>{isSaving ? 'Saving Changes...' : saveSuccess ? 'Saved to Server!' : 'Save Navigation'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'menu'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Menu className="w-4 h-4" />
          <span>Menu &amp; Submenu Structure</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-orange-100 text-orange-700">
            {tree.length} Items
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Navbar Settings &amp; Dropdown Cards</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('preview')}
          className={`px-5 py-3 text-xs font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'preview'
              ? 'border-orange-600 text-orange-600'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          <Eye className="w-4 h-4" />
          <span>Live Visual Preview</span>
        </button>
      </div>

      {/* ==================================================== */}
      {/* TAB 1: MENU & SUBMENU HIERARCHY */}
      {/* ==================================================== */}
      {activeTab === 'menu' && (
        <div className="space-y-4">
          {tree.map((item, index) => {
            const hasChildren = item.children && item.children.length > 0;
            return (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-gray-200 shadow-warm overflow-hidden transition-all duration-200"
              >
                {/* Top Level Item Bar */}
                <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        onClick={() => moveTopItem(index, 'up')}
                        disabled={index === 0}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveTopItem(index, 'down')}
                        disabled={index === tree.length - 1}
                        className="p-1 rounded text-gray-400 hover:text-gray-700 hover:bg-gray-200 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shadow-sm">
                      {index + 1}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-gray-900 font-heading">
                          {item.title}
                        </span>
                        <span className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                          {item.url}
                        </span>
                        {item.badge && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500 text-white">
                            {item.badge}
                          </span>
                        )}
                        {!item.is_active && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-200 text-gray-600">
                            Hidden
                          </span>
                        )}
                      </div>
                      {item.description && (
                        <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenAddModal(item.id)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 text-orange-700 hover:bg-orange-100 text-xs font-bold transition"
                      title="Add a nested submenu under this item"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Submenu</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="p-2 rounded-xl text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id, null)}
                      className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Submenu Items List */}
                {hasChildren && (
                  <div className="p-4 sm:p-5 border-t border-gray-100 bg-white space-y-2.5">
                    <div className="flex items-center justify-between pb-2 mb-1 border-b border-gray-100">
                      <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-orange-600" />
                        <span>Submenu Items under &ldquo;{item.title}&rdquo; ({item.children?.length})</span>
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Supports uploaded thumbnail images for dropdown cards
                      </span>
                    </div>

                    <div className="space-y-2">
                      {item.children?.map((sub, sIdx) => (
                        <div
                          key={sub.id}
                          className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-gray-50/80 border border-gray-200/80 hover:border-orange-200 transition"
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex flex-col gap-0.5">
                              <button
                                type="button"
                                onClick={() => moveSubItem(index, sIdx, 'up')}
                                disabled={sIdx === 0}
                                className="p-0.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20"
                              >
                                <ChevronUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSubItem(index, sIdx, 'down')}
                                disabled={sIdx === (item.children?.length || 0) - 1}
                                className="p-0.5 rounded text-gray-400 hover:text-gray-700 disabled:opacity-20"
                              >
                                <ChevronDown className="w-3 h-3" />
                              </button>
                            </div>

                            {/* Submenu Thumbnail Image */}
                            {sub.image_url ? (
                              <img
                                src={sub.image_url}
                                alt={sub.title}
                                className="w-10 h-10 rounded-xl object-cover border border-gray-200 shadow-sm shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-xs shrink-0">
                                <Sparkles className="w-4 h-4" />
                              </div>
                            )}

                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-gray-900 font-heading">
                                  {sub.title}
                                </span>
                                <span className="text-[10px] font-mono text-gray-400 bg-white px-1.5 py-0.5 rounded border border-gray-200">
                                  {sub.url}
                                </span>
                                {sub.badge && (
                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-orange-100 text-orange-700">
                                    {sub.badge}
                                  </span>
                                )}
                              </div>
                              {sub.description && (
                                <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                                  {sub.description}
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditModal(sub)}
                              className="p-1.5 rounded-lg text-gray-500 hover:text-orange-600 hover:bg-orange-50 transition"
                              title="Edit Submenu Item & Upload Image"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(sub.id, item.id)}
                              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition"
                              title="Delete Submenu Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: NAVBAR SETTINGS & DROPDOWN CARDS */}
      {/* ==================================================== */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Banner Strip Settings */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-warm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 font-heading flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-orange-600" />
              <span>Top Announcement Strip</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Announcement Text</label>
              <input
                type="text"
                value={settings.top_bar_announcement || ''}
                onChange={(e) => setSettings({ ...settings, top_bar_announcement: e.target.value })}
                placeholder="Dual Presence: Hyderabad HQ & Rajahmundry Regional Hub..."
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700">Contact Phone Number</label>
              <input
                type="text"
                value={settings.top_bar_phone || ''}
                onChange={(e) => setSettings({ ...settings, top_bar_phone: e.target.value })}
                placeholder="+91 99596 39539"
                className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="show_admin_link"
                checked={settings.top_bar_show_admin_link === '1'}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    top_bar_show_admin_link: e.target.checked ? '1' : '0'
                  })
                }
                className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
              />
              <label htmlFor="show_admin_link" className="text-xs font-bold text-gray-700">
                Display &ldquo;Admin CMS&rdquo; link on top strip
              </label>
            </div>
          </div>

          {/* Brand Logo & CTA Button */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-warm space-y-4">
            <h3 className="text-sm font-extrabold text-gray-900 font-heading flex items-center gap-2">
              <Award className="w-4 h-4 text-orange-600" />
              <span>Navbar Logo &amp; Primary Action CTA</span>
            </h3>

            <ImageInputControl
              label="Navbar Brand Logo"
              value={settings.navbar_logo_url || '/logo.png'}
              onChange={(url) => setSettings({ ...settings, navbar_logo_url: url })}
              folder="Branding"
              placeholder="/logo.png"
              helperText="Upload transparent PNG or SVG logo for navigation header"
            />

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">CTA Button Text</label>
                <input
                  type="text"
                  value={settings.navbar_cta_text || 'Get Proposal'}
                  onChange={(e) => setSettings({ ...settings, navbar_cta_text: e.target.value })}
                  placeholder="Get Proposal"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">CTA Destination Link</label>
                <input
                  type="text"
                  value={settings.navbar_cta_url || '/contact'}
                  onChange={(e) => setSettings({ ...settings, navbar_cta_url: e.target.value })}
                  placeholder="/contact"
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Megamenu Promo Dialog Card */}
          <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-warm space-y-4 lg:col-span-2">
            <h3 className="text-sm font-extrabold text-gray-900 font-heading flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-orange-600" />
              <span>Mega-Menu Promo Dialog Card (Image Upload &amp; Special Callout)</span>
            </h3>
            <p className="text-xs text-gray-500">
              This interactive card appears inside the mega-menu dropdown with an uploaded banner image, title, and action link.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              <ImageInputControl
                label="Promo Dialog Banner Image"
                value={settings.services_dropdown_promo_image || ''}
                onChange={(url) => setSettings({ ...settings, services_dropdown_promo_image: url })}
                folder="Navigation"
                placeholder="Upload promo image https://..."
                helperText="Uploads directly to Hostinger server via upload.php and records to media library"
              />

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Promo Headline</label>
                  <input
                    type="text"
                    value={settings.services_dropdown_promo_title || ''}
                    onChange={(e) => setSettings({ ...settings, services_dropdown_promo_title: e.target.value })}
                    placeholder="Looking for custom bespoke enterprise architecture?"
                    className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">CTA Label</label>
                    <input
                      type="text"
                      value={settings.services_dropdown_promo_cta || 'Consult Our Architects'}
                      onChange={(e) => setSettings({ ...settings, services_dropdown_promo_cta: e.target.value })}
                      placeholder="Consult Our Architects"
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-700">CTA URL</label>
                    <input
                      type="text"
                      value={settings.services_dropdown_promo_url || '/contact'}
                      onChange={(e) => setSettings({ ...settings, services_dropdown_promo_url: e.target.value })}
                      placeholder="/contact"
                      className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: LIVE PREVIEW */}
      {/* ==================================================== */}
      {activeTab === 'preview' && (
        <div className="p-6 rounded-3xl bg-gray-900 text-white shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-gray-800 pb-3">
            <span className="text-xs font-bold text-orange-400 uppercase tracking-wider">
              Live Interactive Navigation Preview
            </span>
            <span className="text-xs text-gray-400">Desktop View Simulation</span>
          </div>

          {/* Top Bar Preview */}
          <div className="bg-black/60 rounded-xl p-2.5 px-4 text-xs text-gray-300 flex items-center justify-between">
            <span className="text-white font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              {settings.top_bar_announcement || 'Dual Presence: Hyderabad HQ & Rajahmundry Regional Hub'}
            </span>
            <div className="flex items-center gap-4">
              <span>{settings.top_bar_phone || '+91 99596 39539'}</span>
              {settings.top_bar_show_admin_link === '1' && (
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-400 text-[10px] font-bold">
                  Admin CMS
                </span>
              )}
            </div>
          </div>

          {/* Main Navbar Preview */}
          <div className="bg-white text-gray-900 rounded-2xl p-4 flex items-center justify-between shadow-lg">
            <img
              src={settings.navbar_logo_url || '/logo.png'}
              alt="Logo"
              className="h-9 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />

            <div className="flex items-center gap-6">
              {tree.map((item) => (
                <div key={item.id} className="relative group py-2">
                  <span className="text-xs font-bold text-gray-800 hover:text-orange-600 cursor-pointer flex items-center gap-1">
                    {item.title}
                    {item.children && item.children.length > 0 && (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="px-5 py-2 rounded-full bg-sunraise-gradient text-white font-bold text-xs shadow-sunraise">
                {settings.navbar_cta_text || 'Get Proposal'} &rarr;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL: ADD / EDIT MENU ITEM */}
      {/* ==================================================== */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
              <h4 className="text-sm font-extrabold text-gray-900 font-heading">
                {editingItem.id ? 'Edit Menu Item' : 'Add New Menu Item'}
              </h4>
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 font-bold text-lg"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveModalItem} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Parent Selector */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Menu Level</label>
                <select
                  value={editingItem.parent_id === null ? 'top' : editingItem.parent_id}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      parent_id: e.target.value === 'top' ? null : Number(e.target.value)
                    })
                  }
                  className="w-full p-2.5 rounded-xl border border-gray-200 text-xs font-bold"
                >
                  <option value="top">Top-Level Menu Item</option>
                  {tree
                    .filter((t) => t.id !== editingItem.id)
                    .map((t) => (
                      <option key={t.id} value={t.id}>
                        Submenu under &ldquo;{t.title}&rdquo;
                      </option>
                    ))}
                </select>
              </div>

              {/* Title & URL */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Display Label *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.title}
                    onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                    placeholder="e.g. Services, About, Projects"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Destination URL *</label>
                  <input
                    type="text"
                    required
                    value={editingItem.url}
                    onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                    placeholder="/services or https://..."
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Quick Preset Routes */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Quick Link Presets</label>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { label: 'Home', url: '/' },
                    { label: 'About', url: '/about' },
                    { label: 'Services', url: '/services' },
                    { label: 'Projects', url: '/projects' },
                    { label: 'Blog', url: '/blog' },
                    { label: 'Contact', url: '/contact' }
                  ].map((p) => (
                    <button
                      key={p.url}
                      type="button"
                      onClick={() => setEditingItem({ ...editingItem, title: editingItem.title || p.label, url: p.url })}
                      className="px-2 py-1 rounded-lg bg-gray-100 hover:bg-orange-100 hover:text-orange-700 text-[10px] font-bold text-gray-700 transition"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description & Badge */}
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Short Description (for dropdown cards)</label>
                <input
                  type="text"
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  placeholder="e.g. Algorithmic search dominance & Core Web Vitals"
                  className="w-full p-2 rounded-xl border border-gray-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Badge Tag (Optional)</label>
                  <input
                    type="text"
                    value={editingItem.badge}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    placeholder="e.g. Hot, Core, New"
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-700">Icon</label>
                  <select
                    value={editingItem.icon_name}
                    onChange={(e) => setEditingItem({ ...editingItem, icon_name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-gray-200 text-xs font-bold"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.name} value={ic.name}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image Upload for dropdown card / dialog */}
              <ImageInputControl
                label="Thumbnail / Dialog Image"
                value={editingItem.image_url}
                onChange={(url) => setEditingItem({ ...editingItem, image_url: url })}
                folder="Navigation"
                placeholder="Upload thumbnail image https://..."
                helperText="Uploads image permanently to Hostinger storage and database"
              />

              {/* Target & Active Toggle */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.target === '_blank'}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        target: e.target.checked ? '_blank' : '_self'
                      })
                    }
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-gray-700">Open in New Tab</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingItem.is_active}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        is_active: e.target.checked
                      })
                    }
                    className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                  />
                  <span className="text-xs font-bold text-gray-700">Visible in Menu</span>
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 shadow-sm"
                >
                  Apply Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
