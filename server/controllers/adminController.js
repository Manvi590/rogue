const supabase = require('../config/supabase');

// ==========================================
// 👥 USERS MANAGEMENT
// ==========================================

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, is_admin, profile_image, username, phone, gender, dob, weight, weight_unit, height, height_unit, country, city, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a user's details / role
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
  const { name, email, is_admin, username, phone, gender, dob, weight, weight_unit, height, height_unit, country, city } = req.body;
  try {
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update({
        name,
        email,
        is_admin: !!is_admin,
        username,
        phone,
        gender,
        dob: dob || null,
        weight,
        weight_unit,
        height,
        height_unit,
        country,
        city,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select('id, name, email, is_admin, username, phone, gender, dob, weight, height, country, city')
      .single();

    if (error) throw error;
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUserByAdmin = async (req, res) => {
  try {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'User profile purged successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// ⚔️ RECORDS CRUD
// ==========================================

// @desc    Create a record attempt manually
// @route   POST /api/admin/records
// @access  Private/Admin
const createRecordByAdmin = async (req, res) => {
  const { 
    userId, title, category, description, value, unit, 
    status, evidenceUrl, venueName, city, recordType 
  } = req.body;

  try {
    const { data: createdRecord, error } = await supabase
      .from('records')
      .insert([
        {
          user_id: userId,
          title,
          category,
          description,
          value,
          unit,
          status: status || 'pending',
          evidence_url: evidenceUrl || '',
          venue_name: venueName,
          city: city,
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

// @desc    Update a record details
// @route   PUT /api/admin/records/:id
// @access  Private/Admin
const updateRecordByAdmin = async (req, res) => {
  const { title, category, description, value, unit, status, evidenceUrl, venueName, city, recordType } = req.body;
  try {
    const { data: updatedRecord, error } = await supabase
      .from('records')
      .update({
        title,
        category,
        description,
        value,
        unit,
        status,
        evidence_url: evidenceUrl,
        venue_name: venueName,
        city: city,
        record_type: recordType,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a record attempt
// @route   DELETE /api/admin/records/:id
// @access  Private/Admin
const deleteRecordByAdmin = async (req, res) => {
  try {
    const { error } = await supabase
      .from('records')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Record attempt purged successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// 📅 EVENTS CRUD
// ==========================================

// @desc    Get all events (admin feed)
// @route   GET /api/admin/events
// @access  Private/Admin
const getAllEventsByAdmin = async (req, res) => {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });

    if (error) throw error;
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new live sporting event
// @route   POST /api/admin/events
// @access  Private/Admin
const createEventByAdmin = async (req, res) => {
  const { title, description, date, location, imageUrl } = req.body;
  try {
    const { data: createdEvent, error } = await supabase
      .from('events')
      .insert([
        { title, description, date, location, image_url: imageUrl }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a sporting event
// @route   PUT /api/admin/events/:id
// @access  Private/Admin
const updateEventByAdmin = async (req, res) => {
  const { title, description, date, location, imageUrl } = req.body;
  try {
    const { data: updatedEvent, error } = await supabase
      .from('events')
      .update({
        title,
        description,
        date,
        location,
        image_url: imageUrl,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a sporting event
// @route   DELETE /api/admin/events/:id
// @access  Private/Admin
const deleteEventByAdmin = async (req, res) => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Sporting event deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// 🛍️ PRODUCTS CRUD
// ==========================================

// @desc    Get all products (admin catalog)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProductsByAdmin = async (req, res) => {
  try {
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a shop product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProductByAdmin = async (req, res) => {
  const { name, description, price, imageUrl, category, stockCount } = req.body;
  try {
    const { data: createdProduct, error } = await supabase
      .from('products')
      .insert([
        {
          name,
          description,
          price: parseFloat(price) || 0.00,
          image_url: imageUrl,
          category,
          stock_count: parseInt(stockCount) || 0
        }
      ])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a shop product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProductByAdmin = async (req, res) => {
  const { name, description, price, imageUrl, category, stockCount } = req.body;
  try {
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        name,
        description,
        price: parseFloat(price) || 0.00,
        image_url: imageUrl,
        category,
        stock_count: parseInt(stockCount) || 0,
        updated_at: new Date()
      })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error) throw error;
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a shop product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProductByAdmin = async (req, res) => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Shop product deleted successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ==========================================
// ✉️ CONTACT MESSAGES
// ==========================================

// @desc    Get all inquiries
// @route   GET /api/admin/contacts
// @access  Private/Admin
const getAllInquiries = async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete support inquiry
// @route   DELETE /api/admin/contacts/:id
// @access  Private/Admin
const deleteInquiry = async (req, res) => {
  try {
    const { error } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', req.params.id);

    if (error) throw error;
    res.json({ message: 'Support ticket cleared successfully.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  // Users
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  // Records
  createRecordByAdmin,
  updateRecordByAdmin,
  deleteRecordByAdmin,
  // Events
  getAllEventsByAdmin,
  createEventByAdmin,
  updateEventByAdmin,
  deleteEventByAdmin,
  // Shop Products
  getAllProductsByAdmin,
  createProductByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  // Contacts
  getAllInquiries,
  deleteInquiry
};
