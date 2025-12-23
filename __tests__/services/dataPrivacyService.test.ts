import { dataPrivacyService } from '../../services/dataPrivacyService';
import { supabase } from '../../lib/supabase';

// Mock modules
jest.mock('../../lib/supabase');
jest.mock('../../utils/logger');
jest.mock('../../services/analyticsService');

describe('DataPrivacyService', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockExportData = {
    profile: {
      id: 'user-123',
      name: 'Test User',
      email: 'test@example.com',
    },
    matches: [{ id: 'match-1' }],
    bookings: [],
    posts: [],
    social: {
      following: ['user-456'],
      followers: ['user-789'],
    },
    consents: [{ type: 'analytics', granted: true }],
    export_metadata: {
      exported_at: '2025-12-22T00:00:00Z',
      user_id: 'user-123',
      format_version: '1.0',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('exportUserData', () => {
    it('should export all user data successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: mockExportData,
        error: null,
      });

      const result = await dataPrivacyService.exportUserData();

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockExportData);
      expect(supabase.rpc).toHaveBeenCalledWith('export_user_data', {
        p_user_id: mockUser.id,
      });
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await dataPrivacyService.exportUserData();

      expect(result.success).toBe(false);
      expect(result.error).toContain('não autenticado');
    });

    it('should handle RPC errors gracefully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.rpc as jest.Mock).mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      const result = await dataPrivacyService.exportUserData();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });
  });

  describe('deleteAllUserData', () => {
    const mockDeletionResult = {
      analytics_anonymized: 50,
      consents_deleted: 3,
      match_players_deleted: 10,
      invites_deleted: 5,
      matches_deleted: 2,
      follows_deleted: 20,
      checkins_deleted: 15,
      posts_deleted: 8,
      bookings_anonymized: 3,
      profile_deleted: 1,
    };

    it('should delete all user data successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      // Mock export (called before deletion)
      (supabase.rpc as jest.Mock)
        .mockResolvedValueOnce({ data: mockExportData, error: null })
        .mockResolvedValueOnce({ data: mockDeletionResult, error: null });

      (supabase.auth.signOut as jest.Mock).mockResolvedValue({});

      const result = await dataPrivacyService.deleteAllUserData();

      expect(result.success).toBe(true);
      expect(result.result).toEqual(mockDeletionResult);
      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await dataPrivacyService.deleteAllUserData();

      expect(result.success).toBe(false);
      expect(result.error).toContain('não autenticado');
    });

    it('should handle deletion errors', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.rpc as jest.Mock)
        .mockResolvedValueOnce({ data: mockExportData, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Deletion failed' } });

      const result = await dataPrivacyService.deleteAllUserData();

      expect(result.success).toBe(false);
      expect(result.error).toBe('Deletion failed');
    });
  });

  describe('getDataSummary', () => {
    it('should fetch summary of user data', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });


      // Mock each table query
      (supabase.from as jest.Mock)
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ count: 5 }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ count: 10 }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ count: 3 }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ count: 20 }),
          }),
        })
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({ count: 15 }),
          }),
        });

      const result = await dataPrivacyService.getDataSummary();

      expect(result.success).toBe(true);
      expect(result.summary).toBeDefined();
      expect(result.summary?.matches).toBeDefined();
      expect(result.summary?.posts).toBeDefined();
      expect(result.summary?.bookings).toBeDefined();
      expect(result.summary?.followers).toBeDefined();
      expect(result.summary?.following).toBeDefined();
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: { message: 'Not authenticated' },
      });

      const result = await dataPrivacyService.getDataSummary();

      expect(result.success).toBe(false);
      expect(result.error).toContain('não autenticado');
    });
  });
});
