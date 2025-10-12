const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forumController');
const { protect } = require('../middleware/authMiddleware');

// Create a new forum post
router.post('/', protect, forumController.createPost);

// Get forum posts (filter, sort)
router.get('/', protect, forumController.getPosts);

// Reply to a forum post
router.post('/:id/reply', protect, forumController.replyPost);

module.exports = router;
