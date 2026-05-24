const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const controller = require('../controllers/recordMetaController');

router.get('/:recordId', protect, admin, controller.getMetaForRecord);
router.post('/:recordId', protect, admin, controller.upsertMeta);
router.post('/:recordId/generate-tracking', protect, admin, controller.generateTracking);

module.exports = router;
