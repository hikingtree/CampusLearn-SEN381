const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Question = require('./Question');

const ChatbotLog = sequelize.define('ChatbotLog', {
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
type: {
    type: DataTypes.ENUM('user_message', 'bot_response', 'escalation'),
    allowNull: false,
},
data: {
    type: DataTypes.JSONB, // store messages, responses, or extra info
    allowNull: false,
},
at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
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
}, {
tableName: 'chatbot_logs',
timestamps: false,
});

// Associations
ChatbotLog.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ChatbotLog.belongsTo(Question, { foreignKey: 'escalatedQuestionId', as: 'escalatedQuestion' });

module.exports = ChatbotLog;
