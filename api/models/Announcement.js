const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Tutor = require('./Tutor');

const Announcement = sequelize.define('Announcement', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  tutorId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Tutor,
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
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
}, {
  tableName: 'announcements',
  timestamps: false,
});

Tutor.hasMany(Announcement, { foreignKey: 'tutorId', as: 'announcements' });
Announcement.belongsTo(Tutor, { foreignKey: 'tutorId', as: 'tutor' });

module.exports = Announcement;
