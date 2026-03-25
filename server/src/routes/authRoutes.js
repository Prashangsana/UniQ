const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { googleCallback, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/google',
  passport.authenticate('google', { 
      scope: ['profile', 'email'],
      prompt: 'select_account',
      session: false // IMPORTANT: Telling Passport not to use sessions
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: `${process.env.FRONTEND_URL}/login` 
  }),
  oauthLogin // We pass the request to your new controller!
);

// 3. Check Session (Protected Route)
router.get('/me', protect, getMe);

router.get('/logout', logout);

module.exports = router;