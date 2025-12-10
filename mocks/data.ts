// Mock data for development and testing

export interface MockCourt {
  id: string;
  name: string;
  address: string;
  city: string;
  sport: string;
  sports: string[];
  price_per_hour: number;
  rating: number;
  review_count: number;
  images: string[];
  latitude: number;
  longitude: number;
  distance?: number;
  amenities: string[];
  is_favorite?: boolean;
  availability: string;
  owner: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export const MOCK_COURTS: MockCourt[] = [
  {
    id: '1',
    name: 'Arena Beach Tennis Premium',
    address: 'Av. Brigadeiro Faria Lima, 3477',
    city: 'São Paulo, SP',
    sport: 'beach-tennis',
    sports: ['beach-tennis', 'futevolei'],
    price_per_hour: 120,
    rating: 4.8,
    review_count: 234,
    images: [
      'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    ],
    latitude: -23.5678,
    longitude: -46.6912,
    distance: 1.2,
    amenities: ['parking', 'wifi', 'snackbar', 'locker', 'shower'],
    is_favorite: true,
    availability: 'Disponível hoje',
    owner: {
      id: 'owner1',
      name: 'Carlos Silva',
      avatar_url: null,
    },
  },
  {
    id: '2',
    name: 'Quadra do Parque',
    address: 'Rua Oscar Freire, 890',
    city: 'São Paulo, SP',
    sport: 'padel',
    sports: ['padel', 'tennis'],
    price_per_hour: 90,
    rating: 4.5,
    review_count: 156,
    images: [
      'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=800',
    ],
    latitude: -23.5612,
    longitude: -46.6689,
    distance: 2.5,
    amenities: ['parking', 'wifi', 'equipment'],
    is_favorite: false,
    availability: 'Próximo horário: 14h',
    owner: {
      id: 'owner2',
      name: 'Ana Rodrigues',
      avatar_url: null,
    },
  },
  {
    id: '3',
    name: 'Centro Esportivo Ibirapuera',
    address: 'Av. Pedro Álvares Cabral, s/n',
    city: 'São Paulo, SP',
    sport: 'volleyball',
    sports: ['volleyball', 'basketball', 'futevolei'],
    price_per_hour: 80,
    rating: 4.7,
    review_count: 312,
    images: [
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800',
    ],
    latitude: -23.5874,
    longitude: -46.6576,
    distance: 3.8,
    amenities: ['parking', 'snackbar', 'locker', 'shower', 'lighting'],
    is_favorite: true,
    availability: 'Lotado hoje',
    owner: {
      id: 'owner3',
      name: 'Pedro Costa',
      avatar_url: null,
    },
  },
  {
    id: '4',
    name: 'Beach Club Vila Olímpia',
    address: 'Rua Funchal, 538',
    city: 'São Paulo, SP',
    sport: 'beach-tennis',
    sports: ['beach-tennis', 'volleyball'],
    price_per_hour: 150,
    rating: 4.9,
    review_count: 89,
    images: [
      'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800',
    ],
    latitude: -23.5945,
    longitude: -46.6834,
    distance: 4.2,
    amenities: ['parking', 'wifi', 'snackbar', 'locker', 'shower', 'equipment', 'aircon'],
    is_favorite: false,
    availability: 'Disponível hoje',
    owner: {
      id: 'owner4',
      name: 'Mariana Lima',
      avatar_url: null,
    },
  },
  {
    id: '5',
    name: 'Tênis Clube Pinheiros',
    address: 'Rua Mateus Grou, 400',
    city: 'São Paulo, SP',
    sport: 'tennis',
    sports: ['tennis', 'padel'],
    price_per_hour: 200,
    rating: 4.6,
    review_count: 445,
    images: [
      'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=800',
    ],
    latitude: -23.5567,
    longitude: -46.6945,
    distance: 5.1,
    amenities: ['parking', 'wifi', 'snackbar', 'locker', 'shower', 'equipment'],
    is_favorite: false,
    availability: 'Próximo horário: 16h',
    owner: {
      id: 'owner5',
      name: 'João Santos',
      avatar_url: null,
    },
  },
];

// Mock time slots
export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  price: number;
}

export const MOCK_TIME_SLOTS: TimeSlot[] = [
  { id: '1', time: '08:00', available: true, price: 80 },
  { id: '2', time: '09:00', available: true, price: 80 },
  { id: '3', time: '10:00', available: false, price: 100 },
  { id: '4', time: '11:00', available: false, price: 100 },
  { id: '5', time: '12:00', available: true, price: 80 },
  { id: '6', time: '13:00', available: true, price: 80 },
  { id: '7', time: '14:00', available: true, price: 100 },
  { id: '8', time: '15:00', available: false, price: 120 },
  { id: '9', time: '16:00', available: true, price: 120 },
  { id: '10', time: '17:00', available: true, price: 150 },
  { id: '11', time: '18:00', available: false, price: 150 },
  { id: '12', time: '19:00', available: true, price: 150 },
  { id: '13', time: '20:00', available: true, price: 150 },
  { id: '14', time: '21:00', available: false, price: 120 },
  { id: '15', time: '22:00', available: true, price: 100 },
];

// Mock bookings
export interface MockBooking {
  id: string;
  court: MockCourt;
  date: string;
  time: string;
  duration: number;
  price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  players: { id: string; name: string; avatar_url: string | null }[];
  created_at: string;
}

export const MOCK_BOOKINGS: MockBooking[] = [
  {
    id: 'b1',
    court: MOCK_COURTS[0],
    date: '2024-12-05',
    time: '14:00',
    duration: 60,
    price: 120,
    status: 'confirmed',
    players: [
      { id: 'u1', name: 'Você', avatar_url: null },
      { id: 'u2', name: 'Carlos Silva', avatar_url: null },
    ],
    created_at: '2024-12-01T10:00:00Z',
  },
  {
    id: 'b2',
    court: MOCK_COURTS[1],
    date: '2024-12-08',
    time: '10:00',
    duration: 90,
    price: 135,
    status: 'pending',
    players: [
      { id: 'u1', name: 'Você', avatar_url: null },
    ],
    created_at: '2024-12-02T15:30:00Z',
  },
  {
    id: 'b3',
    court: MOCK_COURTS[2],
    date: '2024-11-28',
    time: '18:00',
    duration: 60,
    price: 80,
    status: 'completed',
    players: [
      { id: 'u1', name: 'Você', avatar_url: null },
      { id: 'u3', name: 'Ana Rodrigues', avatar_url: null },
      { id: 'u4', name: 'Pedro Costa', avatar_url: null },
    ],
    created_at: '2024-11-25T09:00:00Z',
  },
];

// Mock user profile
export interface MockUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar_url: string | null;
  bio: string;
  level: string;
  favorite_sports: string[];
  location: string;
  stats: {
    matches_played: number;
    wins: number;
    friends: number;
    courts_visited: number;
  };
  achievements: {
    id: string;
    name: string;
    description: string;
    icon: string;
    unlocked: boolean;
  }[];
}

