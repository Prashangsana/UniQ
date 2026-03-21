const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const authController = require('../controllers/authController');

const router = express.Router();

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: process.env.FRONTEND_URL || 'http://localhost:5173' }),
  authController.oauthLogin
);

// Authentication check for frontend (App.tsx)
router.get('/me', (req, res) => {
  const token = req.cookies?.token;
  if (!token) return res.json({ authenticated: false });

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    return res.json({ authenticated: true });
  } catch (err) {
    return res.json({ authenticated: false });
  }
});

router.post('/logout', authController.logout);

module.exports = router;