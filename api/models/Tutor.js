const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const Student = require('./Student');

const Tutor = sequelize.define('Tutor', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  fullName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  modules: {
    type: DataTypes.ARRAY(DataTypes.STRING), // List of modules the tutor is registered for
    defaultValue: [],
  },
}, {
  tableName: 'tutors',
  timestamps: true,
});

module.exports = Tutor;
