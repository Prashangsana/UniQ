  const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.protect = async (req, res, next) => {
  let token = req.cookies;

  // Check for token in cookies first
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } 
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    // Verify custom JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object (so your teammates can use req.user.id)
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
  }
};