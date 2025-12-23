import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';
import { logger } from '../utils/logger';
import {
    validateProfileUpdate,
    sanitizeString,
} from '../utils/inputValidator';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Profile = Database['public']['Tables']['profiles']['Row'];

export const userService = {
    async getProfile(userId: string) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) throw error;
        return data;
    },

    async updateProfile(userId: string, updates: Partial<Database['public']['Tables']['profiles']['Update']>) {
        // ✅ VALIDATE before saving to database
        const { valid, errors, sanitized } = validateProfileUpdate(updates as any);

        if (!valid) {
            logger.error('[userService] Validation failed:', errors);
            throw new Error(`Validação falhou: ${errors.join(', ')}`);
        }

        // ✅ Use SANITIZED data (XSS-safe)
        const { data, error } = await (supabase
            .from('profiles') as any)
            .update(sanitized as any)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            logger.error('[userService] Update failed:', error);
            throw error;
        }

        logger.log('[userService] Profile updated successfully:', userId);
        return data as any;
    },

    async checkUsernameAvailability(username: string) {
        // ✅ SANITIZE username to prevent injection
        const sanitized = sanitizeString(username).toLowerCase().trim();

        if (!sanitized || sanitized.length < 3) {
            throw new Error('Username inválido (mínimo 3 caracteres)');
        }

        const { error } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', sanitized)
            .single();

        if (error && error.code === 'PGRST116') return true; // Not found, so available
        if (error) throw error;
        return false; // Found, so not available
    },

    async getSuggestions() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // ✅ FIX N+1 Query: Use LEFT JOIN to get follow status in ONE query
        // Instead of: 1 query for users + N queries to check if following each
        // Now: 1 query total using JOIN
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                id,
                full_name,
                username,
                avatar_url,
                level,
                sports,
                bio,
                followers:follows!followed_id(count),
                is_following:follows!follower_id!inner(
                    follower_id
                )
            `)
            .neq('id', user.id)
            .is('follows.follower_id', user.id as any)  // Only users current user is NOT following
            .limit(10);

        if (error) {
            logger.error('[userService] Error fetching suggestions:', error);
            return [];
        }

        // Check which users the current user is already following
        const { data: following } = await supabase
            .from('follows')
            .select('following_id')
            .eq('follower_id', user.id);

        const followingIds = new Set((following as any)?.map((f: any) => f.following_id) || []);

        // Filter out already-followed users and transform to UI model
        return (data as any)
            .filter((p: any) => !followingIds.has(p.id))
            .map((p: any) => ({
                id: p.id,
                name: p.name || 'Usuário',
                sport: p.sports?.[0] || 'BeachTennis',
                reason: p.level ? `Nível ${p.level}` : 'Novo no app',
                isOnline: false, // We don't have real online status yet
                avatar: p.avatar_url,
                followersCount: p.followers_count || 0,
                followingCount: p.following_count || 0,
            }));
    },

    async followUser(targetUserId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Não autenticado');

        if (user.id === targetUserId) {
            throw new Error('Você não pode seguir a si mesmo');
        }

        const { data, error } = await supabase
            .from('follows')
            .insert({
                follower_id: user.id,
                following_id: targetUserId,
            } as any)
            .select()
            .single();

        if (error) {
            if (error.code === '23505') { // Unique violation
                throw new Error('Você já está seguindo este usuário');
            }
            throw error;
        }

        return { success: true, data: data as any };
    },

    async unfollowUser(targetUserId: string) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Não autenticado');

        const { error } = await supabase
            .from('follows')
            .delete()
            .eq('follower_id', user.id)
            .eq('following_id', targetUserId);

        if (error) throw error;

        return { success: true };
    },

    async isFollowing(targetUserId: string): Promise<boolean> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return false;

        const { data, error } = await supabase
            .from('follows')
            .select('id')
            .eq('follower_id', user.id)
            .eq('following_id', targetUserId)
            .single();

        if (error && error.code === 'PGRST116') return false; // Not found
        if (error) throw error;
        return !!data;
    },

    async getFollowers(userId: string) {
        const { data, error } = await supabase
            .from('follows')
            .select(`
                follower:profiles!follows_follower_id_fkey (
                    id,
                    name,
                    avatar_url,
                    level
                )
            `)
            .eq('following_id', userId);

        if (error) throw error;
        return (data as any)?.map((f: any) => f.follower) || [];
    },

    async getFollowing(userId: string) {
        const { data, error } = await supabase
            .from('follows')
            .select(`
                following:profiles!follows_following_id_fkey (
                    id,
                    name,
                    avatar_url,
                    level
                )
            `)
            .eq('follower_id', userId);

        if (error) throw error;
        return (data as any)?.map((f: any) => f.following) || [];
    },

    async searchUsers(query: string) {
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('profiles')
            .select('id, name, avatar_url, level, username')
            .or(`name.ilike.%${query}%,username.ilike.%${query}%`)
            .neq('id', user?.id || '')
            .limit(20);

        if (error) throw error;
        return data || [];
    },
};
