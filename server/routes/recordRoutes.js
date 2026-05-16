const express = require('express');
const router = express.Router();
const {
  getRecords,
  getRecordById,
  createRecord,
  getLeaderboard,
} = require('../controllers/recordController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getRecords);
router.get('/leaderboard', getLeaderboard);
router.get('/:id', getRecordById);
router.post('/', protect, createRecord);

module.exports = router;
