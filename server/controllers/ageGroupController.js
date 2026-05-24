const supabase = require('../config/supabase');

const DEFAULT_GROUPS = [
  { name: 'Junior Champions', min_age: 5, max_age: 12, description: 'Ages 5–12', is_default: true },
  { name: 'Teen Legends', min_age: 13, max_age: 17, description: 'Ages 13–17', is_default: true },
  { name: 'Adult Division', min_age: 18, max_age: 49, description: 'Ages 18–49', is_default: true },
  { name: 'Masters Division', min_age: 50, max_age: 200, description: 'Ages 50+', is_default: true }
];

const getFormattedAgeGroup = (g) => ({
  _id: g.id,
  id: g.id,
  name: g.name,
  minAge: g.min_age,
  maxAge: g.max_age,
  description: g.description || '',
  active: g.active,
  isDefault: g.is_default,
  createdAt: g.created_at,
  updatedAt: g.updated_at
});

const getAllAgeGroups = async (req, res) => {
  try {
    const { data: groups, error } = await supabase
      .from('age_groups')
      .select('*')
      .order('min_age', { ascending: true });

    if (error) throw error;
    res.json({ ageGroups: groups.map(getFormattedAgeGroup) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const createAgeGroup = async (req, res) => {
  const { name, minAge, maxAge, description, active } = req.body;
  if (!name || minAge === undefined) return res.status(400).json({ message: 'Name and minAge required' });

  try {
    const { data: exists } = await supabase
      .from('age_groups')
      .select('id')
      .eq('name', name)
      .maybeSingle();

    if (exists) return res.status(400).json({ message: 'Age group already exists' });

    const { data: grp, error } = await supabase
      .from('age_groups')
      .insert([{
        name,
        min_age: parseInt(minAge),
        max_age: maxAge !== undefined && maxAge !== '' ? parseInt(maxAge) : null,
        description: description || '',
        active: active !== undefined ? !!active : true,
        is_default: false
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(getFormattedAgeGroup(grp));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateAgeGroup = async (req, res) => {
  const { id } = req.params;
  const { name, minAge, maxAge, description, active } = req.body;

  try {
    const { data: group, error: findError } = await supabase
      .from('age_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !group) return res.status(404).json({ message: 'Not found' });
    if (group.is_default) return res.status(403).json({ message: 'Default age groups cannot be modified' });

    const updates = {
      updated_at: new Date()
    };
    if (name) updates.name = name;
    if (minAge !== undefined) updates.min_age = parseInt(minAge);
    if (maxAge !== undefined) updates.max_age = maxAge !== '' ? parseInt(maxAge) : null;
    if (description !== undefined) updates.description = description;
    if (active !== undefined) updates.active = !!active;

    const { data: updatedGroup, error } = await supabase
      .from('age_groups')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.json(getFormattedAgeGroup(updatedGroup));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAgeGroup = async (req, res) => {
  const { id } = req.params;

  try {
    const { data: group, error: findError } = await supabase
      .from('age_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (findError || !group) return res.status(404).json({ message: 'Not found' });
    if (group.is_default) return res.status(403).json({ message: 'Default age groups cannot be deleted' });

    const { error } = await supabase
      .from('age_groups')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const seedDefaultAgeGroups = async (req, res) => {
  try {
    const created = [];
    for (const def of DEFAULT_GROUPS) {
      const { data: existing } = await supabase
        .from('age_groups')
        .select('*')
        .eq('name', def.name)
        .maybeSingle();

      if (!existing) {
        const { data: g, error } = await supabase
          .from('age_groups')
          .insert([def])
          .select()
          .single();

        if (error) throw error;
        created.push(getFormattedAgeGroup(g));
      }
    }
    const { data: all, error: allError } = await supabase
      .from('age_groups')
      .select('*')
      .order('min_age', { ascending: true });

    if (allError) throw allError;
    res.json({ created, ageGroups: all.map(getFormattedAgeGroup) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllAgeGroups,
  createAgeGroup,
  updateAgeGroup,
  deleteAgeGroup,
  seedDefaultAgeGroups
};
