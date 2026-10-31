with open('frontend/src/components/builder/ElementorPageBuilder.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

target = """        reviews: [
          { name: 'MAKSIM Infotech', role: 'Technology Operations', text: 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance.', rating: 5 },
          { name: 'Hotel Jaya Residency', role: 'Hospitality Management', text: 'Direct bookings surged by 3.4x within five months of our local SEO campaign in Rajahmundry.', rating: 5 }
        ]"""

replacement = """        reviews: [
          {
            name: 'MAKSIM Infotech',
            role: 'Technology Operations',
            avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
            text: 'Sunraise Solutions overhauled our core software infrastructure with sheer architectural brilliance.',
            rating: 5
          },
          {
            name: 'Hotel Jaya Residency',
            role: 'Hospitality Management',
            avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
            text: 'Direct bookings surged by 3.4x within five months of our local SEO campaign in Rajahmundry.',
            rating: 5
          }
        ]"""

c_norm = c.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')

if target_norm in c_norm:
    c_norm = c_norm.replace(target_norm, replacement.replace('\r\n', '\n'), 1)
    with open('frontend/src/components/builder/ElementorPageBuilder.tsx', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print("SUCCESS: ElementorPageBuilder testimonials default props updated")
else:
    print("Target not found")

