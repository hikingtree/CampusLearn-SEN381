const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Module = require('./Module');

const Assessment = sequelize.define('Assessment', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
title: {
    type: DataTypes.STRING,
    allowNull: false,
},
description: {
    type: DataTypes.TEXT,
    allowNull: true,
},
dueDate: {
    type: DataTypes.DATE,
    allowNull: false,
},
moduleId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: Module,
    key: 'id',
    },
    onDelete: 'CASCADE',
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
}, {
tableName: 'assessments',
timestamps: false,
});

// Associations 
Assessment.associate = (models) => {
Assessment.hasMany(models.Question, { foreignKey: 'assessmentId', as: 'questions' });
};

module.exports = Assessment;
