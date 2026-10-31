with open('frontend/src/pages/admin/AdminTestimonials.tsx', 'r', encoding='utf-8') as f:
    c = f.read()

# 1. Add ImageInputControl import
import_old = "import { Testimonial, Service } from '../../types';"
import_new = """import { Testimonial, Service } from '../../types';
import { ImageInputControl } from '../../components/builder/ImageInputControl';"""

if import_old in c:
    c = c.replace(import_old, import_new, 1)
    print("AdminTestimonials: ImageInputControl import added")
else:
    print("Import target not found in AdminTestimonials")

# 2. Add ImageInputControl right inside the edit modal form
# After role input and before service_code select
form_target = """              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Linked Service Code (Optional)"""

form_replacement = """              <ImageInputControl
                label="Client Photo / Testimonial Avatar"
                value={currentTestimonial.avatar_url || ''}
                onChange={(url) =>
                  setCurrentTestimonial({ ...currentTestimonial, avatar_url: url })
                }
                folder="Testimonials"
                placeholder="https://... or upload client photo"
                helperText="Upload any JPG, PNG or WebP image. Stored on Hostinger and linked directly to the testimonial."
              />

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-1">
                  Linked Service Code (Optional)"""

c_norm = c.replace('\r\n', '\n')
form_target_norm = form_target.replace('\r\n', '\n')

if form_target_norm in c_norm:
    c_norm = c_norm.replace(form_target_norm, form_replacement.replace('\r\n', '\n'), 1)
    with open('frontend/src/pages/admin/AdminTestimonials.tsx', 'w', encoding='utf-8') as f:
        f.write(c_norm)
    print("SUCCESS: AdminTestimonials updated with ImageInputControl")
else:
    print("Form target not found in AdminTestimonials")

