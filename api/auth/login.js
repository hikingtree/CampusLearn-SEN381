const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check in both tables
  let user = await Student.findOne({ where: { email } });
  let role = 'student';
  if (!user) {
    user = await Tutor.findOne({ where: { email } });
    role = 'tutor';
  }

  if (user && await bcrypt.compare(password, user.password)) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: role,
      token: jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1d' })
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

module.exports = router;
