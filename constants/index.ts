// App Colors - Design Tokens
export const Colors = {
  // Primary brand color
  primary: '#1F2937',
  primaryLight: '#374151',
  primaryDark: '#111827',

  // Secondary
  secondary: '#FF6B00',
  secondaryLight: '#FF8533',
  secondaryDark: '#CC5500',

  // Semantic colors
  success: '#22C55E',
  successLight: '#4ADE80',
  successDark: '#16A34A',

  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',

  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',

  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',

  // Neutral palette (400+ are WCAG AA compliant on white)
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#737373',   // Contrast: 4.6:1 ✓ (was #A3A3A3 with 2.8:1)
    500: '#525252',   // Contrast: 7.5:1 ✓
    600: '#404040',   // Contrast: 9.6:1 ✓
    700: '#262626',   // Contrast: 14.4:1 ✓
    800: '#171717',   // Contrast: 17.5:1 ✓
    900: '#0A0A0A',   // Contrast: 20.1:1 ✓
  },

  // Slate palette (for dark UI elements)
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
  },

  // Background
  background: '#FAFAFA',
  card: '#FFFFFF',
  border: '#E5E5E5',

  // Text (WCAG AA compliant - min 4.5:1 contrast on white)
  text: '#1F2937',           // Contrast: 12.6:1 ✓
  textSecondary: '#525252',  // Contrast: 7.5:1 ✓
  textMuted: '#6B7280',      // Contrast: 5.0:1 ✓ (was #A3A3A3 with 2.8:1)
  textInverse: '#FFFFFF',

  // Transparent overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Status specific
  online: '#22C55E',
  offline: '#EF4444',
  away: '#F59E0B',
};

// Spacing tokens (in pixels)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
};

// Border radius tokens
export const BorderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  '3xl': 24,
  full: 9999,
};

// Shadow presets
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Typography sizes
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
};

// Sports configuration
export const SPORTS_CONFIG = {
  'beach-tennis': {
    id: 'beach-tennis',
    name: 'Beach Tennis',
    emoji: '🎾',
    color: '#FF6B00',
    iconBg: '#FFF3E6',
  },
  padel: {
    id: 'padel',
    name: 'Padel',
    emoji: '🎾',
    color: '#3B82F6',
    iconBg: '#EFF6FF',
  },
  tennis: {
    id: 'tennis',
    name: 'Tênis',
    emoji: '🎾',
    color: '#22C55E',
    iconBg: '#F0FDF4',
  },
  futevolei: {
    id: 'futevolei',
    name: 'Futevôlei',
    emoji: '⚽',
    color: '#EAB308',
    iconBg: '#FEFCE8',
  },
  volleyball: {
    id: 'volleyball',
    name: 'Vôlei',
    emoji: '🏐',
    color: '#8B5CF6',
    iconBg: '#F5F3FF',
  },
  basketball: {
    id: 'basketball',
    name: 'Basquete',
    emoji: '🏀',
    color: '#F97316',
    iconBg: '#FFF7ED',
  },
  soccer: {
    id: 'soccer',
    name: 'Futebol',
    emoji: '⚽',
    color: '#10B981',
    iconBg: '#ECFDF5',
  },
};

export const SPORTS_MAP = SPORTS_CONFIG;

// Levels configuration
export const LEVELS = {
  beginner: {
    id: 'beginner',
    name: 'Iniciante',
    description: 'Estou começando agora',
    color: '#22C55E', // green
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediário',
    description: 'Jogo regularmente',
    color: '#3B82F6', // blue
  },
  advanced: {
    id: 'advanced',
    name: 'Avançado',
    description: 'Jogo competitivamente',
    color: '#F59E0B', // amber
  },
  professional: {
    id: 'professional',
    name: 'Profissional',
    description: 'Atleta profissional',
    color: '#8B5CF6', // purple
  },
};

// Amenities
export const AMENITIES = {
  parking: { id: 'parking', name: 'Estacionamento', icon: 'car' },
  wifi: { id: 'wifi', name: 'Wi-Fi', icon: 'wifi' },
  snackbar: { id: 'snackbar', name: 'Lanchonete', icon: 'coffee' },
  locker: { id: 'locker', name: 'Vestiário', icon: 'door-closed' },
  shower: { id: 'shower', name: 'Chuveiro', icon: 'droplets' },
  equipment: { id: 'equipment', name: 'Aluguel de equipamento', icon: 'package' },
  lighting: { id: 'lighting', name: 'Iluminação', icon: 'lightbulb' },
  aircon: { id: 'aircon', name: 'Ar condicionado', icon: 'wind' },
};

// Booking status
export const BOOKING_STATUS = {
  pending: { id: 'pending', name: 'Pendente', color: Colors.warning },
  confirmed: { id: 'confirmed', name: 'Confirmada', color: Colors.success },
  cancelled: { id: 'cancelled', name: 'Cancelada', color: Colors.error },
  completed: { id: 'completed', name: 'Concluída', color: Colors.neutral[500] },
};

// Payment methods
export const PAYMENT_METHODS = {
  credit: { id: 'credit', name: 'Cartão de Crédito', icon: 'credit-card' },
  debit: { id: 'debit', name: 'Cartão de Débito', icon: 'credit-card' },
  pix: { id: 'pix', name: 'PIX', icon: 'qr-code' },
  wallet: { id: 'wallet', name: 'Carteira', icon: 'wallet' },
};

// App config
export const APP_CONFIG = {
  name: 'Kourt',
  version: '1.0.0',
  supportEmail: 'suporte@kourt.app',
  privacyUrl: 'https://kourt.app/privacidade',
  termsUrl: 'https://kourt.app/termos',
};

// Default location (São Paulo)
export const DEFAULT_LOCATION = {
  latitude: -23.5505,
  longitude: -46.6333,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};

// API endpoints (when not using Supabase)
export const API_ENDPOINTS = {
  courts: '/api/courts',
  bookings: '/api/bookings',
  users: '/api/users',
  chat: '/api/chat',
};
