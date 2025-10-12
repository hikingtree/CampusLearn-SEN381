const Notification = require('../models/Notification');

async function sendNotification(userId, message, channel = 'in_app') {
  try {
    const notification = await Notification.create({
      recipientId: userId,
      templateKey: null,
      channel,
      status: 'pending',
      createdAt: new Date(),
    });

    // Mock sending logic
    switch (channel) {
      case 'email':
        console.log(`Sending EMAIL to ${userId}: ${message}`);
        break;
      case 'sms':
        console.log(`Sending SMS to ${userId}: ${message}`);
        break;
      case 'whatsapp':
        console.log(`Sending WhatsApp to ${userId}: ${message}`);
        break;
      default:
        console.log(`In-app notification for ${userId}: ${message}`);
    }

    notification.status = 'sent';
    notification.sentAt = new Date();
    await notification.save();

    return notification;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

module.exports = { sendNotification };
