import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Find and update handleSeedCategories function to also update local state
old_seed = '''  const handleSeedCategories = async () => {
    try {
      const res = await apiCall("/categories/seed", "GET", null, user.token);
      showToast(res.message || `Seeded ${res.createdCount || 0} default categories!`, "success");
      fetchData(); // Reload'''

new_seed = '''  const handleSeedCategories = async () => {
    try {
      const res = await apiCall("/categories/seed", "GET", null, user.token);
      showToast(res.message || `Seeded ${res.createdCount || 0} default categories!`, "success");
      // Reload categories from API
      const catData = await apiCall("/categories", "GET", null, user.token).catch(() => ({ flat: [] }));
      const apiCategories = catData.flat || catData.categories || [];
      setCategories(apiCategories);
      // Update local categoriesList with newly seeded data
      if (apiCategories.length > 0) {
        setCategoriesList(apiCategories);
      }
      fetchData(); // Reload'''

if old_seed in content:
    content = content.replace(old_seed, new_seed)
else:
    print("Warning: handleSeedCategories pattern not found, trying alternative")

# Find and update handleToggleCategoryActive to update both states
old_toggle = '''      setCategories(prev => prev.map(c => (c._id || c.id) === (cat._id || cat.id) ? { ...c, active: newActive } : c));
      showToast(`Category "${cat.name}" ${newActive ? "activated" : "deactivated"}`, "success");'''

new_toggle = '''      setCategories(prev => prev.map(c => (c._id || c.id) === (cat._id || cat.id) ? { ...c, active: newActive } : c));
      setCategoriesList(prev => prev.map(c => (c._id || c.id) === (cat._id || cat.id) ? { ...c, active: newActive } : c));
      showToast(`Category "${cat.name}" ${newActive ? "activated" : "deactivated"}`, "success");'''

if old_toggle in content:
    content = content.replace(old_toggle, new_toggle)
else:
    print("Warning: handleToggleCategoryActive toggle pattern not found")

# Fix delete handler to update both states
old_delete = '''        else if (recordsSubTab === "categories") setCategories(prev => prev.filter(x => (x._id || x.id) !== id));'''

new_delete = '''        else if (recordsSubTab === "categories") {
          setCategories(prev => prev.filter(x => (x._id || x.id) !== id));
          setCategoriesList(prev => prev.filter(x => (x._id || x.id) !== id));
        }'''

if old_delete in content:
    content = content.replace(old_delete, new_delete)
else:
    print("Warning: delete handler pattern not found")

# Write back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.write(content)

print("✅ Fixed category handlers to update both states")
