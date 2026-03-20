const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { followSociety, unfollowSociety, checkFollowStatus } = require("../controllers/followController");
const {
  getAllSocieties,
  getSocietyProfile
} = require('../controllers/societyController');


// GET ALL SOCIETIES
router.get('/', getAllSocieties);


// GET SOCIETY PROFILE
router.get('/:id', getSocietyProfile);

router.post("/:id/follow", protect, followSociety);

router.delete("/:id/follow", protect, unfollowSociety);

router.get("/:id/follow-status", protect, checkFollowStatus);


module.exports = router;