import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Remove executeSeedCategories function since it's no longer used
pattern = r'\n  const executeSeedCategories = async \(\) => \{\s*try \{\s*await apiCall\(\'\/categories\/seed\', \'GET\', null, user\.token\);\s*fetchData\(\);\s*alert\(\'Default categories seeded\'\);\s*\} catch \(err\) \{\s*alert\(`Failed to seed categories: \${err\.message}`\);\s*\}\s*\};'

match = re.search(pattern, content, re.DOTALL)
if match:
    content = content.replace(match.group(0), '')
    print("✅ Removed unused executeSeedCategories")
else:
    # Try simpler approach - find and remove the whole function
    old = """  const executeSeedCategories = async () => {
    try {
      await apiCall('/categories/seed', 'GET', null, user.token);
      fetchData();
      alert('Default categories seeded');
    } catch (err) {
      alert(`Failed to seed categories: ${err.message}`);
    }
  };"""
    if old in content:
        content = content.replace(old + '\n', '')
        print("✅ Removed unused executeSeedCategories (exact match)")

# Write back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.write(content)

print("✅ Cleanup complete")
