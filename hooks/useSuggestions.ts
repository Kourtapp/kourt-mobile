import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services/userService';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { Alert } from 'react-native';
import { logger } from '../utils/logger';

export function useSuggestions() {
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { session } = useAuthStore();

    const fetchSuggestions = useCallback(async () => {
        try {
            setLoading(true);
            const data = await userService.getSuggestions();
            setSuggestions(data);
        } catch {
            logger.error('[useSuggestions] Failed to fetch suggestions:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    const followUser = async (userId: string) => {
        try {
            // Optimistic update: Remove immediately
            setSuggestions(prev => prev.filter(u => u.id !== userId));
            await userService.followUser(userId);
            // No alert needed for follow action, it should be seamless
        } catch {
            Alert.alert("Erro", "Falha ao seguir usuário.");
            // Revert if failed (optional, but good practice. For now keeping simple)
        }
    };

    useEffect(() => {
        fetchSuggestions();
    }, [fetchSuggestions]);

    // Realtime subscription for follows changes
    useEffect(() => {
        const userId = session?.user?.id;
        if (!userId) return;

        const channel = supabase
            .channel(`suggestions-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'follows',
                    filter: `follower_id=eq.${userId}`,
                },
                (payload) => {
                    logger.log('[useSuggestions] Realtime update:', payload.eventType);
                    fetchSuggestions();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id, fetchSuggestions]);

    return {
        suggestions,
        loading,
        refetch: fetchSuggestions,
        followUser
    };
}
