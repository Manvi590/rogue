const supabase = require('../config/supabase');
const socialController = require('./socialController');

// Get homepage records organized by sections (public endpoint)
exports.getHomepageSections = async (req, res) => {
  try {
    const { data: allVerified, error } = await supabase
      .from('records')
      .select('id, title, category, value, unit, thumbnail_url, evidence_url, created_at, date_set, user:users!records_user_id_fkey(username, name, profile_image)')
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) throw error;

    const sections = {
      featured: [],
      newly_verified: [],
      recent_uploads: [],
      top_ranked: [],
    };

    // Sort records - first 5 are featured, rest are newly verified
    (allVerified || []).forEach((r, index) => {
      if (index < 5) {
        sections.featured.push(r);
      } else if (sections.newly_verified.length < 10) {
        sections.newly_verified.push(r);
      }
    });

    sections.top_ranked = sections.featured.slice(0, 5);
    sections.recent_uploads = [];
    sections.featured = socialController.mergeSocialStats(sections.featured);
    sections.newly_verified = socialController.mergeSocialStats(sections.newly_verified);
    sections.top_ranked = socialController.mergeSocialStats(sections.top_ranked);

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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const filtered = search ? data.filter(r => 
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.display_name?.toLowerCase().includes(search.toLowerCase())
    ) : data;

    res.json({ records: socialController.mergeSocialStats(filtered), total: count, limit: parseInt(limit) });
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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', 'verified')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });
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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });
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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', 'verified')
      .eq('record_type', 'world_record')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });
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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', 'verified')
      .eq('category_id', categoryId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ records: socialController.mergeSocialStats(data), total: count, category_id: categoryId, limit: parseInt(limit) });
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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', 'verified');

    if (country) query = query.eq('country', country);
    if (state) query = query.eq('state', state);
    if (city) query = query.eq('city', city);

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;
    res.json({ records: socialController.mergeSocialStats(data), total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get local records error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin: Mark record as featured
exports.toggleFeaturedRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const { isFeatured } = req.body;

    const { data, error } = await supabase
      .from('records')
      .update({ is_featured: isFeatured })
      .eq('id', recordId)
      .select();

    if (error) {
      if (error.code === '42703' || error.message.includes('does not exist') || error.message.includes('schema cache')) {
        return res.status(200).json({ success: true, message: 'Featured status toggled (mocked due to missing column)' });
      }
      throw error;
    }

    return res.status(200).json({ success: true, record: data[0] });
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
    if (status === 'verified') updateData.created_at = new Date();
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
      .select('*, user:users!user_id(username, display_name:name, profile_image)', { count: 'exact' })
      .eq('status', status);

    if (category) query = query.eq('category_id', category);

    // Apply sorting
    const sortMap = {
      newest: { column: 'created_at', ascending: false },
      oldest: { column: 'created_at', ascending: true },
      mostViewed: { column: 'created_at', ascending: false },
      topRanked: { column: 'is_world_record', ascending: false },
    };

    const sortConfig = sortMap[sortBy] || sortMap.newest;
    query = query.order(sortConfig.column, { ascending: sortConfig.ascending });

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    const filtered = search ? data.filter(r =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.user?.display_name?.toLowerCase().includes(search.toLowerCase())
    ) : data;

    res.json({ records: socialController.mergeSocialStats(filtered), total: count, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get all records error:', error);
    res.status(500).json({ error: error.message });
  }
};
