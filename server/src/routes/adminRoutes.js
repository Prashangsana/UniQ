const express = require('express');
const router = express.Router();
const { getUsersByRole } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');

router.get('/users', protect, getUsersByRole);

module.exports = router;