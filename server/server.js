require('dotenv').config();
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

// Import new files
const authRoutes = require('./routes/auth'); // Import routes
require('./config/passport')(passport);      // Import passport config

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

// Trust Proxy (Keep this for Render/Heroku)
app.set('trust proxy', 1);

// Middleware
app.use(cors({
    origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(session({
    secret: process.env.SESSION_SECRET, //
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000 
    } 
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// --- USE ROUTES ---
// This mounts all auth routes under '/auth'
// So '/google' in auth.js becomes '/auth/google' automatically
app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));