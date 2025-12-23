import { courtService } from '../../services/courtService';
import { supabase } from '../../lib/supabase';

// Mock modules
jest.mock('../../lib/supabase');
jest.mock('../../utils/logger');

describe('CourtService', () => {
  const mockCourt = {
    id: 'court-123',
    name: 'Quadra Beach Tennis Centro',
    type: 'private',
    sport: 'BeachTennis',
    address: 'Rua das Palmeiras, 123',
    city: 'São Paulo',
    state: 'SP',
    latitude: -23.5505,
    longitude: -46.6333,
    price_per_hour: 80,
    rating: 4.5,
    images: ['https://example.com/court1.jpg'],
    amenities: ['estacionamento', 'vestiario', 'iluminacao'],
    operating_hours: {
      monday: { open: '06:00', close: '22:00' },
      tuesday: { open: '06:00', close: '22:00' },
    },
    is_active: true,
    created_at: '2025-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getNearbyCourts', () => {
    it('should fetch courts near a location', async () => {
      const mockCourts = [mockCourt];

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: mockCourts,
        error: null,
      });

      const result = await courtService.getNearbyCourts(-23.5505, -46.6333, 5);

      expect(result).toEqual(mockCourts);
      expect(supabase.rpc).toHaveBeenCalledWith('get_nearby_courts', {
        p_latitude: -23.5505,
        p_longitude: -46.6333,
        p_radius_km: 5,
      });
    });

    it('should throw error on database error', async () => {
      const mockError = { message: 'Database error' };
      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: mockError,
      });

      await expect(courtService.getNearbyCourts(-23.5505, -46.6333, 5))
        .rejects.toEqual(mockError);
    });

    it('should use default radius if not provided', async () => {
      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: [],
        error: null,
      });

      await courtService.getNearbyCourts(-23.5505, -46.6333);

      expect(supabase.rpc).toHaveBeenCalledWith('get_nearby_courts', {
        p_latitude: -23.5505,
        p_longitude: -46.6333,
        p_radius_km: 10, // default 10km
      });
    });
  });

  describe('getCourtDetails', () => {
    it('should fetch a court by ID', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockCourt,
              error: null,
            }),
          }),
        }),
      });

      const result = await courtService.getCourtDetails('court-123');

      expect(result).toEqual(mockCourt);
      expect(supabase.from).toHaveBeenCalledWith('courts');
    });

    it('should throw error if court not found', async () => {
      const singleMock = jest.fn().mockResolvedValue({
        data: null,
        error: { code: 'PGRST116', message: 'Not found' },
      });
      const eqMock = jest.fn().mockReturnValue({ single: singleMock });
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      await expect(courtService.getCourtDetails('invalid-id'))
        .rejects.toEqual({ code: 'PGRST116', message: 'Not found' });
    });
  });

  describe('getFeaturedCourts', () => {
    it('should fetch featured courts ordered by rating', async () => {
      const mockCourts = [mockCourt];

      const limitMock = jest.fn().mockResolvedValue({
        data: mockCourts,
        error: null,
      });

      const orderMock = jest.fn().mockReturnValue({ limit: limitMock });
      const eqMock = jest.fn().mockReturnValue({ order: orderMock });
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock });

      (supabase.from as jest.Mock).mockReturnValue({ select: selectMock });

      const result = await courtService.getFeaturedCourts();

      expect(result).toEqual(mockCourts);
      expect(supabase.from).toHaveBeenCalledWith('courts');
    });
  });

  describe('createCourt', () => {
    it('should create a court with valid data', async () => {
      const courtData = {
        name: 'Nova Quadra',
        sport: 'BeachTennis',
        address: 'Rua Teste, 123',
      };

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'new-court-123', ...courtData },
              error: null,
            }),
          }),
        }),
      });

      const result = await courtService.createCourt(courtData);

      expect((result as any).id).toBe('new-court-123');
      expect(supabase.from).toHaveBeenCalledWith('courts');
    });

    it('should throw error for short name', async () => {
      const courtData = {
        name: 'AB', // Too short (< 3 chars)
        sport: 'BeachTennis',
      };

      await expect(courtService.createCourt(courtData))
        .rejects.toThrow('Nome da quadra inválido');
    });

    it('should throw error for missing sport', async () => {
      const courtData = {
        name: 'Quadra Teste',
        // Missing sport
      };

      await expect(courtService.createCourt(courtData))
        .rejects.toThrow('Esporte é obrigatório');
    });

    it('should sanitize input data (XSS prevention)', async () => {
      const courtData = {
        name: '<script>alert("xss")</script>Quadra Teste',
        sport: 'BeachTennis',
        description: '<img onerror="alert(1)" src="x">Descrição',
      };

      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: { id: 'new-court' },
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: insertMock,
      });

      await courtService.createCourt(courtData);

      // Verify the data was sanitized (no script tags)
      expect(insertMock).toHaveBeenCalled();
      const insertedData = insertMock.mock.calls[0][0];
      expect(insertedData.name).not.toContain('<script>');
      expect(insertedData.description).not.toContain('<img');
    });
  });
});
