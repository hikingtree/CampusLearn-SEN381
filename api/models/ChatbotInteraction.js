const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Question = require('./Question');

const ChatbotInteraction = sequelize.define('ChatbotInteraction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: User,
    key: 'id',
    },
    onDelete: 'SET NULL',
  },
  queryText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  responseText: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  confidence: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 1.0,
  },
  escalated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  escalatedQuestionId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: Question,
    key: 'id',
    },
    onDelete: 'SET NULL',
  },
  timestamp: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'chatbot_interactions',
  timestamps: false,
});

// Associations
ChatbotInteraction.associate = (models) => {
ChatbotInteraction.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
ChatbotInteraction.belongsTo(models.Question, { foreignKey: 'escalatedQuestionId', as: 'escalatedQuestion' });
};

module.exports = ChatbotInteraction;
