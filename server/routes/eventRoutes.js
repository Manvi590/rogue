const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  toggleEventPaid
} = require('../controllers/eventController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getEvents);
router.get('/:id', getEventById);

// Admin routes
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.put('/:id/toggle-paid', protect, toggleEventPaid);

module.exports = router;
