// Web stub for notification setup - push notifications not supported on web

export function useNotificationSetup() {
  // No-op for web - push notifications are not supported in browser
  // This prevents the app from crashing due to react-native AppState import
}

export function useScheduleBookingReminders() {
  const scheduleReminder = async (
    _bookingId: string,
    _courtName: string,
    _bookingDate: Date
  ) => {
    // No-op on web - local notifications not available
    console.log('[Web] Booking reminders not available on web platform');
  };

  const cancelReminders = async (_notificationIds: string[]) => {
    // No-op on web
  };

  return { scheduleReminder, cancelReminders };
}
