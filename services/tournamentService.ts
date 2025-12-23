import { supabase } from '@/lib/supabase';

export interface TournamentData {
    name: string;
    sport: string;
    competition_type: string;
    category: string;
    level: string;
    description?: string;
    banner_url?: string;
    format: string;
    max_teams: number;
    use_seeds: boolean;
    third_place_match: boolean;
    location_type: 'kourt' | 'manual';
    court_id?: string;
    address?: string;
    date: string;
    start_time: string;
    is_free: boolean;
    price_per_team?: number;
    payment_online: boolean;
    payment_local: boolean;
    wait_list_enabled: boolean;
    auto_approval: boolean;
    sets_to_win: number;
    games_to_win: number;
    super_tiebreak: boolean;
    match_duration_minutes: number;
    late_tolerance_minutes: number;
    has_prize_money: boolean;
    prize_1st?: number;
    prize_2nd?: number;
    prize_3rd?: number;
    has_trophy: boolean;
    has_products: boolean;
    visibility: 'public' | 'private';
}

export interface Tournament {
    id: string;
    name: string;
    sport: string;
    category: string;
    level: string;
    format: string;
    date: string;
    start_time: string;
    max_teams: number;
    registered_teams: number;
    price_per_team: number;
    is_free: boolean;
    status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';
    created_by: string;
    created_at: string;
    banner_url?: string;
    address?: string;
    court?: {
        id: string;
        name: string;
        address: string;
    };
}

export const tournamentService = {
    /**
     * Create a new tournament
     */
    async create(data: TournamentData): Promise<{ success: boolean; tournamentId?: string; error?: string }> {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return { success: false, error: 'Você precisa estar logado' };
            }

            const { data: tournament, error } = await supabase
                .from('tournaments')
                .insert({
                    ...data,
                    created_by: user.id,
                    status: 'open',
                    registered_teams: 0,
                } as any)
                .select()
                .single();

            if (error) {
                console.error('[tournamentService.create] Error:', error);
                return { success: false, error: 'Erro ao criar torneio' };
            }

            return { success: true, tournamentId: tournament.id };
        } catch (error: any) {
            console.error('[tournamentService.create] Exception:', error);
            return { success: false, error: error.message || 'Erro inesperado' };
        }
    },

    /**
     * Get tournaments list with filters
     */
    async getList(filters?: {
        sport?: string;
        status?: string;
        city?: string;
        limit?: number;
    }): Promise<Tournament[]> {
        try {
            let query = supabase
                .from('tournaments')
                .select(`
                    id, name, sport, category, level, format,
                    date, start_time, max_teams, registered_teams,
                    price_per_team, is_free, status, created_by, created_at,
                    banner_url, address
                `)
                .order('date', { ascending: true });

            if (filters?.sport) {
                query = query.eq('sport', filters.sport);
            }
            if (filters?.status) {
                query = query.eq('status', filters.status);
            }
            if (filters?.limit) {
                query = query.limit(filters.limit);
            }

            const { data, error } = await query;

            if (error) {
                console.error('[tournamentService.getList] Error:', error);
                return [];
            }

            return (data || []) as Tournament[];
        } catch (error) {
            console.error('[tournamentService.getList] Exception:', error);
            return [];
        }
    },

    /**
     * Get tournament by ID
     */
    async getById(id: string): Promise<Tournament | null> {
        try {
            const { data, error } = await supabase
                .from('tournaments')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                console.error('[tournamentService.getById] Error:', error);
                return null;
            }

            return data as Tournament;
        } catch (error) {
            console.error('[tournamentService.getById] Exception:', error);
            return null;
        }
    },

    /**
     * Register team for tournament
     */
    async registerTeam(tournamentId: string, playerIds: string[]): Promise<{ success: boolean; error?: string }> {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return { success: false, error: 'Você precisa estar logado' };
            }

            // Check if already registered
            const { data: existing } = await supabase
                .from('tournament_teams')
                .select('id')
                .eq('tournament_id', tournamentId)
                .contains('player_ids', [user.id])
                .single();

            if (existing) {
                return { success: false, error: 'Você já está inscrito neste torneio' };
            }

            // Register team
            const { error } = await supabase
                .from('tournament_teams')
                .insert({
                    tournament_id: tournamentId,
                    player_ids: playerIds,
                    registered_by: user.id,
                    status: 'pending',
                } as any);

            if (error) {
                console.error('[tournamentService.registerTeam] Error:', error);
                return { success: false, error: 'Erro ao se inscrever' };
            }

            // Increment registered_teams count
            await supabase.rpc('increment_tournament_teams', { p_tournament_id: tournamentId });

            return { success: true };
        } catch (error: any) {
            console.error('[tournamentService.registerTeam] Exception:', error);
            return { success: false, error: error.message || 'Erro inesperado' };
        }
    },

    /**
     * Get my tournaments (created or participating)
     */
    async getMyTournaments(): Promise<{ created: Tournament[]; participating: Tournament[] }> {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                return { created: [], participating: [] };
            }

            // Get created tournaments
            const { data: created } = await supabase
                .from('tournaments')
                .select('*')
                .eq('created_by', user.id)
                .order('created_at', { ascending: false });

            // Get participating tournaments
            const { data: teams } = await supabase
                .from('tournament_teams')
                .select('tournament_id')
                .contains('player_ids', [user.id]);

            const participatingIds = teams?.map(t => t.tournament_id) || [];

            let participating: Tournament[] = [];
            if (participatingIds.length > 0) {
                const { data: participatingData } = await supabase
                    .from('tournaments')
                    .select('*')
                    .in('id', participatingIds);
                participating = (participatingData || []) as Tournament[];
            }

            return {
                created: (created || []) as Tournament[],
                participating,
            };
        } catch (error) {
            console.error('[tournamentService.getMyTournaments] Exception:', error);
            return { created: [], participating: [] };
        }
    },
};
