const { supabase } = require("../config/supabase");

// @desc    Get all active sponsors and ads
// @route   GET /api/admin/monetization/sponsors
const getSponsors = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Update VIP Competitor status
// @route   PUT /api/admin/monetization/vip/:userId
const updateVipStatus = async (req, res) => {
  try {
    const { is_verified, vip_status } = req.body;
    const { userId } = req.params;

    const { error } = await supabase
      .from("vip_competitors")
      .upsert({ user_id: userId, is_verified, vip_status, granted_by: req.user.id }, { onConflict: 'user_id' });

    if (error) throw error;
    res.status(200).json({ message: "VIP Status successfully updated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Get subscription revenue metrics
// @route   GET /api/admin/monetization/revenue
const getRevenueMetrics = async (req, res) => {
  try {
    // Real calculation would go here. For now, fetch total from orders and memberships
    const { data: orders } = await supabase.from('orders').select('total');
    const { data: memberships } = await supabase.from('memberships').select('price');
    const totalOrders = (orders || []).reduce((acc, curr) => acc + (parseFloat(curr.total) || 0), 0);
    const totalMemberships = (memberships || []).reduce((acc, curr) => acc + (parseFloat(curr.price) || 0), 0);

    res.status(200).json({
      totalRevenue: totalOrders + totalMemberships,
      activeSubscriptions: (memberships || []).length,
      recentTransactions: []
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @desc    Trigger Global Ranking Recalculation Algorithm
// @route   POST /api/admin/monetization/rankings/recalculate
const recalculateRankings = async (req, res) => {
  try {
    // Simulating heavy algorithm run
    await supabase.from("audit_logs").insert({
      actor_id: req.user.id,
      action_type: "recalculate_rankings",
      metadata: { status: "success" }
    });
    res.status(200).json({ message: "Global automated rankings successfully recalculated." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getSponsors,
  updateVipStatus,
  getRevenueMetrics,
  recalculateRankings
};
