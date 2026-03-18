require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose'); // Merged: Mongoose for database connection
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db'); // Database connection logic

// 1. Connect to MongoDB
// connectDB();
const groupRoutes = require('./src/routes/groupRoutes'); // Merged: Grouping routes

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

// Trust Proxy (Keep this for Render/Heroku deployment)
app.set('trust proxy', 1);

// 2. Middleware
app.use(express.json()); // Essential for parsing JSON requests
app.use(cookieParser()); // Required to read the JWT cookies

app.use(cors({
    origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
    credentials: true, // This is crucial for cookies to work across domains!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.urlencoded({ extended: true })); // Good practice for form-encoded data

// 3. Initialize Passport 
app.use(passport.initialize());
require('./src/config/passport')(passport);

// 4. Routes
const authRoutes = require('./src/routes/authRoutes'); 
const societyRoutes = require('./src/routes/societyRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

app.use('/auth', authRoutes); // Teammate's real auth routes
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);

// Grouping APIs
app.use('/api', groupRoutes);
app.use('/api', require('./src/routes/requestRoutes'));
app.use('/api', require('./src/routes/inviteRoutes'));
app.use('/api', require('./src/routes/lecturerRoutes'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));