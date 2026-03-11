const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  updateUserProfile,
  getPublicProfile
} = require("../controllers/userController");

router.get("/profile", getUserProfile);
router.put("/profile", updateUserProfile);

// Public route to view any user by their ID

router.get("/:id", getPublicProfile);

module.exports = router;