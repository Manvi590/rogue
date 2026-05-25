const supabase = require('../config/supabase');

// @desc    Get all products
// @route   GET /api/shop
// @access  Public
const getProducts = async (req, res) => {
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    return res.status(500).json({ message: error.message });
  }
  res.json(products);
};

// @desc    Get single product
// @route   GET /api/shop/:id
// @access  Public
const getProductById = async (req, res) => {
  const { data: product, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (product) {
    res.json(product);
  } else {
    return res.status(404).json({ message: 'Product not found' });
  }
};

module.exports = {
  getProducts,
  getProductById,
};