export const MOCK_USER: MockUser = {
  id: 'current-user',
  name: 'Bruno Oliveira',
  email: 'bruno@email.com',
  phone: '+55 11 99999-9999',
  avatar_url: null,
  bio: 'Apaixonado por esportes de praia. Jogando beach tennis há 2 anos.',
  level: 'intermediate',
  favorite_sports: ['beach-tennis', 'futevolei'],
  location: 'São Paulo, SP',
  stats: {
    matches_played: 45,
    wins: 28,
    friends: 23,
    courts_visited: 12,
  },
  achievements: [
    {
      id: 'a1',
      name: 'Primeira Partida',
      description: 'Complete sua primeira partida',
      icon: '🎾',
      unlocked: true,
    },
    {
      id: 'a2',
      name: 'Explorador',
      description: 'Visite 10 quadras diferentes',
      icon: '🗺️',
      unlocked: true,
    },
    {
      id: 'a3',
      name: 'Vencedor',
      description: 'Vença 25 partidas',
      icon: '🏆',
      unlocked: true,
    },
    {
      id: 'a4',
      name: 'Social',
      description: 'Adicione 20 amigos',
      icon: '👥',
      unlocked: true,
    },
    {
      id: 'a5',
      name: 'Maratonista',
      description: 'Jogue 100 partidas',
      icon: '🔥',
      unlocked: false,
    },
  ],
};

