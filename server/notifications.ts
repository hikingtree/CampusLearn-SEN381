// Notification service for SendGrid (Email) and Twilio (SMS)

interface NotificationService {
  sendEmail(to: string, subject: string, body: string): Promise<void>;
  sendSMS(to: string, message: string): Promise<void>;
}

class MockNotificationService implements NotificationService {
  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    console.log(`[Mock Email] To: ${to}, Subject: ${subject}, Body: ${body}`);
  }

  async sendSMS(to: string, message: string): Promise<void> {
    console.log(`[Mock SMS] To: ${to}, Message: ${message}`);
  }
}

class SendGridTwilioService implements NotificationService {
  private sendgridApiKey: string | undefined;
  private twilioAccountSid: string | undefined;
  private twilioAuthToken: string | undefined;
  private twilioPhoneNumber: string | undefined;

  constructor() {
    this.sendgridApiKey = process.env.SENDGRID_API_KEY;
    this.twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
    this.twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
    this.twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
  }

  async sendEmail(to: string, subject: string, body: string): Promise<void> {
    if (!this.sendgridApiKey) {
      console.log(`[Email Not Configured] To: ${to}, Subject: ${subject}`);
      return;
    }

    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.sendgridApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: to }],
              subject: subject,
            },
          ],
          from: {
            email: "noreply@campuslearn.ac.za",
            name: "CampusLearn™",
          },
          content: [
            {
              type: "text/html",
              value: body,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`SendGrid API error: ${response.statusText}`);
      }

      console.log(`[Email Sent] To: ${to}, Subject: ${subject}`);
    } catch (error) {
      console.error("Failed to send email:", error);
      throw error;
    }
  }

  async sendSMS(to: string, message: string): Promise<void> {
    if (!this.twilioAccountSid || !this.twilioAuthToken || !this.twilioPhoneNumber) {
      console.log(`[SMS Not Configured] To: ${to}, Message: ${message}`);
      return;
    }

    try {
      const auth = Buffer.from(
        `${this.twilioAccountSid}:${this.twilioAuthToken}`
      ).toString("base64");

      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${this.twilioAccountSid}/Messages.json`,
        {
          method: "POST",
          headers: {
            "Authorization": `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            To: to,
            From: this.twilioPhoneNumber!,
            Body: message,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Twilio API error: ${response.statusText}`);
      }

      console.log(`[SMS Sent] To: ${to}, Message: ${message}`);
    } catch (error) {
      console.error("Failed to send SMS:", error);
      throw error;
    }
  }
}

// Export notification service based on environment
export const notificationService: NotificationService =
  process.env.SENDGRID_API_KEY || process.env.TWILIO_ACCOUNT_SID
    ? new SendGridTwilioService()
    : new MockNotificationService();

// Helper functions for common notifications
export async function notifyNewTopic(
  subscriberEmail: string,
  topicTitle: string,
  creatorName: string
) {
  const subject = `New Topic: ${topicTitle}`;
  const body = `
    <h2>New Topic on CampusLearn™</h2>
    <p><strong>${creatorName}</strong> has created a new topic: <strong>${topicTitle}</strong></p>
    <p>Log in to CampusLearn™ to view and subscribe to this topic.</p>
  `;

  await notificationService.sendEmail(subscriberEmail, subject, body);
}

export async function notifyNewMessage(
  recipientEmail: string,
  senderName: string,
  messagePreview: string
) {
  const subject = `New Message from ${senderName}`;
  const body = `
    <h2>New Message on CampusLearn™</h2>
    <p>You have received a new message from <strong>${senderName}</strong></p>
    <p><em>${messagePreview}</em></p>
    <p>Log in to CampusLearn™ to read and reply to this message.</p>
  `;

  await notificationService.sendEmail(recipientEmail, subject, body);
}

export async function notifyForumReply(
  authorEmail: string,
  replierName: string,
  postTitle: string
) {
  const subject = `New Reply to: ${postTitle}`;
  const body = `
    <h2>New Reply on CampusLearn™ Forum</h2>
    <p><strong>${replierName}</strong> has replied to your post: <strong>${postTitle}</strong></p>
    <p>Log in to CampusLearn™ to view the reply.</p>
  `;

  await notificationService.sendEmail(authorEmail, subject, body);
}

export async function notifyTopicSubscription(
  tutorEmail: string,
  studentName: string,
  topicTitle: string
) {
  const subject = `New Subscription: ${topicTitle}`;
  const body = `
    <h2>New Topic Subscription</h2>
    <p><strong>${studentName}</strong> has subscribed to your topic: <strong>${topicTitle}</strong></p>
    <p>Log in to CampusLearn™ to connect with this student.</p>
  `;

  await notificationService.sendEmail(tutorEmail, subject, body);
}
