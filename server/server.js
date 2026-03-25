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
const COOKIE_SECRET = process.env.SESSION_SECRET || 'uniQ_secure_session_key_999';

app.set('trust proxy', 1);

// Middleware
app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
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
<<<<<<<<< Temporary merge branch 1

require('./src/config/passport')(passport);

const authRoutes = require('./src/routes/authRoutes'); 
=========
require('./src/config/passport')(passport);

// Routes
const authRoutes = require('./src/routes/authRoutes');
>>>>>>>>> Temporary merge branch 2
const societyRoutes = require('./src/routes/societyRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const mentoringRoutes = require('./src/routes/mentoringRoutes');
const groupRoutes = require('./src/routes/groupRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');

// Mount Core Routes
app.use('/auth', authRoutes); 
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);
<<<<<<<<< Temporary merge branch 1
=========

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));