const express = require('express');
const router = express.Router();
const { followSociety, unfollowSociety, checkFollowStatus } = require("../controllers/followController");
const {
  getAllSocieties,
  getSocietyProfile
} = require('../controllers/societyController');


// GET ALL SOCIETIES
router.get('/', getAllSocieties);


// GET SOCIETY PROFILE
router.get('/:id', getSocietyProfile);

router.post("/:id/follow", followSociety);

router.delete("/:id/follow", unfollowSociety);

router.get("/:id/follow-status", checkFollowStatus);


module.exports = router;