const supabase = require('../config/supabase');

// @desc    Get all media assets
// @route   GET /api/admin/media
// @access  Private/Admin
const getMediaAssets = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('media_assets')
      .select('*, uploader_id(username)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all certificates (Admin Shop)
// @route   GET /api/admin/certificates
// @access  Private/Admin
const getCertificates = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*, user_id(username, email), record_id(title)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update certificate order status
// @route   PUT /api/admin/certificates/:id
// @access  Private/Admin
const updateCertificateOrder = async (req, res) => {
  const { id } = req.params;
  const { order_status } = req.body;

  try {
    const { data, error } = await supabase
      .from('certificates')
      .update({ order_status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get a page by slug
// @route   GET /api/admin/content/pages/:slug
// @access  Private/Admin
const getPageContent = async (req, res) => {
  const { slug } = req.params;
  try {
    let { data, error } = await supabase
      .from('page_content')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) {
      data = { slug, title: slug.replace('-', ' ').toUpperCase(), body: 'Draft content...' };
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching page' });
  }
};

// @desc    Update page by slug
// @route   PUT /api/admin/content/pages/:slug
// @access  Private/Admin
const updatePageContent = async (req, res) => {
  const { slug } = req.params;
  const { title, body } = req.body;
  try {
    const { data, error } = await supabase
      .from('page_content')
      .upsert({ slug, title, body, last_edited_by: req.user.id, updated_at: new Date() })
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating page' });
  }
};

// @desc    Get FAQs
// @route   GET /api/admin/content/faqs
const getFaqs = async (req, res) => {
  try {
    const { data, error } = await supabase.from('faqs').select('*').order('order_index', { ascending: true });
    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create FAQ
// @route   POST /api/admin/content/faqs
const createFaq = async (req, res) => {
  const { question, answer, order_index, is_published } = req.body;
  try {
    const { data, error } = await supabase.from('faqs').insert([{ question, answer, order_index, is_published }]).select().single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update FAQ
// @route   PUT /api/admin/content/faqs/:id
const updateFaq = async (req, res) => {
  const { id } = req.params;
  const { question, answer, order_index, is_published } = req.body;
  try {
    const { data, error } = await supabase.from('faqs').update({ question, answer, order_index, is_published, updated_at: new Date() }).eq('id', id).select().single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/admin/content/faqs/:id
const deleteFaq = async (req, res) => {
  try {
    const { error } = await supabase.from('faqs').delete().eq('id', req.params.id);
    if (error) throw error;
    res.status(200).json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get Homepage Settings
// @route   GET /api/admin/content/homepage/:section
const getHomepageSettings = async (req, res) => {
  const { section } = req.params;
  try {
    let { data, error } = await supabase.from('homepage_settings').select('*').eq('section', section).single();
    if (error && error.code !== 'PGRST116') throw error;
    if (!data) {
      data = { section, config: {} };
    }
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update Homepage Settings
// @route   PUT /api/admin/content/homepage/:section
const updateHomepageSettings = async (req, res) => {
  const { section } = req.params;
  const { config } = req.body;
  try {
    const { data, error } = await supabase.from('homepage_settings').upsert({ section, config, updated_at: new Date() }).select().single();
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMediaAssets,
  getCertificates,
  updateCertificateOrder,
  getPageContent,
  updatePageContent,
  getFaqs,
  createFaq,
  updateFaq,
  deleteFaq,
  getHomepageSettings,
  updateHomepageSettings
};
