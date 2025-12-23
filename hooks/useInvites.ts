import { useState, useEffect, useCallback } from 'react';
import { MatchService } from '../services/matchService';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';

export function useInvites() {
    const [invites, setInvites] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useAuthStore();

    const fetchInvites = useCallback(async () => {
        setLoading(true);
        const data = await MatchService.getInvites();
        setInvites(data);
        setLoading(false);
    }, []);

    const removeInvite = (matchId: string) => {
        setInvites(prev => prev.filter(i => i.id !== matchId));
    };

    useEffect(() => {
        fetchInvites();
    }, [fetchInvites]);

    // Realtime subscription for invites (match_players table)
    useEffect(() => {
        const userId = session?.user?.id;
        if (!userId) return;

        const channel = supabase
            .channel(`invites-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'match_players',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => {
                    logger.log('[useInvites] Realtime update:', payload.eventType);
                    fetchInvites();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id, fetchInvites]);

    return { invites, loading, refetch: fetchInvites, removeInvite };
}
