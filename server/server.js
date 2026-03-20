require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db');

connectDB();

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true, // This is crucial for cookies to work across domains!
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(passport.initialize());
require('./src/config/passport')(passport);

// Routes
const authRoutes = require('./src/routes/authRoutes');
const societyRoutes = require('./src/routes/societyRoutes');
const eventRoutes = require('./src/routes/eventRoutes');

app.use('/auth', authRoutes);
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));