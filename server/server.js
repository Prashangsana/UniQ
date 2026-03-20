require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');

// 1. Connect to MongoDB
connectDB();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

// 2. Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Good practice for form-encoded data
app.use(cookieParser());

app.use(cors({
  origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 3. Initialize Passport 
app.use(passport.initialize());
require('./src/config/passport')(passport);

// 4. Import Routes
const authRoutes = require('./src/routes/authRoutes'); 
const societyRoutes = require('./src/routes/societyRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const groupRoutes = require('./src/routes/groupRoutes'); 

// 5. Mount Core Routes
app.use('/auth', authRoutes); 
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);

// 6. Mount Grouping & Lecturer APIs
app.use('/api', groupRoutes);
app.use('/api', require('./src/routes/requestRoutes'));
app.use('/api', require('./src/routes/inviteRoutes'));
app.use('/api/lecturer', require('./src/routes/lecturerRoutes'));

// 7. Global Error Handler (Must be placed after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));