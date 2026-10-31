import { PageBlock, SEOMeta, SEOCheckResult, SEOCheckItem } from '../types';

/**
 * Evaluates SEO health of a page based on title, meta description, slug, H1, body content, images, links, etc.
 * Returns an internal guidance score (0-100) and actionable suggestions.
 */
export function analyzePageSEO(params: {
  title: string;
  slug: string;
  seoMeta: SEOMeta;
  blocks: PageBlock[];
  heroHighlight?: string;
  heroTitle?: string;
}): SEOCheckResult {
  const { title, slug, seoMeta, blocks, heroHighlight, heroTitle } = params;
  const focusKeyword = (seoMeta.focus_keyword || '').trim().toLowerCase();
  const metaTitle = (seoMeta.meta_title || title || '').trim();
  const metaDesc = (seoMeta.meta_description || '').trim();
  const fullSlug = (slug || '').trim().toLowerCase();

  // Aggregate text from blocks
  const textTokens: string[] = [];
  let h1Count = 0;
  let hasH2 = false;
  let totalImages = 0;
  let imagesWithAlt = 0;
  let internalLinkCount = 0;
  let externalLinkCount = 0;

  // Check hero title if present
  if (heroTitle || heroHighlight) {
    h1Count += 1;
    textTokens.push(heroTitle || '', heroHighlight || '');
  }

  blocks.forEach((block) => {
    if (block.type === 'visual') {
      const p = block.props || {};
      if (block.component_name === 'Heading') {
        const level = p.level || 'h2';
        if (level === 'h1') h1Count += 1;
        if (level === 'h2') hasH2 = true;
        if (p.text) textTokens.push(p.text);
      }
      if (block.component_name === 'Paragraph' && p.text) textTokens.push(p.text);
      if (block.component_name === 'Image') {
        totalImages += 1;
        if (p.alt && p.alt.trim().length > 0) imagesWithAlt += 1;
      }
      if (block.component_name === 'Button' && p.url) {
        if (p.url.startsWith('/') || p.url.includes('sunraise')) internalLinkCount += 1;
        else if (p.url.startsWith('http')) externalLinkCount += 1;
      }
      if (block.component_name === 'TwoColumn' || block.component_name === 'ThreeColumn' || block.component_name === 'Container') {
        if (p.title) textTokens.push(p.title);
        if (p.content) textTokens.push(p.content);
      }
      if (block.component_name === 'FAQAccordion' && Array.isArray(p.faqs)) {
        p.faqs.forEach((f: any) => {
          if (f.q) textTokens.push(f.q);
          if (f.a) textTokens.push(f.a);
        });
      }
      if (block.component_name === 'FeatureGrid' && Array.isArray(p.features)) {
        p.features.forEach((f: any) => textTokens.push(typeof f === 'string' ? f : f.title || ''));
      }
      if (block.component_name === 'ProcessTimeline' && Array.isArray(p.steps)) {
        p.steps.forEach((s: any) => textTokens.push(s.title || '', s.desc || ''));
      }
    } else if (block.type === 'html' && block.html_content) {
      const raw = block.html_content;
      // count h1s in html
      const h1Matches = raw.match(/<h1(\s|>)/gi);
      if (h1Matches) h1Count += h1Matches.length;
      if (/<h2(\s|>)/i.test(raw)) hasH2 = true;
      // image alt checks
      const imgTags = raw.match(/<img[^>]+>/gi) || [];
      totalImages += imgTags.length;
      imgTags.forEach((img) => {
        if (/alt=["'][^"']+["']/i.test(img)) imagesWithAlt += 1;
      });
      // links
      const hrefs = raw.match(/href=["']([^"']+)["']/gi) || [];
      hrefs.forEach((h) => {
        if (h.includes('http://') || h.includes('https://')) {
          if (h.includes('sunraise')) internalLinkCount += 1;
          else externalLinkCount += 1;
        } else {
          internalLinkCount += 1;
        }
      });
      // strip html for words
      const stripped = raw.replace(/<[^>]+>/g, ' ');
      textTokens.push(stripped);
    }
  });

  const fullBodyText = textTokens.join(' ').toLowerCase();
  const wordCount = fullBodyText.split(/\s+/).filter(Boolean).length;

  const checks: SEOCheckItem[] = [];

  // 1. Focus Keyword in Title
  const hasKwInTitle = focusKeyword ? metaTitle.toLowerCase().includes(focusKeyword) : false;
  checks.push({
    id: 'kw_in_title',
    label: 'Focus Keyword in SEO Title',
    category: hasKwInTitle ? 'good' : focusKeyword ? 'critical' : 'warning',
    passed: hasKwInTitle,
    message: hasKwInTitle
      ? `Keyword "${focusKeyword}" is present in the title tag.`
      : focusKeyword
      ? `The focus keyword "${focusKeyword}" was not found in the SEO title.`
      : 'No focus keyword defined yet.',
    recommendation: 'Position your primary target keyword near the beginning of the title tag.'
  });

  // 2. Title Length
  const titleLen = metaTitle.length;
  const titleLengthOk = titleLen >= 40 && titleLen <= 65;
  checks.push({
    id: 'title_length',
    label: 'SEO Title Length (40–65 chars)',
    category: titleLengthOk ? 'good' : titleLen > 65 ? 'warning' : 'warning',
    passed: titleLengthOk,
    message: `Title length is ${titleLen} characters. (Recommended: 40–65)`,
    recommendation: titleLen < 40 ? 'Add descriptive, compelling phrasing with branding.' : titleLen > 65 ? 'Shorten title to prevent truncation on Google SERPs.' : 'Optimal length for desktop and mobile search viewports.'
  });

  // 3. Focus Keyword in Meta Description
  const hasKwInDesc = focusKeyword ? metaDesc.toLowerCase().includes(focusKeyword) : false;
  checks.push({
    id: 'kw_in_desc',
    label: 'Focus Keyword in Meta Description',
    category: hasKwInDesc ? 'good' : focusKeyword ? 'critical' : 'warning',
    passed: hasKwInDesc,
    message: hasKwInDesc
      ? `Keyword found in meta description.`
      : focusKeyword
      ? `Keyword "${focusKeyword}" is missing from the meta description.`
      : 'Set a focus keyword to verify description alignment.',
    recommendation: 'Include your focus keyword naturally with a strong call-to-action.'
  });

  // 4. Meta Description Length
  const descLen = metaDesc.length;
  const descLengthOk = descLen >= 120 && descLen <= 165;
  checks.push({
    id: 'desc_length',
    label: 'Meta Description Length (120–165 chars)',
    category: descLengthOk ? 'good' : 'warning',
    passed: descLengthOk,
    message: `Description length is ${descLen} characters. (Recommended: 120–165)`,
    recommendation: descLen < 120 ? 'Expand description to summarize value proposition and encourage clicks.' : descLen > 165 ? 'Trim description slightly to avoid Google snippet ellipses.' : 'Perfect length for SERP snippet visibility.'
  });

  // 5. Focus Keyword in URL Slug
  const normalizedKwSlug = focusKeyword.replace(/\s+/g, '-');
  const hasKwInSlug = focusKeyword ? fullSlug.includes(normalizedKwSlug) || fullSlug.includes(focusKeyword) : false;
  checks.push({
    id: 'kw_in_slug',
    label: 'Focus Keyword in URL Slug',
    category: hasKwInSlug ? 'good' : focusKeyword ? 'warning' : 'warning',
    passed: hasKwInSlug,
    message: hasKwInSlug
      ? 'URL slug contains target keyword.'
      : focusKeyword
      ? `Slug "/${fullSlug}" does not contain target keyword.`
      : 'Define a focus keyword to evaluate slug optimization.',
    recommendation: 'Keep URL slugs clean, hyphen-separated, and keyword-rich.'
  });

  // 6. Heading Hierarchy (Strict Single H1)
  const isSingleH1 = h1Count === 1;
  checks.push({
    id: 'heading_hierarchy',
    label: 'Strict Heading Hierarchy (Single H1)',
    category: isSingleH1 ? 'good' : 'critical',
    passed: isSingleH1,
    message: h1Count === 1
      ? 'Validated: Exactly one <h1> tag exists on the page.'
      : h1Count === 0
      ? 'No <h1> tag detected! Every page requires a single primary H1.'
      : `Found ${h1Count} <h1> tags! Multiple H1s dilute topical authority.`,
    recommendation: 'Ensure only the main hero title uses <h1>. Downgrade section titles to <h2> or <h3>.'
  });

  // 7. Focus Keyword in H1
  const h1Text = (heroTitle || '') + ' ' + (heroHighlight || '');
  const hasKwInH1 = focusKeyword ? h1Text.toLowerCase().includes(focusKeyword) : false;
  checks.push({
    id: 'kw_in_h1',
    label: 'Focus Keyword in Primary Heading (H1)',
    category: hasKwInH1 ? 'good' : focusKeyword ? 'critical' : 'warning',
    passed: hasKwInH1,
    message: hasKwInH1
      ? 'Keyword matches H1 heading text.'
      : focusKeyword
      ? 'Focus keyword is not present in the primary H1 heading.'
      : 'Set a focus keyword to evaluate H1 alignment.',
    recommendation: 'Integrate the focus keyword directly into your page headline.'
  });

  // 8. Keyword in Content & Density
  let kwOccurrences = 0;
  if (focusKeyword) {
    const escaped = focusKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const matches = fullBodyText.match(new RegExp(escaped, 'gi'));
    kwOccurrences = matches ? matches.length : 0;
  }
  const density = wordCount > 0 ? (kwOccurrences / wordCount) * 100 : 0;
  const densityOk = focusKeyword ? density >= 0.5 && density <= 2.5 : false;
  checks.push({
    id: 'content_density',
    label: 'Keyword Usage & Density (0.5% – 2.5%)',
    category: densityOk ? 'good' : 'warning',
    passed: densityOk,
    message: focusKeyword
      ? `Keyword appears ${kwOccurrences} times (${density.toFixed(2)}% density).`
      : 'Keyword density cannot be calculated without a focus keyword.',
    recommendation: density < 0.5 ? 'Use the keyword in paragraphs and subheadings naturally.' : density > 2.5 ? 'Reduce keyword occurrences to prevent keyword stuffing penalties.' : 'Healthy keyword distribution.'
  });

  // 9. Content Depth / Word Count
  const contentLenOk = wordCount >= 300;
  checks.push({
    id: 'content_length',
    label: 'Content Length & Topical Depth',
    category: contentLenOk ? 'good' : 'warning',
    passed: contentLenOk,
    message: `Page contains ${wordCount} words. (Target: 300+ words)`,
    recommendation: contentLenOk ? 'Thorough topical coverage.' : 'Add more detailed service specifications, benefits, and FAQ answers.'
  });

  // 10. Image Alt Text Audit
  const allImagesHaveAlt = totalImages === 0 || imagesWithAlt === totalImages;
  checks.push({
    id: 'image_alts',
    label: 'Image Accessibility & Alt Attributes',
    category: allImagesHaveAlt ? 'good' : 'warning',
    passed: allImagesHaveAlt,
    message: totalImages === 0
      ? 'No images on page.'
      : `${imagesWithAlt} of ${totalImages} images have descriptive alt attributes.`,
    recommendation: allImagesHaveAlt ? 'All images have alt text.' : 'Provide descriptive, keyword-supportive alt tags on missing images.'
  });

  // 11. Internal & External Linking
  const hasLinks = internalLinkCount > 0 || externalLinkCount > 0;
  checks.push({
    id: 'link_graph',
    label: 'Internal & External Link Distribution',
    category: hasLinks ? 'good' : 'warning',
    passed: hasLinks,
    message: `Found ${internalLinkCount} internal links and ${externalLinkCount} external links.`,
    recommendation: internalLinkCount === 0 ? 'Add internal links to related services or contact pages.' : 'Internal link structure detected.'
  });

  // 12. Structured Data / Schema Markup
  const hasSchema = !!seoMeta.schema_json && seoMeta.schema_json.trim().length > 10;
  checks.push({
    id: 'schema_markup',
    label: 'Structured Data (JSON-LD Schema)',
    category: hasSchema ? 'good' : 'warning',
    passed: hasSchema,
    message: hasSchema ? 'Valid JSON-LD schema injected for Google Rich Snippets.' : 'No custom schema markup found. Add Service, FAQ or LocalBusiness schema.',
    recommendation: 'Enable automated schema generation in the SEO settings panel.'
  });

  // 13. Social Sharing Graph (OG Tags)
  const hasOg = !!(seoMeta.og_image || seoMeta.og_title || seoMeta.og_description);
  checks.push({
    id: 'open_graph',
    label: 'Open Graph & Social Preview Tags',
    category: hasOg ? 'good' : 'warning',
    passed: hasOg,
    message: hasOg ? 'Social sharing metadata configured.' : 'Open Graph title, description, or image missing.',
    recommendation: 'Set a social share image and custom OG description for LinkedIn & Twitter/X.'
  });

  // Calculate score (0 to 100)
  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return {
    score,
    focusKeyword,
    totalChecks: checks.length,
    passedChecks: passedCount,
    items: checks
  };
}
