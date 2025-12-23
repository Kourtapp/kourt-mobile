import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

/**
 * Service to handle all Kourt Automations (KourtOS v5).
 * Maps directly to the "Guia Completo de Automações".
 */
export const AutomationService = {

    /**
     * Phase 1: Onboarding Automation (Item 1.1)
     * Calls Supabase Function to fetch gov data via CPF.
     */
    async autoFillProfile(cpf: string) {
        try {
            // In production: const { data, error } = await supabase.functions.invoke('gov-data-fetch', { body: { cpf } });

            // Simulation
            return new Promise<{ name: string; birthDate: string }>((resolve) => {
                setTimeout(() => {
                    resolve({
                        name: "Bruno Silva dos Santos",
                        birthDate: "15/05/1995"
                    });
                }, 1500);
            });
        } catch (error) {
            logger.error('[automationService] AutoFill Error:', error);
            throw error;
        }
    },

    /**
     * Phase 2: Match Automation (Item 2.2)
     * Check-in logic. Triggers notifications to other players.
     */
    async checkInMatch(matchId: string, userId: string) {
        try {
            // Update match_players status to checked_in
            const { error } = await (supabase
                .from('match_players') as any)
                .update({
                    status: 'checked_in',
                    checked_in_at: new Date().toISOString()
                })
                .eq('match_id', matchId)
                .eq('user_id', userId);

            if (error) throw error;

            return true;
        } catch (error) {
            logger.error('[automationService] CheckIn Error:', error);
            throw error;
        }
    },

    /**
     * Phase 2: Match Result (Item 2.5)
     * Registers score and calculates XP automatically.
     */
    async registerMatchResult(
        matchId: string,
        scores: { set1: [string, string]; set2?: [string, string]; set3?: [string, string] },
        rating?: number
    ): Promise<{ success: boolean; xpEarned: number; newRank?: number }> {
        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Não autenticado');

            // Parse scores
            const set1User = parseInt(scores.set1[0]) || 0;
            const set1Opp = parseInt(scores.set1[1]) || 0;
            const set2User = scores.set2 ? parseInt(scores.set2[0]) || 0 : 0;
            const set2Opp = scores.set2 ? parseInt(scores.set2[1]) || 0 : 0;
            const set3User = scores.set3 ? parseInt(scores.set3[0]) || 0 : 0;
            const set3Opp = scores.set3 ? parseInt(scores.set3[1]) || 0 : 0;

            // Calculate who won more sets
            let userSetsWon = 0;
            let oppSetsWon = 0;

            if (set1User > set1Opp) userSetsWon++;
            else if (set1Opp > set1User) oppSetsWon++;

            if (scores.set2 && (set2User > 0 || set2Opp > 0)) {
                if (set2User > set2Opp) userSetsWon++;
                else if (set2Opp > set2User) oppSetsWon++;
            }

            if (scores.set3 && (set3User > 0 || set3Opp > 0)) {
                if (set3User > set3Opp) userSetsWon++;
                else if (set3Opp > set3User) oppSetsWon++;
            }

            const userWon = userSetsWon > oppSetsWon;

            // Build score object
            const scoreData = {
                sets: [
                    { user: set1User, opponent: set1Opp },
                    ...(scores.set2 ? [{ user: set2User, opponent: set2Opp }] : []),
                    ...(scores.set3 ? [{ user: set3User, opponent: set3Opp }] : []),
                ],
                userSetsWon,
                oppSetsWon,
                winner: userWon ? 'user' : 'opponent',
            };

            // Build score_final string (e.g., "6-4, 7-5")
            const scoreParts = [`${set1User}-${set1Opp}`];
            if (scores.set2 && (set2User > 0 || set2Opp > 0)) {
                scoreParts.push(`${set2User}-${set2Opp}`);
            }
            if (scores.set3 && (set3User > 0 || set3Opp > 0)) {
                scoreParts.push(`${set3User}-${set3Opp}`);
            }
            const scoreFinal = scoreParts.join(', ');

            // Update match with result
            const { error: matchError } = await (supabase
                .from('matches') as any)
                .update({
                    score: scoreData,
                    score_final: scoreFinal,
                    status: 'completed',
                    winner_team: userWon ? 1 : 2,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', matchId);

            if (matchError) {
                logger.error('[automationService] registerMatchResult match update error:', matchError);
                throw matchError;
            }

            // Calculate XP based on result
            const baseXP = 15;
            const winBonus = userWon ? 10 : 0;
            const xpEarned = baseXP + winBonus;

            // Update user profile with XP and stats
            const { data: profile } = await supabase
                .from('profiles')
                .select('xp, wins, losses, matches_played')
                .eq('id', user.id)
                .single();

            if (profile) {
                const currentXP = (profile as any).xp || 0;
                const currentWins = (profile as any).wins || 0;
                const currentLosses = (profile as any).losses || 0;
                const currentMatches = (profile as any).matches_played || 0;

                await (supabase
                    .from('profiles') as any)
                    .update({
                        xp: currentXP + xpEarned,
                        wins: userWon ? currentWins + 1 : currentWins,
                        losses: userWon ? currentLosses : currentLosses + 1,
                        matches_played: currentMatches + 1,
                        updated_at: new Date().toISOString(),
                    })
                    .eq('id', user.id);
            }

            // Optionally save match rating
            if (rating && rating > 0) {
                try {
                    await supabase
                        .from('match_ratings')
                        .insert({
                            match_id: matchId,
                            user_id: user.id,
                            rating: rating,
                        } as any);
                } catch {
                    // Ignore if table doesn't exist
                }
            }

            return {
                success: true,
                xpEarned,
                newRank: (profile as any)?.rank_points || 1000,
            };
        } catch (error) {
            logger.error('[automationService] Result Error:', error);
            throw error;
        }
    },

    /**
     * Phase 4: Social Automation (Item 5.1)
     * Generates a post using Claude AI / Gumloop.
     */
    async generateAiPost() {
        try {
            // In production: const { data } = await supabase.functions.invoke('generate-post-ai');

            return new Promise<{ content: string; imageUrl: string }>((resolve) => {
                setTimeout(() => {
                    resolve({
                        content: "Acabei de vencer uma partida incrível de Beach Tennis na Arena 7! 🎾🔥 O jogo foi disputado ponto a ponto, mas conseguimos fechar o tie-break. #KourtApp #BeachTennis #Vitoria",
                        imageUrl: "https://images.unsplash.com/photo-1613918108466-292b78a8ef95?q=80&w=2076&auto=format&fit=crop"
                    });
                }, 2500);
            });
        } catch (error) {
            logger.error('[automationService] AI Gen Error:', error);
            throw error;
        }
    },

    /**
     * Phase 3: Monetization (Item 4.3)
     * Toggles auto-renewal subscription status.
     */
    async toggleAutoRenewal(enabled: boolean) {
        try {
            // In production: await supabase.functions.invoke('stripe-subscription-update', { body: { autoRenew: enabled } });

            return new Promise<{ success: boolean; message: string }>((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        message: enabled ? "Renovação ativada" : "Renovação cancelada"
                    });
                }, 1000);
            });
        } catch (error) {
            logger.error('[automationService] Subscription Error:', error);
            throw error;
        }
    }
};
