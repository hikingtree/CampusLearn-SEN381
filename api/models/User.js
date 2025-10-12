
const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
id: {
    type: DataTypes.UUID,                   
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
firstName: {
    type: DataTypes.STRING,
    allowNull: false,
},
lastName: {
    type: DataTypes.STRING,
    allowNull: false,
},
email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
    isEmail: true,
    },
},
passwordHash: {
    type: DataTypes.STRING,
    allowNull: false,
},
role: {
    type: DataTypes.ENUM('student', 'tutor', 'admin'),
    allowNull: false,
    defaultValue: 'student',
},
registeredAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
}, {
tableName: 'users',
timestamps: false, 
});

module.exports = User;
