const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const { googleCallback, getMe, logout } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
// Assuming express, passport, and jwt are required at the top of your file

const router = express.Router();

// Google OAuth
// Kept 'select_account' from main so users don't get auto-logged into the wrong account
router.get('/google',
  passport.authenticate('google', { 
    scope: ['profile', 'email'],
    prompt: 'select_account',
    session: false 
  })
);

// Google Callback
// Merged your localhost fallback (HEAD) with the proper /login route (main)
router.get('/google/callback', 
  passport.authenticate('google', { 
    session: false, 
    failureRedirect: process.env.FRONTEND_URL ? `${process.env.FRONTEND_URL}/login` : 'http://localhost:5173/login'
  }),
  googleCallback
);

// Authentication check for frontend (App.tsx)
// Upgraded to use the clean middleware from main. 
router.get('/me', protect, getMe);

// Logout
// Switched to GET (from main) because standard HTML <a> tags in React make GET requests
router.get('/logout', logout);

module.exports = router;