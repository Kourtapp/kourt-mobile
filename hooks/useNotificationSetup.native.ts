import { useEffect, useRef } from 'react';
import { router } from 'expo-router';
import { AppState, AppStateStatus } from 'react-native';
import {
  notificationService,
  addNotificationReceivedListener,
  addNotificationResponseReceivedListener,
  getNotificationData,
} from '../lib/notifications';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';

export function useNotificationSetup() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    // Register for push notifications
    async function registerNotifications() {
      if (!userId) return;

      const token = await notificationService.registerForPushNotifications();
      if (token) {
        await notificationService.savePushToken(userId, token);
      }
    }

    registerNotifications();
  }, [userId]);

  useEffect(() => {
    // Handle notification received while app is foregrounded
    const receivedSubscription = addNotificationReceivedListener((notification) => {
      logger.log('[useNotificationSetup] Notification received:', notification);
      // You can show an in-app notification here
    });

    // Handle notification interaction (tap)
    const responseSubscription = addNotificationResponseReceivedListener((response) => {
      const data = getNotificationData(response);
      logger.log('[useNotificationSetup] Notification tapped:', data);

      if (data) {
        handleNotificationNavigation(data);
      }
    });

    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
     
  }, []);

  useEffect(() => {
    // Handle app state changes for badge count
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      // App came to foreground - could refresh badge count here
      logger.log('[useNotificationSetup] App came to foreground');
    }
    appState.current = nextAppState;
  };

  const handleNotificationNavigation = (data: Record<string, any>) => {
    switch (data.type) {
      case 'booking_reminder':
        router.push(`/booking/${data.bookingId}`);
        break;
      case 'new_message':
        router.push({
          pathname: '/chat/[id]',
          params: { id: data.conversationId, name: data.senderName },
        });
        break;
      case 'friend_request':
        router.push('/social');
        break;
      case 'game_invite':
        router.push(`/booking/${data.bookingId}`);
        break;
      case 'booking_confirmed':
        router.push(`/booking/${data.bookingId}`);
        break;
      case 'booking_cancelled':
        router.push('/history' as any);
        break;
      default:
        router.push('/notifications');
    }
  };
}

export function useScheduleBookingReminders() {
  const scheduleReminder = async (
    bookingId: string,
    courtName: string,
    bookingDate: Date
  ) => {
    // Schedule 1 hour before
    await notificationService.scheduleBookingReminder(
      bookingId,
      courtName,
      bookingDate,
      60
    );

    // Schedule 15 minutes before
    await notificationService.scheduleBookingReminder(
      bookingId,
      courtName,
      bookingDate,
      15
    );
  };

  const cancelReminders = async (notificationIds: string[]) => {
    for (const id of notificationIds) {
      await notificationService.cancelNotification(id);
    }
  };

  return { scheduleReminder, cancelReminders };
}
