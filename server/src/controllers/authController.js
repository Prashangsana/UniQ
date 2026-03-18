const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate JWT and send it in a cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '30d' // Token valid for 30 days
  });

  const options = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true, // Prevents XSS attacks
    secure: process.env.NODE_ENV === 'production', 
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  };

  // Set the cookie, then redirect the user back to your React frontend!
  const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.status(statusCode).cookie('token', token, options).redirect(FRONTEND_URL);
};

// OAuth Login/Callback Logic
exports.oauthLogin = async (req, res) => {
  try {
    // Data comes from passport.js
    const { email, name, firstName, lastName, providerId, provider, photo } = req.user; 

    // 1. Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // If user exists, update their last login and missing info
      user.lastLogin = Date.now();
      if (!user.providerId) {
        user.providerId = providerId;
        user.authProvider = provider;
      }
      if (!user.photo) user.photo = photo;
      await user.save();
    } else {
      // 2. If new user, figure out their role using your regex logic
      let role = 'lecturer'; 
      if (/\.\d{8,}/.test(email)) {
          role = 'student';
      }

      // 3. Create a new user in MongoDB
      user = await User.create({
        name,
        firstName,
        lastName,
        email,
        role,
        authProvider: provider,
        providerId,
        photo,
        lastLogin: Date.now()
      });
    }

    // 4. Send the JWT in an HttpOnly cookie
    sendTokenResponse(user, 200, res);

  } catch (error) {
    console.error("Auth Error:", error);
    res.status(500).json({ success: false, message: 'OAuth login failed' });
  }
};

// Logout Logic
exports.logout = (req, res) => {
    // Clear the cookie by setting it to a past date/empty value
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
};