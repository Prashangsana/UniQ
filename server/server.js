require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Merged: Mongoose for database connection
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');

const authRoutes = require('./src/routes/auth'); 
require('./src/config/passport')(passport);
const groupRoutes = require('./src/routes/groupRoutes'); // Merged: Grouping routes

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

// Body Parser Middleware (CRITICAL for Stage 1)
// This allows your Express server to read JSON data sent from the frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Good practice for form-encoded data


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

// Grouping endpoints (e.g., /api/groups, /api/modules/:moduleId/groups)
app.use('/api', groupRoutes);

// Request
app.use('/api', require('./src/routes/requestRoutes'));

// Invite
app.use('/api', require('./src/routes/inviteRoutes'));

// --- DATABASE CONNECTION ---
// mongoose.connect(process.env.MONGO_URI)
// .then(() => console.log('MongoDB Connected successfully'))
// .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));