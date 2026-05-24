const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const controller = require('../controllers/ageGroupController');

router.get('/', protect, admin, controller.getAllAgeGroups);
router.get('/seed', protect, admin, controller.seedDefaultAgeGroups);
router.post('/', protect, admin, controller.createAgeGroup);
router.put('/:id', protect, admin, controller.updateAgeGroup);
router.delete('/:id', protect, admin, controller.deleteAgeGroup);

module.exports = router;
