import re

# Read the Admin.jsx file
with open('client/src/pages/Admin.jsx', 'r') as f:
    content = f.read()

# Fix the Save Category button to add API calls
old_save_button = """                        <button onClick={() => {
                          if (!categoryModal.category.name.trim()) return showToast('Category name is required', 'error');
                          
                          if (categoryModal.mode === 'add') {
                            setCategoriesList(prev => [...prev, { ...categoryModal.category, id: Date.now() }]);
                          } else {
                            setCategoriesList(prev => prev.map(c => c.id === categoryModal.category.id ? categoryModal.category : c));
                          }
                          setCategoryModal({ isOpen: false, mode: 'add', category: null });
                          showToast(`Category ${categoryModal.mode === 'add' ? 'created' : 'updated'} successfully`, 'success');
                        }}"""

new_save_button = """                        <button onClick={async () => {
                          if (!categoryModal.category.name.trim()) return showToast('Category name is required', 'error');
                          
                          try {
                            if (categoryModal.mode === 'add') {
                              // Create new category via API
                              const apiRes = await apiCall('/categories', 'POST', {
                                name: categoryModal.category.name,
                                description: categoryModal.category.description || '',
                                active: categoryModal.category.active,
                                rules: categoryModal.category.rules || '',
                                submissionRequirements: categoryModal.category.requirements || ''
                              }, user.token);
                              const newCat = { ...categoryModal.category, id: apiRes._id || apiRes.id, _id: apiRes._id };
                              setCategoriesList(prev => [...prev, newCat]);
                            } else {
                              // Update category via API
                              await apiCall(`/categories/${categoryModal.category._id || categoryModal.category.id}`, 'PUT', {
                                name: categoryModal.category.name,
                                description: categoryModal.category.description || '',
                                active: categoryModal.category.active,
                                rules: categoryModal.category.rules || '',
                                submissionRequirements: categoryModal.category.requirements || ''
                              }, user.token);
                              setCategoriesList(prev => prev.map(c => (c._id || c.id) === (categoryModal.category._id || categoryModal.category.id) ? categoryModal.category : c));
                            }
                            setCategoryModal({ isOpen: false, mode: 'add', category: null });
                            showToast(`Category ${categoryModal.mode === 'add' ? 'created' : 'updated'} successfully`, 'success');
                          } catch (error) {
                            showToast(`Error: ${error.message}`, 'error');
                          }
                        }}"""

if old_save_button in content:
    content = content.replace(old_save_button, new_save_button)
    print("✅ Updated Save Category button with API integration")
else:
    print("Warning: Save Category button pattern not found exactly")

# Write back
with open('client/src/pages/Admin.jsx', 'w') as f:
    f.write(content)

print("✅ Fixed modal API calls")
