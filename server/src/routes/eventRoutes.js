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
  getNotifications
} = require('../controllers/eventController');


/* ================= STAGE 4 ROUTES ================= */

router.get("/main", getMainEvent);
router.get("/latest", getLatestEvents);
router.get("/top-week", getTopEvents);


/* ================= NOTIFICATIONS ================= */

router.get("/notifications", protect, getNotifications);


/* ================= SOCIETY EVENTS ================= */

router.get('/society/:societyId', getSocietyEvents);


/* ================= MY EVENTS ================= */

router.get('/my', protect, getMyEvents);


/* ================= ADD EVENT ================= */

router.post('/:id/add', protect, addEventToMyEvents);


/* ================= REMOVE EVENT ================= */

router.delete('/:id/remove', protect, removeEventFromMyEvents);


/* ================= EVENT DETAILS ================= */

router.get('/:id', getEventDetails);


module.exports = router;