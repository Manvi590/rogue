const express = require('express');
const { getGlobalRankings, getLocalRankings, getCategoryRankings, getUserRankingDetails, addUserPoints, adjustUserPoints, recalculateAllRankings, getPointsRules, updatePointsRule } = require('../controllers/rankingController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/global', getGlobalRankings);
router.get('/local', getLocalRankings);
router.get('/category/:category_id', getCategoryRankings);
router.get('/user/:user_id', getUserRankingDetails);
router.get('/rules', getPointsRules);

// Protected routes
router.post('/points', protect, addUserPoints);
router.post('/adjust-points', protect, adjustUserPoints);
router.put('/rules/:rule_name', protect, updatePointsRule);
router.post('/recalculate', protect, recalculateAllRankings);

module.exports = router;
