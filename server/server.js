require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./src/config/db');

// Connect to MongoDB
connectDB();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(session({
  secret: process.env.SESSION_SECRET || 'super_secret_key_uniq',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', 
    httpOnly: true,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', 
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(passport.initialize());
app.use(passport.session());
require('./src/config/passport')(passport);

// Import Routes
const authRoutes = require('./src/routes/authRoutes'); 
const societyRoutes = require('./src/routes/societyRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');

// Mount Core Routes
app.use('/auth', authRoutes); 
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/modules', moduleRoutes);

// Mount Grouping & Lecturer APIs
app.use('/api', groupRoutes);
app.use('/api', require('./src/routes/requestRoutes'));
app.use('/api', require('./src/routes/inviteRoutes'));
app.use('/api/lecturer', require('./src/routes/lecturerRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));