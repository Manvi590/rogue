const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  createRecordByAdmin,
  updateRecordByAdmin,
  deleteRecordByAdmin,
  getAllEventsByAdmin,
  createEventByAdmin,
  updateEventByAdmin,
  deleteEventByAdmin,
  getAllProductsByAdmin,
  createProductByAdmin,
  updateProductByAdmin,
  deleteProductByAdmin,
  getAllInquiries,
  deleteInquiry
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// Lock down all endpoints underneath protection check
router.use(protect);
router.use(admin);

// 👥 User Operations
router.get('/users', getAllUsers);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUserByAdmin);

// ⚔️ Records Operations
router.post('/records', createRecordByAdmin);
router.put('/records/:id', updateRecordByAdmin);
router.delete('/records/:id', deleteRecordByAdmin);

// 📅 Events Operations
router.get('/events', getAllEventsByAdmin);
router.post('/events', createEventByAdmin);
router.put('/events/:id', updateEventByAdmin);
router.delete('/events/:id', deleteEventByAdmin);

// 🛍️ Shop Catalog Operations
router.get('/products', getAllProductsByAdmin);
router.post('/products', createProductByAdmin);
router.put('/products/:id', updateProductByAdmin);
router.delete('/products/:id', deleteProductByAdmin);

// ✉️ Support Ticket Operations
router.get('/contacts', getAllInquiries);
router.delete('/contacts/:id', deleteInquiry);

module.exports = router;
