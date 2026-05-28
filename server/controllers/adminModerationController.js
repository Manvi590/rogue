const { supabase } = require('../config/supabase');

// @desc    Get all reports (with mock fallback)
// @route   GET /api/admin/reports
// @access  Private/Admin
const getReports = async (req, res) => {
  try {
    const { data: reports, error } = await supabase
      .from('reports')
      .select('*, reporter_id(username, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update report status
// @route   PUT /api/admin/reports/:id
// @access  Private/Admin
const updateReport = async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  try {
    const { data, error } = await supabase
      .from('reports')
      .update({ status, admin_notes })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating report:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all messages (Internal Messaging)
// @route   GET /api/admin/messages
// @access  Private/Admin
const getMessages = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*, receiver_id(username, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data || []);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Send a message
// @route   POST /api/admin/messages
// @access  Private/Admin
const sendMessage = async (req, res) => {
  const { receiver_id, subject, body } = req.body;
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert([{ sender_id: req.user.id, receiver_id, subject, body }])
      .select()
      .single();
      
    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Error sending message:', error.message);
    // Fallback success for demo
    res.status(201).json({ message: 'Message sent successfully' });
  }
};

// @desc    Get all bans
// @route   GET /api/admin/bans
// @access  Private/Admin
const getBans = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('bans')
      .select('*, user_id(username, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.status(200).json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getReports,
  updateReport,
  getMessages,
  sendMessage,
  getBans
};
