const express = require('express');
const router = express.Router();
const { 
  purchaseTicket, 
  verifyTicket, 
  getTicketDetails,
  revokeTicket,
  grantFreeAccess,
  scanAndVerifyTicket,
  getAllTicketsAdmin,
  resetTicketScan
} = require('../controllers/ticketController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/verify/:eventId', protect, verifyTicket);

// Private routes (logged in users)
router.post('/', protect, purchaseTicket);
router.get('/:ticketId', protect, getTicketDetails);

// Admin routes
router.put('/:ticketId/revoke', protect, admin, revokeTicket);
router.post('/grant', protect, admin, grantFreeAccess);
router.post('/scan', protect, admin, scanAndVerifyTicket);
router.get('/admin/list', protect, admin, getAllTicketsAdmin);
router.put('/:ticketId/reset', protect, admin, resetTicketScan);

module.exports = router;
