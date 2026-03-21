exports.isLecturer = (req, res, next) => {
  // In a real app, this checks req.user.role and the Module's moduleLeaders array
  if (req.user && req.user.role === 'lecturer') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied. Lecturers only.' });
  }
};