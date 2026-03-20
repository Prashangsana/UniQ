// src/middleware/lecturerMiddleware.js
const Module = require('../models/Module'); // Assuming the admin dev creates this

// Basic check: Is the user a lecturer?
exports.isLecturer = (req, res, next) => {
  if (req.user && req.user.role === 'lecturer') {
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
    const moduleDoc = await Module.findOne({ _id: moduleId }); // Or search by string ID if you aren't using ObjectIds
    
    if (!moduleDoc) {
      return res.status(404).json({ success: false, message: 'Module not found.' });
    }

    // Check if the logged-in lecturer's ID is in the moduleLeaders or moduleTeam array
    const isLeader = moduleDoc.moduleLeaders.includes(req.user.id);
    const isTeam = moduleDoc.moduleTeam && moduleDoc.moduleTeam.includes(req.user.id);

    if (isLeader || isTeam) {
      next(); // They are authorized!
    } else {
      res.status(403).json({ success: false, message: 'Access denied. You are not a leader for this module.' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error checking module authorization.' });
  }
};