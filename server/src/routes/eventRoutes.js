const express = require('express');
const router = express.Router();

const {
  getEventDetails,
  getSocietyEvents
} = require('../controllers/eventController');


/*
-----------------------------------------
GET EVENT DETAILS
-----------------------------------------
*/
router.get('/:id', getEventDetails);


/*
-----------------------------------------
GET EVENTS BY SOCIETY
-----------------------------------------
*/
router.get('/society/:societyId', getSocietyEvents);


module.exports = router;