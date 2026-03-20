const express = require('express');
const passport = require('passport');
const { oauthLogin, logout, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// 1. Start Google Login
router.get('/google',
  passport.authenticate('google', { 
      scope: ['profile', 'email'],
      prompt: 'select_account',
      session: false // IMPORTANT: Telling Passport not to use sessions
  })
);

// 2. Google Callback
router.get('/google/callback', 
  passport.authenticate('google', { 
      failureRedirect: FRONTEND_URL,
      session: false // IMPORTANT: Telling Passport not to use sessions
  }),
  oauthLogin // We pass the request to your new controller!
);

// 3. Check Session (Protected Route)
router.get('/me', protect, getMe);

// 4. Logout
router.get('/logout', logout);

module.exports = router;