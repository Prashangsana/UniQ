const express = require('express');
const passport = require('passport');
const { oauthLogin, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false
  })
);

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: FRONTEND_URL,
    session: false
  }),
  oauthLogin
);

router.get('/me', protect, (req, res) => {
  res.status(200).json({ success: true, user: req.user });
});

router.get('/logout', logout);

module.exports = router;