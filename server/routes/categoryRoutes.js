const express = require('express');
const router = express.Router();
const protect = require('../middleware/authMiddleware').protect;
const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  seedDefaultCategories
} = require('../controllers/categoryController');

router.get('/', getAllCategories);
router.get('/seed', protect, seedDefaultCategories);
router.get('/:id', getCategoryById);
router.post('/', protect, createCategory);
router.put('/:id', protect, updateCategory);
router.delete('/:id', protect, deleteCategory);

module.exports = router;
