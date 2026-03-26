const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
  getEventDetails,
  getSocietyEvents,
  addEventToMyEvents,
  removeEventFromMyEvents,
  getMyEvents,
  getNotifications,
  cleanupNotifications,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents,
  getLeaderEvents
} = require('../controllers/eventController');

// Public routes
router.get('/', getAllEvents);
router.get('/society/:societyId', getSocietyEvents);
router.get('/:id', getEventDetails);

// Protected routes
router.post('/my-events', protect, addEventToMyEvents);
router.delete('/my-events/:eventId', protect, removeEventFromMyEvents);
router.get('/my-events/list', protect, getMyEvents);
router.get('/notifications', protect, getNotifications);
router.delete('/notifications', protect, cleanupNotifications);

// Leader/Admin routes
router.post('/', protect, createEvent);
router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.get('/leader/:leaderId', protect, getLeaderEvents);

module.exports = router;
