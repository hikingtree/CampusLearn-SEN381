const ForumPost = require('../models/ForumPost');
const Student = require('../models/Student');
const Topic = require('../models/Topic');
const ForumReply = require('../models/ForumReply');

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

exports.replyPost = async (req, res) => {
  try {
    const studentId = req.user.id;
    const postId = req.params.id;
    const { content } = req.body;

    const post = await ForumPost.findByPk(postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const reply = await ForumReply.create({ content, forumPostId: postId, studentId });
    res.status(201).json(reply);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
