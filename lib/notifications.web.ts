// Web stub for notifications - notifications are not supported on web
import { logger } from '../utils/logger';

export interface PushNotificationToken {
  token: string;
  platform: 'ios' | 'android';
}

export interface NotificationContent {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export interface ScheduledNotification {
  content: NotificationContent;
  trigger: any;
}

class NotificationService {
  private expoPushToken: string | null = null;

  async registerForPushNotifications(): Promise<string | null> {
    logger.log('[Notifications] Push notifications are not supported on web');
    return null;
  }

  async savePushToken(_userId: string, _token: string): Promise<void> {
    logger.log('[Notifications] Push notifications are not supported on web');
  }

  async removePushToken(_userId: string): Promise<void> {
    logger.log('[Notifications] Push notifications are not supported on web');
  }

  async scheduleNotification(_notification: ScheduledNotification): Promise<string | null> {
    logger.log('[Notifications] Push notifications are not supported on web');
    return null;
  }

  async scheduleBookingReminder(
    _bookingId: string,
    _courtName: string,
    _bookingDate: Date,
    _reminderMinutes: number = 60
  ): Promise<string | null> {
    logger.log('[Notifications] Push notifications are not supported on web');
    return null;
  }

  async cancelNotification(_notificationId: string): Promise<void> {
    logger.log('[Notifications] Push notifications are not supported on web');
  }

  async cancelAllNotifications(): Promise<void> {
    logger.log('[Notifications] Push notifications are not supported on web');
  }

  async getScheduledNotifications(): Promise<any[]> {
    return [];
  }

  async setBadgeCount(_count: number): Promise<void> {
    logger.log('[Notifications] Badge count is not supported on web');
  }

  async getBadgeCount(): Promise<number> {
    return 0;
  }

  async sendTestNotification(): Promise<void> {
    logger.log('[Notifications] Test notification - web does not support notifications');
  }

  getPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();

// Notification listener types (no-op on web)
export type NotificationReceivedListener = (notification: any) => void;
export type NotificationResponseListener = (response: any) => void;

// Mock subscription type
interface MockSubscription {
  remove: () => void;
}

export function addNotificationReceivedListener(
  _listener: NotificationReceivedListener
): MockSubscription {
  return { remove: () => {} };
}

export function addNotificationResponseReceivedListener(
  _listener: NotificationResponseListener
): MockSubscription {
  return { remove: () => {} };
}

export function getNotificationData(_response: any): Record<string, any> | undefined {
  return undefined;
}
