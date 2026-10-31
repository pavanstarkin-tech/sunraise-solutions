export interface HeroStat {
  label: string;
  val: string;
}

export interface HeroConfig {
  badge: string;
  title: string;
  highlight_text: string;
  subtitle: string;
  primary_cta: string;
  secondary_cta: string;
  hero_image: string;
  background_image?: string;
  background_overlay?: string;
  background_overlay_opacity?: number;
  stats: HeroStat[];
}

export type BlockCategory = 'basic' | 'layout' | 'business' | 'seo';

export interface BlockStyles {
  backgroundColor?: string;
  textColor?: string;
  paddingY?: string;
  paddingX?: string;
  marginY?: string;
  borderRadius?: string;
  boxShadow?: string;
  fullWidth?: boolean;
  maxWidth?: string;
  customClass?: string;
  elementId?: string;
  align?: 'left' | 'center' | 'right';
  backgroundImage?: string;
  backgroundSize?: 'cover' | 'contain' | 'auto';
  backgroundPosition?: 'center' | 'top' | 'bottom' | 'left' | 'right';
  backgroundRepeat?: 'no-repeat' | 'repeat';
  backgroundOverlay?: string;
  backgroundOverlayOpacity?: number;
  responsiveHide?: {
    mobile?: boolean;
    tablet?: boolean;
    desktop?: boolean;
  };
}

export interface PageBlock {
  id: string;
  type: 'visual' | 'html' | 'code';
  category?: BlockCategory;
  component_name?:
    | 'Heading'
    | 'Paragraph'
    | 'Image'
    | 'Video'
    | 'Button'
    | 'Icon'
    | 'Divider'
    | 'Spacer'
    | 'Container'
    | 'TwoColumn'
    | 'ThreeColumn'
    | 'Grid'
    | 'FlexLayout'
    | 'ImageAndText'
    | 'ServiceCards'
    | 'ServiceDescription'
    | 'FeaturesList'
    | 'BenefitsSection'
    | 'PricingTable'
    | 'CTABanner'
    | 'Testimonials'
    | 'FAQAccordion'
    | 'KPICounter'
    | 'ContactForm'
    | 'WhatsAppButton'
    | 'RelatedServices'
    | 'Breadcrumbs'
    | 'FAQSchemaBlock'
    | 'BreadcrumbSchema'
    | 'ArticleSchema'
    | 'LocalBusinessSchema'
    | 'CustomStructuredData'
    | 'FeatureGrid'
    | 'ProcessTimeline'
    | 'SplitImageText'
    | 'RawHTML'
    | 'CustomCode'
    | 'ImageSlider'
    | 'CardSlider'
    | 'TextSlider'
    | 'MarkupTags';
  html_content?: string;
  css_content?: string;
  code_snippet?: string;
  props?: Record<string, any>;
  styles?: BlockStyles;
  sort_order: number;
}

export interface SEOMeta {
  meta_title: string;
  meta_description: string;
  keywords?: string;
  focus_keyword?: string;
  secondary_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  og_title?: string;
  og_description?: string;
  robots?: string;
  twitter_card?: 'summary' | 'summary_large_image';
  robots_index?: boolean;
  robots_follow?: boolean;
  schema_json?: string;
  schema_type?: 'None' | 'LocalBusiness' | 'Service' | 'FAQ' | 'Article' | 'Breadcrumb';
  sitemap_include?: boolean;
  lock_seo?: boolean;
}

export type PageStatus = 'draft' | 'published' | 'scheduled';
export type PageType = 'service' | 'landing' | 'location' | 'blog' | 'campaign' | 'custom' | 'core';

