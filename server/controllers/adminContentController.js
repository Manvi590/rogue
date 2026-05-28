const { supabase } = require('../config/supabase');

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

module.exports = {
  getMediaAssets,
  getCertificates,
  updateCertificateOrder
};
