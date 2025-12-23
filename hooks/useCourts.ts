import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { logger } from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type CourtRow = Database['public']['Tables']['courts']['Row'];

export interface Court {
    id: string;
    name: string;
    type: 'public' | 'private';
    sport: string;
    distance: string;
    rating: number;
    price: number | null;
    currentPlayers?: number;
    image?: string;
    images?: string[];
    latitude: number;
    longitude: number;
    available_now: boolean;
    address?: string;
    city?: string;
    owner_id?: string;
    description?: string;
}


export function useCourts() {
    const [courts, setCourts] = useState<Court[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourts = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            // Fetch all courts from Supabase
            const { data, error: fetchError } = await supabase
                .from('courts')
                .select('*')
                .order('rating', { ascending: false, nullsFirst: false });

            if (fetchError) throw fetchError;

            if (data && data.length > 0) {
                const formattedCourts: Court[] = (data as any[]).map((court) => ({
                    id: court.id,
                    name: court.name || 'Quadra sem nome',
                    type: (court.type as 'public' | 'private') || 'private',
                    sport: court.sport || 'Beach Tennis',
                    distance: '-- km', // Would calculate based on user location
                    rating: court.rating || 4.5,
                    price: court.price_per_hour,
                    latitude: court.latitude || -23.5505,
                    longitude: court.longitude || -46.6333,
                    available_now: true, // Would check availability
                    address: court.address || undefined,
                    city: court.city || undefined,
                    owner_id: court.owner_id || undefined,
                    description: court.description || undefined,
                    image: court.cover_image || undefined,
                    images: court.images || [],
                }));

                setCourts(formattedCourts);
            } else {
                // No courts in database
                logger.log('[useCourts] No courts found in DB');
                setCourts([]);
            }
        } catch (err: any) {
            logger.error('[useCourts] Error fetching courts:', err);
            setError(err.message);
            // Fallback to empty to avoid breaking UI if error isn't 404
            setCourts([]);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchCourts();
    }, [fetchCourts]);

    // Realtime subscription for courts
    useEffect(() => {
        const channel = supabase
            .channel('courts-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'courts',
                },
                (payload) => {
                    logger.log('[useCourts] Realtime update:', payload.eventType);
                    // Refetch to get updated list
                    fetchCourts();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchCourts]);

    return {
        courts,
        nearbyCourts: courts,
        featuredCourts: courts.filter(c => c.rating >= 4.5),
        loading,
        error,
        refetch: fetchCourts,
    };
}

// Hook for fetching a single court with realtime
export function useCourt(courtId: string) {
    const [court, setCourt] = useState<Court | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCourt = useCallback(async () => {
        if (!courtId) {
            setLoading(false);
            return;
        }

        setLoading(true);

        try {
            const { data, error: fetchError } = await supabase
                .from('courts')
                .select('*')
                .eq('id', courtId)
                .single();

            if (fetchError) throw fetchError;

            if (data) {
                const court = data as any;
                setCourt({
                    id: court.id,
                    name: court.name,
                    type: (court.type as 'public' | 'private') || 'private',
                    sport: court.sport || 'Beach Tennis',
                    distance: '-- km',
                    rating: court.rating || 4.5,
                    price: court.price_per_hour,
                    latitude: court.latitude || -23.5505,
                    longitude: court.longitude || -46.6333,
                    available_now: true,
                    address: court.address || undefined,
                    city: court.city || undefined,
                    owner_id: court.owner_id || undefined,
                    description: court.description || undefined,
                    image: court.cover_image || undefined,
                    images: court.images || [],
                });
            }
        } catch (err: any) {
            logger.error('[useCourt] Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [courtId]);

    useEffect(() => {
        fetchCourt();
    }, [fetchCourt]);

    // Realtime for single court
    useEffect(() => {
        if (!courtId) return;

        const channel = supabase
            .channel(`court-${courtId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'courts',
                    filter: `id=eq.${courtId}`,
                },
                () => {
                    fetchCourt();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [courtId, fetchCourt]);

    return { court, loading, error, refetch: fetchCourt };
}
