import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';
import { logger } from '../utils/logger';
import { ptBR } from 'date-fns/locale';

export interface Match {
    id: string;
    sport: string;
    time: string;
    venue: string;
    spotsLeft: number;
    sportIcon: any; // Used by UI
    skill_level?: string;
    is_public?: boolean;
}

export function useMatches() {
    const [openMatches, setOpenMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMatches = useCallback(async () => {
        setLoading(true);
        try {
            // Fetch upcoming public matches
            // We join with court to get the name
            const { data, error } = await supabase
                .from('matches')
                .select(`
                    id,
                    sport,
                    date,
                    start_time,
                    max_players,
                    is_public,
                    court:courts (
                        name
                    ),
                    players:match_players (
                        status
                    )
                `)
                .eq('is_public', true)
                .gte('date', new Date().toISOString().split('T')[0])
                .order('date', { ascending: true })
                .order('start_time', { ascending: true })
                .limit(10);

            if (error) throw error;

            const formattedMatches: Match[] = (data || []).map((m: any) => {
                // Combine date and time strings safely
                // m.date is "YYYY-MM-DD", m.start_time is "HH:mm:ss"
                const dateTimeStr = `${m.date}T${m.start_time}`;
                const date = new Date(dateTimeStr);

                const timeStr = format(date, "EEE, HH:mm", { locale: ptBR });

                // Mapped icon name
                let iconName = 'trophy';
                const s = m.sport?.toLowerCase() || '';
                if (s.includes('tennis') || s.includes('tênis')) iconName = 'tennis' as any;
                else if (s.includes('soccer') || s.includes('futebol')) iconName = 'soccer' as any;
                else if (s.includes('basket')) iconName = 'basketball' as any;

                // Basic spots left calc (placeholder logic, usually requires count of participants)
                // Calculate actual spots left
                const confirmedPlayers = m.players?.filter((p: any) => p.status === 'confirmed').length || 0;
                const spotsLeft = Math.max(0, (m.max_players || 4) - confirmedPlayers);

                return {
                    id: m.id,
                    sport: m.sport,
                    time: timeStr.charAt(0).toUpperCase() + timeStr.slice(1),
                    venue: m.court?.name || 'Local a definir',
                    spotsLeft: spotsLeft,
                    sportIcon: iconName,
                    skill_level: m.skill_level,
                    is_public: m.is_public
                };
            });

            setOpenMatches(formattedMatches);
        } catch (error) {
            logger.error('[useMatches] Error fetching matches:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchMatches();
    }, [fetchMatches]);

    // Realtime subscription for matches changes
    useEffect(() => {
        const channel = supabase
            .channel('matches-changes')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'matches',
                },
                (payload) => {
                    logger.log('[useMatches] Realtime update:', payload.eventType);
                    fetchMatches();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchMatches]);

    return {
        openMatches,
        loading,
        refetch: fetchMatches,
    };
}
