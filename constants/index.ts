// App Colors
export const Colors = {
  // Primary brand color
  primary: '#000000',
  primaryLight: '#333333',
  primaryDark: '#000000',

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

  // Neutral palette
  neutral: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#E5E5E5',
    300: '#D4D4D4',
    400: '#A3A3A3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },

  // Background
  background: '#FAFAFA',
  card: '#FFFFFF',
  border: '#E5E5E5',

  // Text
  text: '#000000',
  textSecondary: '#525252',
  textMuted: '#A3A3A3',
  textInverse: '#FFFFFF',
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
  },
  intermediate: {
    id: 'intermediate',
    name: 'Intermediário',
    description: 'Jogo regularmente',
  },
  advanced: {
    id: 'advanced',
    name: 'Avançado',
    description: 'Jogo competitivamente',
  },
  professional: {
    id: 'professional',
    name: 'Profissional',
    description: 'Atleta profissional',
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
