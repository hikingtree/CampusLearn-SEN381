const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Registration
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Verify token
router.get('/verify', protect, authController.verifyToken);

module.exports = router;
