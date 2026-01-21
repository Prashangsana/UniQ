require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');

const app = express();

// Configuration
const ALLOWED_DOMAIN = process.env.ORG_DOMAIN; 
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

// Essential for Render/Heroku behind a proxy
app.set('trust proxy', 1);

app.use(cors({
    origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production', // true on Render, false on localhost
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' required for cross-site
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    } 
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // Dynamic callback URL based on environment
    callbackURL: `${BACKEND_URL}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, done) {
    const userEmail = profile.emails[0].value;
    const userDomain = userEmail.split('@')[1];

    if (userDomain !== ALLOWED_DOMAIN) {
        return done(null, false, { message: 'Unauthorized University Domain' });
    }

    let role = 'lecturer'; 
    if (/\.\d{8,}/.test(userEmail)) {
        role = 'student';
    }

    const user = {
        googleId: profile.id,
        email: userEmail,
        name: profile.displayName,
        role: role,
        photo: profile.photos ? profile.photos[0].value : null
    };

    return done(null, user);
  }
));

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Start Login
app.get('/auth/google',
  passport.authenticate('google', { 
      scope: ['profile', 'email'],
      prompt: 'select_account'
  })
);

// Google Callback
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: FRONTEND_URL }),
  function(req, res) {
    // Successful authentication, redirect to frontend
    res.redirect(FRONTEND_URL);
  }
);

app.get('/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

app.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.clearCookie('connect.sid'); 
        res.redirect(FRONTEND_URL);
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));