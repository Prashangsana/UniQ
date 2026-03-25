const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  let token;

  console.log("\n=== AUTH MIDDLEWARE ===");
  console.log("Route:", req.method, req.originalUrl);
  
  // Check for token in cookies (both regular and signed)
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
    console.log("✓ Token found in cookies");
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    console.log("✓ Token found in Authorization header");
  }
  
  if (!token) {
    console.log("✗ NO TOKEN FOUND!");
    console.log("================\n");
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    console.log("Verifying token with JWT_SECRET...");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✓ Token verified for user:", decoded.id);

    // Attach user to request object
    req.user = await User.findById(decoded.id).select('-password');
    
    if (!req.user) {
      console.log("✗ User not found in database");
      console.log("================\n");
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    
    console.log("✓ User loaded:", req.user.email);
    console.log("================\n");
    next();
  } catch (err) {
    console.log("✗ Token verification FAILED:", err.message);
    console.log("================\n");
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};
