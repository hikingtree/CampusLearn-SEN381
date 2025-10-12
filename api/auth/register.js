const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const Student = require('../models/Student');
const Tutor = require('../models/Tutor');

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  // Check if user exists
  const userExists = await (role === 'tutor' 
    ? Tutor.findOne({ where: { email } }) 
    : Student.findOne({ where: { email } }));

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create user
  const user = await (role === 'tutor'
    ? Tutor.create({ name, email, password: hashedPassword })
    : Student.create({ name, email, password: hashedPassword }));

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: role,
      token: jwt.sign({ id: user.id, role }, process.env.JWT_SECRET, { expiresIn: '1d' })
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

module.exports = router;
