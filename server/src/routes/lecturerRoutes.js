const express = require('express');
const router = express.Router();

const { createGroupProject, submitFinalisation, reviewGroup, getMyModules, getLecturerGroups } = require('../controllers/mockLecturerController');
const { protect } = require('../middleware/mockAuthMiddleware');
const { isLecturer } = require('../middleware/mockLecturerMiddleware');

router.use(protect); // All routes require login

// Student submitting their group
router.post('/groups/:groupId/submit-finalisation', submitFinalisation);

// Lecturer routes
router.use(isLecturer); 
router.get('/modules/my-modules', getMyModules);
router.get('/module-groups', getLecturerGroups);
router.post('/modules/:moduleId/group-project', createGroupProject);
router.post('/groups/:groupId/review', reviewGroup);

module.exports = router;