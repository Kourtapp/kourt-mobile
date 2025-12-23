// Mock Supabase client
const mockSupabaseClient = {
  auth: {
    getUser: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    neq: jest.fn().mockReturnThis(),
    gte: jest.fn().mockReturnThis(),
    lt: jest.fn().mockReturnThis(),
    is: jest.fn().mockReturnThis(),
    or: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
  rpc: jest.fn(),
  channel: jest.fn(() => ({
    on: jest.fn().mockReturnThis(),
    subscribe: jest.fn(),
  })),
  removeChannel: jest.fn(),
};

// Mock the supabase module
jest.mock('./lib/supabase', () => ({
  supabase: mockSupabaseClient,
}));

// Mock logger
jest.mock('./utils/logger', () => ({
  logger: {
    log: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
  },
}));

// Mock analytics service
jest.mock('./services/analyticsService', () => ({
  Analytics: {
    log: jest.fn(),
    track: jest.fn(),
  },
}));

// Mock Stripe service
jest.mock('./services/stripeService', () => ({
  stripeService: {
    createPaymentIntent: jest.fn(),
    createPixPayment: jest.fn(),
  },
}));

// Reset mocks before each test
beforeEach(() => {
  jest.clearAllMocks();
});
