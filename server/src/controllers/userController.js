const mockUsers = require("../mockData/mockUsers");
const User = require("../models/User");

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).lean();
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      data: user 
    });
  } catch (error) {
    console.error("Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.getPublicProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select("name firstName lastName photo bio skills course group profileImage")
      .lean();
      
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "This user does not exist." 
      });
    }
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error("PublicProfile Error:", error.message);
    res.status(400).json({ 
      success: false, 
      message: "Invalid User ID format" 
    });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const dbUser = await User.findByIdAndUpdate(
      req.user._id, 
      { $set: req.body },
      { returnDocument: 'after', runValidators: true }
    ).lean();
    
    res.status(200).json({
      success: true,
      message: "Saved to Atlas!",
      data: dbUser, 
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};