const express = require('express');
const router = express.Router();
const tutorController = require('../controllers/tutorController');
const { protect } = require('../middleware/authMiddleware');

// Get tutor profile
router.get('/me', protect, tutorController.getProfile);

// Update tutor profile
router.put('/me', protect, tutorController.updateProfile);

// Post announcement
router.post('/announcement', protect, tutorController.postAnnouncement);

module.exports = router;
