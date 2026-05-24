const supabase = require('../config/supabase');

const getFormattedMeta = (m) => {
  if (!m) return null;
  return {
    _id: m.id,
    id: m.id,
    recordId: m.record_id,
    trackingNumber: m.tracking_number || '',
    submissionFee: m.submission_fee ? parseFloat(m.submission_fee) : 0.00,
    adminNotes: m.admin_notes || '',
    history: m.history || [],
    createdAt: m.created_at,
    updatedAt: m.updated_at
  };
};

const ensureMeta = async (recordId) => {
  const { data: existingMeta } = await supabase
    .from('record_meta')
    .select('*')
    .eq('record_id', recordId)
    .maybeSingle();

  if (existingMeta) return existingMeta;

  const { data: createdMeta, error } = await supabase
    .from('record_meta')
    .insert([{
      record_id: recordId,
      tracking_number: '',
      submission_fee: 0.00,
      admin_notes: '',
      history: []
    }])
    .select()
    .single();

  if (error) throw error;
  return createdMeta;
};

const getMetaForRecord = async (req, res) => {
  const { recordId } = req.params;
  try {
    const { data: meta, error } = await supabase
      .from('record_meta')
      .select('*')
      .eq('record_id', recordId)
      .maybeSingle();

    if (error) throw error;
    res.json({ meta: getFormattedMeta(meta) });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const upsertMeta = async (req, res) => {
  const { recordId } = req.params;
  const { trackingNumber, submissionFee, adminNotes, action, by } = req.body;

  try {
    const meta = await ensureMeta(recordId);

    const updates = {
      updated_at: new Date()
    };
    if (trackingNumber) updates.tracking_number = trackingNumber;
    if (submissionFee !== undefined) updates.submission_fee = parseFloat(submissionFee);
    if (adminNotes) updates.admin_notes = adminNotes;
    
    const currentHistory = meta.history || [];
    if (action) {
      currentHistory.push({ 
        action, 
        by: by || 'admin', 
        note: adminNotes || '',
        date: new Date().toISOString()
      });
      updates.history = currentHistory;
    }

    const { data: updatedMeta, error } = await supabase
      .from('record_meta')
      .update(updates)
      .eq('id', meta.id)
      .select()
      .single();

    if (error) throw error;
    res.json(getFormattedMeta(updatedMeta));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const generateTracking = async (req, res) => {
  const { recordId } = req.params;

  try {
    const meta = await ensureMeta(recordId);
    const trackingNumber = `RG-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8).toUpperCase()}`;

    const currentHistory = meta.history || [];
    currentHistory.push({ 
      action: 'generated_tracking', 
      by: req.user?.email || 'admin', 
      note: `Generated ${trackingNumber}`,
      date: new Date().toISOString()
    });

    const { data: updatedMeta, error } = await supabase
      .from('record_meta')
      .update({
        tracking_number: trackingNumber,
        history: currentHistory,
        updated_at: new Date()
      })
      .eq('id', meta.id)
      .select()
      .single();

    if (error) throw error;
    res.json(getFormattedMeta(updatedMeta));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getMetaForRecord, upsertMeta, generateTracking };
