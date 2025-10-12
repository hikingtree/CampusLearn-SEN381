const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const Course = sequelize.define('Course', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
},
name: {
    type: DataTypes.STRING,
    allowNull: false,
},
description: {
    type: DataTypes.TEXT,
},
credits: {
    type: DataTypes.INTEGER,
    allowNull: false,
},
}, {
tableName: 'courses',
timestamps: true,
});


module.exports = Course;