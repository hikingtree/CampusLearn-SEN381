const Tutor = require('../models/Tutor');
const Topic = require('../models/Topic');

// Get tutor profile
exports.getProfile = async (req, res) => {
  try {
    const tutor = await Tutor.findByPk(req.user.id, { include: Topic });
    res.json(tutor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update tutor profile
exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, modules } = req.body;
    const tutor = await Tutor.findByPk(req.user.id);

    if (!tutor) return res.status(404).json({ message: 'Tutor not found' });

    tutor.fullName = fullName || tutor.fullName;
    tutor.email = email || tutor.email;
    tutor.modules = modules || tutor.modules;

    await tutor.save();
    res.json(tutor);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Post announcement (simple version)
exports.postAnnouncement = async (req, res) => {
  // You can create a Announcement model if needed
  res.status(501).json({ message: 'Announcement feature not implemented yet' });
};
