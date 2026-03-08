// src/controllers/userController.js
const mockUser = require("../mockData/userMock"); // This is a reference to the object

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