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

// Post announcement
exports.postAnnouncement = async (req, res) => {
  try {
    const tutorId = req.user.id;
    const { title, content } = req.body;

    if (!title || !content) return res.status(400).json({ message: 'Title and content are required' });

    const announcement = await Announcement.create({ tutorId, title, content });
    res.status(201).json(announcement);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};