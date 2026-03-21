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
const COOKIE_SECRET = process.env.SESSION_SECRET || 'uniQ_secure_session_key_999';

app.set('trust proxy', 1);

app.use(express.json());
app.use(cookieParser(COOKIE_SECRET)); // Added secret to cookieParser

app.use(cors({
  origin: [FRONTEND_URL, 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
}));

app.use(passport.initialize());
require('./src/config/passport')(passport);

// DEBUG ENDPOINT - Check if token is in cookies
app.get('/debug/cookies', (req, res) => {
  console.log("=== COOKIES DEBUG ===");
  console.log("Cookies received:", req.cookies);
  console.log("Signed cookies:", req.signedCookies);
  console.log("Headers:", req.headers);
  res.json({
    message: "Check server console for detailed cookie info",
    cookies: req.cookies,
    signedCookies: req.signedCookies,
    cookieHeader: req.headers.cookie
  });
});

// DEBUG ENDPOINT - Check auth status
app.get('/debug/auth', (req, res) => {
  console.log("\n=== AUTH DEBUG ===");
  console.log("Cookies:", req.cookies);
  console.log("Authorization Header:", req.headers.authorization);
  const hasToken = req.cookies?.token || req.signedCookies?.token || req.headers.authorization;
  res.json({
    message: hasToken ? "Token found!" : "No token found",
    hasToken: !!hasToken,
    tokenInCookies: !!req.cookies?.token,
    tokenInSignedCookies: !!req.signedCookies?.token,
    cookieHeader: req.headers.cookie
  });
});

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