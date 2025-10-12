const { DataTypes } = require('sequelize');
const sequelize = require('../db');
const User = require('./User');

const Notification = sequelize.define('Notification', {
id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
},
recipientId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
    model: User,
    key: 'id',
    },
    onDelete: 'CASCADE',
},
channel: {
    type: DataTypes.ENUM('in_app', 'email', 'sms', 'whatsapp'),
    allowNull: false,
    defaultValue: 'in_app',
},
templateKey: {
    type: DataTypes.STRING,
    allowNull: true,
},
status: {
    type: DataTypes.ENUM('pending', 'sent', 'failed'),
    allowNull: false,
    defaultValue: 'pending',
},
createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
},
sentAt: {
    type: DataTypes.DATE,
    allowNull: true,
},
}, {
tableName: 'notifications',
timestamps: false,
});


Notification.prototype.dispatch = async function() {

try {
    this.status = 'sent';
    this.sentAt = new Date();
    await this.save();
    // Integrate with actual API here (email, SMS, WhatsApp)
    return true;
} catch (error) {
    this.status = 'failed';
    await this.save();
    throw error;
}
};

Notification.prototype.retry = async function() {
if (this.status !== 'failed') return false;
return this.dispatch();
};

// Associations
Notification.belongsTo(User, { foreignKey: 'recipientId', as: 'recipient' });

module.exports = Notification;
