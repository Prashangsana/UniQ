const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { googleCallback, getMe, logout, localEmailLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

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
    failureRedirect: FRONTEND_URL,
      session: false 
  }),
  googleCallback
);

router.get('/me', protect, getMe);

// Logout
router.get('/logout', logout);

module.exports = router;