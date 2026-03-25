const express = require('express');
const router = express.Router();

const {
    getOpenModules,
    createGroup,
    getModuleGroups,
    getGroupDetails,
    getAvailableStudents,
    getMyGroup,
    getMyAllGroups,
    leaveGroup,
    updateGroup,
    updateDeadlines, 
    getAllMyDeadlines
} = require('../controllers/groupController');

const { protect } = require('../middleware/authMiddleware');

// Apply the mock authentication to all routes below
router.use(protect);

// 1. Static Routes (Must go first!)
router.get('/modules/open', getOpenModules);
router.post('/groups', createGroup);
router.get('/my', getMyAllGroups);
router.get('/my-deadlines', getAllMyDeadlines);

// 2. Module Routes
router.get('/modules/:moduleId/groups', getModuleGroups);
router.get('/modules/:moduleId/available-students', getAvailableStudents);
router.get('/modules/:moduleId/my-group', getMyGroup);

// 3. Dynamic Routes (Must go last!)
router.get('/groups/:groupId', getGroupDetails);
router.post('/groups/:groupId/leave', leaveGroup);
router.put('/groups/:groupId/update', updateGroup);
router.put('/groups/:groupId/deadlines', updateDeadlines);

module.exports = router;