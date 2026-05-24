const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/dashboardController');
const { protect, admin } = require('../middleware/authMiddleware');

// Dashboard statistics
router.get('/dashboard', protect, admin, getDashboardStats);

// User management routes
router.get('/users/list/all', protect, admin, getAllUsers);
router.post('/users', protect, admin, createUser);
router.put('/users/:id', protect, admin, updateUser);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/suspend', protect, admin, suspendUser);
router.put('/users/:id/ban', protect, admin, banUser);
router.put('/users/:id/unsuspend', protect, admin, unsuspendUser);
router.put('/users/:id/reset-password', protect, admin, resetUserPassword);
router.get('/users/:id/activity', protect, admin, getUserActivity);

module.exports = router;
