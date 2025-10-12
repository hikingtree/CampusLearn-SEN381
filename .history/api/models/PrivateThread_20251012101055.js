const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Message = require('./Message');
const User = require('./User');
const Topic = require('./Topic');

const PrivateThread = sequelize.define('PrivateThread', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
status: {
    type: DataTypes.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open',
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
studentUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: User,
    key: 'id',
    },
    onDelete: 'CASCADE',
},
tutorUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: User,
    key: 'id',
    },
    onDelete: 'CASCADE',
},
topicId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: Topic,
    key: 'id',
    },
    onDelete: 'SET NULL',
},
}, {
tableName: 'private_threads',
timestamps: false,
});

// Helper method to send a message in this thread
PrivateThread.prototype.sendMessage = async function(senderId, content) {
const Message = require('./Message');
return await Message.create({
    threadId: this.id,
    senderId,
    content,
});
};

// Associations 
PrivateThread.hasMany(Message, { foreignKey: 'threadId', as: 'messages' });
Message.belongsTo(PrivateThread, { foreignKey: 'threadId', as: 'thread' });

module.exports = PrivateThread;
