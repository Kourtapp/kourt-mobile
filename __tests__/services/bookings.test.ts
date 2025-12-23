import {
  createBooking,
  getBooking,
  cancelBooking,
  checkAvailability,
  CreateBookingParams,
} from '../../services/bookings';
import { supabase } from '../../lib/supabase';

// Mock modules
jest.mock('../../lib/supabase');
jest.mock('../../utils/logger');
jest.mock('../../services/stripeService');

describe('Bookings Service', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockBooking = {
    id: 'booking-123',
    user_id: 'user-123',
    court_id: 'court-123',
    date: '2025-12-25',
    start_time: '10:00',
    end_time: '11:00',
    duration_hours: 1,
    total_price: 100,
    subtotal: 90,
    service_fee: 10,
    discount_amount: 0,
    payment_status: 'pending',
    status: 'pending',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createBooking', () => {
    it('should create a booking with valid data', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockBooking,
              error: null,
            }),
          }),
        }),
      });

      const params: CreateBookingParams = {
        court_id: 'court-123',
        date: '2025-12-25',
        start_time: '10:00',
        end_time: '11:00',
        duration_hours: 1,
        total_price: 100,
        subtotal: 90,
        service_fee: 10,
      };

      const result = await createBooking(params);

      expect(result).toEqual(mockBooking);
      expect(supabase.from).toHaveBeenCalledWith('bookings');
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const params: CreateBookingParams = {
        court_id: 'court-123',
        date: '2025-12-25',
        start_time: '10:00',
        end_time: '11:00',
        duration_hours: 1,
        total_price: 100,
      };

      await expect(createBooking(params)).rejects.toThrow('logado');
    });

    it('should handle database errors', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error' },
            }),
          }),
        }),
      });

      const params: CreateBookingParams = {
        court_id: 'court-123',
        date: '2025-12-25',
        start_time: '10:00',
        end_time: '11:00',
        duration_hours: 1,
        total_price: 100,
      };

      await expect(createBooking(params)).rejects.toThrow('Erro ao criar reserva');
    });

    it('should include optional parameters', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockBooking,
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: insertMock,
      });

      const params: CreateBookingParams = {
        court_id: 'court-123',
        date: '2025-12-25',
        start_time: '10:00',
        end_time: '11:00',
        duration_hours: 1,
        total_price: 100,
        subtotal: 90,
        service_fee: 10,
        discount_amount: 5,
        coupon_code: 'DISCOUNT5',
        payment_method: 'credit_card',
      };

      await createBooking(params);

      expect(insertMock).toHaveBeenCalled();
      const insertedData = insertMock.mock.calls[0][0];
      expect(insertedData.coupon_code).toBe('DISCOUNT5');
      expect(insertedData.discount_amount).toBe(5);
      expect(insertedData.payment_method).toBe('credit_card');
    });
  });

  describe('getBooking', () => {
    it('should fetch booking details successfully', async () => {
      const mockBookingWithCourt = {
        ...mockBooking,
        court: {
          id: 'court-123',
          name: 'Court 1',
          address: '123 Main St',
          images: ['image1.jpg'],
          sport: 'BeachTennis',
        },
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockBookingWithCourt,
              error: null,
            }),
          }),
        }),
      });

      const result = await getBooking('booking-123');

      expect(result).toEqual(mockBookingWithCourt);
      expect(result.court).toBeDefined();
      expect(result.court.name).toBe('Court 1');
    });

    it('should throw error when booking not found', async () => {
      const mockError = { message: 'Not found' };
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      });

      await expect(getBooking('booking-123')).rejects.toEqual(mockError);
    });
  });

  describe('cancelBooking', () => {
    it('should cancel a booking successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      await expect(cancelBooking('booking-123')).resolves.not.toThrow();
    });

    it('should cancel with reason', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const updateMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: updateMock,
      });

      await cancelBooking('booking-123', 'Changed plans');

      expect(updateMock).toHaveBeenCalled();
      const updateData = updateMock.mock.calls[0][0];
      expect(updateData.status).toBe('cancelled');
      expect(updateData.cancellation_reason).toBe('Changed plans');
      expect(updateData.cancelled_by).toBe(mockUser.id);
      expect(updateData.cancelled_at).toBeDefined();
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(cancelBooking('booking-123')).rejects.toThrow('autenticado');
    });

    it('should handle database errors', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockError = { message: 'Database error' };
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      });

      await expect(cancelBooking('booking-123')).rejects.toEqual(mockError);
    });

    it('should only cancel user own bookings', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const secondEqMock = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      const firstEqMock = jest.fn().mockReturnValue({
        eq: secondEqMock,
      });

      const updateMock = jest.fn().mockReturnValue({
        eq: firstEqMock,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: updateMock,
      });

      await cancelBooking('booking-123');

      // Verify that both id and user_id filters are applied
      expect(firstEqMock).toHaveBeenCalledWith('id', 'booking-123');
      expect(secondEqMock).toHaveBeenCalledWith('user_id', mockUser.id);
    });
  });

  describe('checkAvailability', () => {
    it('should return true when slot is available', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              neq: jest.fn().mockReturnValue({
                or: jest.fn().mockResolvedValue({
                  data: [], // No conflicting bookings
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      const result = await checkAvailability(
        'court-123',
        '2025-12-25',
        '10:00',
        '11:00'
      );

      expect(result).toBe(true);
    });

    it('should return false when slot is occupied', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              neq: jest.fn().mockReturnValue({
                or: jest.fn().mockResolvedValue({
                  data: [mockBooking], // Conflicting booking exists
                  error: null,
                }),
              }),
            }),
          }),
        }),
      });

      const result = await checkAvailability(
        'court-123',
        '2025-12-25',
        '10:00',
        '11:00'
      );

      expect(result).toBe(false);
    });

    it('should return false on database error', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              neq: jest.fn().mockReturnValue({
                or: jest.fn().mockResolvedValue({
                  data: null,
                  error: { message: 'Database error' },
                }),
              }),
            }),
          }),
        }),
      });

      const result = await checkAvailability(
        'court-123',
        '2025-12-25',
        '10:00',
        '11:00'
      );

      expect(result).toBe(false);
    });

    it('should check for time overlap correctly', async () => {
      const orMock = jest.fn().mockResolvedValue({
        data: [],
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              neq: jest.fn().mockReturnValue({
                or: orMock,
              }),
            }),
          }),
        }),
      });

      await checkAvailability('court-123', '2025-12-25', '10:00', '11:00');

      // Verify the overlap query is correct
      expect(orMock).toHaveBeenCalledWith(
        'and(start_time.lt.11:00,end_time.gt.10:00)'
      );
    });

    it('should exclude cancelled bookings', async () => {
      const neqMock = jest.fn().mockReturnValue({
        or: jest.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              neq: neqMock,
            }),
          }),
        }),
      });

      await checkAvailability('court-123', '2025-12-25', '10:00', '11:00');

      // Verify cancelled bookings are excluded
      expect(neqMock).toHaveBeenCalledWith('status', 'cancelled');
    });
  });

  describe('getUserBookings', () => {
    it('should fetch user bookings', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockBookings = [
        {
          ...mockBooking,
          court: {
            id: 'court-123',
            name: 'Court 1',
            address: '123 Main St',
            images: ['image1.jpg'],
            sport: 'BeachTennis',
          },
        },
      ];

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockBookings,
              error: null,
            }),
          }),
        }),
      });

      const { getUserBookings } = require('../../services/bookings');
      const result = await getUserBookings();

      expect(result).toEqual(mockBookings);
      expect(result[0].court).toBeDefined();
    });

    it('should return empty array when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const { getUserBookings } = require('../../services/bookings');
      const result = await getUserBookings();

      expect(result).toEqual([]);
    });
  });
});