// Mock reviews
export interface MockReview {
  id: string;
  user: { id: string; name: string; avatar_url: string | null };
  rating: number;
  comment: string;
  date: string;
  helpful_count: number;
}

export const MOCK_REVIEWS: MockReview[] = [
  {
    id: 'r1',
    user: { id: 'u2', name: 'Carlos Silva', avatar_url: null },
    rating: 5,
    comment: 'Excelente quadra! Areia de qualidade e bem cuidada. O pessoal do bar é super atencioso.',
    date: '2024-11-28',
    helpful_count: 12,
  },
  {
    id: 'r2',
    user: { id: 'u3', name: 'Ana Rodrigues', avatar_url: null },
    rating: 4,
    comment: 'Boa estrutura, mas o estacionamento fica lotado nos horários de pico.',
    date: '2024-11-25',
    helpful_count: 8,
  },
  {
    id: 'r3',
    user: { id: 'u4', name: 'Pedro Costa', avatar_url: null },
    rating: 5,
    comment: 'Melhor quadra da região! Preço justo e qualidade top.',
    date: '2024-11-20',
    helpful_count: 15,
  },
];

// Mock notifications
export interface MockNotification {
  id: string;
  type: 'booking' | 'social' | 'promo' | 'system';
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  data?: Record<string, any>;
}

export const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: 'n1',
    type: 'booking',
    title: 'Reserva confirmada!',
    message: 'Sua reserva na Arena Beach Tennis Premium foi confirmada para amanhã às 14h.',
    read: false,
    created_at: '2024-12-02T10:00:00Z',
    data: { booking_id: 'b1' },
  },
  {
    id: 'n2',
    type: 'social',
    title: 'Novo amigo',
    message: 'Carlos Silva aceitou seu pedido de amizade.',
    read: false,
    created_at: '2024-12-01T18:30:00Z',
    data: { user_id: 'u2' },
  },
  {
    id: 'n3',
    type: 'promo',
    title: '🎉 Desconto especial!',
    message: 'Use o cupom BEACH20 e ganhe 20% off na sua próxima reserva.',
    read: true,
    created_at: '2024-11-30T12:00:00Z',
  },
  {
    id: 'n4',
    type: 'booking',
    title: 'Lembrete de partida',
    message: 'Sua partida na Quadra do Parque começa em 1 hora.',
    read: true,
    created_at: '2024-11-28T17:00:00Z',
    data: { booking_id: 'b3' },
  },
];

// Mock friends / social
export interface MockFriend {
  id: string;
  name: string;
  avatar_url: string | null;
  level: string;
  favorite_sport: string;
  mutual_friends: number;
  is_online: boolean;
}

export const MOCK_FRIENDS: MockFriend[] = [
  {
    id: 'u2',
    name: 'Carlos Silva',
    avatar_url: null,
    level: 'Avançado',
    favorite_sport: 'beach-tennis',
    mutual_friends: 5,
    is_online: true,
  },
  {
    id: 'u3',
    name: 'Ana Rodrigues',
    avatar_url: null,
    level: 'Intermediário',
    favorite_sport: 'padel',
    mutual_friends: 3,
    is_online: false,
  },
  {
    id: 'u4',
    name: 'Pedro Costa',
    avatar_url: null,
    level: 'Avançado',
    favorite_sport: 'tennis',
    mutual_friends: 8,
    is_online: true,
  },
  {
    id: 'u5',
    name: 'Mariana Lima',
    avatar_url: null,
    level: 'Iniciante',
    favorite_sport: 'volleyball',
    mutual_friends: 2,
    is_online: false,
  },
];

// Sports map for quick lookup
export const SPORTS_MAP: Record<string, { name: string; emoji: string; color: string }> = {
  'beach-tennis': { name: 'Beach Tennis', emoji: '🎾', color: '#FF6B00' },
  padel: { name: 'Padel', emoji: '🎾', color: '#3B82F6' },
  tennis: { name: 'Tênis', emoji: '🎾', color: '#22C55E' },
  futevolei: { name: 'Futevôlei', emoji: '⚽', color: '#EAB308' },
  volleyball: { name: 'Vôlei', emoji: '🏐', color: '#8B5CF6' },
  basketball: { name: 'Basquete', emoji: '🏀', color: '#F97316' },
  soccer: { name: 'Futebol', emoji: '⚽', color: '#10B981' },
};
