const express = require('express');
const router = express.Router();

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
  getLeaderEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

const protect = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Not authorized" });
};

router.get("/main", getMainEvent);
router.get("/latest", getLatestEvents);
router.get("/top-week", getTopEvents);

router.get("/notifications", getNotifications);

router.get('/society/:societyId', getSocietyEvents);

router.get('/my', getMyEvents);

router.post('/:id/add', addEventToMyEvents);
router.delete('/:id/remove', removeEventFromMyEvents);

router.route('/')
  .post(protect, createEvent)
  .get(protect, getLeaderEvents);

router.route('/:id')
  .get(getEventDetails)
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;