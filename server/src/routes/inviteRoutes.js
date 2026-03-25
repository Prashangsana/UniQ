const express = require('express');
const router = express.Router();
// Real Controllers
const { inviteUser, getMyInvites, acceptInvite, rejectInvite, leaveGroup } = require('../controllers/inviteController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/invites/my', getMyInvites);

router.post('/groups/:groupId/invite', inviteUser);
router.post('/invites/:inviteId/accept', acceptInvite);
router.post('/invites/:inviteId/reject', rejectInvite);
router.post('/groups/:groupId/leave', leaveGroup);

module.exports = router;