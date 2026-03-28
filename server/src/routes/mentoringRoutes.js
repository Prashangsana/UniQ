// src/routes/mentoringRoutes.js
const express = require('express');
const router = express.Router();
const mentoringController = require('../controllers/mentoringController');

router.get('/mentors', mentoringController.getMentors);
router.get('/search', mentoringController.searchMentors); // New for Part 4
router.get('/appointments', mentoringController.getAppointments); // Includes Cleanup for Part 3
router.post('/book', mentoringController.bookSession); // Includes Validation for Part 2
router.patch('/status/:id', mentoringController.updateStatus); // Includes Auto-link for Part 1
router.post('/register-peer', mentoringController.registerAsPeerMentor);

module.exports = router;