const express = require('express');
const router = express.Router();
const { followSociety, unfollowSociety, checkFollowStatus } = require("../controllers/followController");
const {
  getAllSocieties,
  getSocietyProfile,
  // Your Leader logic
  createSociety,
  getLeaderSocieties,
  updateSociety
} = require('../controllers/societyController');

// GET ALL SOCIETIES (Student)
router.get('/', getAllSocieties);

// GET SOCIETY PROFILE (Student)
router.get('/:id', getSocietyProfile);

router.post("/:id/follow", followSociety);
router.delete("/:id/follow", unfollowSociety);
router.get("/:id/follow-status", checkFollowStatus);

/* ================= LEADER CRUD (Your Part) ================= */
const protect = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ success: false, message: "Not authorized" });
};

router.post('/create', protect, createSociety);
router.get('/leader/all', protect, getLeaderSocieties);
router.put('/leader/:id', protect, updateSociety);

module.exports = router;
