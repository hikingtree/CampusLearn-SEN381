const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');
const Tutor = require('./Tutor');

const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  senderId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  senderType: {
    type: DataTypes.ENUM('student', 'tutor'),
    allowNull: false,
  },
  receiverId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  receiverType: {
    type: DataTypes.ENUM('student', 'tutor'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  read: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'messages',
  timestamps: true,
});

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(PrivateThread, { foreignKey: 'threadId', as: 'thread' });

module.exports = Message;
