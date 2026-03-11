const express = require('express');
const router = express.Router();

const { getNotifications } = require("../controllers/eventController");

const {
  getEventDetails,
  getSocietyEvents,
  addEventToMyEvents,
  removeEventFromMyEvents,
  getMyEvents
} = require('../controllers/eventController');

router.get("/notifications", getNotifications);


/*
-----------------------------------------
GET EVENTS BY SOCIETY
-----------------------------------------
*/
router.get('/society/:societyId', getSocietyEvents);


/*
-----------------------------------------
GET MY EVENTS
-----------------------------------------
*/
router.get('/my', getMyEvents);


/*
-----------------------------------------
ADD EVENT TO MY EVENTS
-----------------------------------------
*/
router.post('/:id/add', addEventToMyEvents);


/*
-----------------------------------------
REMOVE EVENT FROM MY EVENTS
-----------------------------------------
*/
router.delete('/:id/remove', removeEventFromMyEvents);


/*
-----------------------------------------
GET EVENT DETAILS
-----------------------------------------
*/
router.get('/:id', getEventDetails);


module.exports = router;