require('dotenv').config();
const express = require('express');
const passport = require('passport');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./src/config/db'); // Database connection logic

<<<<<<< HEAD
// 1. Connect to MongoDB
connectDB();
=======
const authRoutes = require('./src/routes/auth');

const societyRoutes = require('./src/routes/societyRoutes');

const eventRoutes = require('./src/routes/eventRoutes');

require('./src/config/passport')(passport);
>>>>>>> d5f08a6b096754ad6c880e9cd64dec9d07701697

const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const PORT = process.env.PORT || 5000;

// Trust Proxy (Keep this for Render/Heroku deployment)
app.set('trust proxy', 1);

<<<<<<< HEAD
// 2. Middleware
app.use(express.json()); // Essential for parsing JSON requests
app.use(cookieParser()); // Required to read the JWT cookies
=======
// Middleware

app.use(express.json());
>>>>>>> d5f08a6b096754ad6c880e9cd64dec9d07701697

app.use(cors({
    origin: [FRONTEND_URL, 'https://uniq.lk', 'https://www.uniq.lk'],
    credentials: true, // This is crucial for cookies to work across domains!
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

// 3. Initialize Passport 
// (Notice: passport.session() and express-session are completely removed)
app.use(passport.initialize());

// Load Passport Configuration
require('./src/config/passport')(passport);

// 4. Routes
// Make sure you rename your old 'auth.js' to 'authRoutes.js' inside the src/routes/ folder!
const authRoutes = require('./src/routes/authRoutes'); 

// Mount auth routes under '/auth'
app.use('/auth', authRoutes);

<<<<<<< HEAD
// 5. Start Server
=======
app.use('/api/societies', societyRoutes);

app.use('/api/events', eventRoutes);

>>>>>>> d5f08a6b096754ad6c880e9cd64dec9d07701697
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));