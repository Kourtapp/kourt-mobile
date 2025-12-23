import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from './supabase';
import Constants from 'expo-constants';
import { logger } from '../utils/logger';

// Configure notification handling
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

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
  trigger: Notifications.NotificationTriggerInput;
}

class NotificationService {
  private expoPushToken: string | null = null;

  // Register for push notifications
  async registerForPushNotifications(): Promise<string | null> {
    let token: string | null = null;

    // Check if running on a physical device
    if (!Device.isDevice) {
      logger.log('[Notifications] Push notifications require a physical device');
      return null;
    }

    // Check/request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      logger.log('[Notifications] Push notification permission not granted');
      return null;
    }

    // Get the Expo push token
    try {
      const projectId = Constants.expoConfig?.extra?.eas?.projectId;

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      token = tokenData.data;
      this.expoPushToken = token;

      logger.log('[Notifications] Expo push token:', token);
    } catch (error) {
      logger.error('[Notifications] Error getting push token:', error);
      return null;
    }

    // Configure Android channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B00',
      });

      // Booking reminders channel
      await Notifications.setNotificationChannelAsync('bookings', {
        name: 'Reservas',
        description: 'Notificações sobre suas reservas',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF6B00',
      });

      // Chat messages channel
      await Notifications.setNotificationChannelAsync('messages', {
        name: 'Mensagens',
        description: 'Notificações de novas mensagens',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 100, 100, 100],
        lightColor: '#FF6B00',
      });

      // Social channel
      await Notifications.setNotificationChannelAsync('social', {
        name: 'Social',
        description: 'Solicitações de amizade e convites',
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 100],
        lightColor: '#FF6B00',
      });
    }

    return token;
  }

  // Save push token to Supabase
  async savePushToken(userId: string, token: string): Promise<void> {
    try {
      const platform = Platform.OS as 'ios' | 'android';

      const { error } = await supabase.from('push_tokens').upsert(
        {
          user_id: userId,
          token,
          platform,
          updated_at: new Date().toISOString(),
        } as any,
        {
          onConflict: 'user_id,platform',
        }
      );

      if (error) throw error;
      logger.log('[Notifications] Push token saved successfully');
    } catch (error) {
      logger.error('[Notifications] Error saving push token:', error);
    }
  }

  // Remove push token from Supabase
  async removePushToken(userId: string): Promise<void> {
    try {
      const platform = Platform.OS;

      const { error } = await supabase
        .from('push_tokens')
        .delete()
        .eq('user_id', userId)
        .eq('platform', platform);

      if (error) throw error;
      logger.log('[Notifications] Push token removed successfully');
    } catch (error) {
      logger.error('[Notifications] Error removing push token:', error);
    }
  }

  // Schedule a local notification
  async scheduleNotification(
    notification: ScheduledNotification
  ): Promise<string | null> {
    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.content.title,
          body: notification.content.body,
          data: notification.content.data,
          sound: 'default',
        },
        trigger: notification.trigger,
      });

      logger.log('[Notifications] Notification scheduled:', id);
      return id;
    } catch (error) {
      logger.error('[Notifications] Error scheduling notification:', error);
      return null;
    }
  }

  // Schedule booking reminder
  async scheduleBookingReminder(
    bookingId: string,
    courtName: string,
    bookingDate: Date,
    reminderMinutes: number = 60
  ): Promise<string | null> {
    const reminderTime = new Date(bookingDate.getTime() - reminderMinutes * 60 * 1000);

    // Don't schedule if reminder time is in the past
    if (reminderTime <= new Date()) {
      return null;
    }

    return this.scheduleNotification({
      content: {
        title: 'Lembrete de Reserva',
        body: `Sua partida em ${courtName} começa em ${reminderMinutes} minutos!`,
        data: {
          type: 'booking_reminder',
          bookingId,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: reminderTime,
        channelId: 'bookings',
      },
    });
  }

  // Cancel a scheduled notification
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      logger.log('[Notifications] Notification cancelled:', notificationId);
    } catch (error) {
      logger.error('[Notifications] Error cancelling notification:', error);
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      logger.log('[Notifications] All notifications cancelled');
    } catch (error) {
      logger.error('[Notifications] Error cancelling notifications:', error);
    }
  }

  // Get all scheduled notifications
  async getScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    return Notifications.getAllScheduledNotificationsAsync();
  }

  // Set badge count
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      logger.error('[Notifications] Error setting badge count:', error);
    }
  }

  // Get badge count
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      logger.error('[Notifications] Error getting badge count:', error);
      return 0;
    }
  }

  // Send a test notification (for development)
  async sendTestNotification(): Promise<void> {
    await this.scheduleNotification({
      content: {
        title: 'Teste de Notificação',
        body: 'Esta é uma notificação de teste do Kourt!',
        data: { type: 'test' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });
  }

  // Get current push token
  getPushToken(): string | null {
    return this.expoPushToken;
  }
}

export const notificationService = new NotificationService();

// Notification listener types
export type NotificationReceivedListener = (
  notification: Notifications.Notification
) => void;

export type NotificationResponseListener = (
  response: Notifications.NotificationResponse
) => void;

// Add notification listeners
export function addNotificationReceivedListener(
  listener: NotificationReceivedListener
): Notifications.EventSubscription {
  return Notifications.addNotificationReceivedListener(listener);
}

export function addNotificationResponseReceivedListener(
  listener: NotificationResponseListener
): Notifications.EventSubscription {
  return Notifications.addNotificationResponseReceivedListener(listener);
}

// Helper to handle notification navigation
export function getNotificationData(
  response: Notifications.NotificationResponse
): Record<string, any> | undefined {
  return response.notification.request.content.data;
}
