require('dotenv').config();
const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
const cors = require('cors');

const app = express();

// Configuration
// Reads "iit.ac.lk" from .env file
const ALLOWED_DOMAIN = process.env.ORG_DOMAIN; 

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using https later
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    const userEmail = profile.emails[0].value;
    const userDomain = userEmail.split('@')[1];

    // Security Check (Is this user from the allowed university)
    if (userDomain !== ALLOWED_DOMAIN) {
        console.log(`Blocked login attempt from: ${userEmail}`);
        return done(null, false, { message: 'Unauthorized University Domain' });
    }

    // Role Assignment
    let role = 'lecturer'; // Default to lecturer
    
    const isStudentPattern = /\.\d{8,}/.test(userEmail);

    if (isStudentPattern) {
        role = 'student';
    }

    // Create the user object to save in session
    const user = {
        googleId: profile.id,
        email: userEmail,
        name: profile.displayName,
        role: role,
        photo: profile.photos ? profile.photos[0].value : null
    };

    console.log(`User Logged In: ${user.email} as ${user.role}`);
    return done(null, user);
  }
));

// Session Handling
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
  passport.authenticate('google', { failureRedirect: 'http://localhost:5173/' }),
  function(req, res) {
    // Login Success Redirect to the frontend dashboard
    res.redirect('http://localhost:5173/');
  }
);

// Check Session Frontend calls this
app.get('/auth/me', (req, res) => {
    if (req.isAuthenticated()) {
        res.json({ authenticated: true, user: req.user });
    } else {
        res.status(401).json({ authenticated: false });
    }
});

// Logout
app.get('/auth/logout', (req, res) => {
    req.logout(() => {
        res.redirect('http://localhost:5173/');
    });
});

app.listen(5000, () => console.log(`Server running for domain: ${ALLOWED_DOMAIN}`));