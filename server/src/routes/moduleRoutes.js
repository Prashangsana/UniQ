const express = require('express');
const router = express.Router();
const { getModules, createModule, updateModule, deleteModule } = require('../controllers/moduleController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getModules)
  .post(protect, createModule);

router.route('/:id')
  .put(protect, updateModule)
  .delete(protect, deleteModule);

module.exports = router;