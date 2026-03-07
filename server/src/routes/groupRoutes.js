const express = require('express');
const router = express.Router();

// COMMENTING OUT THE REAL MONGOOSE CONTROLLER
// const { createGroup, getModuleGroups, getGroupDetails } = require('../controllers/groupController');

// USING THE MOCK CONTROLLER INSTEAD
const { createGroup, getModuleGroups, getGroupDetails } = require('../controllers/mockGroupController');

// COMMENTING OUT THE REAL ONE FOR NOW:
// const { protect } = require('../middleware/authMiddleware');

// USING THE MOCK ONE INSTEAD:
const { protect } = require('../middleware/mockAuthMiddleware');

// Apply the mock authentication to all routes below
router.use(protect);

router.post('/groups', createGroup);
router.get('/modules/:moduleId/groups', getModuleGroups);
router.get('/groups/:groupId', getGroupDetails);

module.exports = router;