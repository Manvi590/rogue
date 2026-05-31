import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Fix 1: Update the fetchData function to sync categories with API
old_fetch_data = """        setRecords(recData || []);
        setCategories(catData.flat || catData.categories || []);
        setAgeGroups(ageData.ageGroups || []);"""

new_fetch_data = """        setRecords(recData || []);
        const apiCategories = catData.flat || catData.categories || [];
        setCategories(apiCategories);
        // Sync API categories with categoriesList state
        if (apiCategories.length > 0) {
          setCategoriesList(prev => {
            // Merge API data with existing state, preferring API data
            const merged = prev.map(cat => {
              const apiCat = apiCategories.find(a => (a._id || a.id) === (cat.id || cat._id));
              return apiCat ? { ...cat, ...apiCat } : cat;
            });
            return merged;
          });
        }
        setAgeGroups(ageData.ageGroups || []);"""

content = content.replace(old_fetch_data, new_fetch_data)

# Fix 2: Change rendering to use categoriesList instead of categories
content = re.sub(
    r'const filteredCats = categories\.filter\(cat => \{\s*const matchesSearch = !categorySearchQuery',
    'const filteredCats = categoriesList.filter(cat => {\n                      const matchesSearch = !categorySearchQuery',
    content
)

# Fix 3: Update empty state to check categoriesList instead of categories
content = re.sub(
    r'{categories\.length === 0 \? "NO CATEGORIES FOUND" : "NO MATCHING CATEGORIES"}',
    '{categoriesList.length === 0 ? "NO CATEGORIES FOUND" : "NO MATCHING CATEGORIES"}',
    content
)

content = re.sub(
    r'{categories\.length === 0 \s*\? "Seed the default',
    '{categoriesList.length === 0 \n                                ? "Seed the default',
    content
)

content = re.sub(
    r'{categories\.length === 0 &&',
    '{categoriesList.length === 0 &&',
    content
)

# Write the updated content back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.write(content)

print("✅ Fixed Admin.jsx Categories rendering and state sync")
