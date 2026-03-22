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
  deleteSociety
} = require('../controllers/societyController');


// GET LEADER'S SOCIETIES
router.get('/leader/all', protect, getLeaderSocieties);

// CREATE SOCIETY / CLUB (any authenticated user)
router.post('/', protect, createSociety);

// GET ALL SOCIETIES
router.get('/', getAllSocieties);

// UPDATE SOCIETY / CLUB (any authenticated user)
router.put('/:id', protect, updateSociety);

// GET SOCIETY PROFILE
router.get('/:id', getSocietyProfile);

// DELETE SOCIETY / CLUB (any authenticated user)
router.delete('/:id', protect, deleteSociety);

router.post("/:id/follow", protect, followSociety);

router.delete("/:id/follow", protect, unfollowSociety);

router.get("/:id/follow-status", protect, checkFollowStatus);


module.exports = router;