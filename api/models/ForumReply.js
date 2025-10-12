const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const ForumPost = require('./ForumPost');
const Student = require('./Student');

const ForumReply = sequelize.define('ForumReply', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  forumPostId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: ForumPost,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Student,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'forum_replies',
  timestamps: false,
});

ForumPost.hasMany(ForumReply, { foreignKey: 'forumPostId', as: 'replies' });
ForumReply.belongsTo(ForumPost, { foreignKey: 'forumPostId', as: 'post' });

module.exports = ForumReply;
