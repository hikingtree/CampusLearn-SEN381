const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const ActivityEntry = sequelize.define('ActivityEntry', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
type: {
    type: DataTypes.STRING,
    allowNull: false,
    comment: 'Type of activity, e.g., post, response, submission, etc.',
},
refId: {
    type: DataTypes.UUID,
    allowNull: false,
    comment: 'Reference ID to the related entity (like ForumPost, Response, etc.)',
},
at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
}, {
tableName: 'activity_entries',
  timestamps: false, 
});

module.exports = ActivityEntry;