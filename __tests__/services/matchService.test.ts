import { MatchService, CreateMatchData } from '../../services/matchService';
import { supabase } from '../../lib/supabase';

// Mock modules
jest.mock('../../lib/supabase');
jest.mock('../../utils/logger');
jest.mock('../../services/analyticsService');

describe('MatchService', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockMatch = {
    id: 'match-123',
    organizer_id: 'user-123',
    sport: 'BeachTennis',
    date: '2025-12-25',
    start_time: '10:00',
    end_time: '11:00',
    is_private: false,
    is_public: true,
    status: 'scheduled',
    max_players: 4,
    current_players: 1,
    level: 'intermediate',
    title: 'Partida de Beach Tennis',
    description: 'Partida amistosa',
    price_per_person: null,
    location_name: null,
    court_id: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createMatch', () => {
    it('should create a match with valid data', async () => {
      // Mock authenticated user
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock successful match creation
      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockMatch,
              error: null,
            }),
          }),
        }),
      });

      // Mock player insertion
      const mockFrom = supabase.from as jest.Mock;
      mockFrom.mockReturnValueOnce({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockMatch,
              error: null,
            }),
          }),
        }),
      }).mockReturnValueOnce({
        insert: jest.fn().mockResolvedValue({
          data: { id: 'player-123' },
          error: null,
        }),
      });

      const matchData: CreateMatchData = {
        sport: 'BeachTennis',
        date: new Date('2025-12-25T10:00:00'),
        endTime: new Date('2025-12-25T11:00:00'),
        isPrivate: false,
        maxPlayers: 4,
        level: 'intermediate',
        title: 'Partida de Beach Tennis',
        description: 'Partida amistosa',
      };

      const result = await MatchService.createMatch(matchData);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMatch);
      expect(supabase.auth.getUser).toHaveBeenCalled();
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const matchData: CreateMatchData = {
        sport: 'BeachTennis',
        date: new Date('2025-12-25T10:00:00'),
        isPrivate: false,
        maxPlayers: 4,
      };

      const result = await MatchService.createMatch(matchData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('autenticado');
    });

    it('should fail with invalid sport name', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const matchData: CreateMatchData = {
        sport: 'ab', // Too short
        date: new Date('2025-12-25T10:00:00'),
        isPrivate: false,
        maxPlayers: 4,
      };

      const result = await MatchService.createMatch(matchData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Esporte inválido');
    });

    it('should fail with invalid max players', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const matchData: CreateMatchData = {
        sport: 'BeachTennis',
        date: new Date('2025-12-25T10:00:00'),
        isPrivate: false,
        maxPlayers: 1, // Invalid: minimum is 2
      };

      const result = await MatchService.createMatch(matchData);

      expect(result.success).toBe(false);
      expect(result.error).toContain('jogadores inválido');
    });

    it('should sanitize user inputs to prevent XSS', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const insertMock = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: mockMatch,
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: insertMock,
      });

      const matchData: CreateMatchData = {
        sport: 'BeachTennis<script>alert("XSS")</script>',
        date: new Date('2025-12-25T10:00:00'),
        isPrivate: false,
        maxPlayers: 4,
        title: '<img src=x onerror=alert(1)>',
        description: '<b>Test</b>',
      };

      await MatchService.createMatch(matchData);

      // Verify sanitization happened
      expect(insertMock).toHaveBeenCalled();
      const insertedData = insertMock.mock.calls[0][0];
      expect(insertedData.sport).not.toContain('<script>');
      expect(insertedData.title).not.toContain('<img');
      expect(insertedData.description).not.toContain('<b>');
    });
  });

  describe('joinMatch', () => {
    it('should join a match successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: true,
        error: null,
      });

      const result = await MatchService.joinMatch('match-123');

      expect(result.success).toBe(true);
      expect(result.message).toContain('entrou na partida');
      expect(supabase.rpc).toHaveBeenCalledWith('join_match', {
        p_match_id: 'match-123',
        p_user_id: mockUser.id,
      });
    });

    it('should fail when match is full', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Match is full' },
      });

      const result = await MatchService.joinMatch('match-123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('cheia');
    });

    it('should handle duplicate entry gracefully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.rpc as jest.Mock).mockRejectedValue({
        code: '23505', // Unique violation
        message: 'duplicate key value',
      });

      const result = await MatchService.joinMatch('match-123');

      expect(result.success).toBe(true);
      expect(result.message).toContain('já está nesta partida');
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await MatchService.joinMatch('match-123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('autenticado');
    });
  });

  describe('leaveMatch', () => {
    it('should leave a match successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const deleteMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: deleteMock,
      });

      const result = await MatchService.leaveMatch('match-123');

      expect(result.success).toBe(true);
      expect(deleteMock).toHaveBeenCalled();
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await MatchService.leaveMatch('match-123');

      expect(result.success).toBe(false);
      expect(result.error).toContain('autenticado');
    });
  });

  describe('getUpcoming', () => {
    it('should fetch upcoming matches', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockMatches = [mockMatch];

      const orderMock = jest.fn().mockResolvedValue({
        data: mockMatches,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                order: orderMock,
              }),
            }),
          }),
        }),
      });

      const result = await MatchService.getUpcoming();

      expect(result).toEqual(mockMatches);
      expect(supabase.from).toHaveBeenCalledWith('matches');
    });

    it('should return empty array when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await MatchService.getUpcoming();

      expect(result).toEqual([]);
    });

    it('should return empty array on error', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const orderMock = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            gte: jest.fn().mockReturnValue({
              order: jest.fn().mockReturnValue({
                order: orderMock,
              }),
            }),
          }),
        }),
      });

      const result = await MatchService.getUpcoming();

      expect(result).toEqual([]);
    });
  });

  describe('getMatchDetails', () => {
    it('should fetch match details successfully', async () => {
      const mockMatchWithDetails = {
        ...mockMatch,
        court: { id: 'court-123', name: 'Court 1' },
        players: [
          {
            id: 'player-123',
            user_id: 'user-123',
            status: 'confirmed',
            profile: { full_name: 'John Doe' },
          },
        ],
      };

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockMatchWithDetails,
              error: null,
            }),
          }),
        }),
      });

      const result = await MatchService.getMatchDetails('match-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockMatchWithDetails);
    });

    it('should handle errors gracefully', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { message: 'Not found' },
            }),
          }),
        }),
      });

      const result = await MatchService.getMatchDetails('match-123');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('updateMatchStatus', () => {
    it('should update match status successfully', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: null,
          }),
        }),
      });

      const result = await MatchService.updateMatchStatus('match-123', 'completed');

      expect(result.success).toBe(true);
    });

    it('should handle errors when updating status', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: null,
            error: { message: 'Update failed' },
          }),
        }),
      });

      const result = await MatchService.updateMatchStatus('match-123', 'completed');

      expect(result.success).toBe(false);
      // The service converts non-Error objects to 'Erro desconhecido'
      expect(result.error).toBeDefined();
    });
  });
});
