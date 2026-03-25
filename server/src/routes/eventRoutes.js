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
<<<<<<<<< Temporary merge branch 1
  getNotifications
} = require('../controllers/eventController');


/* ================= STAGE 4 ROUTES ================= */

=========
  getNotifications,
  // Your Leader CRUD
  createEvent,
  getLeaderEvents,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

/* ================= STAGE 4 ROUTES (Student) ================= */
>>>>>>>>> Temporary merge branch 2
router.get("/main", getMainEvent);
router.get("/latest", getLatestEvents);
router.get("/top-week", getTopEvents);
router.get("/", getAllEvents); // Admin/Leader view of all events

<<<<<<<<< Temporary merge branch 1

/* ================= NOTIFICATIONS ================= */

router.get("/notifications", getNotifications);


/* ================= SOCIETY EVENTS ================= */

router.get('/society/:societyId', getSocietyEvents);


/* ================= MY EVENTS ================= */

router.get('/my', getMyEvents);


/* ================= ADD EVENT ================= */

router.post('/:id/add', addEventToMyEvents);


/* ================= REMOVE EVENT ================= */

router.delete('/:id/remove', removeEventFromMyEvents);


/* ================= EVENT DETAILS ================= */

router.get('/:id', getEventDetails);


module.exports = router;
=========
/* ================= NOTIFICATIONS (Student) ================= */
router.get("/notifications", getNotifications);

/* ================= SOCIETY EVENTS (Student) ================= */
router.get('/society/:societyId', getSocietyEvents);

/* ================= MY EVENTS (Student) ================= */
router.get('/my', getMyEvents);

/* ================= ADD EVENT (Student) ================= */
router.post('/:id/add', addEventToMyEvents);

/* ================= REMOVE EVENT (Student) ================= */
router.delete('/:id/remove', removeEventFromMyEvents);

/* ================= EVENT DETAILS (Student) ================= */
router.get('/:id', getEventDetails);

/* ================= LEADER CRUD (Your Part) ================= */
// You can keep these protected by your existing logic or Passport's req.isAuthenticated()
const protect = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ success: false, message: "Not authorized" });
};

router.route('/')
  .post(protect, createEvent)
  .get(protect, getLeaderEvents);

router.route('/:id')
  .put(protect, updateEvent)
  .delete(protect, deleteEvent);

module.exports = router;
>>>>>>>>> Temporary merge branch 2
