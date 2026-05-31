import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Find and remove the duplicate handleSeedCategories (the sync one that calls executeSeedCategories)
# Keep the async one at line 600
pattern = r'\n  const handleSeedCategories = \(\) => \{\s*showConfirm\(\s*"🌱 SEED CATEGORIES",\s*"Seed default categories \(will create missing ones\)\?",\s*\(\) => executeSeedCategories\(\)\s*\);\s*\};'

match = re.search(pattern, content)
if match:
    content = content.replace(match.group(0), '')
    print("✅ Removed duplicate handleSeedCategories wrapper")
else:
    print("Warning: Could not find duplicate handleSeedCategories pattern")
    # Try alternative pattern
    if 'const handleSeedCategories = () => {\n    showConfirm(' in content:
        old = """  const handleSeedCategories = () => {
    showConfirm(
      "🌱 SEED CATEGORIES",
      "Seed default categories (will create missing ones)?",
      () => executeSeedCategories()
    );
  };"""
        if old in content:
            content = content.replace(old, '')
            print("✅ Removed duplicate using exact match")

# Write back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.write(content)

print("✅ Duplicate handler removal complete")
