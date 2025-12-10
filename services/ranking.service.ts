import { supabase } from '../lib/supabase';

// Mock data flag - set to false when Supabase is configured
const USE_MOCK_DATA = true;

export interface RankingUser {
  id: string;
  name: string;
  avatar_url: string | null;
  sport: string;
  level: string;
  points: number;
  rank: number;
  wins: number;
  losses: number;
  win_rate: number;
  matches_played: number;
  trend: 'up' | 'down' | 'stable';
  previous_rank: number;
}

export interface UserRankingStats {
  sport: string;
  rank: number;
  total_players: number;
  points: number;
  wins: number;
  losses: number;
  win_rate: number;
  best_rank: number;
  current_streak: number;
  longest_streak: number;
}

export type RankingSport = 'beach-tennis' | 'padel' | 'tennis' | 'futevolei' | 'volleyball' | 'all';
export type RankingPeriod = 'week' | 'month' | 'year' | 'all-time';

// Mock data
const MOCK_RANKING_USERS: RankingUser[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Avançado',
    points: 2450,
    rank: 1,
    wins: 45,
    losses: 8,
    win_rate: 84.9,
    matches_played: 53,
    trend: 'stable',
    previous_rank: 1,
  },
  {
    id: '2',
    name: 'Ana Rodrigues',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Avançado',
    points: 2380,
    rank: 2,
    wins: 42,
    losses: 10,
    win_rate: 80.8,
    matches_played: 52,
    trend: 'up',
    previous_rank: 4,
  },
  {
    id: '3',
    name: 'Pedro Costa',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Avançado',
    points: 2320,
    rank: 3,
    wins: 40,
    losses: 12,
    win_rate: 76.9,
    matches_played: 52,
    trend: 'down',
    previous_rank: 2,
  },
  {
    id: '4',
    name: 'Mariana Lima',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Intermediário',
    points: 2180,
    rank: 4,
    wins: 35,
    losses: 15,
    win_rate: 70.0,
    matches_played: 50,
    trend: 'up',
    previous_rank: 6,
  },
  {
    id: '5',
    name: 'João Santos',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Intermediário',
    points: 2050,
    rank: 5,
    wins: 32,
    losses: 18,
    win_rate: 64.0,
    matches_played: 50,
    trend: 'down',
    previous_rank: 3,
  },
  {
    id: '6',
    name: 'Fernanda Oliveira',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Intermediário',
    points: 1980,
    rank: 6,
    wins: 30,
    losses: 20,
    win_rate: 60.0,
    matches_played: 50,
    trend: 'stable',
    previous_rank: 6,
  },
  {
    id: '7',
    name: 'Lucas Ferreira',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Intermediário',
    points: 1850,
    rank: 7,
    wins: 28,
    losses: 22,
    win_rate: 56.0,
    matches_played: 50,
    trend: 'up',
    previous_rank: 10,
  },
  {
    id: '8',
    name: 'Camila Souza',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Iniciante',
    points: 1720,
    rank: 8,
    wins: 25,
    losses: 25,
    win_rate: 50.0,
    matches_played: 50,
    trend: 'down',
    previous_rank: 7,
  },
  {
    id: '9',
    name: 'Rafael Mendes',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Iniciante',
    points: 1650,
    rank: 9,
    wins: 22,
    losses: 28,
    win_rate: 44.0,
    matches_played: 50,
    trend: 'stable',
    previous_rank: 9,
  },
  {
    id: '10',
    name: 'Juliana Alves',
    avatar_url: null,
    sport: 'beach-tennis',
    level: 'Iniciante',
    points: 1580,
    rank: 10,
    wins: 20,
    losses: 30,
    win_rate: 40.0,
    matches_played: 50,
    trend: 'up',
    previous_rank: 15,
  },
];

const MOCK_USER_STATS: UserRankingStats = {
  sport: 'beach-tennis',
  rank: 12,
  total_players: 156,
  points: 1420,
  wins: 18,
  losses: 22,
  win_rate: 45.0,
  best_rank: 8,
  current_streak: 2,
  longest_streak: 5,
};

