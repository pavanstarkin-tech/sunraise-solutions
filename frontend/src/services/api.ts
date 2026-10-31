import { Service, Project, Testimonial, Blog, Lead, SEORedirect, PageBlock, LeadershipMember, CustomPage, PageRevision, MediaItem, SEOPageItem, SEOStats, NavigationItem, NavigationSettings } from '../types';
import { auth } from '../config/firebase';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

async function getAuthHeaders(includeJson: boolean = true): Promise<Record<string, string>> {
  const headers: Record<string, string> = {};
  if (includeJson) {
    headers['Content-Type'] = 'application/json';
  }
  try {
    if (auth.currentUser) {
      const token = await auth.currentUser.getIdToken();
      headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (e) {
    // proceed without token
  }
  return headers;
}

const STORAGE_KEYS = {
  SERVICES: 'sunraise_services_v1',
  PROJECTS: 'sunraise_projects_v1',
  TESTIMONIALS: 'sunraise_testimonials_v1',
  BLOGS: 'sunraise_blogs_v1',
  LEADS: 'sunraise_leads_v1',
  REDIRECTS: 'sunraise_redirects_v1',
  PAGES: 'sunraise_pages_v1',
  MEDIA: 'sunraise_media_library_v1',
  REVISIONS: 'sunraise_page_revisions_v1',
  NAVIGATION: 'sunraise_navigation_v1',
};

// INITIAL SEED SERVICES
const INITIAL_SERVICES: Service[] = [
  {
    id: 1,
    service_code: 'SRV-SEO-01',
    slug: 'seo-services-in-hyderabad',
    title: 'SEO Services in Hyderabad',
    short_description: 'Dominate local and national Google rankings with our proprietary data-driven technical, on-page, and authority link-building blueprints.',
    icon_name: 'Search',
    thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'HYDERABAD #1 SEO AGENCY',
      title: 'Dominate Google Rankings with High-Performance',
      highlight_text: 'SEO in Hyderabad',
      subtitle: 'Stop losing leads to competitors. We build high-converting search visibility through deep technical audits, local map-pack dominance, and white-hat link velocity.',
      primary_cta: 'Get Free SEO Audit',
      secondary_cta: 'View SEO Case Studies',
      hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Organic Traffic Surge', val: '+380%' },
        { label: 'Keywords Page 1', val: '1,450+' },
        { label: 'Retention Rate', val: '98%' }
      ]
    },
    page_blocks: [
      {
        id: 'blk-seo-1',
        type: 'visual',
        component_name: 'FeatureGrid',
        sort_order: 1,
        props: {
          title: 'Complete 360° SEO Capabilities',
          description: 'Engineered for exponential ROI in competitive Andhra Pradesh and Telangana markets.',
          features: [
            'Technical Core Web Vitals Optimization',
            'Google Business Profile 3-Pack Rank',
            'Laser-targeted Telugu & English Keyword Clustering',
            'High-DA White-Hat PR Backlink Outreach',
            'Conversion Rate Optimization (CRO)'
          ]
        }
      },
      {
        id: 'blk-seo-2',
        type: 'visual',
        component_name: 'ProcessTimeline',
        sort_order: 2,
        props: {
          title: 'Our 4-Stage Search Domination Protocol',
          steps: [
            { step: '01', title: 'Algorithmic Audit & Competitor Gap Analysis', desc: 'In-depth crawler analysis identifying crawl budget issues, index bloat, and keyword cannibalization.' },
            { step: '02', title: 'Information Architecture & On-Page Engineering', desc: 'Schema markup injection, semantic heading alignment, and Core Web Vitals speed optimization.' },
            { step: '03', title: 'Local Map Pack & High-Authority PR Link Building', desc: 'Hyper-local citation synchronization across Hyderabad & AP alongside top-tier digital PR links.' },
            { step: '04', title: 'Conversion Tracking & Revenue Analytics', desc: 'Bi-weekly keyword tracking, GA4 funnel attribution, and continuous CRO iteration.' }
          ]
        }
      },
      {
        id: 'blk-seo-3',
        type: 'html',
        component_name: 'RawHTML',
        sort_order: 3,
        html_content: `<div class="p-8 rounded-2xl bg-gradient-to-r from-orange-500/10 to-amber-500/10 border border-orange-200 text-center">
  <h3 class="text-2xl font-bold text-gray-900 mb-2">Want guaranteed Google Top 3 rankings for your business?</h3>
  <p class="text-gray-600 mb-6">Claim your 100% free comprehensive technical and competitor audit report today.</p>
  <a href="#proposal-form" class="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-500 text-white font-semibold shadow-lg hover:shadow-orange-500/25 transition">Claim Free Audit Report &rarr;</a>
</div>`,
        css_content: ''
      }
    ],
    seo_meta: {
      meta_title: 'Best SEO Services in Hyderabad & AP | Sunraise Solutions',
      meta_description: 'Sunraise Solutions is Hyderabad’s leading digital agency delivering technical SEO, local Google Map pack dominance, and organic lead generation for 18+ years.',
      keywords: 'SEO Services Hyderabad, Local SEO Hyderabad, SEO Company Rajahmundry, Search Engine Optimization Telangana',
      canonical_url: 'https://sunraisesolutions.com/services/seo-services-in-hyderabad',
      og_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      schema_json: '{"@context": "https://schema.org", "@type": "Service", "name": "SEO Services in Hyderabad", "provider": {"@type": "LocalBusiness", "name": "Sunraise Solutions"}}',
      lock_seo: true
    },
    is_published: true,
    display_order: 1
  },
  {
    id: 2,
    service_code: 'SRV-WEB-02',
    slug: 'web-development',
    title: 'Web Development & Web Apps',
    short_description: 'Bespoke, blazing-fast web architectures engineered in React, Next.js, and high-concurrency backends for seamless business scalability.',
    icon_name: 'Globe',
    thumbnail_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'HIGH-PERFORMANCE ARCHITECTURE',
      title: 'High-Converting Web Platforms with',
      highlight_text: 'Sub-Second Speeds',
      subtitle: 'We design and engineer bespoke web experiences that elevate your brand authority and convert visitors into loyal clients.',
      primary_cta: 'Start Web Project',
      secondary_cta: 'Explore Tech Stack',
      hero_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Lighthouse Score', val: '99/100' },
        { label: 'Delivered Portals', val: '320+' },
        { label: 'Uptime Guarantee', val: '99.9%' }
      ]
    },
    page_blocks: [
      {
        id: 'blk-web-1',
        type: 'visual',
        component_name: 'FeatureGrid',
        sort_order: 1,
        props: {
          title: 'Full-Cycle Web Solutions',
          description: 'From corporate portals to complex web apps.',
          features: [
            'Custom React & Next.js Architecture',
            'Mobile-First Responsive UX/UI',
            'Headless CMS & Visual Editors',
            'API-Driven Microservices',
            'Enterprise Security & SSL Hardening'
          ]
        }
      }
    ],
    seo_meta: {
      meta_title: 'Top Web Development Company in Hyderabad | Sunraise Solutions',
      meta_description: 'Professional website design and custom web app development company in Hyderabad and Rajahmundry. 18+ years of delivering high-performance platforms.',
      keywords: 'Web Development Hyderabad, Website Design Rajahmundry, React Development, Custom Web Apps AP',
      canonical_url: 'https://sunraisesolutions.com/services/web-development',
      og_image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
      lock_seo: true
    },
    is_published: true,
    display_order: 2
  },
  {
    id: 3,
    service_code: 'SRV-MOB-03',
    slug: 'mobile-app-development',
    title: 'Mobile App Development',
    short_description: 'Native iOS, Android, and Flutter applications featuring intuitive fluid UX, real-time push engines, and rock-solid cloud integrations.',
    icon_name: 'Smartphone',
    thumbnail_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'MOBILE INNOVATION',
      title: 'Scalable iOS & Android Apps Built for',
      highlight_text: 'Maximum Engagement',
      subtitle: 'Bring your product vision to the fingertips of millions with ultra-responsive native and cross-platform mobile apps.',
      primary_cta: 'Request App Scope',
      secondary_cta: 'View App Demos',
      hero_image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'App Store Rating', val: '4.9 ★' },
        { label: 'Total Downloads', val: '1.2M+' },
        { label: 'Crash-Free Rate', val: '99.9%' }
      ]
    },
    page_blocks: [],
    seo_meta: {
      meta_title: 'Mobile App Development Services Hyderabad | Sunraise Solutions',
      meta_description: 'Leading mobile application developers in Hyderabad and Andhra Pradesh crafting iOS and Android mobile software for startups and enterprises.',
      keywords: 'Mobile App Development Hyderabad, iOS App Developers AP, Flutter Developers Hyderabad, Android App Company',
      lock_seo: true
    },
    is_published: true,
    display_order: 3
  },
  {
    id: 4,
    service_code: 'SRV-MKT-04',
    slug: 'digital-marketing',
    title: 'Digital Marketing & Performance Ads',
    short_description: 'Full-funnel Meta & Google Ads campaigns, social media management, brand positioning, and aggressive revenue-generating conversion pipelines.',
    icon_name: 'Megaphone',
    thumbnail_url: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'REVENUE GENERATION',
      title: 'Hyper-Targeted Performance Ads &',
      highlight_text: 'Digital Growth Engines',
      subtitle: 'Stop burning ad budget. We optimize Meta, Google, and LinkedIn ad funnels to deliver verifiable qualified leads and high ROAS.',
      primary_cta: 'Accelerate My ROAS',
      secondary_cta: 'See Ad Results',
      hero_image: 'https://images.unsplash.com/photo-1533750516457-a7f992034fec?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Average ROAS', val: '4.6x' },
        { label: 'Leads Generated', val: '85,000+' },
        { label: 'Ad Spend Managed', val: '₹12Cr+' }
      ]
    },
    page_blocks: [],
    seo_meta: {
      meta_title: 'Top Digital Marketing Agency in Hyderabad | Sunraise Solutions',
      meta_description: 'Drive revenue with Google Ads, Meta campaigns, and strategic social media marketing from Sunraise Solutions Hyderabad.',
      keywords: 'Digital Marketing Agency Hyderabad, Performance Marketing AP, Google Ads Expert Hyderabad',
      lock_seo: true
    },
    is_published: true,
    display_order: 4
  },
  {
    id: 5,
    service_code: 'SRV-SFT-05',
    slug: 'custom-software-development',
    title: 'Custom Software Development',
    short_description: 'Tailored ERP, CRM, and cloud-native software ecosystems designed to streamline operations and automate mission-critical organizational workflows.',
    icon_name: 'Code2',
    thumbnail_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'ENTERPRISE ARCHITECTURE',
      title: 'Purpose-Built Software Platforms for',
      highlight_text: 'Operational Mastery',
      subtitle: 'Eliminate manual bottlenecks with custom enterprise software, workflow automation, and multi-tenant cloud ecosystems.',
      primary_cta: 'Consult Our Engineers',
      secondary_cta: 'Architecture Review',
      hero_image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Operational Efficiency', val: '+70%' },
        { label: 'Custom ERPs Shipped', val: '85+' },
        { label: 'Zero-Downtime Migration', val: '100%' }
      ]
    },
    page_blocks: [],
    seo_meta: {
      meta_title: 'Custom Software Development Company Hyderabad | Sunraise Solutions',
      meta_description: 'Enterprise-grade custom software, CRM, and ERP development services tailored for mid-market and enterprise businesses across Telangana & AP.',
      keywords: 'Custom Software Development Hyderabad, ERP Software AP, Enterprise CRM Solutions',
      lock_seo: true
    },
    is_published: true,
    display_order: 5
  },
  {
    id: 6,
    service_code: 'SRV-POL-06',
    slug: 'political-branding',
    title: 'Political Branding & Campaign PR',
    short_description: 'Groundbreaking 360° constituency analytics, digital sentiment monitoring, narrative strategy, and high-impact voter outreach ecosystems.',
    icon_name: 'Vote',
    thumbnail_url: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'STRATEGIC INFLUENCE',
      title: 'Data-Driven Constituency War Rooms &',
      highlight_text: 'Political Branding',
      subtitle: 'Comprehensive digital voter sentiment analytics, micro-targeted grassroots outreach, and high-impact media production across AP & Telangana.',
      primary_cta: 'Confidential Briefing',
      secondary_cta: 'Campaign Footprint',
      hero_image: 'https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Elections Strategized', val: '42+' },
        { label: 'Voter Reach', val: '15M+' },
        { label: 'Field War Rooms', val: '28' }
      ]
    },
    page_blocks: [],
    seo_meta: {
      meta_title: 'Political Branding & Digital Campaign Strategy AP & Telangana | Sunraise',
      meta_description: 'Premier political war-room consulting, digital voter sentiment analytics, and election campaign branding in Andhra Pradesh and Hyderabad.',
      keywords: 'Political Branding Hyderabad, Election Campaign AP, Political PR Agency Hyderabad, Voter Analytics',
      lock_seo: true
    },
    is_published: true,
    display_order: 6
  },
  {
    id: 7,
    service_code: 'SRV-CGI-07',
    slug: 'cgi-advertising',
    title: 'CGI Advertising & 3D Visuals',
    short_description: 'Hyper-realistic CGI product animation, immersive 3D billboard effects, and cinematic visual spectacles that command instant virality.',
    icon_name: 'Film',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'CINEMATIC IMPACT',
      title: 'Hyper-Realistic 3D & Viral CGI',
      highlight_text: 'Advertising Production',
      subtitle: 'Stop thumb-scrolling with cinema-grade 3D product animations, anamorphic illusion billboards, and CGI social teasers.',
      primary_cta: 'Commission CGI Project',
      secondary_cta: 'Watch Showreel',
      hero_image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Viral Video Views', val: '45M+' },
        { label: 'CGI Ads Rendered', val: '120+' },
        { label: 'Average Engagement', val: '8.4x' }
      ]
    },
    page_blocks: [],
    seo_meta: {
      meta_title: 'CGI Advertising & 3D Visual Effects Hyderabad | Sunraise Solutions',
      meta_description: 'High-end CGI advertising, 3D product rendering, and anamorphic VFX production in Hyderabad for viral brand marketing.',
      keywords: 'CGI Advertising Hyderabad, 3D VFX Agency AP, 3D Product Animation Studio',
      lock_seo: true
    },
    is_published: true,
    display_order: 7
  },
  {
    id: 8,
    service_code: 'SRV-HMS-08',
    slug: 'hospital-management-software',
    title: 'Hospital Management Software (HMS)',
    short_description: 'HIPAA-compliant, unified healthcare ecosystems bridging OPD, IPD, EHR, Pharmacy, Radiology, Lab automation, and NABH-ready telemetry.',
    icon_name: 'Activity',
    thumbnail_url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    hero_config: {
      badge: 'HEALTHCARE EXCELLENCE',
      title: 'NABH-Compliant, Intelligent Hospital',
      highlight_text: 'Management Software',
      subtitle: 'A unified clinical, billing, and patient telemetry operating system trusted by multi-specialty hospitals and healthcare groups across AP & Telangana.',
      primary_cta: 'Book Live HMS Demo',
      secondary_cta: 'Download HMS Specs',
      hero_image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Hospitals Operating', val: '35+' },
        { label: 'Patient Records', val: '1.8M+' },
        { label: 'Billing Audit Time', val: '-65%' }
      ]
    },
    page_blocks: [],
    seo_meta: {
      meta_title: 'Hospital Management Software (HMS) Hyderabad & AP | Sunraise Solutions',
      meta_description: 'Comprehensive Hospital Management Software (HMS) covering OPD, IPD, EHR, NABH compliance, Pharmacy, and Diagnostic Lab automation.',
      keywords: 'Hospital Management Software Hyderabad, HMS Software AP, Clinic Management Software, Healthcare EHR Software',
      lock_seo: true
    },
    is_published: true,
    display_order: 8
  }
];

