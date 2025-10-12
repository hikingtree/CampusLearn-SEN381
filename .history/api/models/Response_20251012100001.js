const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Response = sequelize.define('Response', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
content: {
    type: DataTypes.TEXT,
    allowNull: false,
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
isAccepted: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
},
questionId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: 'questions',
    key: 'id',
    },
    onDelete: 'CASCADE',
},
respondedBy: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: 'users',
    key: 'id',
    },
    onDelete: 'SET NULL',
},
}, {
tableName: 'responses',
timestamps: false,
});

module.exports = Response;
