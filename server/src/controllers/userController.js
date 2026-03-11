// src/controllers/userController.js
const mockUser = require("../mockData/userMock"); // This is a reference to the object

// GET user profile
exports.getUserProfile = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: mockUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//  ADDED: GET public profile by ID 
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params; // Get ID from the URL 

    // Since we only have one mock user, we check if the ID matches
    if (id === mockUser._id) {
      res.status(200).json({
        success: true,
        data: mockUser
      });
    } else {
      // If the ID doesn't match our mock user
      res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
exports.updateUserProfile = async (req, res) => {
  try {
    // 1. Log the incoming data to see if it's reaching the server
    console.log("Updating mock data with:", req.body);

    // 2. This line updates the actual object in the server's memory
    // It copies everything from req.body INTO mockUser
    Object.assign(mockUser, req.body); 

    // 3. Send back the updated object
    res.status(200).json({
      success: true,
      data: mockUser 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};