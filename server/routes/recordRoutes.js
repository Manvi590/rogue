const express = require('express');
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  getLeaderboard,
  getMySubmissions,
  getAllSubmissionsForAdmin,
  adjudicateRecord,
  processCheckout,
  toggleRecordFeatured,
} = require('../controllers/recordController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getRecords);
router.get('/leaderboard', getLeaderboard);
router.get('/my-submissions', protect, getMySubmissions);

// Admin Routes (placed before dynamic route :id to prevent parameter hijacking)
router.get('/admin/submissions', protect, admin, getAllSubmissionsForAdmin);
router.put('/admin/adjudicate/:id', protect, admin, adjudicateRecord);
router.put('/:id/featured', protect, admin, toggleRecordFeatured);

router.get('/:id', getRecordById);
router.post('/', protect, createRecord);
router.post('/:id/checkout', protect, processCheckout);

module.exports = router;
