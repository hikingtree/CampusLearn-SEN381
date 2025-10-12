
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Subscription = sequelize.define('Subscription', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
subjectType: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'The type of entity subscribed to (e.g., Topic, Course, Forum, etc.)',
},
subjectId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'The ID of the subscribed entity (matches subjectType model ID)',
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
},
}, {
tableName: 'subscriptions',
timestamps: false,
});

module.exports = Subscription;
