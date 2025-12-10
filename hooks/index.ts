// Hooks barrel export - only existing hooks

// Chat hooks
export {
  useConversations,
  useMessages,
  useSendMessage,
  useStartConversation,
  useUnreadMessagesCount,
} from './useChat';

// Location hooks
export {
  useLocation,
  useWatchLocation,
  calculateDistance,
  formatDistance,
} from './useLocation';

export type { LocationData, UseLocationResult } from './useLocation';

// Ranking hooks
export {
  useRanking,
  useUserRankingStats,
  useNearbyPlayers,
} from './useRanking';

// Pagination hooks
export {
  usePaginatedQuery,
  useInfiniteScroll,
} from './usePaginatedQuery';

export type { PaginatedResult, PaginatedQueryOptions } from './usePaginatedQuery';

// Notification setup hook
export {
  useNotificationSetup,
  useScheduleBookingReminders,
} from './useNotificationSetup';

// Payment hook
export { usePayment } from './usePayment';
export type { PaymentMethod } from './usePayment';
