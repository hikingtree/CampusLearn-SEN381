const StudentTopics = require('../models/StudentTopics');
const Topic = require('../models/Topic');

exports.subscribeTopic = async (req, res) => {
  try {
    const studentId = req.user.id;
    const topicId = req.params.id;

    const topic = await Topic.findByPk(topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });

    const [subscription, created] = await StudentTopics.findOrCreate({
      where: { studentId, topicId },
    });

    res.status(201).json({ subscription, message: created ? 'Subscribed successfully' : 'Already subscribed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
