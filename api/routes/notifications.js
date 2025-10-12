const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { sendNotification } = require('../services/notificationService');

// Send a notification (could be email/SMS)
router.post('/', protect, async (req, res) => {
  const { userId, message, type } = req.body;
  try {
    await sendNotification(userId, message, type);
    res.status(200).json({ message: 'Notification sent' });
  } catch (err) {
    res.status(500).json({ message: 'Error sending notification', error: err });
  }
});

module.exports = router;
