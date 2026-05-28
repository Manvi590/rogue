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

// @desc    Checkout cart and create order
// @route   POST /api/shop/checkout
// @access  Public
const checkout = async (req, res) => {
  const { customerName, customerEmail, shippingAddress, items, subtotal, discount, total, userId, couponCode } = req.body;

  if (!customerName || !customerEmail || !items || items.length === 0) {
    return res.status(400).json({ message: 'Customer details and cart items are required' });
  }

  try {
    // 1. Create order in 'orders' table
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: userId || null,
          customer_name: customerName,
          customer_email: customerEmail,
          shipping_address: shippingAddress || 'Digital Delivery',
          subtotal: parseFloat(subtotal) || 0.00,
          discount: parseFloat(discount) || 0.00,
          discount_amount: parseFloat(discount) || 0.00,
          coupon_code: couponCode || null,
          total: parseFloat(total) || 0.00,
          shipping_status: 'pending',
          payment_status: 'paid'
        }
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    // 1b. Increment coupon redemptions count if coupon was used
    if (couponCode) {
      try {
        const { data: coupon } = await supabase
          .from('coupons')
          .select('redemptions_count')
          .eq('code', couponCode.trim().toUpperCase())
          .maybeSingle();
        
        if (coupon) {
          await supabase
            .from('coupons')
            .update({
              redemptions_count: (coupon.redemptions_count || 0) + 1,
              updated_at: new Date()
            })
            .eq('code', couponCode.trim().toUpperCase());
        }
      } catch (couponIncErr) {
        console.error('Error incrementing coupon redemptions:', couponIncErr);
        // Do not block checkout if coupon increment fails
      }
    }

    // 2. Create order items and adjust stock levels
    const orderItemsToInsert = [];
    
    for (const item of items) {
      orderItemsToInsert.push({
        order_id: order.id,
        product_id: item.id || null,
        product_name: item.title || item.name,
        price: parseFloat(item.price) || 0.00,
        quantity: parseInt(item.qty) || 1,
        size: item.size || null,
        color: item.color || null
      });

      // Deduct stock if product ID exists
      if (item.id && String(item.id).length > 8) {
        const { data: product, error: fetchError } = await supabase
          .from('products')
          .select('*')
          .eq('id', item.id)
          .single();

        if (product && !fetchError) {
          let updatedStockCount = Math.max(0, (product.stock_count || 0) - (parseInt(item.qty) || 1));
          let updatedSizes = product.sizes || [];

          if (item.size && Array.isArray(updatedSizes)) {
            updatedSizes = updatedSizes.map(szObj => {
              if (String(szObj.size).toLowerCase() === String(item.size).toLowerCase()) {
                const currentStock = szObj.stock || szObj.stockCount || 0;
                return {
                  ...szObj,
                  stock: Math.max(0, currentStock - (parseInt(item.qty) || 1))
                };
              }
              return szObj;
            });
          }

          await supabase
            .from('products')
            .update({
              stock_count: updatedStockCount,
              sizes: updatedSizes,
              updated_at: new Date()
            })
            .eq('id', item.id);
        }
      }
    }

    // Insert all items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) throw itemsError;

    res.status(201).json({
      message: 'Order placed successfully!',
      orderId: order.id,
      order
    });

  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: error.message || 'Server error during checkout' });
  }
};

module.exports = {
  getProducts,
  getProductById,
  checkout,
};

