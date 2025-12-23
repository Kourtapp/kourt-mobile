/**
 * Application Configuration Constants
 * Centralized configuration to avoid magic numbers/strings
 */

// =============================================================================
// PAGINATION
// =============================================================================
export const PAGINATION = {
    DEFAULT: 20,
    MATCHES: 10,
    USERS: 20,
    POSTS: 15,
    COMMENTS: 20,
    NOTIFICATIONS: 30,
    BOOKINGS: 20,
    SEARCH_RESULTS: 25,
    SUGGESTIONS: 10,
    FOLLOWERS: 30,
    COURTS: 20,
} as const;

// =============================================================================
// CACHE (React Query)
// =============================================================================
export const CACHE = {
    /** Time until data is considered stale (5 minutes) */
    STALE_TIME: 5 * 60 * 1000,

    /** Time until inactive data is garbage collected (30 minutes) */
    GC_TIME: 30 * 60 * 1000,

    /** Refetch interval for real-time data (30 seconds) */
    REALTIME_INTERVAL: 30 * 1000,

    /** How long to cache user profile (10 minutes) */
    PROFILE_STALE_TIME: 10 * 60 * 1000,

    /** How long to cache court data (5 minutes) */
    COURTS_STALE_TIME: 5 * 60 * 1000,
} as const;

// =============================================================================
// TIMEOUTS
// =============================================================================
export const TIMEOUTS = {
    /** API request timeout */
    API_REQUEST: 30 * 1000,

    /** Image upload timeout */
    IMAGE_UPLOAD: 60 * 1000,

    /** Toast notification duration */
    TOAST_DURATION: 3000,

    /** Loading skeleton display minimum */
    SKELETON_MIN_DISPLAY: 300,

    /** Debounce for search input */
    SEARCH_DEBOUNCE: 300,

    /** Realtime reconnection delay */
    REALTIME_RECONNECT: 5000,
} as const;

// =============================================================================
// LIMITS
// =============================================================================
export const LIMITS = {
    /** Maximum players in a match */
    MAX_MATCH_PLAYERS: 100,

    /** Minimum players in a match */
    MIN_MATCH_PLAYERS: 2,

    /** Maximum images per court */
    MAX_COURT_IMAGES: 10,

    /** Maximum image size (10MB) */
    MAX_IMAGE_SIZE: 10 * 1024 * 1024,

    /** Recommended image width for uploads */
    RECOMMENDED_IMAGE_WIDTH: 1024,

    /** Image compression quality */
    IMAGE_COMPRESSION: 0.8,

    /** Maximum bio length */
    MAX_BIO_LENGTH: 500,

    /** Maximum court description */
    MAX_DESCRIPTION_LENGTH: 2000,
} as const;

// =============================================================================
// SPORTS
// =============================================================================
export const SPORTS = {
    BEACH_TENNIS: 'Beach Tennis',
    PADEL: 'Padel',
    TENNIS: 'Tennis',
    VOLLEYBALL: 'Volleyball',
    FUTEVOLEI: 'Futevolei',
    FOOTBALL: 'Football',
    BASKETBALL: 'Basketball',
    HANDBALL: 'Handball',
} as const;

export const SPORTS_LIST = Object.values(SPORTS);

// =============================================================================
// SKILL LEVELS
// =============================================================================
export const SKILL_LEVELS = {
    BEGINNER: { value: 1, label: 'Iniciante', range: '1.0 - 2.0' },
    INTERMEDIATE: { value: 2, label: 'Intermediário', range: '2.5 - 3.5' },
    ADVANCED: { value: 3, label: 'Avançado', range: '4.0 - 4.5' },
    PRO: { value: 4, label: 'Profissional', range: '5.0+' },
} as const;

// =============================================================================
// MATCH STATUS
// =============================================================================
export const MATCH_STATUS = {
    SCHEDULED: 'scheduled',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
} as const;

// =============================================================================
// BOOKING STATUS
// =============================================================================
export const BOOKING_STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    COMPLETED: 'completed',
    NO_SHOW: 'no_show',
} as const;

// =============================================================================
// PAYMENT STATUS
// =============================================================================
export const PAYMENT_STATUS = {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SUCCEEDED: 'succeeded',
    FAILED: 'failed',
    REFUNDED: 'refunded',
} as const;

// =============================================================================
// DISTANCES (for nearby search)
// =============================================================================
export const DISTANCES = {
    /** Default search radius in km */
    DEFAULT_RADIUS_KM: 10,

    /** Maximum search radius in km */
    MAX_RADIUS_KM: 50,

    /** Nearby threshold in km */
    NEARBY_THRESHOLD_KM: 5,
} as const;

// =============================================================================
// ACCESSIBILITY
// =============================================================================
export const A11Y = {
    /** Minimum touch target size (iOS/Android guidelines) */
    MIN_TOUCH_SIZE: 44,

    /** Minimum contrast ratio for text (WCAG AA) */
    MIN_CONTRAST_RATIO: 4.5,

    /** Minimum contrast ratio for large text (WCAG AA) */
    MIN_CONTRAST_RATIO_LARGE: 3,
} as const;

// =============================================================================
// COLORS (accessible alternatives)
// =============================================================================
export const ACCESSIBLE_COLORS = {
    /** Gray that passes WCAG AA on white background */
    TEXT_SECONDARY: '#6B7280', // Gray-500 instead of Gray-400

    /** Darker gray for better contrast */
    TEXT_TERTIARY: '#4B5563', // Gray-600

    /** Error red with good contrast */
    ERROR: '#DC2626',

    /** Success green with good contrast */
    SUCCESS: '#059669',

    /** Warning yellow (use with dark text) */
    WARNING: '#D97706',
} as const;

// =============================================================================
// ANALYTICS EVENTS
// =============================================================================
export const ANALYTICS_EVENTS = {
    // App lifecycle
    APP_OPEN: 'app_open',
    APP_CLOSE: 'app_close',

    // Auth
    LOGIN: 'login',
    LOGOUT: 'logout',
    REGISTER: 'register',

    // Matches
    MATCH_VIEW: 'match_view',
    MATCH_CREATE: 'match_create',
    MATCH_JOIN: 'match_join',
    MATCH_LEAVE: 'match_leave',
    MATCH_COMPLETE: 'match_complete',

    // Bookings
    BOOKING_START: 'booking_start',
    BOOKING_COMPLETE: 'booking_complete',
    BOOKING_CANCEL: 'booking_cancel',

    // Social
    PROFILE_VIEW: 'profile_view',
    FOLLOW: 'follow',
    UNFOLLOW: 'unfollow',
    POST_CREATE: 'post_create',
    POST_LIKE: 'post_like',

    // Search
    SEARCH: 'search',
    COURT_VIEW: 'court_view',
} as const;