export interface CustomPage {
  id: number;
  page_key?: string;
  slug: string;
  title: string;
  page_type: PageType;
  status: PageStatus;
  scheduled_at?: string | null;
  hero_config?: HeroConfig;
  page_blocks: PageBlock[];
  seo_meta: SEOMeta;
  seo_score?: number;
  author?: string;
  last_modified_by?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Service {
  id: number;
  service_code: string;
  slug: string;
  title: string;
  short_description: string;
  icon_name: string;
  thumbnail_url: string;
  hero_config: HeroConfig;
  page_blocks: PageBlock[];
  seo_meta: SEOMeta;
  is_published: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string;
  projects?: Project[];
  testimonials?: Testimonial[];
}

export interface BlogCategory {
  id?: number;
  name: string;
  slug: string;
  post_count?: number;
}

export interface BlogAnalytics {
  total_posts: number;
  total_views: number;
  status_counts: {
    published: number;
    draft: number;
    scheduled: number;
  };
  category_breakdown: { category: string; count: number }[];
}

export interface ProjectMetric {
  label: string;
  val: string;
}

export interface ProjectAnalytics {
  total_projects: number;
  total_views: number;
  featured_count: number;
  service_breakdown: { service_code: string; count: number }[];
}

export interface Project {
  id: number;
  slug: string;
  title: string;
  client_name: string;
  client_industry?: string;
  project_year?: string;
  service_code: string;
  category_badge: string;
  thumbnail_url: string;
  image_alt?: string;
  summary: string;
  content_html?: string;
  status?: string;
  project_url?: string;
  challenge?: string;
  solution?: string;
  metrics?: ProjectMetric[];
  technologies?: string;
  views?: number;
  case_study_blocks?: PageBlock[];
  seo_meta: SEOMeta;
  is_featured: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  client_name: string;
  client_role: string;
  avatar_url: string;
  rating: number;
  review_text: string;
  service_code?: string | null;
  is_featured: boolean;
  created_at?: string;
}

export interface Blog {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image: string;
  image_alt?: string;
  image_caption?: string;
  category: string;
  service_code?: string | null;
  tags?: string;
  author?: string;
  is_featured?: boolean;
  views?: number;
  status?: 'published' | 'draft' | 'scheduled';
  scheduled_at?: string | null;
  content_html?: string;
  content_blocks: PageBlock[];
  seo_meta: SEOMeta;
  published_at?: string | null;
  is_published: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface SEORedirect {
  id: number;
  old_path: string;
  new_path: string;
  status_code: number;
  created_at: string;
}

export interface Lead {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  service_code?: string | null;
  budget_range: string;
  message: string;
  source_page?: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
  created_at?: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
  bio: string;
  image: string;
  linkedin?: string;
}

export interface SEOPageItem {
  id: number;
  path: string;
  page_type: 'core' | 'service' | 'blog' | 'project' | 'custom';
  title: string;
  meta_title?: string;
  meta_description?: string;
  focus_keywords?: string;
  canonical_url?: string;
  robots: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_card?: string;
  schema_type?: string;
  custom_schema_json?: string;
  sitemap_priority: number;
  sitemap_changefreq: string;
  is_indexed: boolean | number;
  health_score?: number;
  health_issues?: string[];
  updated_at?: string;
}

export interface SEOStats {
  total_pages: number;
  indexed_pages: number;
  core_pages: number;
  service_pages: number;
  blog_pages: number;
  project_pages: number;
  avg_health_score: number;
}

export interface PageRevision {
  id: string;
  target_id: number;
  target_type: 'service' | 'page';
  slug: string;
  title: string;
  blocks: PageBlock[];
  seo_meta: SEOMeta;
  hero_config?: HeroConfig;
  saved_by: string;
  saved_at: string;
  note?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  filename: string;
  title: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
  sizeBytes?: number;
  folder?: string;
  format?: string;
  uploaded_at: string;
}

export interface SEOCheckItem {
  id: string;
  label: string;
  category: 'critical' | 'warning' | 'good';
  passed: boolean;
  message: string;
  recommendation: string;
}

export interface SEOCheckResult {
  score: number;
  focusKeyword: string;
  totalChecks: number;
  passedChecks: number;
  items: SEOCheckItem[];
}

export type UserRole = 'super_admin' | 'seo_manager' | 'seo_editor';

export interface NavigationItem {
  id: number;
  parent_id: number | null;
  title: string;
  url: string;
  target?: '_self' | '_blank';
  icon_name?: string;
  image_url?: string;
  badge?: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  children?: NavigationItem[];
}

export interface NavigationSettings {
  top_bar_announcement?: string;
  top_bar_phone?: string;
  top_bar_show_admin_link?: string;
  navbar_logo_url?: string;
  navbar_cta_text?: string;
  navbar_cta_url?: string;
  navbar_cta_visible?: string;
  services_dropdown_title?: string;
  services_dropdown_subtitle?: string;
  services_dropdown_promo_title?: string;
  services_dropdown_promo_cta?: string;
  services_dropdown_promo_url?: string;
  services_dropdown_promo_image?: string;
  [key: string]: string | undefined;
}
