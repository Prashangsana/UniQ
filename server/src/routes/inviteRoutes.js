const express = require('express');
const router = express.Router();

// Real Controllers (Commented out for later)
// const { inviteUser, getMyInvites, acceptInvite, rejectInvite, leaveGroup } = require('../controllers/inviteController');

// Mock Controllers
const { inviteUser, getMyInvites, acceptInvite, rejectInvite, leaveGroup } = require('../controllers/mockInviteController');
const { protect } = require('../middleware/mockAuthMiddleware');

router.use(protect);

router.post('/groups/:groupId/invite', inviteUser);
router.get('/invites/my', getMyInvites);
router.post('/invites/:inviteId/accept', acceptInvite);
router.post('/invites/:inviteId/reject', rejectInvite);
router.post('/groups/:groupId/leave', leaveGroup);

module.exports = router;