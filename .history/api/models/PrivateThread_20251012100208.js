const { DataTypes } = require('sequelize');
const sequelize = require('../db');

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
    model: 'users',
    key: 'id',
    },
    onDelete: 'CASCADE',
},
tutorUserId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: 'users',
    key: 'id',
    },
    onDelete: 'CASCADE',
},
topicId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
    model: 'topics',
    key: 'id',
    },
    onDelete: 'SET NULL',
},
}, {
tableName: 'private_threads',
timestamps: false,
});



module.exports = PrivateThread;
