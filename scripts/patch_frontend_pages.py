import re

# 1. Patch ElementorPageBuilder.tsx
builder_path = 'frontend/src/components/builder/ElementorPageBuilder.tsx'
with open(builder_path, 'r', encoding='utf-8') as f:
    builder_content = f.read()

# Add publicPath calculation right after currentHero state
target1 = "  const [currentHero, setCurrentHero] = useState<HeroConfig | undefined>(heroConfig);"
repl1 = """  const [currentHero, setCurrentHero] = useState<HeroConfig | undefined>(heroConfig);

  // Canonical public path for live preview and header indicator
  const publicPath = pageType === 'service'
    ? `/services/${pageSlug}`
    : (pageSlug === 'home' ? '/' : (pageType === 'core' ? `/${pageSlug}` : `/p/${pageSlug}`));"""

if target1 in builder_content:
    builder_content = builder_content.replace(target1, repl1, 1)
    print("ElementorPageBuilder: publicPath calculation added")
else:
    print("ElementorPageBuilder: target1 not found")

# Replace header Path display
target2 = '<span className="font-mono text-orange-400">/p/{pageSlug}</span>'
repl2 = """<a
                href={publicPath}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-orange-400 hover:underline flex items-center gap-1"
                title="View live page in new tab"
              >
                <span>{publicPath}</span>
              </a>"""

if target2 in builder_content:
    builder_content = builder_content.replace(target2, repl2, 1)
    print("ElementorPageBuilder: Path display updated to link")
else:
    print("ElementorPageBuilder: target2 not found")

# Replace preview link
target3 = 'href={`/p/${pageSlug}`}'
repl3 = 'href={publicPath}'
if target3 in builder_content:
    builder_content = builder_content.replace(target3, repl3, 1)
    print("ElementorPageBuilder: preview link updated to publicPath")
else:
    print("ElementorPageBuilder: target3 not found")

with open(builder_path, 'w', encoding='utf-8') as f:
    f.write(builder_content)


# 2. Patch CustomLandingPage.tsx
clp_path = 'frontend/src/pages/CustomLandingPage.tsx'
with open(clp_path, 'r', encoding='utf-8') as f:
    clp_content = f.read()

# Update import to include useNavigate
clp_content = clp_content.replace(
    "import { useParams, Link } from 'react-router-dom';",
    "import { useParams, Link, useNavigate } from 'react-router-dom';"
)

target_clp_hook = """  const { slug } = useParams<{ slug: string }>();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      SunraiseAPI.getPageBySlug(slug).then((res) => {
        setPage(res);
        setLoading(false);
      });
    }
  }, [slug]);"""

repl_clp_hook = """  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [page, setPage] = useState<CustomPage | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const cleanSlug = slug.trim().toLowerCase().replace(/_/g, '-');

    SunraiseAPI.getPageBySlug(cleanSlug).then(async (pageRes) => {
      if (pageRes) {
        setPage(pageRes);
        setLoading(false);
      } else {
        // Fallback: check if this is a Service slug accessed via /p/
        try {
          const serviceRes = await SunraiseAPI.getServiceBySlug(cleanSlug);
          if (serviceRes) {
            navigate(`/services/${cleanSlug}`, { replace: true });
            return;
          }
        } catch (e) {
          // ignore
        }
        setPage(null);
        setLoading(false);
      }
    }).catch(() => {
      setPage(null);
      setLoading(false);
    });
  }, [slug, navigate]);"""

# Normalize \r\n to \n for matching
clp_content_norm = clp_content.replace('\r\n', '\n')
target_clp_norm = target_clp_hook.replace('\r\n', '\n')

if target_clp_norm in clp_content_norm:
    clp_content = clp_content_norm.replace(target_clp_norm, repl_clp_hook.replace('\r\n', '\n'), 1)
    with open(clp_path, 'w', encoding='utf-8') as f:
        f.write(clp_content)
    print("CustomLandingPage: slug normalization and service fallback added")
else:
    print("CustomLandingPage: hook target not found")


# 3. Patch ServiceDetailPage.tsx
sdp_path = 'frontend/src/pages/ServiceDetailPage.tsx'
with open(sdp_path, 'r', encoding='utf-8') as f:
    sdp_content = f.read()

sdp_content = sdp_content.replace(
    "import { useParams, Link } from 'react-router-dom';",
    "import { useParams, Link, useNavigate } from 'react-router-dom';"
)

target_sdp_hook = """  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      setLoading(true);
      SunraiseAPI.getServiceBySlug(slug).then((res) => {
        setService(res);
        setLoading(false);
      });
    }
  }, [slug]);"""

repl_sdp_hook = """  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    const cleanSlug = slug.trim().toLowerCase().replace(/_/g, '-');
    if (cleanSlug !== slug) {
      navigate(`/services/${cleanSlug}`, { replace: true });
      return;
    }
    SunraiseAPI.getServiceBySlug(cleanSlug).then((res) => {
      setService(res);
      setLoading(false);
    }).catch(() => {
      setService(null);
      setLoading(false);
    });
  }, [slug, navigate]);"""

sdp_content_norm = sdp_content.replace('\r\n', '\n')
target_sdp_norm = target_sdp_hook.replace('\r\n', '\n')

if target_sdp_norm in sdp_content_norm:
    sdp_content = sdp_content_norm.replace(target_sdp_norm, repl_sdp_hook.replace('\r\n', '\n'), 1)
    with open(sdp_path, 'w', encoding='utf-8') as f:
        f.write(sdp_content)
    print("ServiceDetailPage: slug normalization and redirect added")
else:
    print("ServiceDetailPage: hook target not found")

