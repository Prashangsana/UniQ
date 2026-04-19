const path = require('path');

// If a variable exists but is an empty string, allow dotenv to populate it from .env.
for (const key of [
  'PORT',
  'BACKEND_URL',
  'FRONTEND_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'ORG_DOMAIN',
  'SESSION_SECRET',
  'MONGO_URI',
  'JWT_SECRET',
  'ADMIN_EMAILS',
]) {
  if (process.env[key] === '') {
    delete process.env[key];
  }
}

require('dotenv').config({ path: path.join(__dirname, '.env'), debug: false, override: false });
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectDB = require('./src/config/db');

connectDB();//connect to MongoDB


const app = express();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

app.set('trust proxy', 1);


// 2. Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS']
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


//import all routes

const authRoutes = require('./src/routes/authRoutes'); 
const societyRoutes = require('./src/routes/societyRoutes');
const eventRoutes = require('./src/routes/eventRoutes');
const userRoutes = require('./src/routes/userRoutes'); 
const groupRoutes = require('./src/routes/groupRoutes');
const mentoringRoutes = require('./src/routes/mentoringRoutes');

const adminRoutes = require('./src/routes/adminRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');

//mount routes

app.use('/auth', authRoutes);
app.use('/api/users', userRoutes);//profile
app.use('/api/societies', societyRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/mentoring', mentoringRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/modules', moduleRoutes);

// 6. Mount Grouping & Lecturer APIs
app.use('/api/groups', groupRoutes);
app.use('/api/requests', require('./src/routes/requestRoutes'));
app.use('/api/invites', require('./src/routes/inviteRoutes'));
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