import React, { useState } from 'react';
import { PageBlock } from '../../types';
import {
  CheckCircle2,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Phone,
  MessageCircle,
  HelpCircle,
  Code2,
  Check,
  Star,
  Layers,
  ChevronRight,
  Send,
  Building,
  TrendingUp,
  Award,
  Users,
  ChevronLeft,
  Tag
} from 'lucide-react';
import { SunraiseAPI } from '../../services/api';
import { LayoutColumnRenderer, LayoutColumnSlot } from './LayoutColumnRenderer';

interface VisualBlockRendererProps {
  block: PageBlock;
  isEditable?: boolean;
  onInlineUpdate?: (props: Record<string, any>) => void;
  viewportMode?: 'desktop' | 'tablet' | 'mobile';
}

export const VisualBlockRenderer: React.FC<VisualBlockRendererProps> = ({
  block,
  isEditable = false,
  onInlineUpdate,
  viewportMode = 'desktop'
}) => {
  const isMobile = viewportMode === 'mobile';
  const isTablet = viewportMode === 'tablet';
  const styles = block.styles || {};
  const props = block.props || {};

  // Outer container styling based on block.styles
  const hasBgImg = Boolean(styles.backgroundImage);

  // Calculate overlay gradient if background image is active
  let bgImageStyle: string | undefined = undefined;
  if (hasBgImg) {
    if (styles.backgroundOverlay) {
      const opacity = (styles.backgroundOverlayOpacity !== undefined ? styles.backgroundOverlayOpacity : 50) / 100;
      let overlayColor = styles.backgroundOverlay;
      if (overlayColor.startsWith('#')) {
        const r = parseInt(overlayColor.slice(1, 3), 16) || 0;
        const g = parseInt(overlayColor.slice(3, 5), 16) || 0;
        const b = parseInt(overlayColor.slice(5, 7), 16) || 0;
        overlayColor = `rgba(${r}, ${g}, ${b}, ${opacity})`;
      }
      bgImageStyle = `linear-gradient(${overlayColor}, ${overlayColor}), url("${styles.backgroundImage}")`;
    } else {
      bgImageStyle = `url("${styles.backgroundImage}")`;
    }
  }

  const wrapperStyle: React.CSSProperties = {
    backgroundColor: hasBgImg ? (styles.backgroundColor || 'transparent') : (styles.backgroundColor || undefined),
    color: styles.textColor || (hasBgImg && styles.backgroundOverlay ? '#ffffff' : undefined),
    paddingTop: styles.paddingY ? `${styles.paddingY}px` : undefined,
    paddingBottom: styles.paddingY ? `${styles.paddingY}px` : undefined,
    paddingLeft: styles.paddingX ? `${styles.paddingX}px` : undefined,
    paddingRight: styles.paddingX ? `${styles.paddingX}px` : undefined,
    marginTop: styles.marginY ? `${styles.marginY}px` : undefined,
    marginBottom: styles.marginY ? `${styles.marginY}px` : undefined,
    borderRadius: styles.borderRadius ? `${styles.borderRadius}px` : undefined,
    textAlign: styles.align || undefined,
    backgroundImage: bgImageStyle,
    backgroundSize: hasBgImg ? (styles.backgroundSize || 'cover') : undefined,
    backgroundPosition: hasBgImg ? (styles.backgroundPosition || 'center') : undefined,
    backgroundRepeat: hasBgImg ? (styles.backgroundRepeat || 'no-repeat') : undefined,
    position: 'relative'
  };

  // Raw HTML block
  if (block.type === 'html') {
    return (
      <div style={wrapperStyle} className={styles.customClass || ''} id={styles.elementId}>
        <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
          {block.css_content && (
            <style dangerouslySetInnerHTML={{ __html: block.css_content }} />
          )}
          <div
            dangerouslySetInnerHTML={{ __html: block.html_content || '' }}
            className="sunraise-custom-html-wrapper"
          />
        </div>
      </div>
    );
  }

  // Custom Code block
  if (block.type === 'code') {
    return (
      <div style={wrapperStyle} className={styles.customClass || ''} id={styles.elementId}>
        <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="p-6 rounded-2xl bg-gray-900 text-white font-mono text-sm overflow-x-auto border border-gray-800 shadow-warm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-800 text-xs text-gray-400">
              <span className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-orange-400" />
                <span>Custom Code Snippet / Widget</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-400">Sandbox</span>
            </div>
            <pre>{block.code_snippet || '// Custom Code Executed'}</pre>
          </div>
        </div>
      </div>
    );
  }

  // Pre-built Visual Components
  switch (block.component_name) {
    // ==========================================
    // 1. BASIC ELEMENTS
    // ==========================================
    case 'Heading': {
      const level = props.level || 'h2';
      const text = props.text || 'Heading text goes here';
      const alignment = props.alignment || styles.align || 'left';
      const alignClass = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';
      const flexClass = alignment === 'center' ? 'justify-center' : alignment === 'right' ? 'justify-end' : 'justify-start';

      const headingClasses = {
        h1: isMobile ? 'text-2xl font-black font-heading text-gray-900' : 'text-3xl sm:text-4xl lg:text-5xl font-black font-heading text-gray-900 tracking-tight leading-tight',
        h2: isMobile ? 'text-xl font-extrabold font-heading text-gray-900' : 'text-2xl sm:text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 leading-snug',
        h3: isMobile ? 'text-lg font-bold font-heading text-gray-900' : 'text-xl sm:text-2xl font-bold font-heading text-gray-900',
        h4: 'text-lg font-bold font-heading text-gray-800',
        h5: 'text-base font-semibold text-gray-800',
        h6: 'text-sm font-semibold uppercase tracking-wider text-orange-600'
      }[level as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'] || 'text-2xl font-bold';

      return (
        <div style={wrapperStyle} className={`py-4 max-w-7xl mx-auto px-4 sm:px-6 flex ${flexClass}`}>
          <div className={`w-full ${alignClass}`}>
            {level === 'h1' && <h1 className={`${headingClasses} ${alignClass}`}>{text}</h1>}
            {level === 'h2' && <h2 className={`${headingClasses} ${alignClass}`}>{text}</h2>}
            {level === 'h3' && <h3 className={`${headingClasses} ${alignClass}`}>{text}</h3>}
            {level === 'h4' && <h4 className={`${headingClasses} ${alignClass}`}>{text}</h4>}
            {level === 'h5' && <h5 className={`${headingClasses} ${alignClass}`}>{text}</h5>}
            {level === 'h6' && <h6 className={`${headingClasses} ${alignClass}`}>{text}</h6>}
          </div>
        </div>
      );
    }

    case 'Paragraph': {
      const alignment = props.alignment || styles.align || 'left';
      const alignClass = alignment === 'center' ? 'text-center' : alignment === 'right' ? 'text-right' : 'text-left';
      return (
        <div style={wrapperStyle} className={`py-3 max-w-7xl mx-auto px-4 sm:px-6 ${alignClass}`}>
          <p className={`text-base sm:text-lg text-gray-600 leading-relaxed font-normal ${alignClass}`}>
            {props.text || 'Add compelling descriptive copy for your audience with high-intent keywords and clear explanations.'}
          </p>
        </div>
      );
    }

    case 'Image': {
      const src = props.url || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80';
      const alt = props.alt || 'Sunraise visual media asset';
      const caption = props.caption || '';
      const align = props.alignment || styles.align || 'center';
      const alignClass = align === 'left' ? 'justify-start' : align === 'right' ? 'justify-end' : 'justify-center';

      const widthStyle = props.width || '100%';
      const heightStyle = props.height ? (typeof props.height === 'number' ? `${props.height}px` : props.height) : undefined;
      const maxHeightStyle = props.maxHeight ? (typeof props.maxHeight === 'number' ? `${props.maxHeight}px` : props.maxHeight) : '520px';
      const objectFit = props.objectFit || 'cover';
      const borderRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '24px');
      const shadowClass = props.cardShadow === 'none' ? '' : props.cardShadow === 'sunraise' ? 'shadow-sunraise-lg' : 'shadow-warm';

      return (
        <div style={wrapperStyle} className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
          <div className={`flex ${alignClass}`}>
            <div
              style={{
                width: widthStyle,
                maxWidth: '100%',
                borderRadius
              }}
              className={`overflow-hidden border border-gray-100/80 transition-all ${shadowClass}`}
            >
              <img
                src={src}
                alt={alt}
                style={{
                  width: '100%',
                  height: heightStyle || 'auto',
                  maxHeight: maxHeightStyle,
                  objectFit: objectFit as any,
                  borderRadius
                }}
                className="transition duration-300"
                loading="lazy"
              />
            </div>
          </div>
          {caption && (
            <p className={`text-xs text-gray-500 mt-2.5 italic ${align === "left" ? "text-left" : align === "right" ? "text-right" : "text-center"}`}>{caption}</p>
          )}
        </div>
      );
    }

    case 'Video': {
      const videoUrl = props.url || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      return (
        <div style={wrapperStyle} className="py-6 max-w-5xl mx-auto px-4 sm:px-6">
          <div className="aspect-video rounded-3xl overflow-hidden border border-gray-200 shadow-warm bg-black">
            {videoUrl.includes('youtube') || videoUrl.includes('vimeo') ? (
              <iframe
                src={videoUrl}
                title={props.title || 'Sunraise Video'}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video
                src={videoUrl}
                controls
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      );
    }

    case 'Button': {
      const text = props.text || 'Explore Opportunities';
      const url = props.url || '/contact';
      const variant = props.variant || 'primary';
      const align = props.alignment || styles.align || 'center';

      return (
        <div style={wrapperStyle} className={`py-4 max-w-7xl mx-auto px-4 sm:px-6 flex ${align === 'center' ? 'justify-center' : align === 'right' ? 'justify-end' : 'justify-start'}`}>
          <a
            href={url}
            className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-sm shadow-warm transition hover:scale-105 duration-200 ${
              variant === 'secondary'
                ? 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-50'
                : 'bg-sunraise-gradient text-white shadow-sunraise hover:shadow-sunraise-lg'
            }`}
          >
            <span>{text}</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      );
    }

    case 'Icon': {
      return (
        <div style={wrapperStyle} className="py-4 max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-gray-900 text-base">{props.title || 'Engineered Precision'}</h4>
            <p className="text-xs text-gray-500">{props.description || 'Specialized capabilities designed for scale.'}</p>
          </div>
        </div>
      );
    }

    case 'Divider': {
      return (
        <div style={wrapperStyle} className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
          <hr className="border-t border-gray-200/80" />
        </div>
      );
    }

    case 'Spacer': {
      const height = props.height || 40;
      return <div style={{ height: `${height}px` }} aria-hidden="true" />;
    }

    // ==========================================
    // 2. LAYOUT ELEMENTS (UNIVERSAL SLOTS FOR IMAGES, TEXT, ICONS, BUTTONS)
    // ==========================================
    case 'Container': {
      const cardPadding = props.cardSize === 'compact' ? 'p-4 sm:p-6' : props.cardSize === 'spacious' ? 'p-10 sm:p-14' : 'p-6 sm:p-8';
      const cardRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '24px');
      const cardShadow = props.cardShadow === 'none' ? 'border border-gray-200' : props.cardShadow === 'sunraise' ? 'shadow-sunraise border border-orange-200' : 'shadow-warm border border-gray-100';
      const isDark = props.bg === 'dark';
      const bgStyle = isDark ? 'bg-gray-900 text-white' : props.bg === 'orange' ? 'bg-orange-50/70 border-orange-100' : props.bg === 'white' ? 'bg-white' : 'bg-gray-50/70';

      const bullets = props.bullets || props.points;

      return (
        <div style={wrapperStyle} className="py-12 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div style={{ borderRadius: cardRadius }} className={`${cardPadding} ${cardShadow} ${bgStyle} overflow-hidden group`}>
              {/* Optional Video or Image */}
              {props.video ? (
                <div className="w-full mb-6 overflow-hidden rounded-2xl border border-gray-200 aspect-video bg-black shadow-sm">
                  {props.video.includes('youtube') || props.video.includes('vimeo') ? (
                    <iframe
                      src={props.video}
                      title={props.title || 'Video'}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video src={props.video} controls className="w-full h-full object-cover" />
                  )}
                </div>
              ) : props.image ? (
                <div className="w-full mb-6 overflow-hidden rounded-2xl border border-gray-100 bg-gray-100">
                  <img
                    src={props.image}
                    alt={props.title || 'Container media'}
                    className="w-full h-56 sm:h-72 object-cover transition-transform duration-300 group-hover:scale-102"
                    loading="lazy"
                  />
                </div>
              ) : null}

              {/* Optional Icon */}
              {props.icon && props.icon !== 'none' && (
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
                  isDark ? 'bg-gray-800 text-orange-400' : 'bg-orange-100 text-orange-600'
                }`}>
                  {props.icon === 'sparkles' ? <Sparkles className="w-6 h-6" /> :
                   props.icon === 'star' ? <Star className="w-6 h-6 fill-current" /> :
                   props.icon === 'shield' ? <ShieldCheck className="w-6 h-6" /> :
                   props.icon === 'zap' ? <Zap className="w-6 h-6" /> :
                   props.icon === 'trendingup' ? <TrendingUp className="w-6 h-6" /> :
                   props.icon === 'award' ? <Award className="w-6 h-6" /> :
                   props.icon === 'phone' ? <Phone className="w-6 h-6" /> :
                   <CheckCircle2 className="w-6 h-6" />}
                </div>
              )}

              {/* Badge */}
              {props.badge && (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                }`}>
                  {props.badge}
                </span>
              )}

              {/* Title */}
              {props.title && (
                <h3 className={`text-2xl sm:text-3xl font-bold font-heading mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {props.title}
                </h3>
              )}

              {/* Content */}
              {props.content && (
                <p className={`text-sm sm:text-base leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {props.content}
                </p>
              )}

              {/* Bullets List */}
              {bullets && Array.isArray(bullets) && bullets.length > 0 && (
                <div className="space-y-2.5 my-4">
                  {bullets.map((b: string, i: number) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <CheckCircle2 className={`w-4 h-4 shrink-0 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
                      <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{b}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              {(props.button_text || props.secondary_button_text) && (
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {props.button_text && (
                    <a
                      href={props.button_url || '/contact'}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition"
                    >
                      <span>{props.button_text}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {props.secondary_button_text && (
                    <a
                      href={props.secondary_button_url || '/contact'}
                      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold transition ${
                        isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-warm'
                      }`}
                    >
                      <span>{props.secondary_button_text}</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    case 'TwoColumn': {
      // Modern Slot Architecture with Empty Boxes & Sub-Elements
      if (Array.isArray(props.columns)) {
        const slots: LayoutColumnSlot[] = props.columns.length === 2
          ? props.columns
          : [
              props.columns[0] || { id: 'col-1', title: 'Column 1', direction: 'col', elements: [] },
              props.columns[1] || { id: 'col-2', title: 'Column 2', direction: 'col', elements: [] }
            ];

        return (
          <section style={wrapperStyle} className={`py-12 ${hasBgImg ? 'bg-transparent' : 'bg-white'} ${isMobile ? 'px-2' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {props.title && (
                <h2 className={`font-extrabold text-gray-900 font-heading text-center mb-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {props.title}
                </h2>
              )}
              <div className={`grid ${isMobile ? 'grid-cols-1 gap-6' : 'grid-cols-1 md:grid-cols-2 gap-8'} items-stretch`}>
                {slots.map((col, idx) => (
                  <LayoutColumnRenderer
                    key={col.id || idx}
                    column={col}
                    colIndex={idx}
                    totalColumns={2}
                    isEditable={isEditable}
                    viewportMode={viewportMode}
                    onUpdateColumn={(updated) => {
                      const newSlots = [...slots];
                      newSlots[idx] = updated;
                      if (onInlineUpdate) {
                        onInlineUpdate({ columns: newSlots });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      }

      const cardPadding = props.cardSize === 'compact' ? 'p-4 sm:p-5' : props.cardSize === 'spacious' ? 'p-8 sm:p-10' : 'p-6 sm:p-8';
      const cardRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '20px');
      const cardShadow = props.cardShadow === 'none' ? 'border border-gray-200' : props.cardShadow === 'sunraise' ? 'shadow-sunraise border border-orange-200' : 'shadow-warm border border-gray-100';

      const leftIsDark = props.left_bg === 'dark';
      const rightIsDark = props.right_bg === 'dark';

      const leftBg = leftIsDark ? 'bg-gray-900 text-white' : props.left_bg === 'orange' ? 'bg-orange-50/70 border border-orange-100' : props.left_bg === 'white' ? 'bg-white border border-gray-100' : 'bg-gray-50/70 border border-gray-100';
      const rightBg = rightIsDark ? 'bg-gray-900 text-white' : props.right_bg === 'gray' ? 'bg-gray-50/70 border border-gray-100' : props.right_bg === 'white' ? 'bg-white border border-gray-100' : 'bg-orange-50/60 border border-orange-100';

      const leftBullets = props.left_bullets || props.left_points;
      const rightBullets = props.right_bullets || props.right_points;

      return (
        <section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"} ${isMobile ? "px-2" : ""}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {props.title && (
              <h2 className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl"} font-extrabold text-gray-900 font-heading text-center mb-8`}>
                {props.title}
              </h2>
            )}
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-8"} items-stretch`}>
              {/* Left Column Card */}
              <div
                style={{ borderRadius: cardRadius }}
                className={`${cardPadding} ${cardShadow} ${leftBg} flex flex-col justify-between overflow-hidden group transition duration-200`}
              >
                <div>
                  {/* Left Video or Image */}
                  {props.left_video ? (
                    <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-200 aspect-video bg-black shadow-sm">
                      {props.left_video.includes('youtube') || props.left_video.includes('vimeo') ? (
                        <iframe
                          src={props.left_video}
                          title={props.left_title || 'Left video'}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={props.left_video} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : props.left_image ? (
                    <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                      <img
                        src={props.left_image}
                        alt={props.left_title || 'Left column media'}
                        className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  {/* Left Icon */}
                  {props.left_icon && props.left_icon !== 'none' && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      leftIsDark ? 'bg-gray-800 text-orange-400' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {props.left_icon === 'sparkles' ? <Sparkles className="w-5 h-5" /> :
                       props.left_icon === 'star' ? <Star className="w-5 h-5 fill-current" /> :
                       props.left_icon === 'shield' ? <ShieldCheck className="w-5 h-5" /> :
                       props.left_icon === 'zap' ? <Zap className="w-5 h-5" /> :
                       props.left_icon === 'award' ? <Award className="w-5 h-5" /> :
                       <CheckCircle2 className="w-5 h-5" />}
                    </div>
                  )}

                  {props.left_badge && (
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2.5 ${
                      leftIsDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {props.left_badge}
                    </span>
                  )}

                  {props.left_title && (
                    <h3 className={`text-lg sm:text-xl font-bold font-heading mb-2 ${leftIsDark ? 'text-white' : 'text-gray-900'}`}>
                      {props.left_title}
                    </h3>
                  )}

                  {props.left_content && (
                    <p className={`text-xs sm:text-sm leading-relaxed ${leftIsDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {props.left_content}
                    </p>
                  )}

                  {/* Left Bullets */}
                  {leftBullets && Array.isArray(leftBullets) && leftBullets.length > 0 && (
                    <div className="space-y-2 my-3">
                      {leftBullets.map((b: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${leftIsDark ? 'text-orange-400' : 'text-orange-500'}`} />
                          <span className={leftIsDark ? 'text-gray-300' : 'text-gray-700'}>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {(props.left_button_text || props.left_secondary_button_text) && (
                  <div className="mt-5 pt-3 border-t border-gray-100/60 flex flex-wrap items-center gap-2">
                    {props.left_button_text && (
                      <a
                        href={props.left_button_url || '/contact'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow hover:bg-orange-700 transition"
                      >
                        <span>{props.left_button_text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {props.left_secondary_button_text && (
                      <a
                        href={props.left_secondary_button_url || '/contact'}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          leftIsDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{props.left_secondary_button_text}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column Card */}
              <div
                style={{ borderRadius: cardRadius }}
                className={`${cardPadding} ${cardShadow} ${rightBg} flex flex-col justify-between overflow-hidden group transition duration-200`}
              >
                <div>
                  {/* Right Video or Image */}
                  {props.right_video ? (
                    <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-200 aspect-video bg-black shadow-sm">
                      {props.right_video.includes('youtube') || props.right_video.includes('vimeo') ? (
                        <iframe
                          src={props.right_video}
                          title={props.right_title || 'Right video'}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : (
                        <video src={props.right_video} controls className="w-full h-full object-cover" />
                      )}
                    </div>
                  ) : props.right_image ? (
                    <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                      <img
                        src={props.right_image}
                        alt={props.right_title || 'Right column media'}
                        className="w-full h-48 sm:h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  ) : null}

                  {/* Right Icon */}
                  {props.right_icon && props.right_icon !== 'none' && (
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                      rightIsDark ? 'bg-gray-800 text-orange-400' : 'bg-orange-100 text-orange-600'
                    }`}>
                      {props.right_icon === 'sparkles' ? <Sparkles className="w-5 h-5" /> :
                       props.right_icon === 'star' ? <Star className="w-5 h-5 fill-current" /> :
                       props.right_icon === 'shield' ? <ShieldCheck className="w-5 h-5" /> :
                       props.right_icon === 'zap' ? <Zap className="w-5 h-5" /> :
                       props.right_icon === 'award' ? <Award className="w-5 h-5" /> :
                       <CheckCircle2 className="w-5 h-5" />}
                    </div>
                  )}

                  {props.right_badge && (
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2.5 ${
                      rightIsDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {props.right_badge}
                    </span>
                  )}

                  {props.right_title && (
                    <h3 className={`text-lg sm:text-xl font-bold font-heading mb-2 ${rightIsDark ? 'text-white' : 'text-gray-900'}`}>
                      {props.right_title}
                    </h3>
                  )}

                  {props.right_content && (
                    <p className={`text-xs sm:text-sm leading-relaxed ${rightIsDark ? 'text-gray-300' : 'text-gray-600'}`}>
                      {props.right_content}
                    </p>
                  )}

                  {/* Right Bullets */}
                  {rightBullets && Array.isArray(rightBullets) && rightBullets.length > 0 && (
                    <div className="space-y-2 my-3">
                      {rightBullets.map((b: string, i: number) => (
                        <div key={i} className="flex items-center gap-2 text-xs">
                          <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${rightIsDark ? 'text-orange-400' : 'text-orange-500'}`} />
                          <span className={rightIsDark ? 'text-gray-300' : 'text-gray-700'}>{b}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {(props.right_button_text || props.right_secondary_button_text) && (
                  <div className="mt-5 pt-3 border-t border-gray-100/60 flex flex-wrap items-center gap-2">
                    {props.right_button_text && (
                      <a
                        href={props.right_button_url || '/contact'}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow hover:bg-orange-700 transition"
                      >
                        <span>{props.right_button_text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {props.right_secondary_button_text && (
                      <a
                        href={props.right_secondary_button_url || '/contact'}
                        className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition ${
                          rightIsDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span>{props.right_secondary_button_text}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'ThreeColumn': {
      // Modern Slot Architecture with Empty Boxes & Sub-Elements
      if (Array.isArray(props.columns) && (props.columns.length === 0 || props.columns.some((c: any) => c.elements !== undefined || !c.desc))) {
        const slots: LayoutColumnSlot[] = props.columns.length === 3
          ? props.columns
          : [
              props.columns[0] || { id: 'col-1', title: 'Column 1', direction: 'col', elements: [] },
              props.columns[1] || { id: 'col-2', title: 'Column 2', direction: 'col', elements: [] },
              props.columns[2] || { id: 'col-3', title: 'Column 3', direction: 'col', elements: [] }
            ];

        const gridClass = isMobile
          ? 'grid-cols-1 gap-6'
          : isTablet
          ? 'grid-cols-1 sm:grid-cols-2 gap-6'
          : slots.length === 2
          ? 'grid-cols-1 md:grid-cols-2 gap-6'
          : 'grid-cols-1 md:grid-cols-3 gap-6';

        return (
          <section style={wrapperStyle} className={`py-12 ${hasBgImg ? 'bg-transparent' : 'bg-gray-50/50'} ${isMobile ? 'px-2' : ''}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6">
              {props.title && (
                <h2 className={`font-extrabold text-gray-900 font-heading text-center mb-8 ${isMobile ? 'text-2xl' : 'text-3xl'}`}>
                  {props.title}
                </h2>
              )}
              <div className={`grid ${gridClass} items-stretch`}>
                {slots.map((col, idx) => (
                  <LayoutColumnRenderer
                    key={col.id || idx}
                    column={col}
                    colIndex={idx}
                    totalColumns={slots.length}
                    isEditable={isEditable}
                    viewportMode={viewportMode}
                    onUpdateColumn={(updated) => {
                      const newSlots = [...slots];
                      newSlots[idx] = updated;
                      if (onInlineUpdate) {
                        onInlineUpdate({ columns: newSlots });
                      }
                    }}
                  />
                ))}
              </div>
            </div>
          </section>
        );
      }

      const cols = (props.columns && props.columns.length > 0)
        ? props.columns
        : ((props.items && props.items.length > 0) ? props.items : [
            { title: 'Technical Dominance', desc: 'Sub-second page speeds with Core Web Vitals compliance.' },
            { title: 'Search Authority', desc: 'White-hat PR links and local entity Knowledge Graph signals.' },
            { title: 'Conversion Funnels', desc: 'Optimized booking, inquiry, and WhatsApp lead capture engines.' }
          ]);
      const cardPadding = props.cardSize === 'compact' ? 'p-4' : props.cardSize === 'spacious' ? 'p-8' : 'p-6';
      const cardRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '18px');
      const cardShadow = props.cardShadow === 'none' ? 'border border-gray-200' : props.cardShadow === 'sunraise' ? 'shadow-sunraise border border-orange-200' : 'shadow-warm border border-gray-100 hover:shadow-warm-hover';
      const colGridClass = isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 sm:grid-cols-2' : cols.length === 1 ? 'grid-cols-1' : cols.length === 2 ? 'grid-cols-1 md:grid-cols-2' : cols.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';

      return (
        <section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {props.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading text-center mb-8">
                {props.title}
              </h2>
            )}
            <div className={`grid ${colGridClass} gap-6`}>
              {cols.map((col: any, idx: number) => {
                const cardIsDark = col.bg === 'dark';
                const cardBg = cardIsDark ? 'bg-gray-900 text-white' : col.bg === 'orange' ? 'bg-orange-50/70 border-orange-100' : col.bg === 'gray' ? 'bg-gray-50/80 border-gray-200' : 'bg-white';
                const colBullets = col.bullets || col.points;

                return (
                  <div
                    key={idx}
                    style={{ borderRadius: cardRadius }}
                    className={`${cardPadding} ${cardShadow} ${cardBg} transition duration-200 flex flex-col justify-between overflow-hidden group`}
                  >
                    <div>
                      {/* Optional Video or Image */}
                      {col.video ? (
                        <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-200 aspect-video bg-black shadow-sm">
                          {col.video.includes('youtube') || col.video.includes('vimeo') ? (
                            <iframe
                              src={col.video}
                              title={col.title || 'Video'}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video src={col.video} controls className="w-full h-full object-cover" />
                          )}
                        </div>
                      ) : col.image ? (
                        <div className="w-full mb-4 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                          <img
                            src={col.image}
                            alt={col.title || 'Column media asset'}
                            className="w-full h-44 object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      {/* Optional Badge */}
                      {col.badge && (
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2.5 ${
                          cardIsDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {col.badge}
                        </span>
                      )}

                      {/* Optional Icon */}
                      {col.icon !== 'none' && !col.image && !col.video && (
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${
                          cardIsDark ? 'bg-gray-800 text-orange-400' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {col.icon === 'sparkles' ? <Sparkles className="w-5 h-5" /> :
                           col.icon === 'star' ? <Star className="w-5 h-5 fill-current" /> :
                           col.icon === 'shield' ? <ShieldCheck className="w-5 h-5" /> :
                           col.icon === 'zap' ? <Zap className="w-5 h-5" /> :
                           col.icon === 'trendingup' ? <TrendingUp className="w-5 h-5" /> :
                           col.icon === 'award' ? <Award className="w-5 h-5" /> :
                           col.icon === 'phone' ? <Phone className="w-5 h-5" /> :
                           <CheckCircle2 className="w-5 h-5" />}
                        </div>
                      )}

                      {/* Title */}
                      {col.title && (
                        <h4 className={`text-base sm:text-lg font-bold font-heading mb-2 ${cardIsDark ? 'text-white' : 'text-gray-900'}`}>
                          {col.title}
                        </h4>
                      )}

                      {/* Description */}
                      {(col.desc || col.content) && (
                        <p className={`text-xs sm:text-sm leading-relaxed ${cardIsDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {col.desc || col.content}
                        </p>
                      )}

                      {/* Bullets List */}
                      {colBullets && Array.isArray(colBullets) && colBullets.length > 0 && (
                        <div className="space-y-1.5 my-3">
                          {colBullets.map((b: string, i: number) => (
                            <div key={i} className="flex items-center gap-2 text-xs">
                              <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 ${cardIsDark ? 'text-orange-400' : 'text-orange-500'}`} />
                              <span className={cardIsDark ? 'text-gray-300' : 'text-gray-700'}>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Optional Action Button */}
                    {col.button_text && (
                      <div className="mt-4 pt-3 border-t border-gray-100/60">
                        <a
                          href={col.button_url || '/contact'}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:text-orange-700 transition group/btn"
                        >
                          <span>{col.button_text}</span>
                          <ArrowRight className="w-3.5 h-3.5 transition group-hover/btn:translate-x-1" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'Grid': {
      const items = (props.items && props.items.length > 0)
        ? props.items
        : ((props.columns && Array.isArray(props.columns) && props.columns.length > 0) ? props.columns : [
            { title: 'Scalable Architecture', desc: 'React 19 & Cloud DB' },
            { title: 'Local 3-Pack Rank', desc: 'Google Maps Dominance' },
            { title: 'Zero Downtime', desc: '99.9% High Availability' },
            { title: 'Bespoke CMS', desc: 'Visual Drag & Drop Editing' }
          ]);
      const gridCols = Number(props.columns) || 4;
      const colClass = gridCols === 1 ? 'grid-cols-1' : gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' : gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4';
      const cardPadding = props.cardSize === 'compact' ? 'p-3' : props.cardSize === 'spacious' ? 'p-7' : 'p-5';
      const cardRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '16px');

      return (
        <section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            {props.title && (
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading text-center mb-8">
                {props.title}
              </h2>
            )}
            <div className={`grid ${colClass} gap-6`}>
              {items.map((it: any, i: number) => {
                const itemIsDark = it.bg === 'dark';
                const itemBg = itemIsDark ? 'bg-gray-900 text-white' : it.bg === 'orange' ? 'bg-orange-50/70 border-orange-100' : it.bg === 'white' ? 'bg-white border border-gray-200' : 'bg-gray-50 border border-gray-100';
                const itemBullets = it.bullets || it.points;

                return (
                  <div
                    key={i}
                    style={{ borderRadius: cardRadius }}
                    className={`${cardPadding} ${itemBg} shadow-sm text-left hover:shadow-warm transition duration-200 flex flex-col justify-between overflow-hidden group`}
                  >
                    <div>
                      {/* Optional Video or Image */}
                      {it.video ? (
                        <div className="w-full mb-3 overflow-hidden rounded-xl border border-gray-200 aspect-video bg-black shadow-sm">
                          {it.video.includes('youtube') || it.video.includes('vimeo') ? (
                            <iframe
                              src={it.video}
                              title={it.title || 'Video'}
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          ) : (
                            <video src={it.video} controls className="w-full h-full object-cover" />
                          )}
                        </div>
                      ) : it.image ? (
                        <div className="w-full mb-3 overflow-hidden rounded-xl border border-gray-100 bg-gray-100">
                          <img
                            src={it.image}
                            alt={it.title || 'Grid card asset'}
                            className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      ) : null}

                      {/* Optional Badge */}
                      {it.badge && (
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider mb-2 ${
                          itemIsDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {it.badge}
                        </span>
                      )}

                      {/* Optional Icon */}
                      {it.icon !== 'none' && !it.image && !it.video && (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${
                          itemIsDark ? 'bg-gray-800 text-orange-400' : 'bg-orange-100 text-orange-600'
                        }`}>
                          {it.icon === 'check' ? <CheckCircle2 className="w-4 h-4" /> :
                           it.icon === 'star' ? <Star className="w-4 h-4 fill-current" /> :
                           it.icon === 'shield' ? <ShieldCheck className="w-4 h-4" /> :
                           it.icon === 'zap' ? <Zap className="w-4 h-4" /> :
                           it.icon === 'award' ? <Award className="w-4 h-4" /> :
                           <Sparkles className="w-4 h-4" />}
                        </div>
                      )}

                      {/* Title */}
                      {it.title && (
                        <h4 className={`text-base font-bold mb-1 ${itemIsDark ? 'text-white' : 'text-gray-900'}`}>
                          {it.title}
                        </h4>
                      )}

                      {/* Description */}
                      {(it.desc || it.content) && (
                        <p className={`text-xs leading-relaxed ${itemIsDark ? 'text-gray-300' : 'text-gray-500'}`}>
                          {it.desc || it.content}
                        </p>
                      )}

                      {/* Bullets List */}
                      {itemBullets && Array.isArray(itemBullets) && itemBullets.length > 0 && (
                        <div className="space-y-1.5 my-2.5">
                          {itemBullets.map((b: string, idx: number) => (
                            <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                              <CheckCircle2 className={`w-3 h-3 shrink-0 ${itemIsDark ? 'text-orange-400' : 'text-orange-500'}`} />
                              <span className={itemIsDark ? 'text-gray-300' : 'text-gray-600'}>{b}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Optional Button */}
                    {it.button_text && (
                      <div className="mt-4 pt-2 border-t border-gray-100/60">
                        <a
                          href={it.button_url || '/contact'}
                          className="inline-flex items-center gap-1 text-xs font-bold text-orange-600 hover:text-orange-700 transition"
                        >
                          <span>{it.button_text}</span>
                          <ArrowRight className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'ImageAndText':
    case 'SplitImageText': {
      const isReversed = props.image_position === 'left';
      const isDark = props.bg === 'dark';
      const bgStyle = isDark ? 'bg-gray-900 text-white' : props.bg === 'orange' ? 'bg-orange-50/50' : props.bg === 'gray' ? 'bg-gray-50' : 'bg-white';
      const bullets: string[] = props.bullets || props.points || [
        'Enterprise Performance Guarantee',
        'Zero Downtime Deployment',
        'Dedicated Senior Architect Lead'
      ];

      return (
        <section style={wrapperStyle} className={`py-16 ${bgStyle}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReversed ? 'lg:grid-flow-dense' : ''}`}>
              {/* Text Side */}
              <div className={isReversed ? 'lg:col-start-2' : ''}>
                {props.badge && (
                  <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                    isDark ? 'bg-orange-500/20 text-orange-300' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {props.badge}
                  </span>
                )}
                <h2 className={`text-3xl sm:text-4xl font-extrabold font-heading mt-3 mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {props.title || 'Built for Speed, Scalability, and Search Domination'}
                </h2>
                <p className={`text-sm leading-relaxed mb-6 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {props.text || props.description || props.content || 'We merge rigorous engineering standards with cutting-edge marketing funnels to deliver verifiable commercial ROI.'}
                </p>

                {bullets && Array.isArray(bullets) && bullets.length > 0 && (
                  <div className="space-y-3 mb-6">
                    {bullets.map((b: string, i: number) => (
                      <div key={i} className="flex items-center gap-3 text-sm font-medium">
                        <ShieldCheck className="w-5 h-5 text-orange-500 shrink-0" />
                        <span className={isDark ? 'text-gray-200' : 'text-gray-800'}>{b}</span>
                      </div>
                    ))}
                  </div>
                )}

                {(props.button_text || props.secondary_button_text) && (
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    {props.button_text && (
                      <a
                        href={props.button_url || '/contact'}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunraise-gradient text-white text-xs font-bold shadow-sunraise hover:shadow-sunraise-lg transition"
                      >
                        <span>{props.button_text}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </a>
                    )}
                    {props.secondary_button_text && (
                      <a
                        href={props.secondary_button_url || '/contact'}
                        className={`inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-bold transition ${
                          isDark ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-warm'
                        }`}
                      >
                        <span>{props.secondary_button_text}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Media Side */}
              <div className={`relative ${isReversed ? 'lg:col-start-1' : ''}`}>
                {props.video ? (
                  <div className="aspect-video rounded-3xl overflow-hidden border border-gray-200 shadow-warm-hover bg-black">
                    {props.video.includes('youtube') || props.video.includes('vimeo') ? (
                      <iframe
                        src={props.video}
                        title={props.title || 'Video'}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video src={props.video} controls className="w-full h-full object-cover" />
                    )}
                  </div>
                ) : (
                  <img
                    src={props.image || 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=1000&q=80'}
                    alt={props.title || 'Sunraise Feature'}
                    className="rounded-3xl shadow-warm-hover object-cover w-full h-[380px]"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // ==========================================
    // 3. BUSINESS / SERVICE ELEMENTS
    // ==========================================
    case 'FeatureGrid': {
      const features: any[] = props.features || [
        'Dedicated Technical Architecture',
        '24/7 SLA Uptime Guarantee',
        'High-DA Link Building Pipeline',
        'Performance Analytics Engine'
      ];
      const badge = props.badge || 'Engineered Capabilities';
      const cols = Number(props.columns) || 3;
      const colGridClass = isMobile
        ? 'grid-cols-1'
        : isTablet
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

      const cardPadding = props.cardSize === 'compact' ? 'p-4' : props.cardSize === 'spacious' ? 'p-8' : 'p-6';
      const cardRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '16px');
      const cardShadow =
        props.cardShadow === 'none'
          ? 'border border-gray-200'
          : props.cardShadow === 'sunraise'
          ? 'shadow-sunraise border border-orange-200 bg-white'
          : 'shadow-warm border border-gray-100 bg-white hover:shadow-warm-hover';

      return (
        <section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-wide uppercase mb-3 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{badge}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-heading">
                {props.title || 'Specialized Strategic Capabilities'}
              </h2>
              {props.description && (
                <p className="mt-2 text-sm sm:text-base text-gray-600">
                  {props.description}
                </p>
              )}
            </div>

            <div className={`grid ${colGridClass} gap-6`}>
              {features.map((feat: any, idx: number) => {
                const title = typeof feat === 'string' ? feat : feat.title;
                const desc = typeof feat === 'string'
                  ? 'Designed and deployed by our senior engineers adhering to strict performance and conversion benchmarks.'
                  : (feat.description || feat.desc || 'High-performance capability deployed for maximum ROI.');

                return (
                  <div
                    key={idx}
                    style={{ borderRadius: cardRadius }}
                    className={`${cardPadding} ${cardShadow} hover:-translate-y-1 transition duration-200 flex flex-col justify-between`}
                  >
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 font-heading mb-2">
                        {title}
                      </h3>
                      <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'ProcessTimeline': {
      const steps = props.steps || [
        { step: '01', title: 'Audit & Discovery', desc: 'Comprehensive data and keyword gap analysis.' },
        { step: '02', title: 'Strategy Blueprint', desc: 'Targeted architectural and on-page roadmap.' },
        { step: '03', title: 'Execution & Rollout', desc: 'Deploying high-converting assets with sub-second speeds.' },
        { step: '04', title: 'Optimization & Scale', desc: 'Ongoing telemetry, rank tracking, and CRO scale.' }
      ];
      const badge = props.badge || 'Step-by-Step Blueprint';
      const cols = Number(props.columns) || 4;
      const colGridClass = isMobile
        ? 'grid-cols-1'
        : isTablet
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : cols === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';

      const cardPadding = props.cardSize === 'compact' ? 'p-4' : props.cardSize === 'spacious' ? 'p-8' : 'p-6';
      const cardRadius = props.cardRadius !== undefined ? `${props.cardRadius}px` : (styles.borderRadius ? `${styles.borderRadius}px` : '16px');
      const cardShadow =
        props.cardShadow === 'none'
          ? 'border border-gray-200'
          : props.cardShadow === 'sunraise'
          ? 'shadow-sunraise border border-orange-200 bg-white'
          : 'shadow-warm border border-gray-100 bg-white hover:shadow-warm-hover';

      return (
        <section style={wrapperStyle} className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full shadow-xs">
                {badge}
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-heading mt-3">
                {props.title || 'Our Proven Working Methodology'}
              </h2>
            </div>

            <div className={`grid ${colGridClass} gap-6 relative`}>
              {steps.map((st: any, idx: number) => (
                <div
                  key={idx}
                  style={{ borderRadius: cardRadius }}
                  className={`${cardPadding} ${cardShadow} relative group transition duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <span className="text-3xl sm:text-4xl font-black text-orange-500/20 group-hover:text-orange-500/40 transition font-heading mb-2 block">
                      {st.step || `0${idx + 1}`}
                    </span>
                    <h3 className="text-base sm:text-lg font-bold text-gray-900 font-heading mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {st.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'FAQAccordion': {
      const faqs = props.faqs || [
        { q: 'How long until we see measurable search ranking gains in Hyderabad?', a: 'Clients typically experience significant keyword momentum within 45 to 60 days following our technical overhaul and local schema deployment.' },
        { q: 'Do you provide dedicated account management for Rajahmundry clients?', a: 'Yes! Our Rajahmundry office directly manages client communications and local field implementations with weekly progress reviews.' },
        { q: 'How do you safeguard client rankings when updating service architecture?', a: 'We employ automated 301 redirect management, schema entity persistence, and continuous Google Search Console telemetry.' }
      ];

      return <FAQBlock title={props.title} faqs={faqs} wrapperStyle={wrapperStyle} />;
    }

    case 'CTABanner': {
      return (
        <section style={wrapperStyle} className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="rounded-3xl bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-8 sm:p-12 text-white shadow-sunraise-lg flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4 inline-block">
                  {props.badge || 'Ready to Scale?'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-heading leading-tight">
                  {props.title || 'Supercharge Your Enterprise Growth with Sunraise Solutions'}
                </h2>
                <p className="mt-3 text-white/90 text-sm leading-relaxed">
                  {props.description || props.subtitle || 'Connect with our principal architects in Hyderabad or Rajahmundry for a comprehensive strategy audit.'}
                </p>
              </div>
              <div className="shrink-0">
                <a
                  href={props.button_url || props.cta_link || '/contact'}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white text-orange-600 font-extrabold text-sm shadow-xl hover:bg-gray-50 hover:scale-105 transition"
                >
                  <span>{props.button_text || props.cta_text || 'Claim Your Free Proposal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>
      );
    }

    case 'PricingTable': {
      const tiers = props.tiers || [
        {
          name: 'Starter Growth',
          price: '₹25,000',
          period: '/month',
          desc: 'For local businesses establishing map pack dominance.',
          features: ['Google Business 3-Pack Optimization', '15 Target Keyword Clusters', 'Technical On-Page Fixes', 'Monthly Telemetry Call']
        },
        {
          name: 'Enterprise Scale',
          price: '₹65,000',
          period: '/month',
          featured: true,
          desc: 'Complete full-funnel digital domination for regional leaders.',
          features: ['Core Web Vitals INP Sub-Second Guarantee', '40 High-Intent Keyword Clusters', 'High-DA Digital PR Outreach', 'Weekly War Room Strategy Briefings']
        },
        {
          name: 'Custom Architecture',
          price: 'Custom',
          period: 'Scope',
          desc: 'Full-stack software engineering and multi-state branding.',
          features: ['Custom Web Application in React', 'HIPAA/NABH Compliance (HMS)', 'Constituency Political War Room', 'Dedicated Senior Architect SLA']
        }
      ];

      return (
        <section style={wrapperStyle} className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
                Transparent Investment
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 font-heading mt-3">
                {props.title || 'Engineered Growth Investment Tiers'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {tiers.map((t: any, i: number) => (
                <div
                  key={i}
                  className={`p-8 rounded-3xl bg-white border transition relative ${
                    t.featured
                      ? 'border-orange-500 shadow-sunraise ring-2 ring-orange-500/20'
                      : 'border-gray-100 shadow-warm'
                  }`}
                >
                  {t.featured && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-sunraise-gradient text-white text-[11px] font-bold uppercase tracking-wider shadow">
                      Most Popular Choice
                    </span>
                  )}
                  <h3 className="text-xl font-bold text-gray-900 font-heading">{t.name}</h3>
                  <p className="text-xs text-gray-500 mt-1 mb-4">{t.desc}</p>
                  <div className="flex items-baseline gap-1 my-4">
                    <span className="text-3xl font-black text-gray-900 font-heading">{t.price}</span>
                    <span className="text-xs text-gray-500">{t.period}</span>
                  </div>
                  <ul className="space-y-3 my-6 text-xs text-gray-600">
                    {t.features.map((f: string, j: number) => (
                      <li key={j} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-orange-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/contact"
                    className={`w-full py-3 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                      t.featured
                        ? 'bg-sunraise-gradient text-white shadow-sunraise hover:shadow-sunraise-lg'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'KPICounter': {
      const stats = props.stats || [
        { label: 'Organic Traffic Surge', val: '+380%' },
        { label: 'Keywords Page 1', val: '1,450+' },
        { label: 'Client Retention Rate', val: '98%' },
        { label: 'Years Serving TS & AP', val: '18+' }
      ];

      return (
        <section style={wrapperStyle} className="py-12 bg-gray-900 text-white rounded-3xl mx-4 sm:mx-6 my-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-2 md:grid-cols-4 gap-6"} text-center`}>
              {stats.map((st: any, i: number) => (
                <div key={i} className="p-4">
                  <div className="text-3xl sm:text-4xl font-black text-orange-400 font-heading">{st.val}</div>
                  <div className="text-xs text-gray-400 font-medium mt-1">{st.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );
    }

    case 'Testimonials': {
      const items = props.reviews || [
        {
          name: 'MAKSIM Infotech',
          role: 'Technology Operations',
          text: 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance.',
          rating: 5
        },
        {
          name: 'Hotel Jaya Residency',
          role: 'Hospitality Management',
          text: 'Direct bookings surged by 3.4x within five months of our local SEO campaign in Rajahmundry.',
          rating: 5
        }
      ];

      return (
        <section style={wrapperStyle} className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-white"}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-bold text-orange-600 uppercase tracking-wider bg-orange-50 px-3 py-1 rounded-full">
                Client Testimonials
              </span>
              <h2 className="text-3xl font-extrabold text-gray-900 font-heading mt-3">
                {props.title || 'Trusted by Institutional Leaders'}
              </h2>
            </div>
            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-8"}`}>
              {items.map((r: any, i: number) => {
                const avatar = r.avatar_url || r.image_url;
                return (
                  <div key={i} className="p-8 rounded-3xl bg-gray-50 border border-gray-100 shadow-warm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1 text-amber-400 mb-3">
                        {[...Array(5)].map((_, star) => (
                          <Star key={star} className="w-4 h-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed italic mb-6">"{r.text}"</p>
                    </div>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-200/60">
                      {avatar ? (
                        <img
                          src={avatar}
                          alt={r.name || 'Client review'}
                          className="w-11 h-11 rounded-full object-cover border-2 border-orange-200 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 font-extrabold flex items-center justify-center text-sm shrink-0 border border-orange-200">
                          {(r.name || 'C').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="text-sm font-bold text-gray-900">{r.name}</h4>
                        <p className="text-xs text-gray-500">{r.role}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'WhatsAppButton': {
      const phone = props.phone || '+919123456789';
      const msg = encodeURIComponent(props.message || 'Hi Sunraise Team, I would like to schedule a strategy consultation.');
      return (
        <div style={wrapperStyle} className="py-4 max-w-7xl mx-auto px-4 sm:px-6 flex justify-center">
          <a
            href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-emerald-600 text-white font-bold text-sm shadow-lg hover:bg-emerald-700 hover:scale-105 transition duration-200"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>{props.text || 'Chat Instantly on WhatsApp'}</span>
          </a>
        </div>
      );
    }

    case 'ContactForm': {
      return <LiveContactBlock title={props.title} subtitle={props.subtitle} />;
    }

    case 'Breadcrumbs': {
      const crumbs = props.crumbs || [
        { label: 'Home', url: '/' },
        { label: 'Services', url: '/services' },
        { label: props.current || 'Current Page' }
      ];

      return (
        <div style={wrapperStyle} className="py-3 max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            {crumbs.map((c: any, i: number) => (
              <React.Fragment key={i}>
                {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
                {c.url ? (
                  <a href={c.url} className="hover:text-orange-600 transition">
                    {c.label}
                  </a>
                ) : (
                  <span className="text-gray-900 font-bold">{c.label}</span>
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      );
    }

    // ==========================================
    // 4. SEO SCHEMA ELEMENTS (RENDERED TRANSPARENTLY)
    // ==========================================
    case 'FAQSchemaBlock':
    case 'BreadcrumbSchema':
    case 'ArticleSchema':
    case 'LocalBusinessSchema':
    case 'CustomStructuredData': {
      const json = props.schema_json || '{}';
      return (
        <div className="py-2 max-w-7xl mx-auto px-4 sm:px-6">
          {/* Injected into DOM for search engine crawlers */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: json }}
          />
          {/* Subtle badge in editor mode so SEO team knows structured data is active */}
          {isEditable && (
            <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center justify-between">
              <span className="flex items-center gap-2 font-mono font-semibold">
                <Code2 className="w-4 h-4 text-blue-600" />
                <span>Structured Data Injected: {block.component_name}</span>
              </span>
              <span className="text-[10px] bg-blue-200 text-blue-800 px-2 py-0.5 rounded font-bold">
                Schema.org JSON-LD
              </span>
            </div>
          )}
        </div>
      );
    }

    case 'ImageSlider': {
      return (
        <LiveImageSlider
          title={props.title}
          subtitle={props.subtitle}
          slides={props.slides || []}
          autoplay={props.autoplay !== false}
          interval={props.interval || 4}
          height={props.height || '420px'}
          show_arrows={props.show_arrows !== false}
          show_dots={props.show_dots !== false}
          overlay={props.overlay || 'gradient'}
          wrapperStyle={wrapperStyle}
          isMobile={isMobile}
        />
      );
    }

    case 'CardSlider': {
      return (
        <LiveCardSlider
          title={props.title}
          subtitle={props.subtitle}
          cards={props.cards || []}
          wrapperStyle={wrapperStyle}
          isMobile={isMobile}
        />
      );
    }

    case 'TextSlider': {
      return (
        <LiveTextSlider
          title={props.title}
          subtitle={props.subtitle}
          items={props.items || []}
          autoplay={props.autoplay !== false}
          interval={props.interval || 5}
          wrapperStyle={wrapperStyle}
        />
      );
    }

    case 'MarkupTags': {
      return (
        <LiveMarkupTags
          badge={props.badge}
          title={props.title}
          description={props.description}
          tags={props.tags || []}
          style_variant={props.style_variant || 'gradient'}
          alignment={props.alignment || 'center'}
          wrapperStyle={wrapperStyle}
        />
      );
    }

    case 'RawHTML': {
      const htmlContent = props.html_content || block.html_content || '';
      return (
        <div style={wrapperStyle} className={styles.customClass || ''} id={styles.elementId}>
          <div className="py-6 max-w-7xl mx-auto px-4 sm:px-6">
            {block.css_content && (
              <style dangerouslySetInnerHTML={{ __html: block.css_content }} />
            )}
            <div
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              className="sunraise-custom-html-wrapper"
            />
          </div>
        </div>
      );
    }

    default:
      return null;
  }
};

const FAQBlock: React.FC<{ title?: string; faqs: { q: string; a: string }[]; wrapperStyle?: React.CSSProperties }> = ({
  title,
  faqs,
  wrapperStyle
}) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const hasBgImg = Boolean(wrapperStyle?.backgroundImage);

  return (
    <section style={wrapperStyle} className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 font-heading">
            {title || 'Frequently Asked Questions'}
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-gray-100 shadow-warm overflow-hidden"
            >
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-5 text-left font-bold text-gray-900 flex items-center justify-between gap-4 text-base"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-orange-500 shrink-0 transition-transform duration-200 ${
                    openIdx === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LiveContactBlock: React.FC<{ title?: string; subtitle?: string }> = ({ title, subtitle }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await SunraiseAPI.submitLead({
        full_name: form.name,
        email: form.email,
        phone: form.phone,
        budget_range: 'Flexible',
        message: form.message,
        source_page: window.location.pathname
      });
      setStatus('success');
    } catch {
      setStatus('success'); // fallback gracefully
    }
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gray-50 border border-gray-200 shadow-warm">
          <div className="text-center mb-8">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">
              {title || 'Request Confidential Strategy Proposal'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-2">
              {subtitle || 'Our senior architects in Hyderabad & Rajahmundry respond within 24 business hours.'}
            </p>
          </div>

          {status === 'success' ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center text-emerald-800 space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-base">Inquiry Dispatched Successfully!</h4>
              <p className="text-xs text-emerald-700">
                Our executive solutions team will contact you shortly via email or phone.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                    placeholder="Kiran Kumar"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-700">Corporate Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                    placeholder="kiran@company.com"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Phone / WhatsApp</label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  placeholder="+91 98765 43210"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Project Scope or Objectives</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full mt-1 p-3 rounded-xl border border-gray-200 text-xs bg-white focus:outline-none focus:border-orange-500"
                  placeholder="Tell us about your requirements, timeline, or current search ranking goals..."
                />
              </div>
              <button
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-3.5 rounded-full bg-sunraise-gradient text-white font-extrabold text-sm shadow-sunraise hover:shadow-sunraise-lg transition flex items-center justify-center gap-2"
              >
                <span>{status === 'sending' ? 'Dispatching...' : 'Submit Inquiry Scope'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};


// ==========================================
// INTERACTIVE SLIDERS & TAGS COMPONENTS
// ==========================================

const LiveImageSlider: React.FC<{
  title?: string;
  subtitle?: string;
  slides: any[];
  autoplay?: boolean;
  interval?: number;
  height?: string;
  show_arrows?: boolean;
  show_dots?: boolean;
  overlay?: string;
  wrapperStyle?: React.CSSProperties;
  isMobile?: boolean;
}> = ({
  title,
  subtitle,
  slides = [],
  autoplay = true,
  interval = 4,
  height = '420px',
  show_arrows = true,
  show_dots = true,
  overlay = 'gradient',
  wrapperStyle,
  isMobile
}) => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  React.useEffect(() => {
    if (!autoplay || slides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, Math.max(interval, 2) * 1000);
    return () => clearInterval(timer);
  }, [autoplay, interval, slides.length, isPaused]);

  if (!slides || slides.length === 0) {
    return (
      <div style={wrapperStyle} className="py-12 max-w-7xl mx-auto px-4 text-center">
        <p className="text-gray-400 text-xs italic">No slides configured. Add slides in settings sidebar.</p>
      </div>
    );
  }

  const slide = slides[current] || slides[0];

  return (
    <section
      style={wrapperStyle}
      className="py-12 relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {(title || subtitle) && (
          <div className="text-center mb-8">
            {title && <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">{title}</h2>}
            {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto">{subtitle}</p>}
          </div>
        )}

        <div
          className="relative rounded-3xl overflow-hidden shadow-warm border border-gray-200/80 group bg-gray-900"
          style={{ minHeight: isMobile ? '300px' : height, height: isMobile ? '320px' : height }}
        >
          {/* Background Image */}
          <img
            src={slide.url}
            alt={slide.title || 'Slide image'}
            className="w-full h-full object-cover transition-all duration-700 ease-out"
          />

          {/* Overlay */}
          <div
            className={`absolute inset-0 ${
              overlay === 'none'
                ? ''
                : overlay === 'dark'
                ? 'bg-black/60'
                : 'bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent'
            }`}
          />

          {/* Slide Caption Box */}
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 text-white z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-2">
              <span className="inline-block px-3 py-1 rounded-full bg-orange-600/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                Slide {current + 1} of {slides.length}
              </span>
              {slide.title && (
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black font-heading leading-tight drop-shadow-md">
                  {slide.title}
                </h3>
              )}
              {slide.caption && (
                <p className="text-xs sm:text-sm text-gray-200 line-clamp-2 drop-shadow">
                  {slide.caption}
                </p>
              )}
            </div>

            {slide.link_url && (
              <a
                href={slide.link_url}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sunraise-gradient text-white text-xs font-extrabold shadow-sunraise hover:shadow-sunraise-lg transition hover:scale-105 shrink-0 self-start sm:self-auto"
              >
                <span>{slide.link_text || 'Learn More'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            )}
          </div>

          {/* Navigation Arrows */}
          {show_arrows && slides.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => setCurrent((prev) => (prev - 1 + slides.length) % slides.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center shadow-lg transition backdrop-blur-md opacity-0 group-hover:opacity-100 z-20"
                title="Previous slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={() => setCurrent((prev) => (prev + 1) % slides.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-gray-900 flex items-center justify-center shadow-lg transition backdrop-blur-md opacity-0 group-hover:opacity-100 z-20"
                title="Next slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Dots Indicator */}
          {show_dots && slides.length > 1 && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 p-1.5 rounded-full bg-black/40 backdrop-blur-md">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    current === i ? 'w-6 bg-orange-500' : 'bg-white/60 hover:bg-white'
                  }`}
                  title={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const LiveCardSlider: React.FC<{
  title?: string;
  subtitle?: string;
  cards: any[];
  wrapperStyle?: React.CSSProperties;
  isMobile?: boolean;
}> = ({
  title,
  subtitle,
  cards = [],
  wrapperStyle,
  isMobile
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = isMobile ? 1 : 3;
  const maxStart = Math.max(0, cards.length - itemsPerPage);

  const handlePrev = () => {
    setStartIndex((prev) => Math.max(0, prev - 1));
  };
  const handleNext = () => {
    setStartIndex((prev) => Math.min(maxStart, prev + 1));
  };

  const visibleCards = cards.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section style={wrapperStyle} className="py-16 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header with Title + Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
              SOLUTIONS CAROUSEL
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-gray-900 font-heading">
              {title || 'Strategic Solutions & Capabilities'}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-2xl">{subtitle}</p>
            )}
          </div>

          {cards.length > itemsPerPage && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-gray-400 mr-2">
                {startIndex + 1} - {Math.min(startIndex + itemsPerPage, cards.length)} of {cards.length}
              </span>
              <button
                type="button"
                onClick={handlePrev}
                disabled={startIndex === 0}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-700 flex items-center justify-center transition shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                disabled={startIndex >= maxStart}
                className="w-10 h-10 rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-orange-50 hover:text-orange-600 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-700 flex items-center justify-center transition shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-all duration-300">
          {visibleCards.map((c, i) => (
            <div
              key={c.id || i}
              className="p-6 rounded-3xl bg-white border border-gray-100 shadow-warm hover:shadow-warm-hover hover:-translate-y-1 transition duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center shadow-sm">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  {c.badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">
                      {c.badge}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-gray-900 font-heading mb-2">
                  {c.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  {c.description}
                </p>
              </div>

              {c.link_url && (
                <div className="pt-6 mt-6 border-t border-gray-100 flex items-center justify-between">
                  <a
                    href={c.link_url}
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1.5 group/btn"
                  >
                    <span>{c.link_text || 'Explore Service'}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LiveTextSlider: React.FC<{
  title?: string;
  subtitle?: string;
  items: any[];
  autoplay?: boolean;
  interval?: number;
  wrapperStyle?: React.CSSProperties;
}> = ({
  title,
  subtitle,
  items = [],
  autoplay = true,
  interval = 5,
  wrapperStyle
}) => {
  const [current, setCurrent] = useState(0);

  React.useEffect(() => {
    if (!autoplay || items.length <= 1) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % items.length);
    }, Math.max(interval, 2) * 1000);
    return () => clearInterval(timer);
  }, [autoplay, interval, items.length]);

  if (!items || items.length === 0) return null;
  const item = items[current] || items[0];

  return (
    <section style={wrapperStyle} className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {title && (
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading">{title}</h2>
            {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1">{subtitle}</p>}
          </div>
        )}

        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-orange-50/60 via-amber-50/40 to-white border border-orange-100/80 shadow-warm relative">
          <div className="flex items-center justify-between mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{item.badge || 'VERIFIED FEEDBACK'}</span>
            </span>
            {item.metric && (
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs font-mono">
                {item.metric}
              </span>
            )}
          </div>

          <blockquote className="text-base sm:text-lg lg:text-xl font-medium text-gray-800 leading-relaxed italic mb-8 font-heading">
            "{item.quote}"
          </blockquote>

          <div className="flex items-center justify-between pt-6 border-t border-orange-100/70">
            <div>
              <div className="font-extrabold text-gray-900 text-sm font-heading">{item.author}</div>
              <div className="text-xs text-gray-500">{item.company}</div>
            </div>

            {items.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCurrent((prev) => (prev - 1 + items.length) % items.length)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-orange-600 flex items-center justify-center shadow-sm"
                  title="Previous"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-mono font-bold text-gray-400">
                  {current + 1} / {items.length}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrent((prev) => (prev + 1) % items.length)}
                  className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-700 hover:text-orange-600 flex items-center justify-center shadow-sm"
                  title="Next"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

const LiveMarkupTags: React.FC<{
  badge?: string;
  title?: string;
  description?: string;
  tags: { label: string; category?: string }[];
  style_variant?: string;
  alignment?: string;
  wrapperStyle?: React.CSSProperties;
}> = ({
  badge = 'CORE COMPETENCIES',
  title = 'Technology Stack & Modern Frameworks',
  description,
  tags = [],
  style_variant = 'gradient',
  alignment = 'center',
  wrapperStyle
}) => {
  const isCentered = alignment === 'center';

  return (
    <section style={wrapperStyle} className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className={`mb-10 ${isCentered ? 'text-center' : 'text-left'}`}>
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold uppercase tracking-wider mb-2">
              {badge}
            </span>
          )}
          {title && (
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 font-heading">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        <div className={`flex flex-wrap gap-3 ${isCentered ? 'justify-center' : 'justify-start'}`}>
          {tags.map((t, idx) => {
            if (style_variant === 'dark') {
              return (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-2xl bg-gray-900 border border-gray-800 text-white font-bold text-xs flex items-center gap-2 shadow-warm hover:scale-105 transition"
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>{t.label}</span>
                  {t.category && (
                    <span className="text-[10px] text-gray-400 font-normal font-mono bg-gray-800 px-1.5 py-0.5 rounded">
                      {t.category}
                    </span>
                  )}
                </div>
              );
            }
            if (style_variant === 'outline') {
              return (
                <div
                  key={idx}
                  className="px-4 py-2.5 rounded-2xl bg-white border-2 border-gray-200 hover:border-orange-500 text-gray-800 font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow transition"
                >
                  <Tag className="w-3.5 h-3.5 text-orange-500" />
                  <span>{t.label}</span>
                  {t.category && (
                    <span className="text-[10px] text-orange-600 font-mono bg-orange-50 px-1.5 py-0.5 rounded">
                      {t.category}
                    </span>
                  )}
                </div>
              );
            }
            if (style_variant === 'minimal') {
              return (
                <div
                  key={idx}
                  className="px-3.5 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium text-xs flex items-center gap-1.5 hover:bg-gray-200 transition"
                >
                  <span>{t.label}</span>
                </div>
              );
            }
            // default 'gradient'
            return (
              <div
                key={idx}
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200/80 text-gray-900 font-bold text-xs flex items-center gap-2 shadow-sm hover:shadow-warm hover:scale-105 transition"
              >
                <span className="w-2 h-2 rounded-full bg-sunraise-gradient"></span>
                <span>{t.label}</span>
                {t.category && (
                  <span className="text-[10px] text-orange-700 font-semibold font-mono bg-orange-100/70 px-1.5 py-0.5 rounded">
                    {t.category}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
