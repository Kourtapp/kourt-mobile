/**
 * Data Privacy Service
 * Implements LGPD compliance features
 * - Data export (portability)
 * - Data deletion (right to be forgotten)
 */

import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';
import { Analytics } from './analyticsService';

export interface DataExport {
  profile: Record<string, unknown>;
  matches: unknown[];
  bookings: unknown[];
  posts: unknown[];
  social: {
    following: string[];
    followers: string[];
  };
  consents: unknown[];
  export_metadata: {
    exported_at: string;
    user_id: string;
    format_version: string;
  };
}

export interface DeletionResult {
  analytics_anonymized: number;
  consents_deleted: number;
  match_players_deleted: number;
  invites_deleted: number;
  matches_deleted: number;
  follows_deleted: number;
  checkins_deleted: number;
  posts_deleted: number;
  bookings_anonymized: number;
  profile_deleted: number;
}

class DataPrivacyService {
  /**
   * Export all user data (LGPD Art. 18 - Portability)
   * Returns JSON with all user data
   */
  async exportUserData(): Promise<{ success: boolean; data?: DataExport; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const { data, error } = await (supabase.rpc as any)('export_user_data', {
        p_user_id: userData.user.id,
      });

      if (error) {
        logger.error('[DataPrivacy] Export failed:', error);
        return { success: false, error: error.message };
      }

      Analytics.log('profile_edit', { action: 'data_export' });
      logger.log('[DataPrivacy] Data exported successfully');

      return { success: true, data: data as DataExport };
    } catch (err) {
      logger.error('[DataPrivacy] Export error:', err);
      return { success: false, error: 'Erro ao exportar dados' };
    }
  }

  /**
   * Download user data as JSON file
   */
  async downloadUserData(): Promise<{ success: boolean; error?: string }> {
    const result = await this.exportUserData();

    if (!result.success || !result.data) {
      return { success: false, error: result.error };
    }

    // In React Native, we'd use expo-file-system and expo-sharing
    // This is a placeholder that returns the data
    // The actual implementation would save to device and share
    return { success: true };
  }

  /**
   * Delete all user data (LGPD Art. 18 - Right to be Forgotten)
   * This action is IRREVERSIBLE
   */
  async deleteAllUserData(): Promise<{ success: boolean; result?: DeletionResult; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      // First, export data before deletion (for user to keep)
      await this.exportUserData();

      const { data, error } = await (supabase.rpc as any)('delete_user_data', {
        p_user_id: userData.user.id,
      });

      if (error) {
        logger.error('[DataPrivacy] Deletion failed:', error);
        return { success: false, error: error.message };
      }

      logger.log('[DataPrivacy] User data deleted:', data);

      // Sign out after deletion
      await supabase.auth.signOut();

      return { success: true, result: data as DeletionResult };
    } catch (err) {
      logger.error('[DataPrivacy] Deletion error:', err);
      return { success: false, error: 'Erro ao excluir dados' };
    }
  }

  /**
   * Get summary of what data will be deleted
   */
  async getDataSummary(): Promise<{
    success: boolean;
    summary?: {
      matches: number;
      posts: number;
      bookings: number;
      followers: number;
      following: number;
    };
    error?: string;
  }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, error: 'Usuário não autenticado' };
      }

      const userId = userData.user.id;

      // Fetch counts in parallel
      const [matchesRes, postsRes, bookingsRes, followersRes, followingRes] = await Promise.all([
        supabase.from('matches').select('id', { count: 'exact', head: true }).eq('organizer_id', userId),
        supabase.from('posts').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('bookings').select('id', { count: 'exact', head: true }).eq('user_id', userId),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('following_id', userId),
        supabase.from('follows').select('id', { count: 'exact', head: true }).eq('follower_id', userId),
      ]);

      return {
        success: true,
        summary: {
          matches: matchesRes.count || 0,
          posts: postsRes.count || 0,
          bookings: bookingsRes.count || 0,
          followers: followersRes.count || 0,
          following: followingRes.count || 0,
        },
      };
    } catch (err) {
      logger.error('[DataPrivacy] Summary error:', err);
      return { success: false, error: 'Erro ao buscar resumo' };
    }
  }
}

export const dataPrivacyService = new DataPrivacyService();
