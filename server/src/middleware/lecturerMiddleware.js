// src/middleware/lecturerMiddleware.js
const Module = require('../models/Module'); // Assuming the admin dev creates this

// Basic check: Is the user a lecturer?
exports.isLecturer = (req, res, next) => {
  if (req.user && req.user.role === 'lecturer' || req.user.role === 'Lecturer') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Lecturers only.' });
  }
};

// Advanced check: Is this lecturer authorized for this specific module?
exports.isModuleLeader = async (req, res, next) => {
  try {
    // The moduleId can come from params or body depending on the route
    const moduleId = req.params.moduleId || req.body.moduleId;
    
    // Find the module in the database
    const moduleDoc = await Module.findById(moduleId);
    
    if (!moduleDoc) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    // Check if the logged-in lecturer's ID is in the moduleLeaders or moduleTeam array
    const userId = req.user._id.toString();
    const isLeader = moduleDoc.moduleLeaders.some(id => id.toString() === userId);
    const isTeam = moduleDoc.moduleTeam.some(id => id.toString() === userId);

    if (isLeader || isTeam) {
      next(); // They are authorized!
    } else {
      res.status(403).json({ success: false, message: 'Access denied. You are not a leader for this module.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking module authorization.' });
  }
};