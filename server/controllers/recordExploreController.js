const supabase = require('../config/supabase');

// Get homepage records organized by sections (public endpoint)
exports.getHomepageSections = async (req, res) => {
  try {
    const { data: allVerified, error } = await supabase
      .from('records')
      .select('id, title, category, value, unit, thumbnail_url, evidence_url, homepage_section, homepage_order, created_at, verified_at, users(username, display_name, member_number)')
      .eq('status', 'verified')
      .eq('show_on_homepage', true)
      .order('homepage_order', { ascending: true });

    if (error) throw error;

    const sections = {
      featured: [],
      newly_verified: [],
      recent_uploads: [],
      top_ranked: [],
    };

    (allVerified || []).forEach(r => {
      if (r.homepage_section && sections[r.homepage_section]) {
        sections[r.homepage_section].push(r);
      }
    });

    res.json(sections);
  } catch (error) {
    console.error('Get homepage sections error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get new records (most recently verified)
exports.getNewRecords = async (req, res) => {
  try {
    const { limit = 20, offset = 0, search = '' } = req.query;

    let query = supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', 'verified')
      .order('verified_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const filtered = search ? data.filter(r => 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.users?.display_name?.toLowerCase().includes(search.toLowerCase())
    ) : data;

    res.json({ records: filtered, total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get new records error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get featured records
exports.getFeaturedRecords = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data, count, error } = await supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', 'verified')
      .eq('is_featured', true)
      .order('featured_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: data, total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get featured records error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get most viewed records
exports.getMostViewedRecords = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data, count, error } = await supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', 'verified')
      .order('views', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: data, total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get most viewed records error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get top ranked records
exports.getTopRankedRecords = async (req, res) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const { data, count, error } = await supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', 'verified')
      .eq('is_world_record', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: data, total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get top ranked records error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get records by category
exports.getRecordsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { limit = 20, offset = 0 } = req.query;

    const { data, count, error } = await supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', 'verified')
      .eq('category_id', categoryId)
      .order('verified_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: data, total: count, category_id: categoryId, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get records by category error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get local records (by location)
exports.getLocalRecords = async (req, res) => {
  try {
    const { country, state, city, limit = 20, offset = 0 } = req.query;

    let query = supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', 'verified');

    if (country) query = query.eq('country', country);
    if (state) query = query.eq('state', state);
    if (city) query = query.eq('city', city);

    query = query.order('verified_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    res.json({ records: data, total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get local records error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Mark record as featured
exports.toggleFeaturedRecord = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { recordId } = req.params;
    const { isFeatured } = req.body;

    const { data, error } = await supabase
      .from('records')
      .update({ is_featured: isFeatured, featured_at: isFeatured ? new Date() : null })
      .eq('id', recordId)
      .select();

    if (error) throw error;
    res.json({ success: true, record: data[0] });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update record visibility
exports.updateRecordVisibility = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { recordId } = req.params;
    const { showOnHomepage, showInNewRecords, published } = req.body;

    const updateData = {};
    if (showOnHomepage !== undefined) updateData.show_on_homepage = showOnHomepage;
    if (showInNewRecords !== undefined) updateData.show_in_new_records = showInNewRecords;
    if (published !== undefined) updateData.published = published;

    const { data, error } = await supabase
      .from('records')
      .update(updateData)
      .eq('id', recordId)
      .select();

    if (error) throw error;
    res.json({ success: true, record: data[0] });
  } catch (error) {
    console.error('Update visibility error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update record details
exports.updateRecordDetails = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { recordId } = req.params;
    const { title, description, categoryId } = req.body;

    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (categoryId) updateData.category_id = categoryId;

    const { data, error } = await supabase
      .from('records')
      .update(updateData)
      .eq('id', recordId)
      .select();

    if (error) throw error;
    res.json({ success: true, record: data[0] });
  } catch (error) {
    console.error('Update record details error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Update record video
exports.updateRecordVideo = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { recordId } = req.params;
    const { videoUrl, thumbnailUrl } = req.body;

    const updateData = {};
    if (videoUrl) updateData.evidence_url = videoUrl;
    if (thumbnailUrl) updateData.thumbnail_url = thumbnailUrl;

    const { data, error } = await supabase
      .from('records')
      .update(updateData)
      .eq('id', recordId)
      .select();

    if (error) throw error;
    res.json({ success: true, record: data[0] });
  } catch (error) {
    console.error('Update video error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Change record status
exports.changeRecordStatus = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { recordId } = req.params;
    const { status, notes } = req.body;

    const updateData = { status };
    if (status === 'verified') updateData.verified_at = new Date();
    if (status === 'approved') updateData.approved_at = new Date();
    if (notes) updateData.admin_notes = notes;

    const { data, error } = await supabase
      .from('records')
      .update(updateData)
      .eq('id', recordId)
      .select();

    if (error) throw error;
    res.json({ success: true, record: data[0] });
  } catch (error) {
    console.error('Change status error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get all records with filters and search
exports.getAllRecords = async (req, res) => {
  try {
    const { status = 'verified', search = '', category = '', limit = 20, offset = 0, sortBy = 'newest' } = req.query;

    let query = supabase
      .from('records')
      .select('*, users(username, display_name, member_number)', { count: 'exact' })
      .eq('status', status);

    if (category) query = query.eq('category_id', category);

    // Apply sorting
    const sortMap = {
      newest: { column: 'verified_at', ascending: false },
      oldest: { column: 'verified_at', ascending: true },
      mostViewed: { column: 'views', ascending: false },
      topRanked: { column: 'is_world_record', ascending: false },
    };

    const sortConfig = sortMap[sortBy] || sortMap.newest;
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const filtered = search ? data.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.users?.display_name?.toLowerCase().includes(search.toLowerCase())
    ) : data;

    res.json({ records: filtered, total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get all records error:', error);
    res.status(500).json({ error: error.message });
  }
};
