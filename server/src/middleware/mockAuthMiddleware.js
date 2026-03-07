const mockUser = require('../data/mockUser.json');

/**
 * TEMPORARY MOCK AUTH MIDDLEWARE
 * Use this until the real JWT authentication is ready.
 */
exports.protect = (req, res, next) => {
  // Simulate what the real auth middleware would do:
  // Attach the user's ID and details to the request object.
  req.user = {
    id: mockUser._id, // Your groupController uses req.user.id
    name: mockUser.name,
    email: mockUser.email,
    role: mockUser.role
  };

  // Just a helpful console log so you know the mock is running
  console.log(`[Mock Auth] Simulating logged-in user: ${req.user.name}`);
  
  next(); // Move to the next function (your controller)
};