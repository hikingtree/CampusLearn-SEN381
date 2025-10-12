const Topic = require('../models/Topic');
const Tutor = require('../models/Tutor');
const Student = require('../models/Student');

// Create new topic (Tutor)
exports.createTopic = async (req, res) => {
  try {
    const { name, description, category, image } = req.body;
    const tutorId = req.user.id;

    const topic = await Topic.create({ name, description, category, image, tutorId });
    res.status(201).json(topic);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all topics or filter by category
exports.getTopics = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const topics = await Topic.findAll({
      where: filter,
      include: [{ model: Tutor, attributes: ['id', 'fullName', 'email'] }]
    });

    res.json(topics);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Subscribe to topic (Student)
exports.subscribeTopic = async (req, res) => {
  // You can create a many-to-many relationship between Student & Topic
  res.status(501).json({ message: 'Subscribe feature not implemented yet' });
};
