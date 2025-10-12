const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');
const Topic = require('./Topic');

const StudentTopics = sequelize.define('StudentTopics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
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
  topicId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Topic,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  subscribedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'student_topics',
  timestamps: false,
});

Student.belongsToMany(Topic, { through: StudentTopics, foreignKey: 'studentId', as: 'subscriptions' });
Topic.belongsToMany(Student, { through: StudentTopics, foreignKey: 'topicId', as: 'subscribers' });

module.exports = StudentTopics;
