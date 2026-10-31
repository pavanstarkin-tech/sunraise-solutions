with open('frontend/src/components/builder/ElementorPageBuilder.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = "    default:\n      return {};"

new_cases = """    case 'ImageSlider':
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
      return {};"""

if target in c:
    c = c.replace(target, new_cases, 1)
    with open('frontend/src/components/builder/ElementorPageBuilder.tsx', 'w', encoding='utf-8') as f:
        f.write(c)
    print("SUCCESS: ElementorPageBuilder default props updated")
else:
    print("Target not found")

