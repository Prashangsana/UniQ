 //src/controllers/userController.js
const mockUsers = require("../mockData/mockUsers"); // This is a reference to the object
const User =require ("../models/user");

// GET user profile
exports.getUserProfile = async (req, res) => {
  try {
    // 2. Try to find the user you just added to Atlas
    // We search by email or just grab the first one for testing
    let user = await User.findOne().lean();
    // 3. THE SAFETY NET: If DB is empty, use Mock Alex
  if (!user) {
      console.warn("⚠️ Database is empty! Showing Mock Data instead.");
      user = mockUsers[0]; 
    }
    
    res.status(200).json({
      success: true,
      data:user 
    });
  } catch (error) {
      console.warn("⚠️ Database is empty! Showing Mock Data instead.");
      res.status(200).json({
      success: true,
      data: mockUsers[0] // Still shows Alex so the UI doesn't break!
    });
    
    }
    
  
};

// GET public profile by ID (Searching the array)
exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;
    // FIND the user in the array that matches the ID
    let user = await User.findById(id).lean();

    if (!user) {
      user = mockUsers.find((u) => u._id === id);
    }    

    if (user) {
      res.status(200).json({
        success: true,
        data: user
      });
    } else {
      res.status(404).json({ success: false, message: " User not found" });
    }
  } catch (error) {
    const fallback = mockUsers.find((u) => u._id === req.params.id);
    res.status(200).json({ success: true, data: fallback || mockUsers[0] });
  }
  
};
exports.updateUserProfile = async (req, res) => {
  try {
    // 1. Log the incoming data to see if it's reaching the server
    console.log("Saving changes for:", req.body.name);

    // 2. This line updates the actual object in the server's memory
    // It copies everything from req.body INTO mockUser

    const dbUser = await User.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true,
    });
    Object.assign(mockUsers[0], req.body); 

    // 3. Send back the updated object
    res.status(200).json({
      success: true,
      message: dbUser ? "Saved to Atlas!" : "Saved to Mock Memory!",
      data: dbUser || mockUsers[0], 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
