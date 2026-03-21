const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');

const {
  getMainEvent,
  getLatestEvents,
  getTopEvents,
  getEventDetails,
  getSocietyEvents,
  addEventToMyEvents,
  removeEventFromMyEvents,
  getMyEvents,
  getNotifications,
  createEvent,
  updateEvent,
  deleteEvent,
  getAllEvents
} = require('../controllers/eventController');


/* ================= STAGE 4 ROUTES ================= */

router.get("/main", getMainEvent);
router.get("/latest", getLatestEvents);
router.get("/top-week", getTopEvents);
router.get("/", getAllEvents); // Admin/Leader view of all events


/* ================= NOTIFICATIONS ================= */

router.get("/notifications", protect, getNotifications);


/* ================= SOCIETY EVENTS ================= */

router.get('/society/:societyId', getSocietyEvents);


/* ================= MY EVENTS ================= */

router.get('/my', protect, getMyEvents);


/* ================= ADD/CREATE EVENT ================= */

router.post('/', protect, createEvent); // Create new event
router.post('/:id/add', protect, addEventToMyEvents);


/* ================= REMOVE/UPDATE/DELETE EVENT ================= */

router.put('/:id', protect, updateEvent);
router.delete('/:id', protect, deleteEvent);
router.delete('/:id/remove', protect, removeEventFromMyEvents);


/* ================= EVENT MANAGEMENT ================= */

router.get("/", getAllEvents);
router.post("/", protect, createEvent);
router.put("/:id", protect, updateEvent);
router.delete("/:id", protect, deleteEvent);


/* ================= EVENT DETAILS ================= */

router.get('/:id', getEventDetails);


module.exports = router;