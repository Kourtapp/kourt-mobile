import { supabase } from '../lib/supabase';
import { Team, CreateTeamDTO } from '../types/team';
import { logger } from '../utils/logger';
import { sanitizeString } from '../utils/inputValidator';

export const TeamService = {
    async getMyTeams(): Promise<Team[]> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        // ✅ FIX N+1 Query: Get teams with member count in ONE query using aggregate
        const { data, error } = await supabase
            .from('team_members' as any)
            .select(`
                team:teams (
                    *,
                    member_count:team_members(count)
                )
            `)
            .eq('user_id', user.id);

        if (error) {
            logger.error('[teamService] Error fetching teams:', error);
            return [];
        }

        // Transform data - member_count comes as array [{count: n}]
        const teams = (data as any).map((item: any) => {
            const team = item.team;
            return {
                ...team,
                member_count: team.member_count?.[0]?.count || 1
            };
        });

        return teams as any;
    },

    async getTeamById(id: string): Promise<Team | null> {
        const { data, error } = await supabase
            .from('teams' as any)
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return null;
        }

        // Get members
        const { count } = await supabase
            .from('team_members' as any)
            .select('*', { count: 'exact', head: true })
            .eq('team_id', id);

        return {
            ...(data as any),
            member_count: count || 0
        } as any;
    },

    async createTeam(data: CreateTeamDTO): Promise<Team> {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuário não autenticado');

        // Sanitize inputs
        const sanitizedName = sanitizeString(data.name);
        const sanitizedSport = sanitizeString(data.sport);
        const sanitizedDescription = data.description ? sanitizeString(data.description) : null;

        // 1. Create Team
        const { data: team, error } = await supabase
            .from('teams' as any)
            .insert({
                name: sanitizedName,
                sport: sanitizedSport,
                description: sanitizedDescription,
                captain_id: user.id,
                stats: { wins: 0, losses: 0, draws: 0, matches: 0, rating: 1000 }
            } as any)
            .select()
            .single();

        if (error) {
            logger.error('[teamService] Error creating team:', error);
            throw error;
        }

        // 2. Add creator as 'captain' in members
        const { error: memberError } = await supabase
            .from('team_members' as any)
            .insert({
                team_id: (team as any).id,
                user_id: user.id,
                role: 'captain'
            } as any);

        if (memberError) {
            logger.error('[teamService] Error adding captain:', memberError);
            // Handle cleanup if strict consistency is needed
        }

        return {
            ...(team as any),
            member_count: 1
        } as any;
    }
};
