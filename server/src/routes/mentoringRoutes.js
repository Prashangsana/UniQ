const express = require('express');
const router = express.Router();
const mentoringController = require('../controllers/mentoringController');

router.get('/mentors', mentoringController.getMentors);
router.get('/search', mentoringController.searchMentors); 
router.get('/appointments', mentoringController.getAppointments); 
router.post('/book', mentoringController.bookSession); 
router.patch('/status/:id', mentoringController.updateStatus); 
const { protect } = require('../middleware/authMiddleware');
router.post('/register-peer', protect, mentoringController.registerAsPeerMentor);

module.exports = router;