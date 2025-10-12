const ForumPost = require('../models/ForumPost');
const Student = require('../models/Student');
const Topic = require('../models/Topic');

// Create a new forum post
exports.createPost = async (req, res) => {
  try {
    const { content, topicId, anonymous } = req.body;
    const studentId = req.user.id;

    const post = await ForumPost.create({ content, topicId, studentId, anonymous });
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get posts with optional filters
exports.getPosts = async (req, res) => {
  try {
    const { topicId, sort } = req.query;
    const filter = topicId ? { topicId } : {};

    const posts = await ForumPost.findAll({
      where: filter,
      order: [['createdAt', sort === 'oldest' ? 'ASC' : 'DESC']],
      include: [{ model: Student, attributes: ['id', 'fullName'] }]
    });

    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reply to a post (simple version)
exports.replyPost = async (req, res) => {
  // You could implement threaded replies here
  res.status(501).json({ message: 'Reply feature not implemented yet' });
};
