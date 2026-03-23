const express = require('express');
const router = express.Router();
// Mock Controllers
const { inviteUser, getMyInvites, acceptInvite, rejectInvite } = require('../controllers/inviteController');
const { protect } = require('../middleware/authMiddleware');

// Real Controllers (Commented out for later)
// const { inviteUser, getMyInvites, acceptInvite, rejectInvite, leaveGroup } = require('../controllers/inviteController');

router.use(protect);

router.get('/my', getMyInvites);

router.post('/groups/:groupId/invite', inviteUser);
router.post('/invites/:inviteId/accept', acceptInvite);
router.post('/invites/:inviteId/reject', rejectInvite);

module.exports = router;