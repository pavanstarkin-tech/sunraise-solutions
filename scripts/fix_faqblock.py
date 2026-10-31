import os

vbr_path = os.path.join('frontend', 'src', 'components', 'builder', 'VisualBlockRenderer.tsx')
with open(vbr_path, 'r', encoding='utf-8') as f:
    vbr_code = f.read()

vbr_code = vbr_code.replace(
    'const FAQBlock: React.FC<{ title?: string; faqs: { q: string; a: string }[]; wrapperStyle?: React.CSSProperties }> = ({\n  title,\n  faqs,\n  wrapperStyle\n}) => {\n  const [openIdx, setOpenIdx] = useState<number | null>(0);',
    'const FAQBlock: React.FC<{ title?: string; faqs: { q: string; a: string }[]; wrapperStyle?: React.CSSProperties }> = ({\n  title,\n  faqs,\n  wrapperStyle\n}) => {\n  const [openIdx, setOpenIdx] = useState<number | null>(0);\n  const hasBgImg = Boolean(wrapperStyle?.backgroundImage);'
)

with open(vbr_path, 'w', encoding='utf-8') as f:
    f.write(vbr_code)

print("Fixed FAQBlock in VisualBlockRenderer.tsx")

