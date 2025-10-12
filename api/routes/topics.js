const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { protect } = require('../middleware/authMiddleware');

// Create new topic (Tutor only)
router.post('/', protect, topicController.createTopic);

// Get all topics
router.get('/', protect, topicController.getTopics);

// Subscribe to a topic (Student)
router.post('/:id/subscribe', protect, topicController.subscribeTopic);

module.exports = router;
