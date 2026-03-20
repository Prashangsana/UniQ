const express = require('express');
const router = express.Router();
// Mock Controllers
const { inviteUser, getMyInvites, acceptInvite, rejectInvite, leaveGroup } = require('../controllers/mockInviteController');
const { protect } = require('../middleware/mockAuthMiddleware');

// Real Controllers (Commented out for later)
// const { inviteUser, getMyInvites, acceptInvite, rejectInvite, leaveGroup } = require('../controllers/inviteController');

router.use(protect);

router.get('/invites/my', getMyInvites);

router.post('/groups/:groupId/invite', inviteUser);
router.post('/invites/:inviteId/accept', acceptInvite);
router.post('/invites/:inviteId/reject', rejectInvite);
router.post('/groups/:groupId/leave', leaveGroup);

module.exports = router;