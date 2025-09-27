import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { app } from "./firebase";

class NotificationService {
  constructor() {
    this.messaging = null;
    this.isSupported = false;
    this.init();
  }

  async init() {
    try {
      this.messaging = getMessaging(app);
      this.isSupported = true;
      
      // Request permission for notifications
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        console.log('Notification permission granted');
        this.setupMessageListener();
      } else {
        console.log('Notification permission denied');
      }
    } catch (error) {
      console.error('Error initializing messaging:', error);
      this.isSupported = false;
    }
  }

  // Setup listener for foreground messages
  setupMessageListener() {
    if (!this.messaging) return;

    onMessage(this.messaging, (payload) => {
      console.log('Message received in foreground:', payload);
      
      // Show notification
      this.showNotification(payload.notification);
    });
  }

  // Get FCM token for the user
  async getToken() {
    if (!this.messaging || !this.isSupported) {
      console.log('Messaging not supported');
      return null;
    }

    try {
      const token = await getToken(this.messaging, {
        vapidKey: 'YOUR_VAPID_KEY' // You'll need to generate this
      });
      console.log('FCM Token:', token);
      return token;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  }

  // Show browser notification
  showNotification(notification) {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return;
    }

    if (Notification.permission === 'granted') {
      const notificationInstance = new Notification(notification.title, {
        body: notification.body,
        icon: '/logo192.png',
        badge: '/logo192.png',
        tag: 'email-notification',
        requireInteraction: true
      });

      // Handle notification click
      notificationInstance.onclick = () => {
        window.focus();
        notificationInstance.close();
      };
    }
  }

  // Send notification for time-related email
  sendTimeRelatedNotification(summary) {
    if (!this.isSupported) {
      console.log('Notifications not supported');
      return;
    }

    const notification = {
      title: `⏰ ${summary.type} Alert`,
      body: `${summary.subject} from ${summary.from}`,
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: `time-alert-${summary.type.toLowerCase()}`,
      data: {
        type: summary.type,
        priority: summary.priority,
        content: summary.content,
        timestamp: summary.timestamp
      }
    };

    this.showNotification(notification);
  }

  // Send multiple notifications
  sendBulkNotifications(summaries) {
    summaries.forEach((summary, index) => {
      // Stagger notifications to avoid overwhelming the user
      setTimeout(() => {
        this.sendTimeRelatedNotification(summary);
      }, index * 1000);
    });
  }

  // Request notification permission
  async requestPermission() {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      console.log('Notification permission denied');
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  // Check if notifications are supported and enabled
  isNotificationSupported() {
    return this.isSupported && 'Notification' in window && Notification.permission === 'granted';
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Utility function to send notifications for parsed emails
export const sendNotificationsForParsedEmails = (parsedEmails) => {
  const timeRelatedEmails = parsedEmails.filter(email => email.hasTimeInfo);
  
  if (timeRelatedEmails.length > 0) {
    const summaries = timeRelatedEmails.map(email => email.summary);
    notificationService.sendBulkNotifications(summaries);
  }
  
  return timeRelatedEmails.length;
};
