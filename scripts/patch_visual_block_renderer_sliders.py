with open('frontend/src/components/builder/VisualBlockRenderer.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Update imports
import_target = "  Users\n} from 'lucide-react';"
import_repl = "  Users,\n  ChevronLeft,\n  Tag\n} from 'lucide-react';"

if import_target in c:
    c = c.replace(import_target, import_repl, 1)
    print("VisualBlockRenderer imports updated")
else:
    print("Import target not found in VisualBlockRenderer")

# 2. Add switch cases before `default:`
switch_target = "    default:\n      return null;"

switch_repl = """    case 'ImageSlider': {
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
      return null;"""

if switch_target in c:
    c = c.replace(switch_target, switch_repl, 1)
    print("Switch cases added to VisualBlockRenderer")
else:
    print("Switch target not found")

# 3. Add component definitions at the bottom of VisualBlockRenderer.tsx
comp_definitions = """
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
"""

c = c + "\n" + comp_definitions

with open('frontend/src/components/builder/VisualBlockRenderer.tsx', 'w', encoding='utf-8') as f:
    f.write(c)

print("SUCCESS: VisualBlockRenderer.tsx updated with sliders and tags")

