const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Tutor = require('./Tutor');

const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING, // URL/path to image
  },
  tutorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Tutor,
      key: 'id',
    },
  },
}, {
  tableName: 'topics',
  timestamps: true,
});

Topic.belongsTo(Tutor, { foreignKey: 'tutorId' });
module.exports = Topic;
