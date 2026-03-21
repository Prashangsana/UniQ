const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getPublicProfile
} = require("../controllers/userController");

//import middleware*
const { protect } = require("../middleware/authMiddleware");

router.get("/profile",protect, getUserProfile);
router.put("/profile",protect,updateUserProfile);

// Public route to view any user by their ID

router.get("/public-profile/:id", getPublicProfile);

module.exports = router;