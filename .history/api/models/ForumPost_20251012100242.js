const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');
const Topic = require('./Topic');

const ForumPost = sequelize.define('ForumPost', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  anonymous: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  studentId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Student,
      key: 'id',
    },
  },
  topicId: {
    type: DataTypes.UUID,
    references: {
      model: Topic,
      key: 'id',
    },
  },
}, {
  tableName: 'forum_posts',
  timestamps: true,
});

ForumPost.belongsTo(Student, { foreignKey: 'studentId' });
ForumPost.belongsTo(Topic, { foreignKey: 'topicId' });

module.exports = ForumPost;
