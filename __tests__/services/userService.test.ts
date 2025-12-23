import { userService } from '../../services/userService';
import { supabase } from '../../lib/supabase';

// Mock modules
jest.mock('../../lib/supabase');
jest.mock('../../utils/logger');

describe('userService', () => {
  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
  };

  const mockProfile = {
    id: 'user-123',
    full_name: 'John Doe',
    username: 'johndoe',
    avatar_url: 'https://example.com/avatar.jpg',
    bio: 'Beach tennis player',
    level: 'intermediate',
    sports: ['BeachTennis'],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getProfile', () => {
    it('should fetch user profile successfully', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      });

      const result = await userService.getProfile('user-123');

      expect(result).toEqual(mockProfile);
      expect(supabase.from).toHaveBeenCalledWith('profiles');
    });

    it('should throw error when profile not found', async () => {
      const mockError = { message: 'Profile not found' };
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

      await expect(userService.getProfile('user-123')).rejects.toEqual(mockError);
    });
  });

  describe('updateProfile', () => {
    it('should update profile with valid data', async () => {
      const updates = {
        name: 'Jane Doe',
        bio: 'Professional tennis player',
      };

      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { ...mockProfile, ...updates },
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await userService.updateProfile('user-123', updates);

      expect(result.name).toBe('Jane Doe');
      expect(result.bio).toBe('Professional tennis player');
    });

    it('should sanitize inputs to prevent XSS', async () => {
      const updates = {
        name: 'John<script>alert("XSS")</script>',
        bio: '<img src=x onerror=alert(1)>',
      };

      const updateMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: mockProfile,
              error: null,
            }),
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: updateMock,
      });

      await userService.updateProfile('user-123', updates);

      // Verify sanitization occurred
      expect(updateMock).toHaveBeenCalled();
      const sanitizedData = updateMock.mock.calls[0][0];
      expect(sanitizedData.name).not.toContain('<script>');
      expect(sanitizedData.bio).not.toContain('<img');
    });

    it('should fail with invalid name', async () => {
      const updates = {
        name: 'A', // Too short
      };

      await expect(
        userService.updateProfile('user-123', updates)
      ).rejects.toThrow();
    });

    it('should fail with very long bio', async () => {
      const updates = {
        bio: 'A'.repeat(600), // Exceeds MAX_LENGTHS.BIO (500)
      };

      await expect(
        userService.updateProfile('user-123', updates)
      ).rejects.toThrow();
    });

    it('should handle database errors gracefully', async () => {
      const mockError = { message: 'Database error' };
      (supabase.from as jest.Mock).mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: mockError,
              }),
            }),
          }),
        }),
      });

      await expect(
        userService.updateProfile('user-123', { name: 'Valid Name' })
      ).rejects.toEqual(mockError);
    });
  });

  describe('getSuggestions', () => {
    it('should fetch user suggestions', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      const mockSuggestions = [
        { ...mockProfile, id: 'user-456', full_name: 'Alice' },
        { ...mockProfile, id: 'user-789', full_name: 'Bob' },
      ];

      // Mock the profiles query
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          neq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: mockSuggestions,
                error: null,
              }),
            }),
          }),
        }),
      });

      // Mock the follows query
      (supabase.from as jest.Mock).mockReturnValueOnce({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockResolvedValue({
            data: [],
            error: null,
          }),
        }),
      });

      const result = await userService.getSuggestions();

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return empty array when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await userService.getSuggestions();

      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          neq: jest.fn().mockReturnValue({
            is: jest.fn().mockReturnValue({
              limit: jest.fn().mockResolvedValue({
                data: null,
                error: { message: 'Database error' },
              }),
            }),
          }),
        }),
      });

      const result = await userService.getSuggestions();

      expect(result).toEqual([]);
    });
  });

  describe('followUser', () => {
    it('should follow a user successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { id: 'follow-123' },
              error: null,
            }),
          }),
        }),
      });

      const result = await userService.followUser('user-456');

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it('should fail when trying to follow yourself', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      await expect(
        userService.followUser(mockUser.id)
      ).rejects.toThrow('não pode seguir a si mesmo');
    });

    it('should handle duplicate follow gracefully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: jest.fn().mockReturnValue({
          select: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: '23505', message: 'duplicate key value' },
            }),
          }),
        }),
      });

      await expect(
        userService.followUser('user-456')
      ).rejects.toThrow('já está seguindo');
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(
        userService.followUser('user-456')
      ).rejects.toThrow('autenticado');
    });
  });

  describe('unfollowUser', () => {
    it('should unfollow a user successfully', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: null,
            }),
          }),
        }),
      });

      const result = await userService.unfollowUser('user-456');

      expect(result.success).toBe(true);
    });

    it('should fail when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      await expect(
        userService.unfollowUser('user-456')
      ).rejects.toThrow('autenticado');
    });

    it('should handle database errors', async () => {
      const mockError = { message: 'Database error' };
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            }),
          }),
        }),
      });

      await expect(
        userService.unfollowUser('user-456')
      ).rejects.toEqual(mockError);
    });
  });

  describe('isFollowing', () => {
    it('should return true when following', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: { id: 'follow-123' },
                error: null,
              }),
            }),
          }),
        }),
      });

      const result = await userService.isFollowing('user-456');

      expect(result).toBe(true);
    });

    it('should return false when not following', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: null,
                error: { code: 'PGRST116', message: 'Not found' },
              }),
            }),
          }),
        }),
      });

      const result = await userService.isFollowing('user-456');

      expect(result).toBe(false);
    });

    it('should return false when user is not authenticated', async () => {
      (supabase.auth.getUser as jest.Mock).mockResolvedValue({
        data: { user: null },
        error: null,
      });

      const result = await userService.isFollowing('user-456');

      expect(result).toBe(false);
    });
  });

  describe('checkUsernameAvailability', () => {
    it('should return true when username is available', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: null,
              error: { code: 'PGRST116', message: 'Not found' },
            }),
          }),
        }),
      });

      const result = await userService.checkUsernameAvailability('newusername');

      expect(result).toBe(true);
    });

    it('should return false when username is taken', async () => {
      (supabase.from as jest.Mock).mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            single: jest.fn().mockResolvedValue({
              data: { username: 'existinguser' },
              error: null,
            }),
          }),
        }),
      });

      const result = await userService.checkUsernameAvailability('existinguser');

      expect(result).toBe(false);
    });

    it('should fail with invalid username', async () => {
      await expect(
        userService.checkUsernameAvailability('ab')
      ).rejects.toThrow('Username inválido');
    });

    it('should sanitize username before checking', async () => {
      const selectMock = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116' },
          }),
        }),
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: selectMock,
      });

      await userService.checkUsernameAvailability('User<script>Name</script>');

      expect(selectMock).toHaveBeenCalled();
    });
  });
});
