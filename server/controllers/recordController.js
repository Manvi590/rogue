const supabase = require('../config/supabase');

// @desc    Get all verified records
// @route   GET /api/records
// @access  Public
const getRecords = async (req, res) => {
  const { data: records, error } = await supabase
    .from('records')
    .select('*, user:users(name)')
    .eq('status', 'verified');
  
  if (error) {
    return res.status(500).json({ message: error.message });
  }
  res.json(records);
};

// @desc    Get single record
// @route   GET /api/records/:id
// @access  Public
const getRecordById = async (req, res) => {
  const { data: record, error } = await supabase
    .from('records')
    .select('*, user:users(name)')
    .eq('id', req.params.id)
    .single();

  if (record) {
    res.json(record);
  } else {
    res.status(404).json({ message: 'Record not found' });
  }
};

// @desc    Create a record submission
// @route   POST /api/records
// @access  Private
const createRecord = async (req, res) => {
  const { 
    title, category, description, value, unit, 
    evidenceUrl, thumbnailUrl, athleteId, venueName, 
    city, witnesses, recordType 
  } = req.body;

  try {
    const { data: createdRecord, error } = await supabase
      .from('records')
      .insert([
        {
          user_id: req.user.id,
          athlete_id: athleteId,
          title,
          category,
          description,
          value: value || '0',
          unit: unit || '',
          evidence_url: evidenceUrl || '',
          thumbnail_url: thumbnailUrl || '',
          venue_name: venueName,
          city: city,
          witnesses: witnesses || [],
          status: 'pending',
          record_type: recordType || 'standard'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(createdRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get leaderboard
// @route   GET /api/records/leaderboard
// @access  Public
const getLeaderboard = async (req, res) => {
  const { data: leaderboard, error } = await supabase
    .from('records')
    .select('*, user:users(name, profile_image)')
    .eq('status', 'verified')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    return res.status(500).json({ message: error.message });
  }
  res.json(leaderboard);
};

// @desc    Get logged in user's records (pending, verified, rejected)
// @route   GET /api/records/my-submissions
// @access  Private
const getMySubmissions = async (req, res) => {
  try {
    const { data: records, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', req.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all submissions for admin review
// @route   GET /api/records/admin/submissions
// @access  Private/Admin
const getAllSubmissionsForAdmin = async (req, res) => {
  try {
    const { data: records, error } = await supabase
      .from('records')
      .select('*, user:users(name, email)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Adjudicate (verify/reject) record submission
// @route   PUT /api/records/admin/adjudicate/:id
// @access  Private/Admin
const adjudicateRecord = async (req, res) => {
  const { status } = req.body;
  
  if (!['verified', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({ message: 'Invalid adjudication status' });
  }

  try {
    const { data: updatedRecord, error } = await supabase
      .from('records')
      .update({ status, updated_at: new Date() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  getLeaderboard,
  getMySubmissions,
  getAllSubmissionsForAdmin,
  adjudicateRecord,
};
