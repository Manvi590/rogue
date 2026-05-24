const express = require('express');
const router = express.Router();
const { 
  purchaseTicket, 
  verifyTicket, 
  getTicketDetails,
  revokeTicket,
  grantFreeAccess
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/verify/:eventId', protect, verifyTicket);

// Private routes (logged in users)
router.post('/', protect, purchaseTicket);
router.get('/:ticketId', protect, getTicketDetails);

// Admin routes
router.put('/:ticketId/revoke', protect, revokeTicket);
router.post('/grant', protect, grantFreeAccess);

module.exports = router;
