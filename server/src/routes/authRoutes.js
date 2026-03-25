const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { oauthLogin, getMe, logout, localEmailLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Local Email Login
router.post('/local', localEmailLogin);

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: `${FRONTEND_URL}/login`,
    session: false 
  }), 
  oauthLogin
);

// Get current user
router.get('/me', protect, getMe);

// Logout
router.post('/logout', logout);

module.exports = router;
