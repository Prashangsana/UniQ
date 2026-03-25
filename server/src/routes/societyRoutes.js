const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { followSociety, unfollowSociety, checkFollowStatus } = require("../controllers/followController");
const {
  getAllSocieties,
  getSocietyProfile,
  getLeaderSocieties,
  createSociety,
  updateSociety,
  deleteSociety,
  getUsersByRole,
  assignLeader
} = require('../controllers/societyController');

// GET LEADER'S SOCIETIES
router.get('/leader/all', protect, getLeaderSocieties);

// CREATE SOCIETY / CLUB (admin only)
router.post('/', protect, createSociety);

// GET ALL SOCIETIES
router.get('/', getAllSocieties);

// GET SOCIETY PROFILE
router.get('/:id', getSocietyProfile);

// UPDATE SOCIETY / CLUB (leader only)
router.put('/:id', protect, updateSociety);

// DELETE SOCIETY / CLUB (admin only)
router.delete('/:id', protect, deleteSociety);

// ADMIN ROUTES
// GET USERS BY ROLE (admin only)
router.get('/admin/users', protect, getUsersByRole);

// ASSIGN LEADER TO SOCIETY (admin only)
router.put('/admin/societies/:id/assign-leader', protect, assignLeader);

// FOLLOW/UNFOLLOW SOCIETY
router.post("/:id/follow", protect, followSociety);
router.delete("/:id/follow", protect, unfollowSociety);
router.get("/:id/follow-status", protect, checkFollowStatus);

module.exports = router;