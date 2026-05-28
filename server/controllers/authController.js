const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const authUser = async (req, res) => {
  const { email, password } = req.body;

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      profileImage: user.profile_image,
      username: user.username || '',
      phone: user.phone || '',
      gender: user.gender || '',
      dob: user.dob || '',
      weight: user.weight || '',
      weightUnit: user.weight_unit || 'kg',
      height: user.height || '',
      heightUnit: user.height_unit || 'cm',
      country: user.country || '',
      city: user.city || '',
      role: user.role || 'athlete',
      membershipType: user.membership_type || 'free_athlete',
      accountStatus: user.account_status || 'active',
      token: generateToken(user.id),
    });
  } else {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
  const { 
    name, email, password, 
    username, phone, gender, dob, 
    weight, weightUnit, height, heightUnit, 
    country, city 
  } = req.body;

  const { data: userExists } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = { 
    name, 
    email, 
    password: hashedPassword, 
    is_admin: false,
    profile_image: '',
    username: username || '',
    phone: phone || '',
    gender: gender || '',
    dob: dob || null,
    weight: weight || null,
    weight_unit: weightUnit || 'kg',
    height: height || null,
    height_unit: heightUnit || 'cm',
    country: country || '',
    city: city || '',
    role: 'athlete',
    membership_type: 'free_athlete',
    account_status: 'active'
  };

  const { data: user, error } = await supabase
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (error) {
    console.error('Supabase signup error:', error);
    return res.status(400).json({ message: error.message || 'Invalid user data' });
  }

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      profileImage: user.profile_image,
      username: user.username || '',
      phone: user.phone || '',
      gender: user.gender || '',
      dob: user.dob || '',
      weight: user.weight || '',
      weightUnit: user.weight_unit || 'kg',
      height: user.height || '',
      heightUnit: user.height_unit || 'cm',
      country: user.country || '',
      city: user.city || '',
      role: user.role,
      membershipType: user.membership_type,
      accountStatus: user.account_status,
      token: generateToken(user.id),
    });
  } else {
    return res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  const { data: user, error } = await supabase
    .from('users')
    .select('id, name, email, is_admin, role, membership_type, account_status, profile_image, username, phone, gender, dob, weight, weight_unit, height, height_unit, country, city')
    .eq('id', req.user.id)
    .single();

  if (error) {
    console.error('Supabase fetch profile error:', error);
  }

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.is_admin,
      profileImage: user.profile_image,
      username: user.username || '',
      phone: user.phone || '',
      gender: user.gender || '',
      dob: user.dob || '',
      weight: user.weight || '',
      weightUnit: user.weight_unit || 'kg',
      height: user.height || '',
      heightUnit: user.height_unit || 'cm',
      country: user.country || '',
      city: user.city || '',
      role: user.role || 'athlete',
      membershipType: user.membership_type || 'free_athlete',
      accountStatus: user.account_status || 'active',
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  const { data: user, error: getError } = await supabase
    .from('users')
    .select('*')
    .eq('id', req.user.id)
    .single();

  if (user) {
    const { 
      name, email, password, profileImage,
      username, phone, gender, dob, 
      weight, weightUnit, height, heightUnit, 
      country, city 
    } = req.body;

    const updates = {
      name: name || user.name,
      email: email || user.email,
      profile_image: profileImage !== undefined ? profileImage : user.profile_image,
      username: username !== undefined ? username : user.username,
      phone: phone !== undefined ? phone : user.phone,
      gender: gender !== undefined ? gender : user.gender,
      dob: dob !== undefined ? dob : user.dob,
      weight: weight !== undefined ? weight : user.weight,
      weight_unit: weightUnit !== undefined ? weightUnit : user.weight_unit,
      height: height !== undefined ? height : user.height,
      height_unit: heightUnit !== undefined ? heightUnit : user.height_unit,
      country: country !== undefined ? country : user.country,
      city: city !== undefined ? city : user.city,
      updated_at: new Date()
    };

    if (password) {
      const salt = await bcrypt.genSalt(10);
      updates.password = await bcrypt.hash(password, salt);
    }

    const { data: updatedUser, error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', req.user.id)
      .select()
      .single();

    if (updateError) {
      return res.status(400).json({ message: updateError.message });
    }

    res.json({
      _id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      isAdmin: updatedUser.is_admin,
      profileImage: updatedUser.profile_image,
      username: updatedUser.username || '',
      phone: updatedUser.phone || '',
      gender: updatedUser.gender || '',
      dob: updatedUser.dob || '',
      weight: updatedUser.weight || '',
      weightUnit: updatedUser.weight_unit || 'kg',
      height: updatedUser.height || '',
      heightUnit: updatedUser.height_unit || 'cm',
      country: updatedUser.country || '',
      city: updatedUser.city || '',
      role: updatedUser.role || 'athlete',
      membershipType: updatedUser.membership_type || 'free_athlete',
      accountStatus: updatedUser.account_status || 'active',
      token: generateToken(updatedUser.id)
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile };
