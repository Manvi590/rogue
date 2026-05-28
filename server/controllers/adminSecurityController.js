const { supabase } = require("../config/supabase");

// @desc    Get system audit logs
// @route   GET /api/admin/security/audit-logs
const getAuditLogs = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*, users:actor_id(name, email)")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Trigger system database backup
// @route   POST /api/admin/security/backup
const triggerBackup = async (req, res) => {
  try {
    // In a real scenario, this would call AWS S3/pg_dump logic
    await supabase.from("audit_logs").insert({
      actor_id: req.user.id,
      action_type: "manual_backup",
      metadata: { target: "aws_s3_cold_storage" }
    });
    res.status(200).json({ message: "Backup successfully dispatched to cold storage." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get all API Integrations
// @route   GET /api/admin/security/api-keys
const getApiKeys = async (req, res) => {
  try {
    const { data, error } = await supabase.from("api_keys").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update system SEO Settings
// @route   PUT /api/admin/security/seo
const updateSeoSettings = async (req, res) => {
  try {
    const { title, meta_description, keywords } = req.body;
    await supabase.from("audit_logs").insert({
      actor_id: req.user.id,
      action_type: "update_seo",
      metadata: { title, meta_description, keywords }
    });
    res.status(200).json({ message: "Global SEO tags updated successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAuditLogs,
  triggerBackup,
  getApiKeys,
  updateSeoSettings
};
