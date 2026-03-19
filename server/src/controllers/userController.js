 //src/controllers/userController.js
const mockUsers = require("../mockData/mockUsers"); // This is a reference to the object
//const User =require ("../models/user");

// GET user profile
exports.getUserProfile = async (req, res) => {
  try {

    const user = mockUsers[0];

    //const user = await User.findOne(); // For now, this gets the first user in the DB

    
    res.status(200).json({
      success: true,
      data:user
      
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET public profile by ID (Searching the array)
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // FIND the user in the array that matches the ID
    const user = mockUsers.find(u => u._id === id);

    //const user = await User.findById(id);

    if (user) {
      res.status(200).json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, message: " Mock User not found" });
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
    Object.assign(mockUsers[0], req.body); 

    // 3. Send back the updated object
    res.status(200).json({
      success: true,
      data: mockUsers[0] 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
