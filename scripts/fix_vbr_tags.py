import os

vbr_path = os.path.join('frontend', 'src', 'components', 'builder', 'VisualBlockRenderer.tsx')
with open(vbr_path, 'r', encoding='utf-8') as f:
    vbr_code = f.read()

# Fix all `<section style={wrapperStyle} className={`...`}` that were missing `>`
vbr_code = vbr_code.replace(
    'className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}\n',
    'className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}>\n'
)
vbr_code = vbr_code.replace(
    'className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"}`}\n',
    'className={`py-12 ${hasBgImg ? "bg-transparent" : "bg-white"}`}>\n'
)
vbr_code = vbr_code.replace(
    'className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}\n',
    'className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-gray-50/50"}`}>\n'
)
vbr_code = vbr_code.replace(
    'className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-white"}`}\n',
    'className={`py-16 ${hasBgImg ? "bg-transparent" : "bg-white"}`}>\n'
)

with open(vbr_path, 'w', encoding='utf-8') as f:
    f.write(vbr_code)

print("Fixed closing brackets in VisualBlockRenderer.tsx")

