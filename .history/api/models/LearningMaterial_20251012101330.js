const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');
const Topic = require('./Topic');

const LearningMaterial = sequelize.define('LearningMaterial', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
title: {
    type: DataTypes.STRING,
    allowNull: false,
},
type: {
    type: DataTypes.ENUM('pdf', 'video', 'audio', 'link', 'interactive', 'other'),
    allowNull: false,
},
urlOrPath: {
    type: DataTypes.TEXT,
    allowNull: false,
},
uploaderId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: User,
    key: 'id',
    },
    onDelete: 'SET NULL',
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
isMobileFriendly: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
},
uploadedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
}, {
tableName: 'learning_materials',
timestamps: false,
});

// Instance method to validate material 
LearningMaterial.prototype.validateMaterial = function() {
  if (!this.title || !this.type || !this.urlOrPath) {
    throw new Error('Missing required fields');
  }

  if (!['pdf', 'video', 'audio', 'link', 'interactive', 'other'].includes(this.type)) {
    throw new Error('Invalid material type');
  }

  // check URL format if type is link
  if (this.type === 'link' && !/^https?:\/\/.+/.test(this.urlOrPath)) {
    throw new Error('Invalid URL');
  }

  return true;
};

// Associations
LearningMaterial.belongsTo(User, { foreignKey: 'uploaderId', as: 'uploader' });
LearningMaterial.belongsTo(Topic, { foreignKey: 'topicId', as: 'topic' });

module.exports = LearningMaterial;
