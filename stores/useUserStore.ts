import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';
import * as Location from 'expo-location';
import { Database } from '../types/database.types';
import { logger } from '../utils/logger';

type ProfileRow = Database['public']['Tables']['profiles']['Row'];

interface UserProfile {
    id: string;
    name: string;
    email: string;
    location: string;
    avatar_url?: string;
    cover_url?: string;
    bio?: string;
    sports: { id: string; name: string; icon: string }[];
    level: number;
    xp: number;
    xp_to_next_level: number;
    streak: number;
    wins: number;
    matches_count: number;
    followers_count: number;
    following_count: number;
    is_pro: boolean;
    is_verified: boolean;
    stats: {
        attack: number;
        defense: number;
        technique: number;
        physical: number;
        mental: number;
    };
}

interface UserState {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    realtimeChannel: RealtimeChannel | null;
    fetchProfile: (userId: string) => Promise<void>;
    updateProfile: (data: Partial<UserProfile>) => void;
    subscribeToRealtime: (userId: string) => void;
    unsubscribeFromRealtime: () => void;
    isSyncingLocation: boolean;
    syncLocation: () => Promise<void>;
}

export const useUserStore = create<UserState>((set, get) => ({
    profile: null,
    loading: false,
    error: null,
    realtimeChannel: null,
    isSyncingLocation: false,

    fetchProfile: async (userId: string) => {
        set({ loading: true, error: null });
        try {
            // 1. Fetch Basic Profile - Selecting only necessary columns to reduce cost
            const { data, error: profileError } = await supabase
                .from('profiles')
                .select(`
                    id, name, email, city, avatar_url, bio,
                    sports, level, xp, xp_to_next_level,
                    streak, wins, followers_count, following_count,
                    subscription_tier, email_verified,
                    stats_attack, stats_defense, stats_technique, stats_physical, stats_mental
                `)
                .eq('id', userId)
                .single();

            if (profileError) throw profileError;

            // Strict typing using Database definition
            const profileData = data as unknown as ProfileRow;

            // 2. Fetch/Calculate Stats (Mocking complex calcs for now)
            const { count: matchesCount } = await supabase
                .from('matches')
                .select('*', { count: 'exact', head: true })
                .or(`player1_id.eq.${userId},player2_id.eq.${userId},player3_id.eq.${userId},player4_id.eq.${userId}`);

            const userProfile: UserProfile = {
                id: profileData.id,
                name: profileData.name || 'Novo Jogador',
                email: (profileData as any).email || '', // email is safely handled even if generic
                location: profileData.city || 'São Paulo, SP', // Mapped from 'city'
                avatar_url: profileData.avatar_url || undefined,
                cover_url: undefined, // Not in DB schema yet
                bio: profileData.bio || undefined,
                sports: profileData.sports?.map((s: string) => ({ id: s, name: s, icon: 'sports-tennis' })) || [], // Mapped from 'sports'
                level: typeof profileData.level === 'string' ? parseInt(profileData.level) : (profileData.level || 1),
                xp: profileData.xp || 0,
                xp_to_next_level: profileData.xp_to_next_level || 1000,
                streak: profileData.streak || 0, // Mapped from 'streak'
                wins: profileData.wins || 0,
                matches_count: matchesCount || 0,
                followers_count: profileData.followers_count || 0,
                following_count: profileData.following_count || 0,
                is_pro: profileData.subscription_tier === 'pro',
                is_verified: !!profileData.email_verified, // Mapped from 'email_verified'
                stats: {
                    attack: profileData.stats_attack || 0,
                    defense: profileData.stats_defense || 0,
                    technique: profileData.stats_technique || 0,
                    physical: profileData.stats_physical || 0,
                    mental: profileData.stats_mental || 0
                }
            };

            set({ profile: userProfile, loading: false });

            // Auto-subscribe to realtime when profile is fetched
            get().subscribeToRealtime(userId);
        } catch (error: any) {
            logger.error('[useUserStore] Error fetching profile:', error);
            set({ error: error.message, loading: false });
        }
    },

    updateProfile: (data: Partial<UserProfile>) => {
        const currentProfile = get().profile;
        if (currentProfile) {
            set({ profile: { ...currentProfile, ...data } });
        }
    },

    subscribeToRealtime: (userId: string) => {
        // Unsubscribe from existing channel if any
        get().unsubscribeFromRealtime();

        const channel = supabase
            .channel(`user-profile-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'profiles',
                    filter: `id=eq.${userId}`,
                },
                (payload) => {
                    logger.log('[useUserStore] Profile realtime update:', payload);
                    if (payload.eventType === 'UPDATE' && payload.new) {
                        const newData = payload.new as any;
                        const currentProfile = get().profile;
                        if (currentProfile) {
                            set({
                                profile: {
                                    ...currentProfile,
                                    name: newData.name || currentProfile.name,
                                    bio: newData.bio || currentProfile.bio,
                                    avatar_url: newData.avatar_url || currentProfile.avatar_url,
                                    cover_url: newData.cover_url || currentProfile.cover_url,
                                    location: newData.location || currentProfile.location,
                                }
                            });
                        }
                    }
                }
            )
            .subscribe();

        set({ realtimeChannel: channel });
    },

    unsubscribeFromRealtime: () => {
        const channel = get().realtimeChannel;
        if (channel) {
            supabase.removeChannel(channel);
            set({ realtimeChannel: null });
        }
    },

    syncLocation: async () => {
        if (get().isSyncingLocation) {
            logger.log('[useUserStore] syncLocation: Already syncing. Skipping.');
            return;
        }

        set({ isSyncingLocation: true });

        try {
            logger.log('[useUserStore] syncLocation: Starting...');
            const { status } = await Location.requestForegroundPermissionsAsync();
            logger.log('[useUserStore] syncLocation: Permission status:', status);

            if (status !== 'granted') {
                logger.log('[useUserStore] syncLocation: Permission denied');
                set({ isSyncingLocation: false });
                return;
            }

            // 1. Try last known position first (fastest)
            let location = await Location.getLastKnownPositionAsync();

            // 2. If no last known, get current (balanced accuracy for speed/battery)
            if (!location) {
                logger.log('[useUserStore] syncLocation: Getting current position (Balanced)...');
                location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Balanced, // Reduced from High to prevent timeouts
                    timeInterval: 5000 // Timeout 5s
                });
            } else {
                logger.log('[useUserStore] syncLocation: Using last known position.');
            }

            if (location) {
                logger.log('[useUserStore] syncLocation: Got coordinates:', {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude
                });

                // Reverse geocode
                const address = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude
                });

                logger.log('[useUserStore] syncLocation: Reverse geocode result:', address[0]);

                if (address && address.length > 0) {
                    const { city, region, subregion, isoCountryCode } = address[0];
                    // Use city, or subregion (for smaller cities), or region
                    const cityName = city || subregion || region;
                    const formattedLocation = cityName ? `${cityName}, ${region || isoCountryCode}` : (region || isoCountryCode || 'Brasil');

                    logger.log('[useUserStore] syncLocation: Formatted location:', formattedLocation);

                    const currentProfile = get().profile;
                    if (currentProfile && currentProfile.location !== formattedLocation) {
                        set({
                            profile: {
                                ...currentProfile,
                                location: formattedLocation
                            }
                        });
                        logger.log('[useUserStore] syncLocation: Profile updated locally');
                    } else {
                        logger.log('[useUserStore] syncLocation: Location unchanged.');
                    }
                }
            }
        } catch (error) {
            // Silently fail - location sync is optional
            logger.log('[useUserStore] syncLocation: Failed (this is normal in simulator):', (error as any)?.message || error);
        } finally {
            set({ isSyncingLocation: false });
        }
    }
}));
