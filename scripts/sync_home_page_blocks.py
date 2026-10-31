import os
import json
import paramiko

HOST = os.getenv("SSH_HOST", "193.203.185.110")
PORT = int(os.getenv("SSH_PORT", "65002"))
USER = os.getenv("SSH_USER", "u833088220")
PASS = os.getenv("SSH_PASS", "YOUR_SSH_PASSWORD")

hero_config = {
    "badge": "Top Digital Marketing Agency in Andhra Pradesh",
    "title": "Grow Your Business with",
    "highlight_text": "Sunraise Solutions",
    "subtitle": "With 18+ years of expertise in digital marketing and software innovation, we help startups, growing brands, and established businesses build a powerful digital presence that drives real results. Headquartered in Hyderabad with a regional center in Rajahmundry.",
    "primary_cta": "Get a Free Proposal",
    "secondary_cta": "Explore Projects",
    "hero_image": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    "stats": [
        {"label": "Proven Experience", "val": "18+ Years"},
        {"label": "Projects Delivered", "val": "500+"},
        {"label": "Client Retention", "val": "98%"}
    ]
}

page_blocks = [
    # 1. Three Column Value Cards (Matches Homepage Section 2)
    {
        "id": "blk-home-values",
        "type": "component",
        "component_name": "ThreeColumn",
        "order": 0,
        "props": {
            "title": "Innovation, Strategy & Excellence",
            "columns": [
                {
                    "title": "Innovation with Purpose",
                    "desc": "We engineer scalable architectures and AI-assisted workflows tailored to solve concrete operational hurdles and maximize capital efficiency.",
                    "bg": "white"
                },
                {
                    "title": "Strategic Solutions",
                    "desc": "Algorithmic SEO, hyper-local search mapping, and full-funnel ad campaigns constructed to dominate Andhra Pradesh and national search rankings.",
                    "bg": "white"
                },
                {
                    "title": "Dedicated to Excellence",
                    "desc": "18+ years of reliable delivery, zero-regression software maintenance, and round-the-clock senior engineering leadership for peace of mind.",
                    "bg": "white"
                }
            ],
            "cardSize": "spacious",
            "cardShadow": "warm"
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 2. Who We Are (Matches Homepage Section 3)
    {
        "id": "blk-home-whoweare",
        "type": "component",
        "component_name": "TwoColumn",
        "order": 1,
        "props": {
            "title": "Architecting High-Yield Software & Digital Growth Across South India",
            "left_title": "Our Engineering Heritage",
            "left_desc": "Sunraise Solutions stands as a benchmark of technical reliability and strategic innovation. Headquartered in Hyderabad's premier tech corridor with an expansive regional footprint in Rajahmundry, Andhra Pradesh, we partner with healthcare giants, educational institutions, political campaigns, and mid-market enterprises.",
            "left_image": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
            "left_bullets": [
                "18+ Years Industry Experience",
                "Custom Enterprise Software & Web Solutions",
                "SEO & Sub-Second Performance",
                "Result-Driven Conversion Pipelines"
            ],
            "right_title": "Dual Corporate Hub Presence",
            "right_desc": "Immediate regional support across Telangana and Andhra Pradesh with dedicated account directors and round-the-clock engineering availability.",
            "right_bullets": [
                "Hyderabad Head Office: Madhapur, Hitec City Corridor",
                "Rajahmundry Regional Hub: Danavaipeta Commercial Centre",
                "Pan India & Global Client Coverage",
                "92% Satisfied Clients Returning Often"
            ],
            "right_bg": "orange"
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 3. Dynamic Services Capabilities - 8 Cards (Matches Homepage Section 4)
    {
        "id": "blk-home-services",
        "type": "component",
        "component_name": "FeatureGrid",
        "order": 2,
        "props": {
            "badge": "Dynamic Capabilities",
            "title": "Full-Suite Corporate Digital Services",
            "description": "Configured dynamically in our CMS. Each service offers dedicated service codes, sub-second SLAs, and integrated completed projects.",
            "columns": 4,
            "features": [
                "01 - Web Development: High-performance, responsive websites, e-commerce stores, and custom portals engineered for conversion.",
                "02 - Mobile App Development: Powerful Android & iOS apps tailored to your business workflows.",
                "03 - Digital Marketing: Hyper-targeted SEO, PPC advertising, social media growth, and branding campaigns.",
                "04 - Custom Software Development: Scalable ERP, CRM, and cloud-native software built to automate operations.",
                "05 - Political Branding: Strategic digital campaigns and narrative engineering for political leaders and public campaigns.",
                "06 - White Label Digital Services: Reseller-ready digital marketing and software development for partner agencies.",
                "07 - CGI Advertising Agency: 3D product visualizations, CGI ads, and cinematic commercial video production.",
                "08 - Hospital Management Software (HMS): Complete clinical workflow software with OPD, IPD, billing, and pharmacy modules."
            ],
            "cardSize": "compact",
            "cardShadow": "warm"
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 4. Our 4-Step Working Process (Matches Homepage Section 6)
    {
        "id": "blk-home-process",
        "type": "component",
        "component_name": "ProcessTimeline",
        "order": 3,
        "props": {
            "badge": "Engineered Delivery",
            "title": "Our 4-Step Working Process",
            "columns": 4,
            "steps": [
                {
                    "step": "01",
                    "title": "Brand Discovery / Audit",
                    "desc": "In-depth algorithmic analysis of current architecture, organic rankings, and market positioning."
                },
                {
                    "step": "02",
                    "title": "Creative Planning / Strategy",
                    "desc": "Architecting custom technical roadmaps, high-converting prototypes, and target keyword clusters."
                },
                {
                    "step": "03",
                    "title": "Digital Execution",
                    "desc": "Agile development, sub-second speed optimization, and multi-channel campaign rollout."
                },
                {
                    "step": "04",
                    "title": "Growth Optimization",
                    "desc": "Continuous telemetry measurement, automated 301 safeguards, and ongoing conversion scale."
                }
            ]
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 5. Featured Completed Projects (Matches Homepage Section 5)
    {
        "id": "blk-home-projects",
        "type": "component",
        "component_name": "ThreeColumn",
        "order": 4,
        "props": {
            "title": "Featured Completed Projects & Implementations",
            "columns": [
                {
                    "title": "Avanthi MCA College",
                    "desc": "SEO & Web Development · +420% Organic Admission Inquiries and complete responsive university portal with sub-second page loads."
                },
                {
                    "title": "Sri Veera Hanuman Nursery",
                    "desc": "E-Commerce & Digital Marketing · 3.2x Online Inquiries for India's largest plant nursery with Telugu-English multilingual mapping."
                },
                {
                    "title": "Union Hospital",
                    "desc": "Hospital Management Software (HMS) · Paperless OPD, IPD, billing, and pharmacy digital workflows with automated doctor schedules."
                }
            ]
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 6. Trust & Proof Counters (Matches Homepage Section 7)
    {
        "id": "blk-home-trust",
        "type": "component",
        "component_name": "KPICounter",
        "order": 5,
        "props": {
            "title": "Why Industry Leaders Choose Sunraise Solutions",
            "stats": [
                {"label": "Industry Experience", "val": "18+ Years"},
                {"label": "Projects Delivered", "val": "500+"},
                {"label": "Client Retention", "val": "98%"},
                {"label": "Happy Corporate Clients", "val": "300+"}
            ]
        },
        "styles": {
            "paddingY": 40
        }
    },

    # 7. Real Testimonials (Matches Homepage Section 8)
    {
        "id": "blk-home-testimonials",
        "type": "component",
        "component_name": "Testimonials",
        "order": 6,
        "props": {
            "title": "Endorsed by Andhra Pradesh & Hyderabad Leaders (4.8 Rating)",
            "reviews": [
                {
                    "name": "MAKSIM Infotech",
                    "role": "Technology Operations",
                    "text": "From branding to web development, Sunraise Solutions handled everything professionally. Their team is skilled, responsive, and always delivers on time.",
                    "rating": 5
                },
                {
                    "name": "Hotel Jaya Residency",
                    "role": "Hospitality Operations",
                    "text": "Sunraise Solutions has transformed our online presence with exceptional web development strategies. Direct room bookings have surged significantly.",
                    "rating": 5
                },
                {
                    "name": "MVR Group",
                    "role": "Corporate Enterprises",
                    "text": "Sunraise Solutions built us a beautiful website and provided excellent support throughout the process. Their attention to detail and design sense is top-notch.",
                    "rating": 5
                }
            ]
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 8. FAQs (Matches Homepage Section 10)
    {
        "id": "blk-home-faqs",
        "type": "component",
        "component_name": "FAQAccordion",
        "order": 7,
        "props": {
            "title": "Frequently Asked Questions (SEO FAQs)",
            "items": [
                {
                    "q": "How does Sunraise Solutions ensure Google Top 3 rankings in Hyderabad?",
                    "a": "We leverage deep Core Web Vitals optimization, semantic schema markup linking your Hyderabad addresses, high-DA localized link building, and conversion-optimized content clusters."
                },
                {
                    "q": "Do you offer custom software development with local Rajahmundry support?",
                    "a": "Yes! Our Rajahmundry branch provides immediate on-site consultation and ongoing support for enterprises and hospitals across coastal Andhra Pradesh."
                },
                {
                    "q": "What is your Hospital Management Software (HMS) deployment timeline?",
                    "a": "A standard NABH-ready HMS deployment across OPD, IPD, and pharmacy modules is completed within 3 to 6 weeks, including data migration and medical staff training."
                },
                {
                    "q": "How do you safeguard client rankings when restructuring a website?",
                    "a": "We employ our Zero-Regression SEO framework with automated 301 redirects, URL slug preservation, and strict heading hierarchy checks."
                }
            ]
        },
        "styles": {
            "paddingY": 48
        }
    },

    # 9. Free Proposal CTA Banner (Matches Proposal Form CTA)
    {
        "id": "blk-home-proposal-cta",
        "type": "component",
        "component_name": "CTABanner",
        "order": 8,
        "props": {
            "badge": "Free Architectural Consultation",
            "title": "Get a Free SEO & Software Proposal",
            "description": "Receive a comprehensive competitive audit and commercial roadmap within 24 hours from our senior architects in Hyderabad or Rajahmundry.",
            "button_text": "Request Free Proposal",
            "button_link": "/contact"
        },
        "styles": {
            "paddingY": 48
        }
    }
]

seo_meta = {
    "meta_title": "Sunraise Solutions | Corporate Digital Agency & Custom Software Hyderabad & Rajahmundry",
    "meta_description": "Sunraise Solutions is a premier digital agency in Hyderabad and Rajahmundry with 18+ years of excellence in SEO, Web Development, Mobile Apps, Custom ERP/HMS, and Performance Marketing.",
    "focus_keyword": "SEO Services Hyderabad, Web Development Rajahmundry",
    "canonical_url": "https://testers.acheva.in/",
    "robots_index": True,
    "robots_follow": True,
    "sitemap_include": True
}

# Connect SSH and execute PHP script to update DB
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect(HOST, port=PORT, username=USER, password=PASS, timeout=20)

php_script = f"""<?php
require_once '/home/u833088220/domains/testers.acheva.in/public_html/api/config.php';

$hero_json = {json.dumps(json.dumps(hero_config))};
$blocks_json = {json.dumps(json.dumps(page_blocks))};
$seo_json = {json.dumps(json.dumps(seo_meta))};

$stmt = $pdo->prepare("UPDATE pages SET 
    title = 'Home Page',
    hero_config = ?, 
    page_blocks = ?, 
    seo_meta = ?,
    status = 'published',
    is_published = 1,
    page_type = 'core'
WHERE slug = 'home'");

$res = $stmt->execute([$hero_json, $blocks_json, $seo_json]);
echo "Rows updated: " . $stmt->rowCount() . "\\n";
"""

sftp = client.open_sftp()
with sftp.file("/home/u833088220/domains/testers.acheva.in/public_html/api/tmp_update_home.php", "w") as f:
    f.write(php_script)
sftp.close()

stdin, stdout, stderr = client.exec_command("php /home/u833088220/domains/testers.acheva.in/public_html/api/tmp_update_home.php")
out = stdout.read().decode('utf-8')
err = stderr.read().decode('utf-8')
print("Output:", out)
if err:
    print("Error:", err)

# Cleanup
client.exec_command("rm /home/u833088220/domains/testers.acheva.in/public_html/api/tmp_update_home.php")
client.close()
print("Home page blocks synced successfully in remote DB!")

