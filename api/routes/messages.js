const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/authMiddleware');

// Get user messages
router.get('/', protect, async (req, res) => {
  const messages = await Message.findAll({ where: { userId: req.user.id } });
  res.json(messages);
});

// Send a new message
router.post('/', protect, async (req, res) => {
  const { toUserId, content } = req.body;
  const message = await Message.create({ fromUserId: req.user.id, toUserId, content });
  res.status(201).json(message);
});

module.exports = router;