export const rankingService = {
  // Get ranking leaderboard
  async getRanking(
    sport: RankingSport = 'beach-tennis',
    period: RankingPeriod = 'month',
    page: number = 1,
    limit: number = 20
  ): Promise<RankingUser[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));

      let filtered = [...MOCK_RANKING_USERS];

      if (sport !== 'all') {
        filtered = filtered.filter((u) => u.sport === sport);
      }

      const start = (page - 1) * limit;
      return filtered.slice(start, start + limit);
    }

    const offset = (page - 1) * limit;

    let query = supabase
      .from('rankings')
      .select(`
        id,
        points,
        rank,
        wins,
        losses,
        win_rate,
        matches_played,
        trend,
        previous_rank,
        sport,
        profiles:user_id (
          id,
          name,
          avatar_url,
          level
        )
      `)
      .order('rank', { ascending: true })
      .range(offset, offset + limit - 1);

    if (sport !== 'all') {
      query = query.eq('sport', sport);
    }

    if (period !== 'all-time') {
      const now = new Date();
      let startDate: Date;

      switch (period) {
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        case 'year':
          startDate = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        default:
          startDate = new Date(0);
      }

      query = query.gte('updated_at', startDate.toISOString());
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.profiles.id,
      name: item.profiles.name,
      avatar_url: item.profiles.avatar_url,
      sport: item.sport,
      level: item.profiles.level,
      points: item.points,
      rank: item.rank,
      wins: item.wins,
      losses: item.losses,
      win_rate: item.win_rate,
      matches_played: item.matches_played,
      trend: item.trend,
      previous_rank: item.previous_rank,
    }));
  },

  // Get user's ranking stats
  async getUserRankingStats(
    userId: string,
    sport: RankingSport = 'beach-tennis'
  ): Promise<UserRankingStats | null> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return MOCK_USER_STATS;
    }

    const { data, error } = await supabase
      .from('rankings')
      .select('*')
      .eq('user_id', userId)
      .eq('sport', sport)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw error;
    }

    // Get total players count
    const { count } = await supabase
      .from('rankings')
      .select('*', { count: 'exact', head: true })
      .eq('sport', sport);

    const d = data as any;
    return {
      sport: d.sport,
      rank: d.rank,
      total_players: count || 0,
      points: d.points,
      wins: d.wins,
      losses: d.losses,
      win_rate: d.win_rate,
      best_rank: d.best_rank,
      current_streak: d.current_streak,
      longest_streak: d.longest_streak,
    };
  },

  // Get nearby players with similar skill level
  async getNearbyRankedPlayers(
    userId: string,
    sport: RankingSport,
    limit: number = 5
  ): Promise<RankingUser[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // Return users around rank 12 (mock user's rank)
      return MOCK_RANKING_USERS.filter((u) => u.rank >= 10 && u.rank <= 15).slice(0, limit);
    }

    // First get user's rank
    const { data: userRanking } = await supabase
      .from('rankings')
      .select('rank')
      .eq('user_id', userId)
      .eq('sport', sport)
      .single();

    if (!userRanking) return [];

    const userRank = (userRanking as any).rank;

    // Get players within 5 ranks
    const { data, error } = await supabase
      .from('rankings')
      .select(`
        id,
        points,
        rank,
        wins,
        losses,
        win_rate,
        matches_played,
        trend,
        previous_rank,
        sport,
        profiles:user_id (
          id,
          name,
          avatar_url,
          level
        )
      `)
      .eq('sport', sport)
      .neq('user_id', userId)
      .gte('rank', userRank - 5)
      .lte('rank', userRank + 5)
      .order('rank', { ascending: true })
      .limit(limit);

    if (error) throw error;

    return (data || []).map((item: any) => ({
      id: item.profiles.id,
      name: item.profiles.name,
      avatar_url: item.profiles.avatar_url,
      sport: item.sport,
      level: item.profiles.level,
      points: item.points,
      rank: item.rank,
      wins: item.wins,
      losses: item.losses,
      win_rate: item.win_rate,
      matches_played: item.matches_played,
      trend: item.trend,
      previous_rank: item.previous_rank,
    }));
  },

  // Record match result and update rankings
  async recordMatchResult(
    matchId: string,
    winnerId: string,
    loserId: string,
    sport: string
  ): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return;
    }

    // This would typically be handled by a Supabase Edge Function
    // to ensure atomic updates and proper ELO calculation
    const { error } = await supabase.rpc('record_match_result' as any, {
      p_match_id: matchId,
      p_winner_id: winnerId,
      p_loser_id: loserId,
      p_sport: sport,
    } as any);

    if (error) throw error;
  },
};
