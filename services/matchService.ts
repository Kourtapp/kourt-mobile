import { supabase } from '../lib/supabase';
import { Analytics } from './analyticsService';
import { Database } from '../lib/database.types';
import { logger } from '../utils/logger';
import { sanitizeString } from '../utils/inputValidator';

// Types from database
type Match = Database['public']['Tables']['matches']['Row'];
type MatchInsert = Database['public']['Tables']['matches']['Insert'];
type MatchPlayer = Database['public']['Tables']['match_players']['Row'];
type MatchPlayerInsert = Database['public']['Tables']['match_players']['Insert'];

export interface CreateMatchData {
    sport: string;
    courtId?: string;
    location?: { lat: number; lng: number; address?: string };
    date: Date;
    endTime?: Date;
    isPrivate: boolean;
    maxPlayers: number;
    level?: string;
    title?: string;
    description?: string;
    pricePerPerson?: number;
}

export interface MatchWithDetails extends Match {
    court?: Database['public']['Tables']['courts']['Row'] | null;
    players?: (MatchPlayer & {
        profile?: Database['public']['Tables']['profiles']['Row'] | null;
    })[];
}

export interface MatchServiceResult<T = void> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export const MatchService = {
    /**
     * Creates a new match in the database
     */
    async createMatch(data: CreateMatchData): Promise<MatchServiceResult<Match>> {
        try {
            Analytics.log('match_create_start', { sport: data.sport });

            const { data: userData, error: authError } = await supabase.auth.getUser();
            if (authError || !userData.user) {
                throw new Error('Usuário não autenticado');
            }

            const user = userData.user;

            // Format date for database
            const matchDate = data.date.toISOString().split('T')[0];
            const startTime = data.date.toTimeString().slice(0, 5);
            const endTime = data.endTime
                ? data.endTime.toTimeString().slice(0, 5)
                : new Date(data.date.getTime() + 60 * 60 * 1000).toTimeString().slice(0, 5); // Default 1 hour

            // ✅ SANITIZE user inputs to prevent XSS
            const sanitizedTitle = data.title ? sanitizeString(data.title) : null;
            const sanitizedDescription = data.description ? sanitizeString(data.description) : null;
            const sanitizedSport = sanitizeString(data.sport);

            // ✅ VALIDATE required fields
            if (!sanitizedSport || sanitizedSport.length < 3) {
                throw new Error('Esporte inválido');
            }

            if (data.maxPlayers < 2 || data.maxPlayers > 100) {
                throw new Error('Número de jogadores inválido (2-100)');
            }

            // Prepare match data
            const matchData: MatchInsert = {
                organizer_id: user.id,
                court_id: data.courtId || null,
                sport: sanitizedSport,
                date: matchDate,
                start_time: startTime,
                end_time: endTime,
                is_private: data.isPrivate,
                is_public: !data.isPrivate,
                status: 'scheduled',
                max_players: data.maxPlayers,
                current_players: 1,
                level: data.level || null,
                title: sanitizedTitle,
                description: sanitizedDescription,
                price_per_person: data.pricePerPerson || null,
                location_name: data.location?.address ? sanitizeString(data.location.address) : null,
            } as any;

            const { data: match, error } = await supabase
                .from('matches')
                .insert(matchData as any)
                .select()
                .single();

            if (error) throw error;

            const matchData2 = match as any;
            logger.log('[MatchService] Match created:', matchData2.id);
            Analytics.log('match_create_success', { matchId: matchData2.id, sport: data.sport });

            // Add organizer as a player
            const playerData: MatchPlayerInsert = {
                match_id: matchData2.id,
                user_id: user.id,
                status: 'confirmed',
                team: 'A',
            } as any;

            const { error: playerError } = await supabase
                .from('match_players')
                .insert(playerData as any);

            if (playerError) {
                logger.error('[MatchService] Failed to add organizer to match:', playerError);
            }

            return { success: true, data: match };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('[MatchService] Create match failed:', error);
            return { success: false, error: message };
        }
    },

    /**
     * Fetch upcoming matches for the user
     */
    async getUpcoming(): Promise<Match[]> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return [];

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('matches')
            .select('*, courts(*)')
            .eq('organizer_id', userData.user.id)
            .gte('date', today)
            .order('date', { ascending: true })
            .order('start_time', { ascending: true });

        if (error) {
            logger.error('[MatchService] Get upcoming error:', error);
            return [];
        }

