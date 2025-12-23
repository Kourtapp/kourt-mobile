import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';
import { Database } from '../lib/database.types';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

export interface UserProfile {
    id: string;
    name: string;
    username: string | null;
    email: string;
    avatar_url: string | null;
    cover_url: string | null;
    bio: string | null;
    skill_level: string | null;
    play_style: string | null;
    play_frequency: string | null;
    main_goal: string | null;
    latitude: number | null;
    longitude: number | null;
    // Stats
    matches_count: number;
    wins: number;
    losses: number;
    rating: number | null;
    followers_count: number;
    following_count: number;
    is_verified: boolean;
    // Host specific
    is_host: boolean;
    total_courts: number;
    created_at: string;
}

interface UseProfileReturn {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => Promise<void>;
}

export function useProfile(): UseProfileReturn {
    const { user } = useAuthStore();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchProfile = useCallback(async () => {
        if (!user?.id) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Fetch profile
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            const p = profileData as ProfileRow;

            // Fetch courts count (for host)
            const { count: courtsCount } = await supabase
                .from('courts')
                .select('*', { count: 'exact', head: true })
                .eq('owner_id', user.id);

            // Calculate host stats
            const isHost = (courtsCount || 0) > 0;

            const userProfile: UserProfile = {
                id: p.id,
                name: p.full_name || 'Usuário',
                username: p.username,
                email: user.email || '',
                avatar_url: p.avatar_url,
                cover_url: p.cover_url || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200',
                bio: p.bio,
                skill_level: p.skill_level,
                play_style: p.play_style,
                play_frequency: p.play_frequency,
                main_goal: p.main_goal,
                latitude: p.latitude,
                longitude: p.longitude,
                // Stats
                matches_count: p.matches_count || 0,
                wins: p.wins || 0,
                losses: p.losses || 0,
                rating: p.rating,
                followers_count: p.followers_count || 0,
                following_count: p.following_count || 0,
                is_verified: p.is_verified || false,
                // Host
                is_host: isHost,
                total_courts: courtsCount || 0,
                created_at: p.created_at,
            };

            setProfile(userProfile);
        } catch (err: any) {
            logger.error('[useProfile] Error fetching profile:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [user?.id, user?.email]);

    const updateProfile = useCallback(async (data: Partial<UserProfile>) => {
        if (!user?.id) return;

        try {
            const updateData: Partial<ProfileRow> = {};

            if (data.name !== undefined) updateData.full_name = data.name;
            if (data.username !== undefined) updateData.username = data.username;
            if (data.bio !== undefined) updateData.bio = data.bio;
            if (data.avatar_url !== undefined) updateData.avatar_url = data.avatar_url;
            if (data.cover_url !== undefined) updateData.cover_url = data.cover_url;
            if (data.skill_level !== undefined) updateData.skill_level = data.skill_level;
            if (data.play_style !== undefined) updateData.play_style = data.play_style;
            if (data.play_frequency !== undefined) updateData.play_frequency = data.play_frequency;
            if (data.main_goal !== undefined) updateData.main_goal = data.main_goal;
            if (data.latitude !== undefined) updateData.latitude = data.latitude;
            if (data.longitude !== undefined) updateData.longitude = data.longitude;

            const { error: updateError } = await (supabase
                .from('profiles') as any)
                .update(updateData)
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Update local state
            setProfile(prev => prev ? { ...prev, ...data } : null);
        } catch (err: any) {
            logger.error('[useProfile] Error updating profile:', err);
            throw err;
        }
    }, [user?.id]);

    // Initial fetch
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Realtime subscription
    useEffect(() => {
        if (!user?.id) return;

        const channel = supabase
            .channel(`profile-${user.id}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${user.id}`,
                },
                (payload) => {
                    logger.log('[useProfile] Profile changed:', payload);
                    // Refetch to get complete data
                    fetchProfile();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user?.id, fetchProfile]);

    return {
        profile,
        loading,
        error,
        refetch: fetchProfile,
        updateProfile,
    };
}

// Hook for getting profile from anywhere with cached data
export function useProfileStore() {
    return useProfile();
}
