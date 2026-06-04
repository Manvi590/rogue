const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const { protect } = require('../middleware/authMiddleware');

// Get stats for a record (optional auth to check if liked)
// We'll use a loose protect middleware or just not fail if token is missing
// Wait, our protect middleware blocks if no token. We can create an optional auth middleware,
// but for simplicity we will just let the frontend get social stats anonymously or logged in.
const optionalProtect = require('../middleware/authMiddleware').protect; // if it requires token, we'll bypass for now or make it flexible.
// Actually, I'll just use a try-catch in the route for optional auth.
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');

const extractUser = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const { data: user } = await supabase.from('users').select('*').eq('id', decoded.id).single();
      if (user) req.user = user;
    } catch (error) {
      console.error('Optional auth failed:', error.message);
    }
  }
  next();
};

router.post('/:recordId/like', protect, socialController.toggleLike);
router.post('/:recordId/view', socialController.incrementView);
router.post('/:recordId/comment', protect, socialController.addComment);
router.get('/:recordId', extractUser, socialController.getSocialStats);

module.exports = router;
