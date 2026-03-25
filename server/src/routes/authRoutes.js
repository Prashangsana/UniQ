const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { googleCallback, getMe, logout, localEmailLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Local Email Login
router.post('/local', localEmailLogin);

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false 
  })
);

// Google Callback
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false,
    failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173'
  }),
  googleCallback
);

router.get('/me', protect, getMe);

// Logout
router.get('/logout', logout);

module.exports = router;