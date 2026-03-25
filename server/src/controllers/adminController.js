const User = require('../models/User');

exports.getUsersByRole = async (req, res) => {
  try {
    const { role } = req.query;
    const query = role ? { role } : {};
    
    const users = await User.find(query).select('-password');
    
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Fetch Users Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};