        return (data as any) || [];
    },

    /**
     * Fetch match history for the user
     */
    async getHistory(): Promise<Match[]> {
        const { data: userData } = await supabase.auth.getUser();
        if (!userData.user) return [];

        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await supabase
            .from('matches')
            .select('*, courts(*)')
            .eq('organizer_id', userData.user.id)
            .lt('date', today)
            .order('date', { ascending: false });

        if (error) {
            logger.error('[MatchService] Get history error:', error);
            return [];
        }

        return (data as any) || [];
    },

    /**
     * Get full details of a match by ID
     */
    async getMatchDetails(matchId: string): Promise<MatchServiceResult<MatchWithDetails>> {
        try {
            const { data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    court:courts(*),
                    players:match_players(
                        id,
                        user_id,
                        status,
                        team,
                        joined_at,
                        profile:profiles(*)
                    )
                `)
                .eq('id', matchId)
                .single();

            if (error) throw error;

            if (data) {
                Analytics.log('match_view', { matchId });
            }

            return { success: true, data: data as any as MatchWithDetails };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('[MatchService] Get details error:', error);
            return { success: false, error: message };
        }
    },

    /**
     * Join a match and notify the organizer
     */
    async joinMatch(matchId: string): Promise<MatchServiceResult> {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('Usuário não autenticado');

            const user = userData.user;

            // ✅ Use RPC with transaction to prevent race condition
            // This atomically:
            // 1. Checks if match is full
            // 2. Adds player
            // 3. Increments current_players
            // All in ONE database transaction!
            const { error } = await (supabase.rpc as any)('join_match', {
                p_match_id: matchId,
                p_user_id: user.id
            });

            if (error) {
                // Check if it's "match full" error
                if (error.message?.includes('full') || error.message?.includes('completo')) {
                    return { success: false, error: 'Partida já está cheia' };
                }
                throw error;
            }

            logger.log('[MatchService] User joined match:', { matchId, userId: user.id });
            Analytics.log('match_join', { matchId, success: true });

            return { success: true, message: 'Você entrou na partida!' };

        } catch (error) {
            const err = error as { code?: string; message?: string };
            logger.error('[MatchService] Join error:', error);

            // Handle duplicate entry (already joined)
            if (err.code === '23505') {
                return { success: true, message: 'Você já está nesta partida' };
            }

            // Handle constraint violation (max_players exceeded)
            if (err.code === '23514') {
                return { success: false, error: 'Partida já está cheia' };
            }

            return { success: false, error: err.message || 'Erro ao entrar na partida' };
        }
    },

    /**
     * Leave a match
     */
    async leaveMatch(matchId: string): Promise<MatchServiceResult> {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) throw new Error('Usuário não autenticado');

            const { error } = await supabase
                .from('match_players')
                .delete()
                .eq('match_id', matchId)
                .eq('user_id', userData.user.id);

            if (error) throw error;

            Analytics.log('match_leave', { matchId });
            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('[MatchService] Leave error:', error);
            return { success: false, error: message };
        }
    },

    /**
     * Get public matches available to join (invites)
     */
    async getInvites(): Promise<MatchWithDetails[]> {
        try {
            const { data: userData } = await supabase.auth.getUser();
            if (!userData.user) return [];

            const today = new Date().toISOString().split('T')[0];

            const { data, error } = await supabase
                .from('matches')
                .select(`
                    *,
                    court:courts(*),
                    players:match_players(
                        user_id,
                        status,
                        profile:profiles(avatar_url, full_name)
                    )
                `)
                .eq('is_public', true)
                .gte('date', today)
                .order('date', { ascending: true })
                .order('start_time', { ascending: true })
                .limit(10);

            if (error) throw error;

            // Filter out matches the user is already in
            const invites = ((data as any) || []).filter((match: any) =>
                !match.players?.some((p: any) => p.user_id === userData.user?.id)
            );

            return invites as any as MatchWithDetails[];
        } catch (error) {
            logger.error('[MatchService] Get invites error:', error);
            return [];
        }
    },

    /**
     * Update match status
     */
    async updateMatchStatus(
        matchId: string,
        status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled'
    ): Promise<MatchServiceResult> {
        try {
            const { error } = await (supabase
                .from('matches') as any)
                .update({ status })
                .eq('id', matchId);

            if (error) throw error;

            Analytics.log('match_status_update', { matchId, status });
            return { success: true };
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Erro desconhecido';
            logger.error('[MatchService] Update status error:', error);
            return { success: false, error: message };
        }
    },
};

export default MatchService;
