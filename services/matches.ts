import { supabase } from '../lib/supabase';
import { Database } from '../types/database.types';

type MatchInsert = Database['public']['Tables']['matches']['Insert'];

export const createMatch = async (matchData: MatchInsert) => {
    const { data, error } = await (supabase
        .from('matches') as any)
        .insert(matchData)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const getMatch = async (matchId: string) => {
    const { data, error } = await supabase
        .from('matches')
        .select(`
      *,
      court:courts(*),
      players:match_players(
        *,
        user:profiles(*)
      )
    `)
        .eq('id', matchId)
        .single();

    if (error) throw error;
    return data;
};

export const joinMatch = async (matchId: string, userId: string) => {
    const { data, error } = await (supabase
        .from('match_players') as any)
        .insert({
            match_id: matchId,
            user_id: userId,
            status: 'confirmed',
        })
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const leaveMatch = async (matchId: string, userId: string) => {
    const { error } = await supabase
        .from('match_players')
        .delete()
        .eq('match_id', matchId)
        .eq('user_id', userId);

    if (error) throw error;
};

export const updateScore = async (matchId: string, score: any) => {
    const { data, error } = await (supabase
        .from('matches') as any)
        .update({ score })
        .eq('id', matchId)
        .select()
        .single();

    if (error) throw error;
    return data;
};

export const finishMatch = async (matchId: string, finalScore: any) => {
    const { data, error } = await (supabase
        .from('matches') as any)
        .update({
            status: 'completed',
            score: finalScore,
        })
        .eq('id', matchId)
        .select()
        .single();

    if (error) throw error;
    return data;
};
