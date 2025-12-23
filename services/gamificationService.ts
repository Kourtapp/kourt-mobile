import { supabase } from '@/lib/supabase';

// XP rewards for different activities
export const XP_REWARDS = {
    // Matches
    MATCH_PLAYED: 50,
    MATCH_WIN: 100,
    MATCH_WIN_STREAK_BONUS: 25, // Per streak game
    MATCH_FIRST_OF_DAY: 30,
    MATCH_REGISTERED: 20, // For recording match in app

    // Social
    FOLLOW_PLAYER: 5,
    RECEIVE_FOLLOWER: 10,
    POST_CREATED: 15,
    POST_LIKED: 2,
    COMMENT_RECEIVED: 5,

    // Profile
    PROFILE_COMPLETED: 100,
    AVATAR_UPLOADED: 25,
    BIO_ADDED: 15,
    SPORTS_SELECTED: 20,

    // Court actions
    COURT_REVIEWED: 30,
    COURT_BOOKED: 20,
    COURT_CHECK_IN: 15,

    // Tournaments
    TOURNAMENT_JOINED: 50,
    TOURNAMENT_WIN: 200,
    TOURNAMENT_SECOND: 100,
    TOURNAMENT_THIRD: 50,

    // Streaks
    STREAK_7_DAYS: 100,
    STREAK_30_DAYS: 500,
    STREAK_100_DAYS: 2000,

    // Achievements (one-time)
    FIRST_MATCH: 150,
    FIRST_WIN: 200,
    FIRST_TOURNAMENT: 100,
    FIRST_BOOKING: 50,
    VERIFIED_EMAIL: 50,
};

// Level thresholds
export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    500,    // Level 2
    1200,   // Level 3
    2100,   // Level 4
    3200,   // Level 5
    4500,   // Level 6
    6000,   // Level 7
    7800,   // Level 8
    9900,   // Level 9
    12300,  // Level 10
    15000,  // Level 11
    18000,  // Level 12
    21500,  // Level 13
    25500,  // Level 14
    30000,  // Level 15
    35000,  // Level 16
    41000,  // Level 17
    48000,  // Level 18
    56000,  // Level 19
    65000,  // Level 20
    // Beyond level 20: each level requires 10000 more
];

export interface XPEvent {
    id: string;
    user_id: string;
    event_type: keyof typeof XP_REWARDS;
    xp_amount: number;
    metadata?: Record<string, any>;
    created_at: string;
}

export interface LevelUpResult {
    leveled_up: boolean;
    new_level: number;
    xp_gained: number;
    total_xp: number;
    xp_for_next_level: number;
}

