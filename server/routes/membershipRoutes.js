const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware').protect;
const {
  getTierConfigs,
  getAllMemberships,
  getUserMembership,
  createMembership,
  updateMembership,
  changeMembershipTier,
  renewMembership,
  cancelMembership,
  getMembershipStats,
  getPaymentHistory
} = require('../controllers/membershipController');

// Public routes
router.get('/tiers', getTierConfigs);

// Protected routes
router.get('/stats/overview', protect, getMembershipStats);
router.get('/', protect, getAllMemberships);
router.get('/user/:userId', protect, getUserMembership);
router.post('/', protect, createMembership);
router.put('/:id', protect, updateMembership);
router.put('/:id/change-tier', protect, changeMembershipTier);
router.put('/:id/renew', protect, renewMembership);
router.put('/:id/cancel', protect, cancelMembership);
router.get('/:id/payments', protect, getPaymentHistory);

module.exports = router;
