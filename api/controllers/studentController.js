const Student = require('../models/Student');
const Topic = require('../models/Topic');

// Get student profile
exports.getProfile = async (req, res) => {
  try {
    const student = await Student.findByPk(req.user.id, { include: Topic });
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email } = req.body;
    const student = await Student.findByPk(req.user.id);

    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.fullName = fullName || student.fullName;
    student.email = email || student.email;

    await student.save();
    res.json(student);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
