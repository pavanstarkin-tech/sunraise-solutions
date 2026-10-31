import os

vbr_path = os.path.join('frontend', 'src', 'components', 'builder', 'VisualBlockRenderer.tsx')
with open(vbr_path, 'r', encoding='utf-8') as f:
    code = f.read()

# 1. TwoColumn
code = code.replace(
    'return (\n        <section style={wrapperStyle} className="py-12 bg-white">\n          <div className="max-w-7xl mx-auto px-4 sm:px-6">\n            {props.title && (\n              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-heading text-center mb-8">\n                {props.title}\n              </h2>\n            )}\n            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">',
    'return (\n        <section style={wrapperStyle} className={`py-12 bg-white ${isMobile ? "px-2" : ""}`}>\n          <div className="max-w-7xl mx-auto px-4 sm:px-6">\n            {props.title && (\n              <h2 className={`${isMobile ? "text-xl" : "text-2xl sm:text-3xl"} font-extrabold text-gray-900 font-heading text-center mb-8`}>\n                {props.title}\n              </h2>\n            )}\n            <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-8"} items-stretch`}>'
)

# 2. ThreeColumn colGridClass
code = code.replace(
    "const colGridClass = cols.length === 1 ? 'grid-cols-1' : cols.length === 2 ? 'grid-cols-1 md:grid-cols-2' : cols.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';",
    "const colGridClass = isMobile ? 'grid-cols-1' : isTablet ? 'grid-cols-1 sm:grid-cols-2' : cols.length === 1 ? 'grid-cols-1' : cols.length === 2 ? 'grid-cols-1 md:grid-cols-2' : cols.length === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3';"
)

# 3. FeatureGrid colGridClass
code = code.replace(
    """      const colGridClass =
        cols === 1
          ? 'grid-cols-1'
          : cols === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : cols === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';""",
    """      const colGridClass = isMobile
        ? 'grid-cols-1'
        : isTablet
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : cols === 4
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';"""
)

# 4. ProcessTimeline colGridClass
code = code.replace(
    """      const colGridClass =
        cols === 1
          ? 'grid-cols-1'
          : cols === 2
          ? 'grid-cols-1 md:grid-cols-2'
          : cols === 3
          ? 'grid-cols-1 md:grid-cols-3'
          : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';""",
    """      const colGridClass = isMobile
        ? 'grid-cols-1'
        : isTablet
        ? 'grid-cols-1 sm:grid-cols-2'
        : cols === 1
        ? 'grid-cols-1'
        : cols === 2
        ? 'grid-cols-1 md:grid-cols-2'
        : cols === 3
        ? 'grid-cols-1 md:grid-cols-3'
        : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4';"""
)

# 5. KPICounter
code = code.replace(
    '<div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">',
    '<div className={`grid ${isMobile ? "grid-cols-1 gap-4" : isTablet ? "grid-cols-2 gap-4" : "grid-cols-2 md:grid-cols-4 gap-6"} text-center`}>'
)

# 6. Testimonials
code = code.replace(
    '<div className="grid grid-cols-1 md:grid-cols-2 gap-8">',
    '<div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-1 md:grid-cols-2 gap-8"}`}>'
)

with open(vbr_path, 'w', encoding='utf-8') as f:
    f.write(code)

print("VisualBlockRenderer.tsx successfully updated!")