export const gamificationService = {
    /**
     * Calculate level from total XP
     */
    calculateLevel(totalXp: number): { level: number; xpToNextLevel: number; xpProgress: number } {
        let level = 1;
        let xpForCurrentLevel = 0;
        let xpForNextLevel = LEVEL_THRESHOLDS[1] || 500;

        for (let i = 1; i < LEVEL_THRESHOLDS.length; i++) {
            if (totalXp >= LEVEL_THRESHOLDS[i]) {
                level = i + 1;
                xpForCurrentLevel = LEVEL_THRESHOLDS[i];
                xpForNextLevel = LEVEL_THRESHOLDS[i + 1] || (LEVEL_THRESHOLDS[i] + 10000);
            } else {
                break;
            }
        }

        // Handle levels beyond the threshold array
        if (level >= LEVEL_THRESHOLDS.length) {
            const baseLevelXp = LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1];
            const extraLevels = Math.floor((totalXp - baseLevelXp) / 10000);
            level = LEVEL_THRESHOLDS.length + extraLevels;
            xpForCurrentLevel = baseLevelXp + (extraLevels * 10000);
            xpForNextLevel = xpForCurrentLevel + 10000;
        }

        const xpProgress = totalXp - xpForCurrentLevel;
        const xpToNextLevel = xpForNextLevel - totalXp;

        return { level, xpToNextLevel, xpProgress };
    },

    /**
     * Award XP to a user
     */
    async awardXP(
        eventType: keyof typeof XP_REWARDS,
        metadata?: Record<string, any>
    ): Promise<LevelUpResult> {
        try {
            const { data: { user }, error: authError } = await supabase.auth.getUser();
            if (authError || !user) {
                throw new Error('User not authenticated');
            }

            const xpAmount = XP_REWARDS[eventType];

            // Get current user XP
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('xp, level')
                .eq('id', user.id)
                .single();

            if (profileError) throw profileError;

            const currentXp = profile.xp || 0;
            const currentLevel = typeof profile.level === 'string'
                ? parseInt(profile.level)
                : (profile.level || 1);
            const newTotalXp = currentXp + xpAmount;

            // Calculate new level
            const { level: newLevel, xpToNextLevel } = this.calculateLevel(newTotalXp);
            const leveledUp = newLevel > currentLevel;

            // Update profile
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                    xp: newTotalXp,
                    level: newLevel,
                    xp_to_next_level: xpToNextLevel,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', user.id);

            if (updateError) throw updateError;

            // Log XP event (if table exists)
            try {
                await supabase.from('xp_events').insert({
                    user_id: user.id,
                    event_type: eventType,
                    xp_amount: xpAmount,
                    metadata: metadata || {},
                });
            } catch {
                // xp_events table might not exist, silently fail
                console.log('[gamificationService] xp_events table not available');
            }

            return {
                leveled_up: leveledUp,
                new_level: newLevel,
                xp_gained: xpAmount,
                total_xp: newTotalXp,
                xp_for_next_level: xpToNextLevel,
            };
        } catch (error: any) {
            console.error('[gamificationService.awardXP] Error:', error);
            throw error;
        }
    },

    /**
     * Award XP for completing a match
     */
    async onMatchCompleted(matchResult: 'win' | 'loss' | 'draw', streakCount?: number): Promise<LevelUpResult[]> {
        const results: LevelUpResult[] = [];

        // Base XP for playing
        results.push(await this.awardXP('MATCH_PLAYED'));

        // Win bonus
        if (matchResult === 'win') {
            results.push(await this.awardXP('MATCH_WIN'));

            // Streak bonus
            if (streakCount && streakCount > 1) {
                const streakBonus = Math.min(streakCount - 1, 5) * XP_REWARDS.MATCH_WIN_STREAK_BONUS;
                // We'd need a custom XP award for this
                // For now, award multiple streak bonuses
            }
        }

        // First match of the day bonus (check last match time)
        // This would require checking the last match timestamp

        return results;
    },

    /**
     * Award XP for recording a match
     */
    async onMatchRegistered(metadata?: Record<string, any>): Promise<LevelUpResult> {
        return this.awardXP('MATCH_REGISTERED', metadata);
    },

    /**
     * Award XP for social actions
     */
    async onFollowPlayer(followedUserId: string): Promise<LevelUpResult> {
        return this.awardXP('FOLLOW_PLAYER', { followed_user_id: followedUserId });
    },

    async onReceiveFollower(followerUserId: string): Promise<LevelUpResult> {
        return this.awardXP('RECEIVE_FOLLOWER', { follower_user_id: followerUserId });
    },

    async onPostCreated(postId: string): Promise<LevelUpResult> {
        return this.awardXP('POST_CREATED', { post_id: postId });
    },

    /**
     * Award XP for profile completion
     */
    async onProfileCompleted(): Promise<LevelUpResult> {
        return this.awardXP('PROFILE_COMPLETED');
    },

    async onAvatarUploaded(): Promise<LevelUpResult> {
        return this.awardXP('AVATAR_UPLOADED');
    },

    /**
     * Award XP for court actions
     */
    async onCourtReviewed(courtId: string): Promise<LevelUpResult> {
        return this.awardXP('COURT_REVIEWED', { court_id: courtId });
    },

    async onCourtBooked(bookingId: string): Promise<LevelUpResult> {
        return this.awardXP('COURT_BOOKED', { booking_id: bookingId });
    },

    async onCourtCheckIn(courtId: string): Promise<LevelUpResult> {
        return this.awardXP('COURT_CHECK_IN', { court_id: courtId });
    },

    /**
     * Award XP for tournament participation
     */
    async onTournamentJoined(tournamentId: string): Promise<LevelUpResult> {
        return this.awardXP('TOURNAMENT_JOINED', { tournament_id: tournamentId });
    },

    async onTournamentResult(
        tournamentId: string,
        position: 1 | 2 | 3
    ): Promise<LevelUpResult> {
        const eventType = position === 1
            ? 'TOURNAMENT_WIN'
            : position === 2
                ? 'TOURNAMENT_SECOND'
                : 'TOURNAMENT_THIRD';
        return this.awardXP(eventType, { tournament_id: tournamentId, position });
    },

    /**
     * Check and award streak achievements
     */
    async checkStreakAchievements(streakDays: number): Promise<LevelUpResult | null> {
        if (streakDays === 7) {
            return this.awardXP('STREAK_7_DAYS');
        } else if (streakDays === 30) {
            return this.awardXP('STREAK_30_DAYS');
        } else if (streakDays === 100) {
            return this.awardXP('STREAK_100_DAYS');
        }
        return null;
    },

    /**
     * Get user's XP history
     */
    async getXPHistory(limit: number = 20): Promise<XPEvent[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            const { data, error } = await supabase
                .from('xp_events')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (error) {
                console.log('[gamificationService.getXPHistory] Error:', error);
                return [];
            }

            return data as XPEvent[];
        } catch {
            return [];
        }
    },

    /**
     * Get leaderboard by XP
     */
    async getXPLeaderboard(limit: number = 10): Promise<{
        id: string;
        name: string;
        avatar_url: string | null;
        level: number;
        xp: number;
    }[]> {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('id, name, avatar_url, level, xp')
                .order('xp', { ascending: false })
                .limit(limit);

            if (error) throw error;

            return (data || []).map(p => ({
                id: p.id,
                name: p.name || 'Jogador',
                avatar_url: p.avatar_url,
                level: typeof p.level === 'string' ? parseInt(p.level) : (p.level || 1),
                xp: p.xp || 0,
            }));
        } catch (error) {
            console.error('[gamificationService.getXPLeaderboard] Error:', error);
            return [];
        }
    },
};
