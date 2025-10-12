const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { protect } = require('../middleware/authMiddleware');

// Get own profile
router.get('/me', protect, studentController.getProfile);

// Update profile
router.put('/me', protect, studentController.updateProfile);

module.exports = router;
