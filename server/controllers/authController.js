const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Helper to generate a unique Member Number in the format AWR-XXXXXX
const generateUniqueMemberNumber = async () => {
  let isUnique = false;
  let memberNumber = '';
  let attempts = 0;
  while (!isUnique && attempts < 15) {
    attempts++;
    const num = Math.floor(100000 + Math.random() * 900000);
    memberNumber = `AWR-${num}`;
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('member_number', memberNumber)
      .maybeSingle();
    if (!data && !error) {
      isUnique = true;
    }
  }
  if (!isUnique) {
    memberNumber = `AWR-${Math.floor(100000 + Math.random() * 900000)}`;
  }
  return memberNumber;
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
    // Ensure they have a member number (for legacy/existing users)
    let finalUser = user;
    if (!user.member_number) {
      const memberNumber = await generateUniqueMemberNumber();
      const { data: updated } = await supabase
        .from('users')
        .update({ member_number: memberNumber })
        .eq('id', user.id)
        .select()
        .single();
      if (updated) finalUser = updated;
    }

    res.json({
      _id: finalUser.id,
      name: finalUser.name,
      email: finalUser.email,
      isAdmin: finalUser.is_admin,
      profileImage: finalUser.profile_image,
      username: finalUser.username || '',
      phone: finalUser.phone || '',
      gender: finalUser.gender || '',
      dob: finalUser.dob || '',
      weight: finalUser.weight || '',
      weightUnit: finalUser.weight_unit || 'kg',
      height: finalUser.height || '',
      heightUnit: finalUser.height_unit || 'cm',
      country: finalUser.country || '',
      city: finalUser.city || '',
      role: finalUser.role || 'athlete',
      membershipType: finalUser.membership_type || 'free_athlete',
      accountStatus: finalUser.account_status || 'active',
      memberNumber: finalUser.member_number || '',
      token: generateToken(finalUser.id),
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
  const memberNumber = await generateUniqueMemberNumber();

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
    account_status: 'active',
    member_number: memberNumber
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
      memberNumber: user.member_number || '',
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
    .select('id, name, email, is_admin, role, membership_type, account_status, profile_image, username, phone, gender, dob, weight, weight_unit, height, height_unit, country, city, street_address, apartment, state, zip_code, member_number')
    .eq('id', req.user.id)
    .single();

  if (error) {
    console.error('Supabase fetch profile error:', error);
  }

  if (user) {
    let finalUser = user;
    if (!user.member_number) {
      const memberNumber = await generateUniqueMemberNumber();
      const { data: updated } = await supabase
        .from('users')
        .update({ member_number: memberNumber })
        .eq('id', user.id)
        .select()
        .single();
      if (updated) finalUser = updated;
    }

    res.json({
      _id: finalUser.id,
      name: finalUser.name,
      email: finalUser.email,
      isAdmin: finalUser.is_admin,
      profileImage: finalUser.profile_image,
      username: finalUser.username || '',
      phone: finalUser.phone || '',
      gender: finalUser.gender || '',
      dob: finalUser.dob || '',
      weight: finalUser.weight || '',
      weightUnit: finalUser.weight_unit || 'kg',
      height: finalUser.height || '',
      heightUnit: finalUser.height_unit || 'cm',
      country: finalUser.country || '',
      city: finalUser.city || '',
      streetAddress: finalUser.street_address || '',
      apartment: finalUser.apartment || '',
      state: finalUser.state || '',
      zipCode: finalUser.zip_code || '',
      role: finalUser.role || 'athlete',
      membershipType: finalUser.membership_type || 'free_athlete',
      accountStatus: finalUser.account_status || 'active',
      memberNumber: finalUser.member_number || '',
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
      country, city, streetAddress, apartment, state, zipCode
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
      street_address: streetAddress !== undefined ? streetAddress : user.street_address,
      apartment: apartment !== undefined ? apartment : user.apartment,
      state: state !== undefined ? state : user.state,
      zip_code: zipCode !== undefined ? zipCode : user.zip_code,
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
      streetAddress: updatedUser.street_address || '',
      apartment: updatedUser.apartment || '',
      state: updatedUser.state || '',
      zipCode: updatedUser.zip_code || '',
      role: updatedUser.role || 'athlete',
      membershipType: updatedUser.membership_type || 'free_athlete',
      accountStatus: updatedUser.account_status || 'active',
      memberNumber: updatedUser.member_number || '',
      token: generateToken(updatedUser.id)
    });
  } else {
    return res.status(404).json({ message: 'User not found' });
  }
};

module.exports = { authUser, registerUser, getUserProfile, updateUserProfile };