// INITIAL SEED PROJECTS
const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    slug: 'avanthi-mca-college',
    title: 'Avanthi MCA College Admissions & Portal',
    client_name: 'Avanthi Educational Society',
    service_code: 'SRV-SEO-01',
    category_badge: 'SEO',
    thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
    summary: 'Generated 4,200+ qualified student admission inquiries within 90 days via technical on-page SEO restructuring and hyper-local search domination across Hyderabad.',
    seo_meta: {
      meta_title: 'Avanthi MCA College SEO Case Study | Sunraise Solutions',
      meta_description: 'How Sunraise delivered +340% organic enrollment inquiries for Avanthi MCA College in Hyderabad.',
      keywords: 'Avanthi MCA College SEO, Education Lead Gen Hyderabad'
    },
    is_featured: true
  },
  {
    id: 2,
    slug: 'sri-veera-hanuman-nursery',
    title: 'Sri Veera Hanuman Nursery E-Commerce',
    client_name: 'Sri Veera Hanuman Nursery',
    service_code: 'SRV-WEB-02',
    category_badge: 'Web Development',
    thumbnail_url: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?auto=format&fit=crop&w=1000&q=80',
    summary: 'Engineered high-concurrency horticultural marketplace with live inventory sync, shipping logistics integration, and sub-second catalog browsing.',
    seo_meta: {
      meta_title: 'Sri Veera Hanuman Nursery E-Commerce Web Portal | Sunraise',
      meta_description: 'High-performance plant nursery e-commerce platform built for scale across South India.',
      keywords: 'E-commerce nursery web development, Plant delivery portal'
    },
    is_featured: true
  },
  {
    id: 3,
    slug: 'union-hospital-digital-ecosystem',
    title: 'Union Hospital 360° Healthcare Digital',
    client_name: 'Union Hospitals Group',
    service_code: 'SRV-HMS-08',
    category_badge: 'Hospital Management',
    thumbnail_url: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1000&q=80',
    summary: 'Deployed complete NABH-compliant cloud Hospital Management System integrating emergency triage, automated pharmacy dispensing, and real-time bed management.',
    seo_meta: {
      meta_title: 'Union Hospital HMS Implementation Case Study | Sunraise',
      meta_description: 'Complete hospital ERP modernization boosting staff workflow efficiency by 65%.',
      keywords: 'Union Hospital HMS, Hospital ERP Case Study'
    },
    is_featured: true
  },
  {
    id: 4,
    slug: 'aero-drone-technologies',
    title: 'Aero Drone Technologies Brand Platform',
    client_name: 'Aero Drone Tech India',
    service_code: 'SRV-WEB-02',
    category_badge: 'Web Development',
    thumbnail_url: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&w=1000&q=80',
    summary: 'Created an interactive 3D WebGL drone customizer and defense-grade commercial platform highlighting autonomous surveillance hardware capabilities.',
    seo_meta: {
      meta_title: 'Aero Drone Technologies Digital Platform | Sunraise Solutions',
      meta_description: 'Bespoke 3D interactive web portal designed for advanced aerospace drone manufacturers.',
      keywords: 'Drone technology web design, WebGL industrial showcase'
    },
    is_featured: true
  },
  {
    id: 5,
    slug: 'dmi-hospital-telemetry',
    title: 'DMI Hospital Patient Telemetry & Appointments',
    client_name: 'DMI Healthcare',
    service_code: 'SRV-HMS-08',
    category_badge: 'Hospital Management',
    thumbnail_url: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1000&q=80',
    summary: 'Modernized patient appointment queueing, reducing patient wait times by 48 minutes on average, and integrated automated WhatsApp prescription alerts.',
    seo_meta: {
      meta_title: 'DMI Hospital Healthcare Systems | Sunraise Solutions',
      meta_description: 'Patient queue optimization and digital prescription rollout at DMI Hospital.',
      keywords: 'DMI hospital software, Healthcare automation Hyderabad'
    },
    is_featured: true
  },
  {
    id: 6,
    slug: 'usha-prime-hospital-growth',
    title: 'Usha Prime Hospital Search & Local Brand',
    client_name: 'Usha Prime Super Specialty Hospital',
    service_code: 'SRV-SEO-01',
    category_badge: 'SEO',
    thumbnail_url: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1000&q=80',
    summary: 'Secured rank #1 for 14 emergency cardiology and orthopedic search queries in Rajahmundry, resulting in a 220% increase in monthly emergency admissions.',
    seo_meta: {
      meta_title: 'Usha Prime Hospital Local Search Domination | Sunraise',
      meta_description: 'Hospital local SEO case study: capturing Google 3-Pack rankings for emergency medical care.',
      keywords: 'Hospital SEO Rajahmundry, Medical Local SEO Andhra Pradesh'
    },
    is_featured: true
  }
];

// INITIAL SEED TESTIMONIALS
const INITIAL_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    client_name: 'MAKSIM Infotech',
    client_role: 'Director of Technology Operations',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    review_text: 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance. Their ability to deliver high-performance applications on strict timelines is unmatched in Hyderabad.',
    service_code: 'SRV-SFT-05',
    is_featured: true
  },
  {
    id: 2,
    client_name: 'Hotel Jaya Residency',
    client_role: 'General Manager, Hospitality Division',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    review_text: 'Our direct room bookings multiplied by 3.4x within five months of launching the new responsive portal and local SEO campaigns. The Sunraise team feels like an in-house powerhouse.',
    service_code: 'SRV-SEO-01',
    is_featured: true
  },
  {
    id: 3,
    client_name: 'MVR Agro Solutions',
    client_role: 'Managing Partner',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    review_text: 'From brand strategy and Telugu-English multi-lingual digital ad campaigns to supply chain software, Sunraise delivered extraordinary commercial value for our brand across AP.',
    service_code: 'SRV-MKT-04',
    is_featured: true
  },
  {
    id: 4,
    client_name: 'Dr. Ramesh',
    client_role: 'Chief Medical Officer, DMI Hospital',
    avatar_url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    review_text: 'The Hospital Management System designed by Sunraise revolutionized our OPD and billing departments. Patient paperwork reduced to zero, and audits are now 100% effortless.',
    service_code: 'SRV-HMS-08',
    is_featured: true
  },
  {
    id: 5,
    client_name: 'Dr. Usha',
    client_role: 'Managing Director, Usha Prime Hospital',
    avatar_url: 'https://images.unsplash.com/photo-1594824813598-f2b77a1645e5?auto=format&fit=crop&w=200&q=80',
    rating: 5.0,
    review_text: 'Sunraise Solutions is the undisputed leader for healthcare digital growth in Andhra Pradesh. Their search engine optimization work established us as the premier cardiology hospital in our region.',
    service_code: 'SRV-SEO-01',
    is_featured: true
  }
];

// INITIAL BLOGS
const INITIAL_BLOGS: Blog[] = [
  {
    id: 1,
    slug: 'why-technical-seo-drives-380-percent-more-qualified-leads',
    title: 'Why Technical SEO Drives 380% More Qualified Leads for Hyderabad Businesses',
    excerpt: 'Discover the exact architectural audit checkpoints, Core Web Vitals fixes, and schema markup strategies our agency uses to dominate Google search results.',
    cover_image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
    category: 'SEO & Organic Growth',
    service_code: 'SRV-SEO-01',
    content_blocks: [
      {
        id: 'blk-b1-1',
        type: 'html',
        sort_order: 1,
        html_content: `<p class="text-lg leading-relaxed text-gray-700 mb-6">Search algorithms have fundamentally shifted. Surface-level keyword stuffing no longer works. Modern search engines measure interaction to next paint (INP), semantic content vectors, and technical crawl authority.</p>
<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Eliminating Render-Blocking Bottlenecks</h2>
<p class="text-gray-700 leading-relaxed mb-6">When Sunraise Solutions audits corporate websites across Andhra Pradesh and Telangana, 82% fail Core Web Vitals on mobile devices due to uncompressed media and heavy JavaScript payloads. Fixing this alone often yields an immediate 20-35% boost in search visibility.</p>
<h2 class="text-2xl font-bold text-gray-900 mt-8 mb-4">2. The Power of Hyper-Local Entity Schema</h2>
<p class="text-gray-700 leading-relaxed mb-6">By injecting structured Schema.org JSON-LD linking your physical office addresses in Hyderabad and Rajahmundry with exact geo-coordinates, Google’s Knowledge Graph immediately elevates your brand above generic aggregators.</p>`
      }
    ],
    seo_meta: {
      meta_title: 'Technical SEO Lead Gen Guide | Sunraise Solutions',
      meta_description: 'Learn how technical SEO and Core Web Vitals optimization can drive a 380% surge in organic inbound inquiries for your enterprise.',
      keywords: 'Technical SEO Hyderabad, Organic Lead Generation, Google Core Web Vitals'
    },
    is_published: true,
    published_at: '2026-10-25T10:00:00Z'
  },
  {
    id: 2,
    slug: 'choosing-the-right-hospital-management-software-in-2026',
    title: 'Architecting NABH-Compliant Hospital Management Systems: 2026 Checklist',
    excerpt: 'A strategic roadmap for hospital owners and medical directors on modernizing clinical EHR, patient telemetry, and pharmacy workflows without downtime.',
    cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80',
    category: 'Healthcare Technology',
    service_code: 'SRV-HMS-08',
    content_blocks: [
      {
        id: 'blk-b2-1',
        type: 'html',
        sort_order: 1,
        html_content: `<p class="text-lg leading-relaxed text-gray-700 mb-6">Healthcare modernization is no longer an IT luxury; it is a clinical and legal necessity. A robust Hospital Management System (HMS) must combine rapid OPD triage with bank-grade patient data privacy.</p>`
      }
    ],
    seo_meta: {
      meta_title: 'NABH Hospital Management Software Checklist 2026 | Sunraise',
      meta_description: 'Everything healthcare directors must know when migrating to cloud-native, NABH-compliant hospital software in South India.',
      keywords: 'NABH HMS checklist, Hospital Management Software Andhra Pradesh, Healthcare EHR'
    },
    is_published: true,
    published_at: '2026-10-20T14:30:00Z'
  }
];

// LEADERSHIP TEAM DATA
export const LEADERSHIP_TEAM: LeadershipMember[] = [
  {
    name: 'Kiran Kumar B',
    role: 'Managing Director & CEO',
    bio: '18+ years of visioning and executing mission-critical enterprise software, digital transformation pipelines, and regional scale across South India.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Suresh Kumar',
    role: 'Director',
    bio: 'Oversees operational scalability, key institutional client relationships, and infrastructure governance across Hyderabad and Rajahmundry operations.',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'Neeraj',
    role: 'CEO & Marketing Head',
    bio: 'Architect behind Sunraise’s high-impact digital campaign war rooms, algorithmic SEO engineering, and performance ad growth funnels.',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
    linkedin: 'https://linkedin.com'
  },
  {
    name: 'G. Radhika Rani',
    role: 'CFO & Head of Human Resources',
    bio: 'Leads financial governance, institutional compliance, and talent engineering to cultivate a high-performance technology culture.',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    linkedin: 'https://linkedin.com'
  }
];

// Helper to load or seed localStorage
function loadFromStorage<T>(key: string, defaultData: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(item) as T;
  } catch (e) {
    return defaultData;
  }
}

function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

// ==========================================
// API CLIENT IMPLEMENTATION (CONNECTS TO HOSTINGER PHP BACKEND)
// ==========================================
export const SunraiseAPI = {
  // SERVICES
  async getServices(): Promise<Service[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/services.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          saveToStorage(STORAGE_KEYS.SERVICES, data);
          return data;
        }
      }
    } catch (e) {
      // fallback
    }
    return loadFromStorage<Service[]>(STORAGE_KEYS.SERVICES, INITIAL_SERVICES);
  },

  async getServiceBySlug(slug: string): Promise<Service | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/services.php?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.service_code) return data;
      }
    } catch (e) {
      // fallback
    }

    const services = await this.getServices();
    const service = services.find(s => s.slug === slug);
    if (!service) return null;

    const allProjects = await this.getProjects();
    const allTestimonials = await this.getTestimonials();

    return {
      ...service,
      projects: allProjects.filter(p => p.service_code === service.service_code),
      testimonials: allTestimonials.filter(t => t.service_code === service.service_code || !t.service_code)
    };
  },

  async upsertService(service: Partial<Service>): Promise<Service> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/services.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify(service)
      });
      if (res.ok) {
        // reload from backend
        const all = await this.getServices();
        const found = all.find(s => s.service_code === service.service_code || s.slug === service.slug);
        if (found) return found;
      }
    } catch (e) {
      // fallback
    }

    // LocalStorage Fallback
    const services = await this.getServices();
    let updatedService: Service;

    if (service.id) {
      const idx = services.findIndex(s => s.id === service.id);
      if (idx !== -1) {
        const existing = services[idx];
        if (service.slug && existing.slug && service.slug !== existing.slug) {
          await this.registerSEORedirect(`/services/${existing.slug}`, `/services/${service.slug}`);
        }
        updatedService = { ...existing, ...service, updated_at: new Date().toISOString() } as Service;
        services[idx] = updatedService;
      } else {
        throw new Error('Service not found');
      }
    } else {
      const newId = services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1;
      updatedService = {
        id: newId,
        service_code: service.service_code || `SRV-CUST-${newId.toString().padStart(2, '0')}`,
        slug: service.slug || `service-${newId}`,
        title: service.title || 'New Service',
        short_description: service.short_description || '',
        icon_name: service.icon_name || 'Globe',
        thumbnail_url: service.thumbnail_url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        hero_config: service.hero_config || {
          badge: 'SUNRAISE EXPERTISE',
          title: 'Premium Solutions for',
          highlight_text: 'Modern Enterprises',
          subtitle: 'Accelerating digital growth with engineered precision.',
          primary_cta: 'Get Started',
          secondary_cta: 'Learn More',
          hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          stats: [{ label: 'Client Success', val: '98%' }]
        },
        page_blocks: service.page_blocks || [],
        seo_meta: service.seo_meta || {
          meta_title: `${service.title} | Sunraise Solutions`,
          meta_description: service.short_description || 'Corporate Digital Agency in Hyderabad',
          lock_seo: false
        },
        is_published: service.is_published ?? true,
        display_order: service.display_order ?? (services.length + 1),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      services.push(updatedService);
    }
    saveToStorage(STORAGE_KEYS.SERVICES, services);
    return updatedService;
  },

  async updateServiceBlocks(id: number, blocks: PageBlock[]): Promise<Service> {
    const services = await this.getServices();
    const target = services.find(s => s.id === id);
    if (!target) throw new Error('Service not found');

    const sanitizedBlocks = blocks.map(block => {
      if (block.type === 'html' && block.html_content) {
        return {
          ...block,
          html_content: block.html_content
            .replace(/<h1(\s|>)/gi, '<h2$1')
            .replace(/<\/h1>/gi, '</h2>')
        };
      }
      return block;
    });

    target.page_blocks = sanitizedBlocks;
    target.updated_at = new Date().toISOString();
    return this.upsertService(target);
  },

  async deleteService(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/services.php?id=${id}`, { method: 'DELETE', headers });
    } catch (e) {
      // fallback
    }
    const services = await this.getServices();
    saveToStorage(STORAGE_KEYS.SERVICES, services.filter(s => s.id !== id));
  },

  // PROJECTS
  async getProjects(filter?: string | { service_code?: string; category?: string; is_featured?: boolean; search?: string }): Promise<Project[]> {
    try {
      let queryStr = '';
      if (typeof filter === 'string') {
        queryStr = `?service_code=${encodeURIComponent(filter)}`;
      } else if (filter) {
        const q = new URLSearchParams();
        if (filter.service_code) q.append('service_code', filter.service_code);
        if (filter.category) q.append('category', filter.category);
        if (filter.is_featured !== undefined) q.append('is_featured', filter.is_featured ? '1' : '0');
        if (filter.search) q.append('search', filter.search);
        queryStr = `?${q.toString()}`;
      }

      const res = await fetch(`${API_BASE_URL}/projects.php${queryStr}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveToStorage(STORAGE_KEYS.PROJECTS, data);
          return data;
        }
      }
    } catch (e) {}

    const projects = loadFromStorage<Project[]>(STORAGE_KEYS.PROJECTS, INITIAL_PROJECTS);
    if (typeof filter === 'string') {
      return projects.filter(p => p.service_code === filter);
    }
    return projects;
  },

  async getProjectAnalytics(): Promise<{ total_projects: number; total_views: number; featured_count: number; service_breakdown: any[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects.php?action=analytics`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const p = await this.getProjects();
    return {
      total_projects: p.length,
      total_views: p.reduce((acc, curr) => acc + (curr.views || 0), 0),
      featured_count: p.filter(x => x.is_featured).length,
      service_breakdown: []
    };
  },

  async checkProjectSlug(slug: string, excludeId?: number): Promise<boolean> {
    try {
      const url = `${API_BASE_URL}/projects.php?check_slug=${encodeURIComponent(slug)}${excludeId ? `&exclude_id=${excludeId}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return !!data.available;
      }
    } catch (e) {}
    return true;
  },

  async bulkActionProjects(ids: number[], operation: 'delete' | 'feature' | 'unfeature'): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/projects.php?action=bulk`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ids, operation })
      });
    } catch (e) {}
  },

  async getProjectBySlug(slug: string): Promise<Project | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/projects.php?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) return data;
      }
    } catch (e) {}
    const projects = await this.getProjects();
    return projects.find(p => p.slug === slug) || null;
  },

  async upsertProject(project: Partial<Project>): Promise<Project> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/projects.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify(project)
      });
      if (res.ok) {
        const all = await this.getProjects();
        const found = all.find(p => p.slug === project.slug);
        if (found) return found;
      }
    } catch (e) {}

    const projects = await this.getProjects();
    let updated: Project;
    if (project.id) {
      const idx = projects.findIndex(p => p.id === project.id);
      if (idx !== -1) {
        updated = { ...projects[idx], ...project } as Project;
        projects[idx] = updated;
      } else {
        throw new Error('Project not found');
      }
    } else {
      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
      updated = {
        id: newId,
        slug: project.slug || `project-${newId}`,
        title: project.title || 'New Project',
        client_name: project.client_name || 'Client',
        client_industry: project.client_industry || 'Corporate Enterprise',
        project_year: project.project_year || new Date().getFullYear().toString(),
        service_code: project.service_code || 'SRV-SEO-01',
        category_badge: project.category_badge || 'Completed Project',
        thumbnail_url: project.thumbnail_url || 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1000&q=80',
        summary: project.summary || '',
        challenge: project.challenge || '',
        solution: project.solution || '',
        metrics: project.metrics || [],
        technologies: project.technologies || '',
        views: 0,
        seo_meta: project.seo_meta || { meta_title: `${project.title} | Sunraise`, meta_description: project.summary || '' },
        is_featured: project.is_featured ?? true,
        created_at: new Date().toISOString()
      };
      projects.push(updated);
    }
    saveToStorage(STORAGE_KEYS.PROJECTS, projects);
    return updated;
  },

  async deleteProject(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/projects.php?id=${id}`, { method: 'DELETE', headers });
    } catch (e) {}
    const projects = await this.getProjects();
    saveToStorage(STORAGE_KEYS.PROJECTS, projects.filter(p => p.id !== id));
  },

  // TESTIMONIALS
  async getTestimonials(serviceCode?: string): Promise<Testimonial[]> {
    try {
      const url = serviceCode ? `${API_BASE_URL}/testimonials.php?service_code=${encodeURIComponent(serviceCode)}` : `${API_BASE_URL}/testimonials.php`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveToStorage(STORAGE_KEYS.TESTIMONIALS, data);
          return data;
        }
      }
    } catch (e) {}
    const testimonials = loadFromStorage<Testimonial[]>(STORAGE_KEYS.TESTIMONIALS, INITIAL_TESTIMONIALS);
    if (serviceCode) {
      return testimonials.filter(t => t.service_code === serviceCode || !t.service_code);
    }
    return testimonials;
  },

  async upsertTestimonial(testimonial: Partial<Testimonial>): Promise<Testimonial> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/testimonials.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify(testimonial)
      });
    } catch (e) {}
    const list = await this.getTestimonials();
    let updated: Testimonial;
    if (testimonial.id) {
      const idx = list.findIndex(t => t.id === testimonial.id);
      if (idx !== -1) {
        updated = { ...list[idx], ...testimonial } as Testimonial;
        list[idx] = updated;
      } else {
        throw new Error('Testimonial not found');
      }
    } else {
      const newId = list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : 1;
      updated = {
        id: newId,
        client_name: testimonial.client_name || 'Client',
        client_role: testimonial.client_role || 'Executive',
        avatar_url: testimonial.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        rating: testimonial.rating || 5.0,
        review_text: testimonial.review_text || '',
        service_code: testimonial.service_code || null,
        is_featured: testimonial.is_featured ?? true,
        created_at: new Date().toISOString()
      };
      list.push(updated);
    }
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, list);
    return updated;
  },

  async deleteTestimonial(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/testimonials.php?id=${id}`, { method: 'DELETE', headers });
    } catch (e) {}
    const list = await this.getTestimonials();
    saveToStorage(STORAGE_KEYS.TESTIMONIALS, list.filter(t => t.id !== id));
  },

  // CATEGORIES
  async getCategories(): Promise<{ id: number; name: string; slug: string; post_count: number }[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/categories.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) return data;
      }
    } catch (e) {}
    return [
      { id: 1, name: 'SEO & Organic Growth', slug: 'seo-organic-growth', post_count: 1 },
      { id: 2, name: 'Web Engineering', slug: 'web-engineering', post_count: 0 },
      { id: 3, name: 'Mobile Architecture', slug: 'mobile-architecture', post_count: 0 },
      { id: 4, name: 'Healthcare Technology', slug: 'healthcare-technology', post_count: 1 },
      { id: 5, name: 'Performance Marketing', slug: 'performance-marketing', post_count: 0 },
      { id: 6, name: 'Political Branding', slug: 'political-branding', post_count: 0 },
      { id: 7, name: 'CGI & 3D Visuals', slug: 'cgi-3d-visuals', post_count: 0 }
    ];
  },

  async createCategory(name: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/categories.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ name })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to create category');
    }
    return await res.json();
  },

  async deleteCategory(idOrName: number | string): Promise<void> {
    const headers = await getAuthHeaders();
    const param = typeof idOrName === 'number' ? `id=${idOrName}` : `name=${encodeURIComponent(idOrName)}`;
    await fetch(`${API_BASE_URL}/categories.php?${param}`, { method: 'DELETE', headers });
  },

  // BLOGS
  async getBlogs(filters?: { search?: string; category?: string; status?: string; service_code?: string; sort?: string; include_drafts?: boolean }): Promise<Blog[]> {
    try {
      const q = new URLSearchParams();
      if (filters?.include_drafts) q.append('include_drafts', '1');
      if (filters?.search) q.append('search', filters.search);
      if (filters?.category) q.append('category', filters.category);
      if (filters?.status) q.append('status', filters.status);
      if (filters?.service_code) q.append('service_code', filters.service_code);
      if (filters?.sort) q.append('sort', filters.sort);

      const res = await fetch(`${API_BASE_URL}/blogs.php?${q.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveToStorage(STORAGE_KEYS.BLOGS, data);
          return data;
        }
      }
    } catch (e) {}
    return loadFromStorage<Blog[]>(STORAGE_KEYS.BLOGS, INITIAL_BLOGS);
  },

  async getBlogAnalytics(): Promise<{ total_posts: number; total_views: number; status_counts: { published: number; draft: number; scheduled: number }; category_breakdown: any[] }> {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs.php?action=analytics`);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}
    const all = await this.getBlogs({ include_drafts: true });
    return {
      total_posts: all.length,
      total_views: all.reduce((acc, curr) => acc + (curr.views || 0), 0),
      status_counts: {
        published: all.filter(x => (x.status || (x.is_published ? 'published' : 'draft')) === 'published').length,
        draft: all.filter(x => x.status === 'draft' || (!x.is_published && x.status !== 'scheduled')).length,
        scheduled: all.filter(x => x.status === 'scheduled').length
      },
      category_breakdown: []
    };
  },

  async checkBlogSlug(slug: string, excludeId?: number): Promise<boolean> {
    try {
      const url = `${API_BASE_URL}/blogs.php?check_slug=${encodeURIComponent(slug)}${excludeId ? `&exclude_id=${excludeId}` : ''}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        return !!data.available;
      }
    } catch (e) {}
    return true;
  },

  async bulkActionBlogs(ids: number[], operation: 'delete' | 'publish' | 'draft'): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/blogs.php?action=bulk`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ids, operation })
      });
    } catch (e) {}
  },

  async getBlogBySlug(slug: string): Promise<Blog | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/blogs.php?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) return data;
      }
    } catch (e) {}
    const blogs = await this.getBlogs({ include_drafts: true });
    return blogs.find(b => b.slug === slug) || null;
  },

  async upsertBlog(blog: Partial<Blog>): Promise<Blog> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/blogs.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify(blog)
      });
    } catch (e) {}
    const blogs = await this.getBlogs({ include_drafts: true });
    let updated: Blog;
    if (blog.id) {
      const idx = blogs.findIndex(b => b.id === blog.id);
      if (idx !== -1) {
        updated = { ...blogs[idx], ...blog, updated_at: new Date().toISOString() } as Blog;
        blogs[idx] = updated;
      } else {
        throw new Error('Blog not found');
      }
    } else {
      const newId = blogs.length > 0 ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
      updated = {
        id: newId,
        slug: blog.slug || `article-${newId}`,
        title: blog.title || 'New Article',
        excerpt: blog.excerpt || '',
        cover_image: blog.cover_image || 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=1200&q=80',
        image_alt: blog.image_alt || '',
        image_caption: blog.image_caption || '',
        category: blog.category || 'SEO & Organic Growth',
        service_code: blog.service_code || null,
        tags: blog.tags || '',
        author: blog.author || 'Sunraise Editorial Team',
        is_featured: blog.is_featured ?? false,
        views: 0,
        status: blog.status || 'published',
        scheduled_at: blog.scheduled_at || null,
        content_html: blog.content_html || '',
        content_blocks: blog.content_blocks || [],
        seo_meta: blog.seo_meta || { meta_title: `${blog.title} | Sunraise`, meta_description: blog.excerpt || '' },
        published_at: new Date().toISOString(),
        is_published: (blog.status ? blog.status === 'published' : (blog.is_published ?? true)),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      blogs.push(updated);
    }
    saveToStorage(STORAGE_KEYS.BLOGS, blogs);
    return updated;
  },

  async deleteBlog(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/blogs.php?id=${id}`, { method: 'DELETE', headers });
    } catch (e) {}
    const blogs = await this.getBlogs();
    saveToStorage(STORAGE_KEYS.BLOGS, blogs.filter(b => b.id !== id));
  },

  // LEADS & INQUIRIES
  async submitLead(lead: Omit<Lead, 'id' | 'status' | 'created_at'>): Promise<Lead> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/leads.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify(lead)
      });
      if (res.ok) {
        const resp = await res.json();
        return { ...lead, id: resp.id || Date.now(), status: 'new', created_at: new Date().toISOString() };
      }
    } catch (e) {}

    const leads = loadFromStorage<Lead[]>(STORAGE_KEYS.LEADS, []);
    const newId = leads.length > 0 ? Math.max(...leads.map(l => l.id)) + 1 : 1;
    const newLead: Lead = {
      ...lead,
      id: newId,
      status: 'new',
      created_at: new Date().toISOString()
    };
    leads.unshift(newLead);
    saveToStorage(STORAGE_KEYS.LEADS, leads);
    return newLead;
  },

  async getLeads(): Promise<Lead[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/leads.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveToStorage(STORAGE_KEYS.LEADS, data);
          return data;
        }
      }
    } catch (e) {}
    return loadFromStorage<Lead[]>(STORAGE_KEYS.LEADS, []);
  },

  async updateLeadStatus(id: number, status: Lead['status']): Promise<Lead> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/leads.php`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ id, status })
      });
    } catch (e) {}
    const leads = await this.getLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx !== -1) {
      leads[idx].status = status;
      saveToStorage(STORAGE_KEYS.LEADS, leads);
      return leads[idx];
    }
    return { id, full_name: '', email: '', phone: '', budget_range: '', message: '', status };
  },

  // 301 SEO REDIRECTS
  async registerSEORedirect(oldPath: string, newPath: string): Promise<void> {
    const redirects = loadFromStorage<SEORedirect[]>(STORAGE_KEYS.REDIRECTS, []);
    const existing = redirects.find(r => r.old_path === oldPath);
    if (!existing) {
      redirects.push({
        id: redirects.length + 1,
        old_path: oldPath,
        new_path: newPath,
        status_code: 301,
        created_at: new Date().toISOString()
      });
      saveToStorage(STORAGE_KEYS.REDIRECTS, redirects);
    }
  },

  async getSEORedirects(): Promise<SEORedirect[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/redirects.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          saveToStorage(STORAGE_KEYS.REDIRECTS, data);
          return data;
        }
      }
    } catch (e) {}
    return loadFromStorage<SEORedirect[]>(STORAGE_KEYS.REDIRECTS, []);
  },

  // MEDIA UPLOAD (PNG, JPG, WEBP, MP4, etc.) with multipart + base64 dual-resilience
  async uploadMedia(file: File): Promise<{ url: string; filename: string }> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const headers = await getAuthHeaders(false); // browser sets multipart boundary
      const res = await fetch(`${API_BASE_URL}/upload.php`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Multipart upload failed or was blocked by proxy, trying base64 fallback...', e);
    }

    // Base64 JSON upload fallback (100% resilient across Vite proxies, CORS, and hosting firewalls)
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = reader.result as string;
          const headers = await getAuthHeaders(true);
          const res = await fetch(`${API_BASE_URL}/upload.php`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
              image: base64Data,
              filename: file.name
            })
          });

          if (!res.ok) {
            const err = await res.json();
            throw new Error(err.message || 'Media upload failed');
          }

          const data = await res.json();
          resolve(data);
        } catch (err: any) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file as data URL'));
      reader.readAsDataURL(file);
    });
  },

  // SEO CENTRAL ENGINE APIS
  async getSEOPages(params?: { type?: string; search?: string }): Promise<{ pages: SEOPageItem[]; stats: SEOStats }> {
    try {
      const query = new URLSearchParams();
      if (params?.type && params.type !== 'all') query.set('type', params.type);
      if (params?.search) query.set('search', params.search);
      const res = await fetch(`${API_BASE_URL}/seo.php?${query.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return {
          pages: json.pages || [],
          stats: json.stats || {
            total_pages: 0,
            indexed_pages: 0,
            core_pages: 0,
            service_pages: 0,
            blog_pages: 0,
            project_pages: 0,
            avg_health_score: 100
          }
        };
      }
    } catch (e) {}
    return {
      pages: [],
      stats: {
        total_pages: 0,
        indexed_pages: 0,
        core_pages: 0,
        service_pages: 0,
        blog_pages: 0,
        project_pages: 0,
        avg_health_score: 100
      }
    };
  },

  async updateSEOPage(page: Partial<SEOPageItem>): Promise<boolean> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/seo.php`, {
      method: 'POST',
      headers,
      body: JSON.stringify(page)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Failed to update SEO metadata');
    }
    return true;
  },

  async bulkUpdateSEO(payload: { paths: string[]; operation: string; value: any }): Promise<boolean> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/seo.php?action=bulk`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'Bulk SEO update failed');
    }
    return true;
  },

  async syncSEOPages(): Promise<string> {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API_BASE_URL}/seo.php?action=sync`, {
      method: 'POST',
      headers
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.message || 'SEO auto-sync failed');
    }
    const data = await res.json();
    return data.message || 'SEO pages synchronized';
  },

  // ==========================================
  // CUSTOM CMS PAGES (STANDALONE & LANDING PAGES)
  // ==========================================
  async getPages(): Promise<CustomPage[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/pages.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          if (data.length > 0) {
            saveToStorage(STORAGE_KEYS.PAGES, data);
            return data;
          } else {
            // Auto-seed initial pages into database
            try {
              for (const p of INITIAL_PAGES) {
                await fetch(`${API_BASE_URL}/pages.php`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(p)
                });
              }
            } catch (err) {}
            return INITIAL_PAGES;
          }
        }
      }
    } catch (e) {}

    return loadFromStorage<CustomPage[]>(STORAGE_KEYS.PAGES, INITIAL_PAGES);
  },

  async getPageBySlug(slug: string): Promise<CustomPage | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/pages.php?slug=${encodeURIComponent(slug)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.slug) return data;
      }
    } catch (e) {}

    const pages = await this.getPages();
    return pages.find((p) => p.slug === slug) || null;
  },

  async getPageById(id: number): Promise<CustomPage | null> {
    try {
      const res = await fetch(`${API_BASE_URL}/pages.php?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) return data;
      }
    } catch (e) {}

    const pages = await this.getPages();
    return pages.find((p) => p.id === id) || null;
  },

  async upsertPage(page: Partial<CustomPage>): Promise<CustomPage> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/pages.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify(page)
      });
      if (res.ok) {
        const all = await this.getPages();
        const found = all.find((p) => p.slug === page.slug);
        if (found) return found;
      }
    } catch (e) {}

    const pages = await this.getPages();
    let updatedPage: CustomPage;

    if (page.id) {
      const idx = pages.findIndex((p) => p.id === page.id);
      if (idx !== -1) {
        const existing = pages[idx];
        if (page.slug && existing.slug && page.slug !== existing.slug) {
          await this.registerSEORedirect(`/p/${existing.slug}`, `/p/${page.slug}`);
        }
        updatedPage = {
          ...existing,
          ...page,
          updated_at: new Date().toISOString()
        } as CustomPage;
        pages[idx] = updatedPage;
      } else {
        throw new Error('Page not found');
      }
    } else {
      const newId = pages.length > 0 ? Math.max(...pages.map((p) => p.id)) + 1 : 1;
      updatedPage = {
        id: newId,
        page_key: page.page_key || `page_${newId}_${Date.now()}`,
        slug: page.slug || `page-${newId}`,
        title: page.title || 'New Landing Page',
        page_type: page.page_type || 'landing',
        status: page.status || 'draft',
        scheduled_at: page.scheduled_at || null,
        hero_config: page.hero_config || {
          badge: 'GROWTH BLUEPRINT',
          title: page.title || 'High-Impact Digital Solutions',
          highlight_text: 'For Growing Enterprises',
          subtitle: 'Engineered for conversion velocity, brand dominance, and measurable ROI.',
          primary_cta: 'Claim Free Strategy Session',
          secondary_cta: 'Explore Capabilities',
          hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
          stats: [
            { label: 'Client Retention', val: '98%' },
            { label: 'Average Growth', val: '+240%' }
          ]
        },
        page_blocks: page.page_blocks || [],
        seo_meta: page.seo_meta || {
          meta_title: `${page.title || 'New Page'} | Sunraise Solutions`,
          meta_description: 'High-performance digital agency platform and solutions.',
          focus_keyword: '',
          robots_index: true,
          robots_follow: true,
          sitemap_include: true
        },
        seo_score: page.seo_score || 85,
        author: page.author || 'SEO Strategy Team',
        last_modified_by: page.last_modified_by || 'Admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      pages.push(updatedPage);
    }

    saveToStorage(STORAGE_KEYS.PAGES, pages);
    return updatedPage;
  },

  async deletePage(id: number): Promise<void> {
    try {
      const headers = await getAuthHeaders();
      await fetch(`${API_BASE_URL}/pages.php?id=${id}`, { method: 'DELETE', headers });
    } catch (e) {}

    const pages = await this.getPages();
    saveToStorage(STORAGE_KEYS.PAGES, pages.filter((p) => p.id !== id));
  },

  // ==========================================
  // PAGE REVISIONS & ROLLBACK WORKFLOW
  // ==========================================
  async getPageRevisions(targetId: number, targetType: 'service' | 'page' = 'page'): Promise<PageRevision[]> {
    const list = loadFromStorage<PageRevision[]>(STORAGE_KEYS.REVISIONS, INITIAL_REVISIONS);
    return list.filter((r) => r.target_id === targetId && r.target_type === targetType);
  },

  async savePageRevision(rev: Omit<PageRevision, 'id' | 'saved_at'>): Promise<PageRevision> {
    const list = loadFromStorage<PageRevision[]>(STORAGE_KEYS.REVISIONS, INITIAL_REVISIONS);
    const newRev: PageRevision = {
      ...rev,
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      saved_at: new Date().toISOString()
    };
    list.unshift(newRev);
    // Keep last 30 revisions
    const trimmed = list.slice(0, 30);
    saveToStorage(STORAGE_KEYS.REVISIONS, trimmed);
    return newRev;
  },

  // ==========================================
  // MEDIA LIBRARY MANAGEMENT (PERSISTED IN MYSQL & HOSTINGER STORAGE)
  // ==========================================
  async uploadMediaFile(file: File, folder: string = 'Uploads'): Promise<MediaItem> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    try {
      const headers = await getAuthHeaders(false);
      const res = await fetch(`${API_BASE_URL}/upload.php`, {
        method: 'POST',
        headers,
        body: formData
      });

      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const item: MediaItem = {
            id: `media-${Date.now()}`,
            url: data.url,
            filename: data.filename || file.name,
            title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            alt: file.name.replace(/\.[^/.]+$/, ''),
            sizeBytes: data.size || file.size,
            format: file.type.split('/')[1]?.toUpperCase() || 'WEBP',
            folder,
            uploaded_at: new Date().toISOString()
          };
          const current = await this.getMediaItems();
          saveToStorage(STORAGE_KEYS.MEDIA, [item, ...current.filter((m) => m.url !== item.url)]);
          return item;
        }
      }
    } catch (err) {
      console.warn('Server upload failed, converting to embedded data URL:', err);
    }

    // Reliable fallback for offline or restricted cross-origin: convert to Base64 so it opens everywhere!
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Url = reader.result as string;
        try {
          const res = await fetch(`${API_BASE_URL}/upload.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              image: base64Url,
              title: file.name.replace(/\.[^/.]+$/, ''),
              folder
            })
          });
          if (res.ok) {
            const data = await res.json();
            if (data.url) {
              const item: MediaItem = {
                id: `media-${Date.now()}`,
                url: data.url,
                filename: data.filename || file.name,
                title: file.name.replace(/\.[^/.]+$/, ''),
                alt: file.name.replace(/\.[^/.]+$/, ''),
                sizeBytes: file.size,
                format: 'WEBP',
                folder,
                uploaded_at: new Date().toISOString()
              };
              const current = await this.getMediaItems();
              saveToStorage(STORAGE_KEYS.MEDIA, [item, ...current]);
              return resolve(item);
            }
          }
        } catch (e) {}

        const item: MediaItem = {
          id: `media-${Date.now()}`,
          url: base64Url,
          filename: file.name,
          title: file.name.replace(/\.[^/.]+$/, ''),
          alt: file.name.replace(/\.[^/.]+$/, ''),
          sizeBytes: file.size,
          format: 'DATA-URL',
          folder,
          uploaded_at: new Date().toISOString()
        };
        const current = await this.getMediaItems();
        saveToStorage(STORAGE_KEYS.MEDIA, [item, ...current]);
        resolve(item);
      };
      reader.readAsDataURL(file);
    });
  },

  // ==========================================
  // NAVIGATION & MENUS MANAGEMENT
  // ==========================================
  async getNavigation(): Promise<{ tree: NavigationItem[]; flat_items: NavigationItem[]; settings: NavigationSettings }> {
    try {
      const res = await fetch(`${API_BASE_URL}/navigation.php`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.tree && data.tree.length > 0) {
          saveToStorage(STORAGE_KEYS.NAVIGATION, data);
          return data;
        }
      }
    } catch (e) {}

    const cached = loadFromStorage<{ tree: NavigationItem[]; flat_items: NavigationItem[]; settings: NavigationSettings } | null>(STORAGE_KEYS.NAVIGATION, null);
    if (cached) return cached;

    // Fallback default navigation
    return {
      tree: [
        { id: 1, parent_id: null, title: 'Home', url: '/', sort_order: 1, is_active: true, children: [] },
        { id: 2, parent_id: null, title: 'About Us', url: '/about', sort_order: 2, is_active: true, children: [
          { id: 21, parent_id: 2, title: 'Our Leadership Team', url: '/about#leadership', sort_order: 1, is_active: true, badge: 'Core', description: '18+ years corporate digital excellence' },
          { id: 22, parent_id: 2, title: 'Corporate Locations', url: '/about#locations', sort_order: 2, is_active: true, badge: 'Dual Hub', description: 'Hyderabad HQ and Rajahmundry Regional Delivery Center' }
        ] },
        { id: 3, parent_id: null, title: 'Services', url: '/services', sort_order: 3, is_active: true, badge: '8 Capabilities', description: 'Enterprise engineering & marketing capabilities', children: [] },
        { id: 4, parent_id: null, title: 'Projects', url: '/projects', sort_order: 4, is_active: true, children: [] },
        { id: 5, parent_id: null, title: 'Blog', url: '/blog', sort_order: 5, is_active: true, children: [] },
        { id: 6, parent_id: null, title: 'Contact', url: '/contact', sort_order: 6, is_active: true, children: [] },
      ],
      flat_items: [],
      settings: {
        top_bar_announcement: 'Dual Presence: Hyderabad HQ & Rajahmundry Regional Hub | 18+ Years Corporate Digital Excellence',
        top_bar_phone: '+91 99596 39539',
        top_bar_show_admin_link: '1',
        navbar_logo_url: '/logo.png',
        navbar_cta_text: 'Get Proposal',
        navbar_cta_url: '/contact',
        navbar_cta_visible: '1',
        services_dropdown_title: 'Our Core Specializations',
        services_dropdown_subtitle: '8 Enterprise Capabilities',
        services_dropdown_promo_title: 'Looking for custom bespoke enterprise architecture?',
        services_dropdown_promo_cta: 'Consult Our Architects',
        services_dropdown_promo_url: '/contact'
      }
    };
  },

  async saveNavigationTree(tree: NavigationItem[], settings?: NavigationSettings): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/navigation.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ tree, settings })
      });
      if (res.ok) {
        saveToStorage(STORAGE_KEYS.NAVIGATION, { tree, settings, flat_items: [] });
        return true;
      }
    } catch (e) {}
    saveToStorage(STORAGE_KEYS.NAVIGATION, { tree, settings, flat_items: [] });
    return true;
  },

  async saveNavigationSettings(settings: NavigationSettings): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/navigation.php`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ settings })
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async deleteNavigationItem(id: number): Promise<boolean> {
    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`${API_BASE_URL}/navigation.php?id=${id}`, {
        method: 'DELETE',
        headers
      });
      return res.ok;
    } catch (e) {
      return false;
    }
  },

  async getMediaItems(): Promise<MediaItem[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/upload.php`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const dbItems: MediaItem[] = data.map((d: any) => ({
            id: String(d.id || `media-${Date.now()}`),
            url: d.url,
            filename: d.filename || 'media_asset.webp',
            title: d.title || 'Media Asset',
            alt: d.alt || '',
            caption: d.caption || '',
            sizeBytes: Number(d.size_bytes) || 0,
            folder: d.folder || 'Uploads',
            format: d.format || 'WEBP',
            uploaded_at: d.created_at || new Date().toISOString()
          }));

          const cached = loadFromStorage<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
          // Combine DB items with initial items, deduplicated by URL
          const combined = [...dbItems];
          for (const c of cached) {
            if (!combined.some((m) => m.url === c.url)) {
              combined.push(c);
            }
          }
          saveToStorage(STORAGE_KEYS.MEDIA, combined);
          return combined;
        }
      }
    } catch (e) {}

    return loadFromStorage<MediaItem[]>(STORAGE_KEYS.MEDIA, INITIAL_MEDIA);
  },

  async addMediaItem(item: Partial<MediaItem>): Promise<MediaItem> {
    // If it has base64 data, persist to server
    if (item.url && item.url.startsWith('data:')) {
      try {
        const res = await fetch(`${API_BASE_URL}/upload.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: item.url,
            title: item.title,
            folder: item.folder
          })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.url) item.url = data.url;
        }
      } catch (e) {}
    }

    const list = await this.getMediaItems();
    const newItem: MediaItem = {
      id: item.id || `media-${Date.now()}`,
      url: item.url || '',
      filename: item.filename || 'media_asset.webp',
      title: item.title || 'Sunraise Media Asset',
      alt: item.alt || 'Sunraise Solutions digital asset',
      caption: item.caption || '',
      width: item.width || 1200,
      height: item.height || 800,
      sizeBytes: item.sizeBytes || 184000,
      folder: item.folder || 'General',
      format: item.format || 'WEBP',
      uploaded_at: new Date().toISOString()
    };
    list.unshift(newItem);
    saveToStorage(STORAGE_KEYS.MEDIA, list);
    return newItem;
  },

  async updateMediaItem(id: string, updates: Partial<MediaItem>): Promise<MediaItem> {
    const list = await this.getMediaItems();
    const idx = list.findIndex((m) => m.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      saveToStorage(STORAGE_KEYS.MEDIA, list);
      return list[idx];
    }
    throw new Error('Media item not found');
  },

  async deleteMediaItem(id: string): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/upload.php?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {}
    const list = await this.getMediaItems();
    saveToStorage(STORAGE_KEYS.MEDIA, list.filter((m) => m.id !== id));
  },

  // RESET TO FACTORY DEMO DATA
  async resetToDefaults(): Promise<void> {
    try {
      await fetch(`${API_BASE_URL}/seed.php`);
    } catch (e) {}
    localStorage.clear();
    window.location.reload();
  }
};

// INITIAL SEED CUSTOM PAGES
const INITIAL_PAGES: CustomPage[] = [
  {
    id: 1,
    page_key: 'page_core_home',
    slug: 'home',
    title: 'Home Page',
    page_type: 'core',
    status: 'published',
    hero_config: {
      badge: '18+ YEARS ENTERPRISE DOMINANCE',
      title: 'High-Performance Digital Growth & Technology Solutions',
      highlight_text: 'By Sunraise Solutions',
      subtitle: 'Uniting algorithmic search domination, high-velocity web architectures, and corporate digital equity across South India.',
      primary_cta: 'Claim Free Proposal',
      secondary_cta: 'Explore Capabilities',
      hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Client Retention', val: '98%' },
        { label: 'Growth Surge', val: '+280%' }
      ]
    },
    page_blocks: [
      {
            "id": "blk-home-kpi",
            "type": "visual",
            "component_name": "KPICounter",
            "sort_order": 1,
            "props": {
                  "title": "Sunraise Solutions 18+ Years Performance Metrics",
                  "stats": [
                        {
                              "label": "Market Leadership",
                              "val": "18+ Yrs"
                        },
                        {
                              "label": "Deployed Platforms",
                              "val": "500+"
                        },
                        {
                              "label": "Client Retention Rate",
                              "val": "98%"
                        },
                        {
                              "label": "Organic Traffic Surge",
                              "val": "+380%"
                        }
                  ]
            }
      },
      {
            "id": "blk-home-locations",
            "type": "visual",
            "component_name": "TwoColumn",
            "sort_order": 2,
            "props": {
                  "title": "Dual Corporate Presence: Strategic Headquarters & Regional Delivery Hub",
                  "columns": [
                        {
                              "id": "col-home-hyd",
                              "title": "Hyderabad Corporate Headquarters",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Hyderabad Headquarters (HITEC City Cyber Towers)",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-img1",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Hyderabad Corporate Office",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-p1",
                                          "type": "Paragraph",
                                          "text": "Level 4, Cyber Towers, HITEC City, Hyderabad. Our executive war room managing multi-crore campaigns, enterprise cloud architecture, and high-stakes SEO.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-btn1",
                                          "type": "Button",
                                          "text": "Visit Hyderabad HQ",
                                          "url": "/about#locations",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-home-rjy",
                              "title": "Rajahmundry Regional Delivery Hub",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Rajahmundry Regional Operations & Delivery Hub",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-img2",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Rajahmundry Regional Center",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-p2",
                                          "type": "Paragraph",
                                          "text": "Danavaipeta, Rajahmundry, Andhra Pradesh. High-velocity engineering, customer success, and local market deployment for coastal Andhra enterprises.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-btn2",
                                          "type": "Button",
                                          "text": "Explore Regional Delivery",
                                          "url": "/about#locations",
                                          "variant": "secondary",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-home-services-heading",
            "type": "visual",
            "component_name": "Heading",
            "sort_order": 3,
            "props": {
                  "level": "h2",
                  "text": "Comprehensive 360\u00b0 Corporate Digital Capabilities",
                  "alignment": "center"
            }
      },
      {
            "id": "blk-home-services-grid",
            "type": "visual",
            "component_name": "FeatureGrid",
            "sort_order": 4,
            "props": {
                  "title": "8 Specialized Enterprise Capabilities",
                  "description": "Engineered for sub-second page performance, verifiable Google dominance, and maximum conversion velocity.",
                  "features": [
                        "SRV-SEO-01: Algorithmic Search Dominance & Local Map Pack 3-Pack Rank",
                        "SRV-WEB-02: Next.js & React High-Performance Headless Cloud Web Architecture",
                        "SRV-APP-03: Native iOS & Android Cross-Platform Mobile Applications",
                        "SRV-SMM-04: High-ROAS Meta & Google Ads Performance Marketing Engines",
                        "SRV-DEV-05: Bespoke Custom Cloud Software, Enterprise ERP & CRM Platforms",
                        "SRV-POL-06: Strategic Electoral Sentiment Analytics & Digital Voter Outreach",
                        "SRV-MED-07: Broadcast-Grade Commercial Video & Corporate Film Production",
                        "SRV-HOS-08: NABH-Compliant Hospital Management Software & Clinical Telemetry"
                  ]
            }
      },
      {
            "id": "blk-home-timeline",
            "type": "visual",
            "component_name": "ProcessTimeline",
            "sort_order": 5,
            "props": {
                  "title": "Our 4-Stage Search & Revenue Domination Protocol",
                  "steps": [
                        {
                              "step": "01",
                              "title": "Algorithmic Audit & Discovery",
                              "desc": "In-depth crawler analysis identifying crawl budget issues, index bloat, and technical bottlenecks."
                        },
                        {
                              "step": "02",
                              "title": "Architecture & On-Page Engineering",
                              "desc": "Semantic HTML5, Schema.org entity injection, and Core Web Vitals speed optimization."
                        },
                        {
                              "step": "03",
                              "title": "Digital PR & High-Authority Links",
                              "desc": "White-hat contextual outreach alongside local citation sync across Hyderabad & AP."
                        },
                        {
                              "step": "04",
                              "title": "Continuous CRO & Conversion Funnels",
                              "desc": "Bi-weekly analytics, A/B testing, and lead attribution tracking."
                        }
                  ]
            }
      },
      {
            "id": "blk-home-projects",
            "type": "visual",
            "component_name": "TwoColumn",
            "sort_order": 6,
            "props": {
                  "title": "Real Deployed Client Architectures & Proven Outcomes",
                  "columns": [
                        {
                              "id": "col-proj-1",
                              "title": "NABH Clinical Healthcare Platform",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-h3",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "NABH Clinical Healthcare SaaS & Telemetry",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-img3",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Healthcare Software",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-p3",
                                          "type": "Paragraph",
                                          "text": "Engineered high-concurrency electronic health record (EHR) and real-time ICU bed occupancy telemetry system for multi-specialty hospitals in AP & Telangana.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-btn3",
                                          "type": "Button",
                                          "text": "View Healthcare Project",
                                          "url": "/projects",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-proj-2",
                              "title": "Omnichannel Retail Platform",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-h4",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Omnichannel Multi-Crore Retail & eCommerce Platform",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-img4",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                                          "alt": "eCommerce Software",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-p4",
                                          "type": "Paragraph",
                                          "text": "High-scale React commerce architecture handling 100,000+ daily sessions, automated warehouse inventory sync, and sub-second checkout speeds.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-btn4",
                                          "type": "Button",
                                          "text": "View eCommerce Project",
                                          "url": "/projects",
                                          "variant": "secondary",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-home-testimonials",
            "type": "visual",
            "component_name": "Testimonials",
            "sort_order": 7,
            "props": {
                  "title": "Verified Enterprise Client Endorsements",
                  "testimonials": [
                        {
                              "name": "Dr. C. V. Raman",
                              "role": "Medical Director, Sunshine Hospitals",
                              "content": "Sunraise Solutions built our entire clinical workflow and search presence. Inquiries from Hyderabad increased by 320% in 6 months.",
                              "rating": 5
                        },
                        {
                              "name": "Rajesh Varma",
                              "role": "Managing Director, Coastal Infrastructure Ltd",
                              "content": "18 years of trust. Sunraise handles our digital strategy, bespoke ERP, and brand reputation with surgical precision.",
                              "rating": 5
                        },
                        {
                              "name": "Pooja Reddy",
                              "role": "Chief Marketing Officer, FinVantage Capital",
                              "content": "Our customer acquisition costs dropped by 44% while our organic ranking reached #1 across all our target financial terms.",
                              "rating": 5
                        }
                  ]
            }
      },
      {
            "id": "blk-home-faq",
            "type": "visual",
            "component_name": "FAQAccordion",
            "sort_order": 8,
            "props": {
                  "title": "Frequently Asked Questions",
                  "items": [
                        {
                              "q": "Why choose Sunraise Solutions over generic agencies?",
                              "a": "We have 18+ years of dedicated regional dominance, full-stack in-house software engineers, and zero-compromise Core Web Vitals performance."
                        },
                        {
                              "q": "How quickly can we expect measurable SEO and traffic results?",
                              "a": "Most clients observe Google top-3 ranking improvements and conversion velocity jumps within 60 to 90 days."
                        },
                        {
                              "q": "Can you build custom cloud software integrated with our existing CRM?",
                              "a": "Yes, our engineering team specializes in custom APIs, enterprise ERP/HMS software, and seamless cloud integrations."
                        }
                  ]
            }
      },
      {
            "id": "blk-home-cta",
            "type": "visual",
            "component_name": "CTABanner",
            "sort_order": 9,
            "props": {
                  "badge": "CORPORATE DIGITAL LEADERSHIP",
                  "title": "Ready to Dominate Your Market & Accelerate Revenue?",
                  "description": "Schedule a confidential technical audit and discovery session with our senior architects in Hyderabad or Rajahmundry.",
                  "button_text": "Claim Free Strategy Session",
                  "button_url": "/contact"
            }
      }
],
    seo_meta: {
      meta_title: 'Sunraise Solutions | Corporate Digital Transformation Agency Hyderabad',
      meta_description: 'High-performance digital marketing, custom cloud software, and brand dominance architectures.',
      focus_keyword: 'Digital Agency Hyderabad',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 95,
    author: 'Sunraise Architecture',
    last_modified_by: 'Admin',
    created_at: '2026-10-31T00:00:00Z',
    updated_at: '2026-10-31T00:00:00Z'
  },
  {
    id: 2,
    page_key: 'page_core_about',
    slug: 'about',
    title: 'About Us',
    page_type: 'core',
    status: 'published',
    hero_config: {
      badge: 'CORPORATE HERITAGE',
      title: '18+ Years Building Market Leaders & Digital Dominance',
      highlight_text: 'By Sunraise Solutions',
      subtitle: 'Dual presence in Hyderabad HITEC City HQ and Rajahmundry Regional Delivery Center.',
      primary_cta: 'Claim Free Proposal',
      secondary_cta: 'Explore Capabilities',
      hero_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Client Retention', val: '98%' },
        { label: 'Growth Surge', val: '+280%' }
      ]
    },
    page_blocks: [
      {
            "id": "blk-about-hero",
            "type": "visual",
            "component_name": "Container",
            "sort_order": 1,
            "props": {
                  "badge": "18+ YEARS CORPORATE DIGITAL HERITAGE",
                  "title": "Building High-Performance Digital Equity Across South India",
                  "content": "Founded with an unwavering commitment to engineering mastery and business growth, Sunraise Solutions unites visionary digital marketing with enterprise-grade cloud software.",
                  "image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
                  "button_text": "Explore Our Hubs",
                  "button_url": "#locations"
            }
      },
      {
            "id": "blk-about-locations",
            "type": "visual",
            "component_name": "TwoColumn",
            "sort_order": 2,
            "props": {
                  "title": "Dual Presence: Hyderabad Headquarters & Rajahmundry Operations Hub",
                  "columns": [
                        {
                              "id": "col-ab-hyd",
                              "title": "Hyderabad Headquarters",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-ab-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "HITEC City Hyderabad HQ",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-ab-img1",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Hyderabad Corporate Office",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-ab-p1",
                                          "type": "Paragraph",
                                          "text": "Level 4, Cyber Towers, HITEC City. Direct access to premier tech talent, institutional clients, and regional enterprise leaders.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-ab-btn1",
                                          "type": "Button",
                                          "text": "Hyderabad HQ Details",
                                          "url": "/contact",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-ab-rjy",
                              "title": "Rajahmundry Regional Hub",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-ab-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Rajahmundry Regional Delivery Hub",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-ab-img2",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Rajahmundry Delivery Hub",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-ab-p2",
                                          "type": "Paragraph",
                                          "text": "Danavaipeta, Rajahmundry. Dedicated regional delivery center supporting manufacturing, healthcare, and educational institutions across Coastal Andhra.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-ab-btn2",
                                          "type": "Button",
                                          "text": "Rajahmundry Hub Details",
                                          "url": "/contact",
                                          "variant": "secondary",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-about-pillars",
            "type": "visual",
            "component_name": "ThreeColumn",
            "sort_order": 3,
            "props": {
                  "title": "Our Three Operational Pillars",
                  "columns": [
                        {
                              "id": "col-pil-1",
                              "title": "Technical Dominance",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-pil-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Technical Dominance",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pil-p1",
                                          "type": "Paragraph",
                                          "text": "Sub-second load times, headless React architectures, and rigorous code security audits.",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-pil-2",
                              "title": "Search Authority",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-pil-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Search Authority",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pil-p2",
                                          "type": "Paragraph",
                                          "text": "White-hat PR links, Google Knowledge Graph alignment, and zero-penalty algorithmic SEO.",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-pil-3",
                              "title": "Measurable ROI",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-pil-h3",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Measurable ROI",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pil-p3",
                                          "type": "Paragraph",
                                          "text": "Transparent conversion tracking, clear lead pipelines, and verifiable commercial growth.",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-about-cta",
            "type": "visual",
            "component_name": "CTABanner",
            "sort_order": 4,
            "props": {
                  "badge": "PARTNER WITH US",
                  "title": "Partner with an 18-Year Legacy Digital Agency",
                  "description": "Connect with our leadership to plan your digital growth trajectory.",
                  "button_text": "Contact Our Architects",
                  "button_url": "/contact"
            }
      }
],
    seo_meta: {
      meta_title: 'About Us | Sunraise Solutions - 18+ Years Corporate Legacy',
      meta_description: 'Learn about Sunraise Solutions, our executive leadership, 18+ years of digital transformation, and our dual presence.',
      focus_keyword: 'Sunraise Solutions About',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 92,
    author: 'Sunraise Architecture',
    last_modified_by: 'Admin',
    created_at: '2026-10-31T00:00:00Z',
    updated_at: '2026-10-31T00:00:00Z'
  },
  {
    id: 3,
    page_key: 'page_core_services',
    slug: 'services',
    title: 'Services Hub',
    page_type: 'core',
    status: 'published',
    hero_config: {
      badge: 'CAPABILITIES DIRECTORY',
      title: 'Enterprise Engineering & Marketing Capabilities',
      highlight_text: 'By Sunraise Solutions',
      subtitle: 'Explore our full spectrum of 8 corporate specializations engineered for verifiable commercial ROI.',
      primary_cta: 'Claim Free Proposal',
      secondary_cta: 'Explore Capabilities',
      hero_image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Client Retention', val: '98%' },
        { label: 'Growth Surge', val: '+280%' }
      ]
    },
    page_blocks: [
      {
            "id": "blk-srv-hero",
            "type": "visual",
            "component_name": "Container",
            "sort_order": 1,
            "props": {
                  "badge": "ENTERPRISE SERVICES DIRECTORY",
                  "title": "8 Engineered Capabilities for Enterprise Dominance",
                  "content": "Explore our full spectrum of corporate capabilities designed for scalable ROI, sub-second speeds, and search dominance.",
                  "image": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
                  "button_text": "Consult Our Architects",
                  "button_url": "/contact"
            }
      },
      {
            "id": "blk-srv-grid",
            "type": "visual",
            "component_name": "FeatureGrid",
            "sort_order": 2,
            "props": {
                  "title": "Specialized Corporate Services Catalog",
                  "description": "Each service backed by dedicated SLAs, enterprise frameworks, and experienced technical leadership.",
                  "features": [
                        "SRV-SEO-01: Search Engine Optimization - Algorithm ranking & local map dominance",
                        "SRV-WEB-02: Web Architecture & Design - Fast, modern React & cloud platforms",
                        "SRV-APP-03: Mobile App Development - iOS & Android cross-platform solutions",
                        "SRV-SMM-04: Performance Marketing - High-ROAS Google & Meta ad funnels",
                        "SRV-DEV-05: Custom Software Development - Cloud ERP, CRM & automated systems",
                        "SRV-POL-06: Political Campaign Management - Voter data analytics & ground outreach",
                        "SRV-MED-07: Video & Media Production - TV commercials, 3D animations & documentaries",
                        "SRV-HOS-08: Hospital Management Software - NABH compliant telemetry & EHR"
                  ]
            }
      },
      {
            "id": "blk-srv-sla",
            "type": "visual",
            "component_name": "TwoColumn",
            "sort_order": 3,
            "props": {
                  "title": "Enterprise Delivery Standards & Quality Benchmarks",
                  "columns": [
                        {
                              "id": "col-sla-1",
                              "title": "Sub-Second Performance SLA",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-sla-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Sub-Second Performance SLA",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-sla-p1",
                                          "type": "Paragraph",
                                          "text": "Every web platform we build achieves 95+ Core Web Vitals speed scores with global CDN distribution.",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-sla-2",
                              "title": "Dedicated Technical Lead",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-sla-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Dedicated Technical Lead",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-sla-p2",
                                          "type": "Paragraph",
                                          "text": "Direct access to our senior software architects and digital strategists with daily standup updates.",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-srv-cta",
            "type": "visual",
            "component_name": "CTABanner",
            "sort_order": 4,
            "props": {
                  "badge": "BESPOKE ARCHITECTURE",
                  "title": "Need a Tailored Enterprise Architecture?",
                  "description": "Our engineering team is ready to design a custom solution for your business.",
                  "button_text": "Request Custom Architecture",
                  "button_url": "/contact"
            }
      }
],
    seo_meta: {
      meta_title: 'Enterprise Services Directory | Sunraise Solutions',
      meta_description: 'Explore 8 corporate specializations: SEO, Web Development, Apps, Performance Marketing, Cloud ERP, and Hospital SaaS.',
      focus_keyword: 'Corporate IT Services Hyderabad',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 94,
    author: 'Sunraise Architecture',
    last_modified_by: 'Admin',
    created_at: '2026-10-31T00:00:00Z',
    updated_at: '2026-10-31T00:00:00Z'
  },
  {
    id: 4,
    page_key: 'page_core_projects',
    slug: 'projects',
    title: 'Completed Projects',
    page_type: 'core',
    status: 'published',
    hero_config: {
      badge: 'PROVEN TRACK RECORD',
      title: 'Real Deployed Client Architectures & Measurable Impact',
      highlight_text: 'By Sunraise Solutions',
      subtitle: 'Explore real-world software deployments, conversion surges, and digital transformation outcomes.',
      primary_cta: 'Claim Free Proposal',
      secondary_cta: 'Explore Capabilities',
      hero_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Client Retention', val: '98%' },
        { label: 'Growth Surge', val: '+280%' }
      ]
    },
    page_blocks: [
      {
            "id": "blk-proj-hero",
            "type": "visual",
            "component_name": "Container",
            "sort_order": 1,
            "props": {
                  "badge": "PROVEN TRACK RECORD",
                  "title": "Real Deployed Client Architectures & Measurable Impact",
                  "content": "Review real client architectures deployed by Sunraise Solutions across healthcare, retail, real estate, and government institutions.",
                  "image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
                  "button_text": "Discuss Your Project",
                  "button_url": "/contact"
            }
      },
      {
            "id": "blk-proj-showcase",
            "type": "visual",
            "component_name": "TwoColumn",
            "sort_order": 2,
            "props": {
                  "title": "Flagship Completed Deployments",
                  "columns": [
                        {
                              "id": "col-pr-1",
                              "title": "NABH Clinical Healthcare Platform",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-pr-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "NABH Hospital EHR & Telemetry Platform",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pr-img1",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Healthcare Software",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-pr-p1",
                                          "type": "Paragraph",
                                          "text": "Deployed across 12 hospitals in AP & Telangana with real-time bed occupancy tracking, doctor rosters, and electronic health records.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pr-btn1",
                                          "type": "Button",
                                          "text": "Explore Healthcare Tech",
                                          "url": "/services/hospital-management-software",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-pr-2",
                              "title": "Omnichannel Retail Platform",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-pr-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Omnichannel Multi-Crore Retail Ecosystem",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pr-img2",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Retail Software",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-pr-p2",
                                          "type": "Paragraph",
                                          "text": "High-scale ecommerce platform handling thousands of concurrent transactions with real-time warehouse ERP synchronization.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-pr-btn2",
                                          "type": "Button",
                                          "text": "Explore Web Engineering",
                                          "url": "/services/website-architecture-and-design",
                                          "variant": "secondary",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-proj-stack",
            "type": "visual",
            "component_name": "ThreeColumn",
            "sort_order": 3,
            "props": {
                  "title": "Our Technology & Engineering Stack",
                  "columns": [
                        {
                              "id": "col-st-1",
                              "title": "Frontend Architecture",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-st-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Frontend Architecture",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-st-p1",
                                          "type": "Paragraph",
                                          "text": "React 19, TypeScript, TailwindCSS, Next.js, Vite with sub-second asset bundling.",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-st-2",
                              "title": "Backend & Cloud",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-st-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Backend & Cloud",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-st-p2",
                                          "type": "Paragraph",
                                          "text": "PHP 8, Node.js, Python, MySQL, PostgreSQL, Docker, AWS and Hostinger cloud infrastructure.",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-st-3",
                              "title": "Search & Growth",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-st-h3",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Search & Growth",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-st-p3",
                                          "type": "Paragraph",
                                          "text": "Ahrefs, SEMrush, Google Search Console API, GA4 attribution funnels and Schema.org.",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-proj-cta",
            "type": "visual",
            "component_name": "CTABanner",
            "sort_order": 4,
            "props": {
                  "badge": "START A PROJECT",
                  "title": "Ready to Build Your Next High-Performance Platform?",
                  "description": "Our team will review your requirements and provide an architectural blueprint within 48 hours.",
                  "button_text": "Submit Project Brief",
                  "button_url": "/contact"
            }
      }
],
    seo_meta: {
      meta_title: 'Completed Projects & Portfolio | Sunraise Solutions',
      meta_description: 'Review real deployed client architectures, hospital software systems, and high-scale eCommerce platforms.',
      focus_keyword: 'Completed Web Projects',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 93,
    author: 'Sunraise Architecture',
    last_modified_by: 'Admin',
    created_at: '2026-10-31T00:00:00Z',
    updated_at: '2026-10-31T00:00:00Z'
  },
  {
    id: 5,
    page_key: 'page_core_blog',
    slug: 'blog',
    title: 'Blog & Technical Articles',
    page_type: 'core',
    status: 'published',
    hero_config: {
      badge: 'INSIGHTS & THOUGHT LEADERSHIP',
      title: 'Algorithmic Search, Engineering & Marketing Insights',
      highlight_text: 'By Sunraise Solutions',
      subtitle: 'Deep-dive technical articles, SEO algorithm updates, and architectural guides by Sunraise experts.',
      primary_cta: 'Claim Free Proposal',
      secondary_cta: 'Explore Capabilities',
      hero_image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Client Retention', val: '98%' },
        { label: 'Growth Surge', val: '+280%' }
      ]
    },
    page_blocks: [
      {
            "id": "blk-blog-hero",
            "type": "visual",
            "component_name": "Container",
            "sort_order": 1,
            "props": {
                  "badge": "TECHNICAL INSIGHTS & STRATEGY",
                  "title": "Algorithmic Search, Cloud Software & Corporate Growth",
                  "content": "Explore technical breakdowns, SEO algorithm changes, and growth case studies authored by Sunraise Solutions specialists.",
                  "image": "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80"
            }
      },
      {
            "id": "blk-blog-cards",
            "type": "visual",
            "component_name": "ThreeColumn",
            "sort_order": 2,
            "props": {
                  "title": "Featured Engineering & Marketing Articles",
                  "columns": [
                        {
                              "id": "col-bl-1",
                              "title": "Core Web Vitals Guide",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-bl-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Google Core Web Vitals 2026: Sub-Second Imperative",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-bl-p1",
                                          "type": "Paragraph",
                                          "text": "How page speed directly correlates with conversion velocity and organic ranking in competitive South Indian markets.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-bl-btn1",
                                          "type": "Button",
                                          "text": "Read Article",
                                          "url": "/blog",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-bl-2",
                              "title": "Enterprise SEO Guide",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-bl-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Enterprise SEO vs Local Map Pack Dominance",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-bl-p2",
                                          "type": "Paragraph",
                                          "text": "Architectural guide to dominating both Google local 3-pack rankings and nationwide organic search terms.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-bl-btn2",
                                          "type": "Button",
                                          "text": "Read Article",
                                          "url": "/blog",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-bl-3",
                              "title": "Hospital Compliance Guide",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-bl-h3",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "NABH Software Compliance for Hospitals",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-bl-p3",
                                          "type": "Paragraph",
                                          "text": "Key technical standards required for hospital management systems to achieve full NABH compliance.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-bl-btn3",
                                          "type": "Button",
                                          "text": "Read Article",
                                          "url": "/blog",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-blog-cta",
            "type": "visual",
            "component_name": "CTABanner",
            "sort_order": 3,
            "props": {
                  "badge": "STAY INFORMED",
                  "title": "Subscribe to Technical Insights & SEO Updates",
                  "description": "Get our monthly technical breakdown delivered straight to your inbox.",
                  "button_text": "Contact Editorial Team",
                  "button_url": "/contact"
            }
      }
],
    seo_meta: {
      meta_title: 'Blog & Digital Insights | Sunraise Solutions',
      meta_description: 'Latest industry insights on search engine optimization, full-stack web architectures, and growth strategy.',
      focus_keyword: 'Digital Marketing Blog',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 91,
    author: 'Sunraise Architecture',
    last_modified_by: 'Admin',
    created_at: '2026-10-31T00:00:00Z',
    updated_at: '2026-10-31T00:00:00Z'
  },
  {
    id: 6,
    page_key: 'page_core_contact',
    slug: 'contact',
    title: 'Contact Us',
    page_type: 'core',
    status: 'published',
    hero_config: {
      badge: 'DIRECT ARCHITECT ACCESS',
      title: 'Consult with Our Enterprise Architects',
      highlight_text: 'By Sunraise Solutions',
      subtitle: 'Ready to dominate your industry? Connect directly with our strategy leadership in Hyderabad or Rajahmundry.',
      primary_cta: 'Claim Free Proposal',
      secondary_cta: 'Explore Capabilities',
      hero_image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Client Retention', val: '98%' },
        { label: 'Growth Surge', val: '+280%' }
      ]
    },
    page_blocks: [
      {
            "id": "blk-cnt-hero",
            "type": "visual",
            "component_name": "Container",
            "sort_order": 1,
            "props": {
                  "badge": "DIRECT LEADERSHIP ACCESS",
                  "title": "Connect with Our Solutions Architects",
                  "content": "Whether you need a full enterprise software build, custom SEO ranking strategy, or digital transformation advisory, our leadership is ready to help.",
                  "image": "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80"
            }
      },
      {
            "id": "blk-cnt-locations",
            "type": "visual",
            "component_name": "TwoColumn",
            "sort_order": 2,
            "props": {
                  "title": "Visit Our Headquarters & Delivery Centers",
                  "columns": [
                        {
                              "id": "col-cn-1",
                              "title": "Hyderabad Corporate Headquarters",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-cn-h1",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Hyderabad Corporate Headquarters",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-cn-img1",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Hyderabad Corporate Office",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-cn-p1",
                                          "type": "Paragraph",
                                          "text": "Level 4, Cyber Towers, HITEC City, Hyderabad, Telangana 500081. Phone: +91 99596 39539. Email: info@sunraisesolutions.com",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-cn-btn1",
                                          "type": "Button",
                                          "text": "Call Hyderabad Office",
                                          "url": "tel:+919959639539",
                                          "variant": "primary",
                                          "alignment": "left"
                                    }
                              ]
                        },
                        {
                              "id": "col-cn-2",
                              "title": "Rajahmundry Regional Delivery Hub",
                              "direction": "col",
                              "elements": [
                                    {
                                          "id": "el-cn-h2",
                                          "type": "Heading",
                                          "level": "h3",
                                          "text": "Rajahmundry Regional Delivery Hub",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-cn-img2",
                                          "type": "Image",
                                          "url": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
                                          "alt": "Rajahmundry Delivery Hub",
                                          "alignment": "center"
                                    },
                                    {
                                          "id": "el-cn-p2",
                                          "type": "Paragraph",
                                          "text": "Danavaipeta, Rajahmundry, Andhra Pradesh 533103. Phone: +91 99596 39539. Serving Godavari, Visakhapatnam & Vijayawada regions.",
                                          "alignment": "left"
                                    },
                                    {
                                          "id": "el-cn-btn2",
                                          "type": "Button",
                                          "text": "Call Rajahmundry Office",
                                          "url": "tel:+919959639539",
                                          "variant": "secondary",
                                          "alignment": "left"
                                    }
                              ]
                        }
                  ]
            }
      },
      {
            "id": "blk-cnt-form",
            "type": "visual",
            "component_name": "ContactForm",
            "sort_order": 3,
            "props": {
                  "title": "Request a Confidential Proposal & Technical Audit",
                  "subtitle": "Our executive engineering team responds within 24 hours with a comprehensive roadmap."
            }
      },
      {
            "id": "blk-cnt-faq",
            "type": "visual",
            "component_name": "FAQAccordion",
            "sort_order": 4,
            "props": {
                  "title": "Engagement & Consultation FAQs",
                  "items": [
                        {
                              "q": "How do project consultations work?",
                              "a": "We schedule an initial discovery call to review your technical requirements and business goals, followed by an architectural proposal."
                        },
                        {
                              "q": "Can we visit your offices in Hyderabad or Rajahmundry?",
                              "a": "Yes! We welcome clients to both our HITEC City Hyderabad headquarters and our Rajahmundry delivery center."
                        }
                  ]
            }
      }
],
    seo_meta: {
      meta_title: 'Contact Sunraise Solutions | Hyderabad HQ & Rajahmundry Regional Hub',
      meta_description: 'Get in touch for a bespoke digital marketing proposal, software consultation, or enterprise technical audit.',
      focus_keyword: 'Contact Sunraise Solutions',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 95,
    author: 'Sunraise Architecture',
    last_modified_by: 'Admin',
    created_at: '2026-10-31T00:00:00Z',
    updated_at: '2026-10-31T00:00:00Z'
  },

  {
    id: 1,
    page_key: 'hyderabad-regional-hub',
    slug: 'hyderabad-regional-hub',
    title: 'Hyderabad Corporate Headquarters & Regional Hub',
    page_type: 'location',
    status: 'published',
    hero_config: {
      badge: 'HYDERABAD CORPORATE HEADQUARTERS',
      title: 'Accelerating Digital Growth from the Heart of',
      highlight_text: 'HITEC City Hyderabad',
      subtitle: 'Our primary executive war room delivering enterprise-grade search dominance, high-performance web systems, and high-ROAS performance advertising.',
      primary_cta: 'Visit Hyderabad Office',
      secondary_cta: 'Consult Our Directors',
      hero_image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Active Retainers', val: '120+' },
        { label: 'Years Serving TS', val: '18+' },
        { label: 'Client Retention', val: '98%' }
      ]
    },
    page_blocks: [
      {
        id: 'blk-hyd-1',
        type: 'visual',
        component_name: 'Heading',
        sort_order: 1,
        props: {
          level: 'h2',
          text: 'Strategic Advantages of Partnering with Sunraise Hyderabad',
          alignment: 'center'
        }
      },
      {
        id: 'blk-hyd-2',
        type: 'visual',
        component_name: 'FeatureGrid',
        sort_order: 2,
        props: {
          title: 'Enterprise Growth Capabilities',
          description: 'Customized for Telangana IT, Healthcare, and Commercial Real Estate powerhouses.',
          features: [
            'Dedicated HITEC City Account Executives & Weekly War Rooms',
            'Full-Stack SEO Technical Audits with Sub-Second Core Web Vitals',
            'Bespoke React 19 & Next.js Scalable Cloud Portals',
            'Hyper-Local Telugu & English Bilingual Ad Creatives'
          ]
        }
      },
      {
        id: 'blk-hyd-3',
        type: 'visual',
        component_name: 'FAQAccordion',
        sort_order: 3,
        props: {
          title: 'Hyderabad Office Operations FAQ',
          faqs: [
            {
              q: 'Where is the Sunraise Solutions Hyderabad office located?',
              a: 'Our main office is strategically situated in HITEC City, Hyderabad, providing easy access for enterprise client briefings and tactical consultations.'
            },
            {
              q: 'Can Hyderabad clients schedule in-person strategy reviews?',
              a: 'Yes, our Managing Director and CEO host confidential quarterly and monthly in-person strategy briefings for all retainer partners.'
            }
          ]
        }
      },
      {
        id: 'blk-hyd-4',
        type: 'visual',
        component_name: 'CTABanner',
        sort_order: 4,
        props: {
          badge: 'READY TO SCALE?',
          title: 'Schedule a Confidential Strategic Review at our Hyderabad HQ',
          description: 'Meet our senior solutions architects and unlock your custom 2026 digital roadmap.',
          button_text: 'Book Strategy Briefing',
          button_url: '/contact'
        }
      }
    ],
    seo_meta: {
      meta_title: 'Hyderabad Digital Agency & Technology Hub | Sunraise Solutions',
      meta_description: 'Sunraise Solutions Hyderabad headquarters provides enterprise SEO, web application development, and ROI performance marketing for 18+ years.',
      focus_keyword: 'Hyderabad Digital Agency',
      secondary_keywords: 'SEO Company Hyderabad, Web Development HITEC City',
      canonical_url: 'https://sunraisesolutions.com/p/hyderabad-regional-hub',
      og_image: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
      schema_json: '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Sunraise Solutions Hyderabad HQ","address":{"@type":"PostalAddress","addressLocality":"Hyderabad","addressRegion":"Telangana","addressCountry":"IN"}}',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 95,
    author: 'Kiran Kumar B',
    last_modified_by: 'Kiran Kumar B',
    created_at: '2026-10-01T09:00:00Z',
    updated_at: '2026-10-28T14:20:00Z'
  },
  {
    id: 2,
    page_key: 'rajahmundry-regional-hub',
    slug: 'rajahmundry-regional-hub',
    title: 'Rajahmundry Regional Operations & Delivery Hub',
    page_type: 'location',
    status: 'published',
    hero_config: {
      badge: 'ANDHRA PRADESH REGIONAL HUB',
      title: 'Powering Digital Transformation Across Andhra Pradesh from',
      highlight_text: 'Rajahmundry Hub',
      subtitle: 'Our regional engineering and content command center, empowering coastal AP businesses with top-tier search visibility and software platforms.',
      primary_cta: 'Contact Rajahmundry Team',
      secondary_cta: 'View Regional Projects',
      hero_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'AP Businesses Served', val: '210+' },
        { label: 'Emergency Deployments', val: '< 2 hrs' },
        { label: 'Local Support', val: '24/7' }
      ]
    },
    page_blocks: [
      {
        id: 'blk-rjy-1',
        type: 'visual',
        component_name: 'Heading',
        sort_order: 1,
        props: {
          level: 'h2',
          text: 'Dedicated Regional Support for Coastal Andhra Pradesh',
          alignment: 'center'
        }
      },
      {
        id: 'blk-rjy-2',
        type: 'visual',
        component_name: 'ProcessTimeline',
        sort_order: 2,
        props: {
          title: 'Our Rapid Regional Deployment Cycle',
          steps: [
            { step: '01', title: 'On-Site Diagnostic Audit', desc: 'Our Rajahmundry field team inspects your business workflows and local search visibility.' },
            { step: '02', title: 'Architectural Blueprint', desc: 'Crafting bespoke software and local search ranking blueprints tailored for AP markets.' },
            { step: '03', title: 'Rapid Rollout & Training', desc: 'Deploying high-speed platforms with full on-site staff training.' },
            { step: '04', title: 'Continuous Maintenance', desc: 'Dedicated 24/7 SLA telephone and on-premise emergency engineering support.' }
          ]
        }
      },
      {
        id: 'blk-rjy-3',
        type: 'visual',
        component_name: 'CTABanner',
        sort_order: 3,
        props: {
          badge: 'REGIONAL EXCELLENCE',
          title: 'Connect with our Rajahmundry Regional Leadership',
          description: 'Unlock special regional business growth incentives and dedicated on-site consulting.',
          button_text: 'Contact Rajahmundry Office',
          button_url: '/contact'
        }
      }
    ],
    seo_meta: {
      meta_title: 'Rajahmundry Regional Digital Hub | Sunraise Solutions AP',
      meta_description: 'Sunraise Solutions Rajahmundry regional operations center delivering web software, local SEO, and hospital management platforms across Andhra Pradesh.',
      focus_keyword: 'Rajahmundry Regional Hub',
      secondary_keywords: 'Software Company Rajahmundry, Web Design AP, Hospital Software East Godavari',
      canonical_url: 'https://sunraisesolutions.com/p/rajahmundry-regional-hub',
      og_image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      schema_json: '{"@context":"https://schema.org","@type":"LocalBusiness","name":"Sunraise Solutions Rajahmundry Regional Hub","address":{"@type":"PostalAddress","addressLocality":"Rajahmundry","addressRegion":"Andhra Pradesh","addressCountry":"IN"}}',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 92,
    author: 'Suresh Kumar',
    last_modified_by: 'Suresh Kumar',
    created_at: '2026-10-05T11:00:00Z',
    updated_at: '2026-10-27T16:15:00Z'
  },
  {
    id: 3,
    page_key: 'growth-audit-landing',
    slug: 'growth-audit-landing',
    title: 'Free 360° Digital Growth & SEO Technical Audit',
    page_type: 'campaign',
    status: 'published',
    hero_config: {
      badge: 'LIMITED COMPLIMENTARY OFFER',
      title: 'Claim Your 100% Free Confidential',
      highlight_text: '360° Growth Audit',
      subtitle: 'Uncover hidden Core Web Vitals bottlenecks, competitor backlink gaps, and missed high-intent keyword opportunities costing your business qualified leads.',
      primary_cta: 'Claim Free Audit Now',
      secondary_cta: 'Review Sample Report',
      hero_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      stats: [
        { label: 'Audits Shipped', val: '450+' },
        { label: 'Avg Inefficiency Found', val: '38%' },
        { label: 'Turnaround Time', val: '24 Hours' }
      ]
    },
    page_blocks: [
      {
        id: 'blk-aud-1',
        type: 'visual',
        component_name: 'Heading',
        sort_order: 1,
        props: {
          level: 'h2',
          text: 'What Our Comprehensive Audit Report Contains',
          alignment: 'center'
        }
      },
      {
        id: 'blk-aud-2',
        type: 'visual',
        component_name: 'FeatureGrid',
        sort_order: 2,
        props: {
          title: 'Deep Multi-Point Diagnostic Pillars',
          description: 'No generic automated PDF spam. Every report is reviewed by a Senior Technical SEO Architect.',
          features: [
            'Core Web Vitals INP & LCP Mobile Speed Breakdown',
            'Top 5 Regional Competitor Keyword Gap Analysis',
            'Local Google Business Profile 3-Pack Authority Score',
            'Technical Crawl Architecture & Index Bloat Diagnosis',
            'Toxic Backlink Detection & Disavow Roadmap',
            'Conversion Rate Funnel Leakage Points'
          ]
        }
      },
      {
        id: 'blk-aud-3',
        type: 'visual',
        component_name: 'CTABanner',
        sort_order: 3,
        props: {
          badge: 'CLAIM TODAY',
          title: 'Start Dominating Search Results in 2026',
          description: 'Our senior consultants will prepare your personalized audit within 24 business hours.',
          button_text: 'Submit Audit Request',
          button_url: '/contact'
        }
      }
    ],
    seo_meta: {
      meta_title: 'Free SEO & Digital Growth Audit | Sunraise Solutions',
      meta_description: 'Request a free 360-degree technical SEO and conversion audit from Sunraise Solutions. Identify search crawl bottlenecks and boost organic revenue.',
      focus_keyword: 'Digital Growth Audit',
      secondary_keywords: 'Free SEO Audit Hyderabad, Website Speed Audit AP',
      canonical_url: 'https://sunraisesolutions.com/p/growth-audit-landing',
      og_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      robots_index: true,
      robots_follow: true,
      sitemap_include: true
    },
    seo_score: 96,
    author: 'Neeraj',
    last_modified_by: 'Neeraj',
    created_at: '2026-10-12T10:00:00Z',
    updated_at: '2026-10-29T18:00:00Z'
  }
];

// INITIAL SEED MEDIA
const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    filename: 'seo_analytics_dashboard_sunraise.webp',
    title: 'SEO Analytics & Keyword Dashboard',
    alt: 'Real-time keyword ranking and organic traffic analytics telemetry',
    width: 1200,
    height: 800,
    sizeBytes: 215000,
    folder: 'Analytics',
    format: 'WEBP',
    uploaded_at: '2026-10-20T10:00:00Z'
  },
  {
    id: 'med-2',
    url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80',
    filename: 'web_development_code_architecture.webp',
    title: 'Modern High-Performance Code Architecture',
    alt: 'React and cloud backend developer workstation in Hyderabad office',
    width: 1200,
    height: 800,
    sizeBytes: 198000,
    folder: 'Engineering',
    format: 'WEBP',
    uploaded_at: '2026-10-21T11:30:00Z'
  },
  {
    id: 'med-3',
    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    filename: 'conversion_growth_metrics.webp',
    title: 'Client ROI & Revenue Growth Charts',
    alt: 'Bar graphs and KPI metrics showing +380% surge in inbound inquiries',
    width: 1200,
    height: 800,
    sizeBytes: 175000,
    folder: 'Marketing',
    format: 'WEBP',
    uploaded_at: '2026-10-22T08:15:00Z'
  },
  {
    id: 'med-4',
    url: 'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1200&q=80',
    filename: 'hyderabad_office_boardroom.webp',
    title: 'Sunraise Hyderabad Headquarters War Room',
    alt: 'Executive strategy conference room in HITEC City Hyderabad',
    width: 1200,
    height: 800,
    sizeBytes: 242000,
    folder: 'Offices',
    format: 'WEBP',
    uploaded_at: '2026-10-23T14:40:00Z'
  },
  {
    id: 'med-5',
    url: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    filename: 'hospital_management_software_telemetry.webp',
    title: 'Hospital Clinical Telemetry & EHR Interface',
    alt: 'Doctor monitoring NABH compliant patient records and emergency bed occupancy',
    width: 1200,
    height: 800,
    sizeBytes: 260000,
    folder: 'Healthcare',
    format: 'WEBP',
    uploaded_at: '2026-10-24T09:20:00Z'
  },
  {
    id: 'med-6',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    filename: 'rajahmundry_operations_center.webp',
    title: 'Rajahmundry Regional Delivery Center',
    alt: 'Collaboration space at Sunraise Solutions Rajahmundry regional operations',
    width: 1200,
    height: 800,
    sizeBytes: 210000,
    folder: 'Offices',
    format: 'WEBP',
    uploaded_at: '2026-10-25T16:00:00Z'
  }
];

// INITIAL SEED REVISIONS
const INITIAL_REVISIONS: PageRevision[] = [
  {
    id: 'rev-seed-1',
    target_id: 1,
    target_type: 'page',
    slug: 'hyderabad-regional-hub',
    title: 'Hyderabad Corporate Headquarters & Regional Hub (v1.2)',
    blocks: INITIAL_PAGES[0].page_blocks,
    seo_meta: INITIAL_PAGES[0].seo_meta,
    hero_config: INITIAL_PAGES[0].hero_config,
    saved_by: 'Kiran Kumar B',
    saved_at: '2026-10-28T14:20:00Z',
    note: 'Added HITEC City entity schema and FAQ block'
  },
  {
    id: 'rev-seed-2',
    target_id: 1,
    target_type: 'page',
    slug: 'hyderabad-regional-hub',
    title: 'Hyderabad Corporate Headquarters (v1.0 Initial Release)',
    blocks: INITIAL_PAGES[0].page_blocks.slice(0, 2),
    seo_meta: INITIAL_PAGES[0].seo_meta,
    hero_config: INITIAL_PAGES[0].hero_config,
    saved_by: 'Kiran Kumar B',
    saved_at: '2026-10-01T09:00:00Z',
    note: 'Initial page creation'
  }
];
