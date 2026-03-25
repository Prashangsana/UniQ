const express = require('express');
const router = express.Router();

// REAL MONGOOSE CONTROLLER
const { createGroup, getModuleGroups, getGroupDetails, getMyAllGroups } = require('../controllers/groupController');

const { protect } = require('../middleware/authMiddleware');

// Apply the authentication to all routes below
router.use(protect);

// 1. Static Routes (Must go first!)
router.post('/groups', createGroup);
router.get('/groups/my-groups', getMyAllGroups);

// 2. Module Routes
router.get('/modules/:moduleId/groups', getModuleGroups);

// 3. Dynamic Routes (Must go last!)
router.get('/groups/:groupId', getGroupDetails);

module.exports = router;