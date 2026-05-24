const supabase = require('../config/supabase');

// Helper to slugify
const slugify = (text) => text.toString().toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const getFormattedCategory = (c) => ({
  _id: c.id,
  id: c.id,
  name: c.name,
  slug: c.slug,
  description: c.description || '',
  parent: c.parent,
  order: c.order_num || 0,
  active: c.active,
  isDefault: c.is_default,
  createdAt: c.created_at,
  updatedAt: c.updated_at
});

// GET /api/categories - list tree
const getAllCategories = async (req, res) => {
  try {
    const { data: dbCategories, error } = await supabase
      .from('categories')
      .select('*')
      .order('order_num', { ascending: true })
      .order('name', { ascending: true });

    if (error) throw error;

    const categories = dbCategories.map(getFormattedCategory);

    // Build tree
    const map = {};
    categories.forEach(c => map[c.id] = { ...c, children: [] });
    const roots = [];
    categories.forEach(c => {
      if (c.parent) {
        if (map[c.parent]) map[c.parent].children.push(map[c.id]);
      } else roots.push(map[c.id]);
    });

    res.json({ categories: roots, flat: categories });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error: error.message });
  }
};

// GET /api/categories/:id
const getCategoryById = async (req, res) => {
  try {
    const { data: cat, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !cat) return res.status(404).json({ message: 'Category not found' });
    res.json(getFormattedCategory(cat));
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error: error.message });
  }
};

// POST /api/categories
const createCategory = async (req, res) => {
  try {
    const { name, description, parent, order = 0, active = true } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const slug = slugify(name);

    // Check duplicate
    const { data: exists } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .maybeSingle();

    if (exists) return res.status(400).json({ message: 'Category with that name or slug already exists' });

    const { data: cat, error } = await supabase
      .from('categories')
      .insert([{
        name,
        slug,
        description: description || '',
        parent: parent || null,
        order_num: parseInt(order) || 0,
        active: active !== undefined ? active : true,
        is_default: false
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json({ message: 'Category created', category: getFormattedCategory(cat) });
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error: error.message });
  }
};

// PUT /api/categories/:id
const updateCategory = async (req, res) => {
  try {
    const { name, description, parent, order, active } = req.body;

    const { data: existingCat, error: findError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !existingCat) return res.status(404).json({ message: 'Category not found' });
    if (existingCat.is_default) return res.status(403).json({ message: "Cannot modify default category" });

    const updates = {
      updated_at: new Date()
    };
    if (name && name !== existingCat.name) {
      updates.name = name;
      updates.slug = slugify(name);
    }
    if (typeof description !== 'undefined') updates.description = description;
    if (typeof parent !== 'undefined') updates.parent = parent || null;
    if (typeof order !== 'undefined') updates.order_num = parseInt(order);
    if (typeof active !== 'undefined') updates.active = active;

    const { data: cat, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json({ message: 'Category updated', category: getFormattedCategory(cat) });
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error: error.message });
  }
};

// DELETE /api/categories/:id
const deleteCategory = async (req, res) => {
  try {
    const { data: cat, error: findError } = await supabase
      .from('categories')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (findError || !cat) return res.status(404).json({ message: 'Category not found' });
    if (cat.is_default) return res.status(403).json({ message: 'Cannot delete default category' });

    // Check subcategories
    const { data: children, error: childrenError } = await supabase
      .from('categories')
      .select('id')
      .eq('parent', cat.id);

    if (childrenError) throw childrenError;
    if (children && children.length > 0) {
      return res.status(400).json({ message: 'Category has subcategories; remove or reassign them first' });
    }

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', cat.id);

    if (error) throw error;
    res.json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error: error.message });
  }
};

// POST /api/categories/seed - create default categories
const seedDefaultCategories = async (req, res) => {
  try {
    const defaultList = [
      'Athletics','Strength','Endurance','Balance','Skills','Gaming','Water Sports','Reaction','Mind & Memory','Action Sports','Other'
    ];
    const created = [];
    for (let name of defaultList) {
      const slug = slugify(name);
      const { data: existing } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .maybeSingle();

      if (!existing) {
        const isDefault = name === 'Other';
        const { data: c, error } = await supabase
          .from('categories')
          .insert([{
            name,
            slug,
            is_default: isDefault,
            active: true
          }])
          .select()
          .single();

        if (error) throw error;
        created.push(getFormattedCategory(c));
      }
    }
    res.json({ message: 'Default categories seeded', createdCount: created.length });
  } catch (error) {
    res.status(500).json({ message: 'Error seeding categories', error: error.message });
  }
};

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  seedDefaultCategories
};
