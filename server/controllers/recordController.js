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

module.exports = {
  getRecords,
  getRecordById,
  createRecord,
  getLeaderboard,
};
