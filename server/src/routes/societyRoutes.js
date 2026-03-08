const express = require('express');
const router = express.Router();

const {
  getAllSocieties,
  getSocietyProfile
} = require('../controllers/societyController');


// GET ALL SOCIETIES
router.get('/', getAllSocieties);


// GET SOCIETY PROFILE
router.get('/:id', getSocietyProfile);


module.exports = router;