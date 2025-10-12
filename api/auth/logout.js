const express = require('express');
const router = express.Router();

// In stateless JWT, server doesn't need to delete token
router.post('/', (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = router;
