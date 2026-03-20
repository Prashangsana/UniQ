const mockStudents = require('../data/mockStudents.json');
const mockLecturers = require('../data/mockLecturers.json');

/**
 * TEMPORARY MOCK AUTH MIDDLEWARE
 * Use this until the real JWT authentication is ready.
 */
exports.protect = (req, res, next) => {
  // 1. Identify if the frontend is hitting a /lecturer route
  const isLecturerAction = req.originalUrl.includes('/lecturer') && !req.originalUrl.includes('submit-finalisation');

  // 2. Assign the correct user from your JSON files
  const userObj = isLecturerAction ? mockLecturers[0] : mockStudents[0];

  // 3. Map _id to id so controllers don't crash looking for undefined
  req.user = {
    id: userObj._id,
    _id: userObj._id,
    name: userObj.name,
    email: userObj.email,
    role: userObj.role
  };

  // Helpful console log so you can see the magic happening in your terminal
  console.log(`[Mock Auth] User: ${req.user.name} (${req.user.role}) -> Path: ${req.originalUrl}`);

  next();
};