const express = require('express');
const passport = require('passport');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Start Login
router.get('/google',
  passport.authenticate('google', { 
      scope: ['profile', 'email'],
      prompt: 'select_account'
  })
);

// Google Callback
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: FRONTEND_URL }),
  (req, res) => {
    res.redirect(FRONTEND_URL);
  }
);

// Check Session
router.get('/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

// Logout
router.get('/logout', (req, res) => {
    req.logout(() => {
        res.clearCookie('connect.sid'); 
        res.redirect(FRONTEND_URL);
    });
});

module.exports = router;