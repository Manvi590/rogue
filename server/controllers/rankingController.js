const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Get global rankings with filters
exports.getGlobalRankings = async (req, res) => {
  try {
    const { limit = 50, offset = 0, search = '', sortBy = 'total_points', order = 'desc', country = '', state = '', city = '' } = req.query;

    let query = supabase
      .from('user_rankings')
      .select('*, users(username, display_name, profile_image, country, state, city)', { count: 'exact' });

    if (country) query = query.eq('country', country);
    if (state) query = query.eq('state', state);
    if (city) query = query.eq('city', city);

    const orderDirection = order === 'asc' ? { ascending: true } : { ascending: false };
    query = query.order(sortBy, orderDirection).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    let filtered = data;
    if (search) {
      filtered = data.filter(r =>
        r.users.username?.toLowerCase().includes(search.toLowerCase()) ||
        r.users.display_name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ rankings: filtered, total: count, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    console.error('Get rankings error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get local rankings
exports.getLocalRankings = async (req, res) => {
  try {
    const { country, state, city, limit = 50, offset = 0, sortBy = 'total_points', order = 'desc' } = req.query;

    let query = supabase.from('user_rankings').select('*, users(username, display_name, profile_image, country, state, city)', { count: 'exact' });

    if (country) query = query.eq('country', country);
    if (state) query = query.eq('state', state);
    if (city) query = query.eq('city', city);

    const orderDirection = order === 'asc' ? { ascending: true } : { ascending: false };
    query = query.order(sortBy, orderDirection).range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) throw error;

    res.json({ rankings: data, total: count, limit: parseInt(limit), offset: parseInt(offset) });
  } catch (error) {
    console.error('Get local rankings error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get category rankings
exports.getCategoryRankings = async (req, res) => {
  try {
    const { category_id } = req.params;
    const { limit = 50, offset = 0 } = req.query;

    const { data: records, error: recordsError } = await supabase
      .from('records').select('user_id, category_id').eq('category_id', category_id).eq('status', 'verified');

    if (recordsError) throw recordsError;

    const userIds = [...new Set(records.map(r => r.user_id))];
    if (userIds.length === 0) return res.json({ rankings: [], total: 0 });

    const { data, count, error } = await supabase
      .from('user_rankings')
      .select('*, users(username, display_name)', { count: 'exact' })
      .in('user_id', userIds)
      .order('total_points', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw error;
    res.json({ rankings: data, total: count, category_id, limit: parseInt(limit) });
  } catch (error) {
    console.error('Get category rankings error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get user ranking details
exports.getUserRankingDetails = async (req, res) => {
  try {
    const { user_id } = req.params;

    const { data: ranking, error: rankingError } = await supabase
      .from('user_rankings').select('*, users(username, display_name, email, country, state, city)').eq('user_id', user_id).single();

    if (rankingError) throw rankingError;

    const { data: pointsHistory, error: historyError } = await supabase
      .from('user_points_history').select('*').eq('user_id', user_id).order('created_at', { ascending: false }).limit(20);

    if (historyError) throw historyError;

    const { data: records } = await supabase
      .from('records').select('id, name, category_id, total_score, status').eq('user_id', user_id).eq('status', 'verified').limit(10);

    res.json({ ranking, recentPoints: pointsHistory, verifiedRecords: records });
  } catch (error) {
    console.error('Get user ranking details error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Add points
exports.addUserPoints = async (req, res) => {
  try {
    const { user_id, points, source, reference_id, reason } = req.body;
    if (!user_id || !points || !source) return res.status(400).json({ error: 'Missing required fields' });

    await supabase.from('user_points_history').insert([{
      user_id, points_awarded: points, source, reference_id, reason, admin_id: req.user?.id, is_manual: false
    }]);

    const { data: currentRanking } = await supabase.from('user_rankings').select('total_points').eq('user_id', user_id).single().catch(() => ({ data: null }));

    const newTotal = (currentRanking?.total_points || 0) + points;
    let tier = 'Challenger';
    if (newTotal >= 50000) tier = 'Grand Champion';
    else if (newTotal >= 20000) tier = 'Elite Master';
    else if (newTotal >= 5000) tier = 'Pro Competitor';

    if (currentRanking) {
      const { data: updated } = await supabase.from('user_rankings').update({
        total_points: newTotal, tier_badge: tier, updated_at: new Date()
      }).eq('user_id', user_id).select();

      return res.json({ success: true, ranking: updated[0] });
    } else {
      const { data: created } = await supabase.from('user_rankings').insert([{
        user_id, total_points: newTotal, tier_badge: tier
      }]).select();

      return res.json({ success: true, ranking: created[0] });
    }
  } catch (error) {
    console.error('Add points error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Admin adjust points
exports.adjustUserPoints = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { user_id, points, reason, notes } = req.body;
    if (!user_id || points === undefined || !reason) return res.status(400).json({ error: 'Missing required fields' });

    await supabase.from('user_points_history').insert([{
      user_id, points_awarded: points, source: 'admin_adjustment', reason, admin_notes: notes, admin_id: req.user.id, is_manual: true
    }]);

    const { data: currentRanking } = await supabase.from('user_rankings').select('total_points').eq('user_id', user_id).single().catch(() => ({ data: null }));

    const newTotal = (currentRanking?.total_points || 0) + points;
    let tier = 'Challenger';
    if (newTotal >= 50000) tier = 'Grand Champion';
    else if (newTotal >= 20000) tier = 'Elite Master';
    else if (newTotal >= 5000) tier = 'Pro Competitor';

    const { data: updated } = await supabase.from('user_rankings').update({
      total_points: Math.max(0, newTotal), tier_badge: tier, updated_at: new Date()
    }).eq('user_id', user_id).select();

    res.json({ success: true, ranking: updated[0] });
  } catch (error) {
    console.error('Adjust points error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Recalculate rankings
exports.recalculateAllRankings = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { data: rankings } = await supabase.from('user_rankings').select('*').order('total_points', { ascending: false });

    for (let i = 0; i < rankings.length; i++) {
      await supabase.from('user_rankings').update({ global_rank: i + 1 }).eq('id', rankings[i].id);
    }

    res.json({ success: true, recalculatedCount: rankings.length });
  } catch (error) {
    console.error('Recalculate rankings error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Get points rules
exports.getPointsRules = async (req, res) => {
  try {
    const { data } = await supabase.from('points_rules').select('*').order('points_value', { ascending: false });
    res.json({ rules: data });
  } catch (error) {
    console.error('Get points rules error:', error);
    res.status(500).json({ error: error.message });
  }
};

// Update points rule
exports.updatePointsRule = async (req, res) => {
  try {
    if (!req.user?.isAdmin) return res.status(403).json({ error: 'Admin only' });

    const { rule_name } = req.params;
    const { points_value, description } = req.body;

    const { data } = await supabase.from('points_rules').update({
      points_value: points_value || undefined, description: description || undefined, updated_at: new Date()
    }).eq('rule_name', rule_name).select();

    res.json({ success: true, rule: data[0] });
  } catch (error) {
    console.error('Update points rule error:', error);
    res.status(500).json({ error: error.message });
  }
};
