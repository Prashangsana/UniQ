const express = require('express');
const router = express.Router();

// REAL CONTROLLER (Commented out)
// const { createRequest, getGroupRequests, approveRequest, rejectRequest } = require('../controllers/requestController');

// MOCK CONTROLLER
const { createRequest, getGroupRequests, approveRequest, rejectRequest } = require('../controllers/mockRequestController');

const { protect } = require('../middleware/mockAuthMiddleware');

router.use(protect);

router.post('/groups/:groupId/request', createRequest);
router.get('/groups/:groupId/requests', getGroupRequests);
router.post('/requests/:requestId/approve', approveRequest);
router.post('/requests/:requestId/reject', rejectRequest);

module.exports = router;