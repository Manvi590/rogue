const supabase = require('../config/supabase');
const bcrypt = require('bcryptjs');
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    console.log('getDashboardStats called');
    
    // Count total users
    console.log('Querying users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id, name, email, created_at, is_admin', { count: 'exact' });

    console.log('Users query done:', users?.length, 'users');
    if (usersError) {
      console.error('Users error:', usersError);
      throw usersError;
    }
    const totalUsers = users?.length || 0;

    // Count total submissions
    const { data: records, error: recordsError } = await supabase
      .from('records')
      .select('id, status, category, created_at', { count: 'exact' });

    if (recordsError) throw recordsError;
    const totalSubmissions = records?.length || 0;
    const pendingReviews = records?.filter(r => r.status === 'pending')?.length || 0;
    const approvedRecords = records?.filter(r => r.status === 'verified')?.length || 0;
    const deniedRecords = records?.filter(r => r.status === 'rejected')?.length || 0;

    // Get most active categories
    const categoryStats = records?.reduce((acc, rec) => {
      const existing = acc.find(c => c._id === rec.category);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ _id: rec.category, count: 1 });
      }
      return acc;
    }, [])?.sort((a, b) => b.count - a.count)?.slice(0, 10) || [];

    // Get trending records (most recent approved)
    const { data: trendingRecords, error: trendingError } = await supabase
      .from('records')
      .select('id, title, status, created_at, user_id')
      .eq('status', 'verified')
      .order('created_at', { ascending: false })
      .limit(10);

    if (trendingError) console.error('Trending error:', trendingError);

    // Count total events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, created_at', { count: 'exact' });

    if (eventsError) console.error('Events error:', eventsError);
    const totalEvents = events?.length || 0;

    // Recent activity
    const recentSubmissions = records
      ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      ?.slice(0, 5) || [];

    const recentUsers = users
      ?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      ?.slice(0, 5) || [];

    res.json({
      users: {
        total: totalUsers,
        active: totalUsers,
        suspended: 0,
        banned: 0
      },
      submissions: {
        total: totalSubmissions,
        pending: pendingReviews,
        approved: approvedRecords,
        denied: deniedRecords
      },
      categories: categoryStats,
      trendingRecords,
      events: {
        total: totalEvents,
        live: 0
      },
      tickets: {
        sold: 0,
        revenue: 0
      },
      orders: {
        total: 0,
        revenue: 0
      },
      recentSubmissions,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// @desc    Suspend a user
// @route   PUT /api/admin/users/:id/suspend
// @access  Private/Admin
const suspendUser = async (req, res) => {
  const { reason, durationDays } = req.body;

  try {
    const suspendedUntil = durationDays 
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : null;

    const { data: user, error } = await supabase
      .from('users')
      .update({
        account_status: 'suspended'
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: 'User suspended successfully', user: user[0] });
  } catch (error) {
    res.status(400).json({ message: 'Error suspending user', error: error.message });
  }
};

// @desc    Ban a user
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
  const { reason } = req.body;

  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        account_status: 'banned'
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: 'User banned successfully', user: user[0] });
  } catch (error) {
    res.status(400).json({ message: 'Error banning user', error: error.message });
  }
};

// @desc    Unsuspend/Unban a user
// @route   PUT /api/admin/users/:id/unsuspend
// @access  Private/Admin
const unsuspendUser = async (req, res) => {
  try {
    const { data: user, error } = await supabase
      .from('users')
      .update({
        account_status: 'active'
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: 'User unsuspended successfully', user: user[0] });
  } catch (error) {
    res.status(400).json({ message: 'Error unsuspending user', error: error.message });
  }
};

// @desc    Reset user password
// @route   PUT /api/admin/users/:id/reset-password
// @access  Private/Admin
const resetUserPassword = async (req, res) => {
  const { newPassword } = req.body;

  try {
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const { data: user, error } = await supabase
      .from('users')
      .update({
        password: hashedPassword
      })
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: 'User password reset successfully', user: user[0] });
  } catch (error) {
    res.status(400).json({ message: 'Error resetting password', error: error.message });
  }
};

// @desc    Get user activity
// @route   GET /api/admin/users/:id/activity
// @access  Private/Admin
const getUserActivity = async (req, res) => {
  try {
    const { data: userRecords, error } = await supabase
      .from('records')
      .select('*')
      .eq('user_id', req.params.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    const submissionStats = {
      total: userRecords?.length || 0,
      verified: userRecords?.filter(r => r.status === 'verified')?.length || 0,
      pending: userRecords?.filter(r => r.status === 'pending')?.length || 0,
      rejected: userRecords?.filter(r => r.status === 'rejected')?.length || 0
    };

    res.json({
      userId: req.params.id,
      submissions: userRecords || [],
      submissionStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user activity', error: error.message });
  }
};

// @desc    Get all users with filters
// @route   GET /api/admin/users/list/all
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { search = '', limit = 50, page = 1 } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('users')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, count, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.json({
      users,
      total: count,
      page: parseInt(page),
      pages: Math.ceil(count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = async (req, res) => {
  const { name, email, password, username, country, gender, dob, phone, city, isAdmin } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: user, error } = await supabase
      .from('users')
      .insert({
        name,
        email,
        password: hashedPassword,
        username,
        country,
        gender: gender || 'male',
        dob: dob ? dob : null,
        phone,
        city,
        is_admin: isAdmin || false
      })
      .select();

    if (error) throw error;
    res.status(201).json({ message: 'User created successfully', user: user[0] });
  } catch (error) {
    if (error.message?.includes('duplicate key') || error.message?.includes('unique')) {
      res.status(400).json({ message: 'Email already exists' });
    } else {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res) => {
  const { name, email, username, country, gender, dob, phone, city, isAdmin, accountStatus } = req.body;

  try {
    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (username) updateData.username = username;
    if (country) updateData.country = country;
    if (gender) updateData.gender = gender;
    if (dob) updateData.dob = dob;
    if (phone) updateData.phone = phone;
    if (city) updateData.city = city;
    if (typeof isAdmin !== 'undefined') updateData.is_admin = isAdmin;
    if (accountStatus) updateData.account_status = accountStatus;

    const { data: user, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', req.params.id)
      .select();

    if (error) throw error;
    res.json({ message: 'User updated successfully', user: user[0] });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  suspendUser,
  banUser,
  unsuspendUser,
  resetUserPassword,
  getUserActivity,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser
};
