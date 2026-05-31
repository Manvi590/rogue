import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Fix the Add Category button to use categoryModal instead of openModal
old_button = """                      <button onClick={() => openModal("add")} style={{ background: "#FF5500", color: "white", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 8px 20px rgba(255,85,0,0.3)" }}>
                        <Plus size={16} /> Add Category
                      </button>"""

new_button = """                      <button onClick={() => setCategoryModal({ isOpen: true, mode: 'add', category: { name: "", subs: [], active: true, rules: "", description: "", requirements: "", featured_records: "" } })} style={{ background: "#FF5500", color: "white", border: "none", padding: "12px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", textTransform: "uppercase", letterSpacing: "0.5px", boxShadow: "0 8px 20px rgba(255,85,0,0.3)" }}>
                        <Plus size={16} /> Add Category
                      </button>"""

if old_button in content:
    content = content.replace(old_button, new_button)
    print("✅ Fixed Add Category button to use categoryModal")
else:
    # Try a partial match approach
    pattern = r'<button onClick=\{\(\) => openModal\("add"\)\}.*?<Plus size=\{16\} \/> Add Category\s*</button>'
    match = re.search(pattern, content, re.DOTALL)
    if match:
        old_text = match.group(0)
        new_text = old_text.replace('openModal("add")', 'setCategoryModal({ isOpen: true, mode: \'add\', category: { name: "", subs: [], active: true, rules: "", description: "", requirements: "", featured_records: "" } })')
        content = content.replace(old_text, new_text)
        print("✅ Fixed Add Category button using pattern matching")
    else:
        print("Warning: Could not find Add Category button to fix")

# Write back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.write(content)

print("✅ Category button fixes applied")
