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
  origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(passport.initialize());

require('./src/config/passport')(passport);

const authRoutes = require('./src/routes/authRoutes');

app.use('/auth', authRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));