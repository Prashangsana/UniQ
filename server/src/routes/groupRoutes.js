const express = require('express');
const router = express.Router();

// COMMENTING OUT THE REAL MONGOOSE CONTROLLER
// const { createGroup, getModuleGroups, getGroupDetails } = require('../controllers/groupController');

// USING THE MOCK CONTROLLER INSTEAD
const { getOpenModules, createGroup, getModuleGroups, getGroupDetails, getAvailableStudents, getMyGroup, getMyAllGroups } = require('../controllers/mockGroupController');

// COMMENTING OUT THE REAL ONE FOR NOW:
// const { protect } = require('../middleware/authMiddleware');

// USING THE MOCK ONE INSTEAD:
const { protect } = require('../middleware/mockAuthMiddleware');

// Apply the mock authentication to all routes below
router.use(protect);

// 1. Static Routes (Must go first!)
router.get('/modules/open', getOpenModules);
router.post('/groups', createGroup);
router.get('/groups/my', getMyAllGroups);

// 2. Module Routes
router.get('/modules/:moduleId/groups', getModuleGroups);
router.get('/modules/:moduleId/available-students', getAvailableStudents);
router.get('/modules/:moduleId/my-group', getMyGroup);

// 3. Dynamic Routes (Must go last!)
router.get('/groups/:groupId', getGroupDetails);

module.exports = router;