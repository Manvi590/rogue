const express = require('express');
const router = express.Router();
const recordExploreController = require('../controllers/recordExploreController');
const { protect } = require('../middleware/authMiddleware');

// Public routes for exploring records
router.get('/explore/homepage-sections', recordExploreController.getHomepageSections);
router.get('/explore/new', recordExploreController.getNewRecords);
router.get('/explore/featured', recordExploreController.getFeaturedRecords);
router.get('/explore/viewed', recordExploreController.getMostViewedRecords);
router.get('/explore/ranked', recordExploreController.getTopRankedRecords);
router.get('/explore/category/:categoryId', recordExploreController.getRecordsByCategory);
router.get('/explore/local', recordExploreController.getLocalRecords);
router.get('/explore/all', recordExploreController.getAllRecords);

// Admin routes for record management
router.put('/admin/featured/:recordId', protect, recordExploreController.toggleFeaturedRecord);
router.put('/admin/visibility/:recordId', protect, recordExploreController.updateRecordVisibility);
router.put('/admin/details/:recordId', protect, recordExploreController.updateRecordDetails);
router.put('/admin/video/:recordId', protect, recordExploreController.updateRecordVideo);
router.put('/admin/status/:recordId', protect, recordExploreController.changeRecordStatus);

module.exports = router;
