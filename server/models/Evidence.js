/**
 * Evidence Model
 * Manages photo evidence and related evidence files for records
 */

const supabase = require('../config/supabase');

// Evidence types
const EVIDENCE_TYPES = {
  PHOTO: 'photo', // Photo evidence
  SCREENSHOT: 'screenshot', // Screenshot of achievement
  DOCUMENT: 'document', // Supporting document
  CERTIFICATE: 'certificate', // Certificate of achievement
};

// Evidence status
const EVIDENCE_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
};

// Create a new evidence record
const createEvidence = async (evidenceData) => {
  try {
    const {
      recordId,
      userId,
      evidenceType, // One of EVIDENCE_TYPES
      title,
      description,
      fileUrl,
      fileName,
      fileSize,
      mimeType,
      status = EVIDENCE_STATUS.PENDING,
      verifiedBy = null,
      verificationNotes = null,
    } = evidenceData;

    const { data, error } = await supabase
      .from('evidence')
      .insert({
        record_id: recordId,
        user_id: userId,
        evidence_type: evidenceType,
        title,
        description,
        file_url: fileUrl,
        file_name: fileName,
        file_size: fileSize,
        mime_type: mimeType,
        status,
        verified_by: verifiedBy,
        verification_notes: verificationNotes,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get all evidence records with filters
const getEvidence = async (filters = {}) => {
  try {
    let query = supabase.from('evidence').select('*');

    if (filters.recordId) {
      query = query.eq('record_id', filters.recordId);
    }
    if (filters.userId) {
      query = query.eq('user_id', filters.userId);
    }
    if (filters.evidenceType) {
      query = query.eq('evidence_type', filters.evidenceType);
    }
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get a single evidence record by ID
const getEvidenceById = async (evidenceId) => {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .select('*')
      .eq('id', evidenceId)
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Update evidence record
const updateEvidence = async (evidenceId, updates) => {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .update({
        ...updates,
        updated_at: new Date(),
      })
      .eq('id', evidenceId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Verify evidence (admin action)
const verifyEvidence = async (evidenceId, verifiedBy, verificationNotes = '') => {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .update({
        status: EVIDENCE_STATUS.VERIFIED,
        verified_by: verifiedBy,
        verification_notes: verificationNotes,
        updated_at: new Date(),
      })
      .eq('id', evidenceId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Reject evidence (admin action)
const rejectEvidence = async (evidenceId, verifiedBy, rejectionReason) => {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .update({
        status: EVIDENCE_STATUS.REJECTED,
        verified_by: verifiedBy,
        verification_notes: rejectionReason,
        updated_at: new Date(),
      })
      .eq('id', evidenceId)
      .select()
      .single();

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Delete evidence
const deleteEvidence = async (evidenceId) => {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .delete()
      .eq('id', evidenceId);

    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
};

// Get evidence statistics
const getEvidenceStats = async () => {
  try {
    const { data, error } = await supabase
      .from('evidence')
      .select('status')
      .then(async (result) => {
        if (result.error) throw result.error;

        const stats = {
          total: result.data.length,
          verified: result.data.filter((e) => e.status === EVIDENCE_STATUS.VERIFIED).length,
          pending: result.data.filter((e) => e.status === EVIDENCE_STATUS.PENDING).length,
          rejected: result.data.filter((e) => e.status === EVIDENCE_STATUS.REJECTED).length,
        };

        return { data: stats, error: null };
      });

    return { data, error };
  } catch (error) {
    return { data: null, error };
  }
};

module.exports = {
  createEvidence,
  getEvidence,
  getEvidenceById,
  updateEvidence,
  verifyEvidence,
  rejectEvidence,
  deleteEvidence,
  getEvidenceStats,
  EVIDENCE_TYPES,
  EVIDENCE_STATUS,
};
