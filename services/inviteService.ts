import { supabase } from '../lib/supabase';
import { Database } from '../lib/database.types';
import { logger } from '../utils/logger';
import { sanitizeString } from '../utils/inputValidator';

type MatchInviteRow = Database['public']['Tables']['match_invites']['Row'];

export interface MatchInvite extends MatchInviteRow {
    match?: any;
    sender?: {
        id: string;
        full_name: string | null;
        avatar_url: string | null;
    };
}

export const InviteService = {
    /**
     * Send invites to multiple users for a match
     */
    async sendInvites(matchId: string, inviteeIds: string[], message?: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            // Sanitize message if provided
            const sanitizedMessage = message ? sanitizeString(message) : null;

            const invites = inviteeIds.map(recipientId => ({
                match_id: matchId,
                sender_id: user.id,
                recipient_id: recipientId,
                status: 'pending' as const,
                message: sanitizedMessage
            }));

            const { data, error } = await supabase
                .from('match_invites')
                .insert(invites as any)
                .select();

            if (error) throw error;

            // Fetch match and profile data for potential future notification use
            await supabase
                .from('matches')
                .select('title, sport, date, start_time')
                .eq('id', matchId)
                .single();

            await supabase
                .from('profiles')
                .select('full_name, avatar_url')
                .eq('id', user.id)
                .single();

            logger.log('[InviteService] Invites sent:', data?.length);
            return { success: true, invites: data };
        } catch (error: any) {
            logger.error('[InviteService] Error sending invites:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get pending invites for the current user
     */
    async getMyInvites(): Promise<MatchInvite[]> {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            // Get invites with match data
            const { data: invites, error } = await supabase
                .from('match_invites')
                .select(`
                    *,
                    match:matches(
                        id, title, sport, date, start_time, end_time, max_players, current_players,
                        court:courts(id, name, address, latitude, longitude)
                    )
                `)
                .eq('recipient_id', user.id)
                .eq('status', 'pending')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (!invites || invites.length === 0) return [];

            // Get unique sender IDs and fetch their profiles separately
            const senderIds = [...new Set((invites as any).map((inv: any) => inv.sender_id))];
            const { data: senders } = await supabase
                .from('profiles')
                .select('id, full_name, avatar_url')
                .in('id', senderIds);

            const senderMap = new Map((senders as any)?.map((s: any) => [s.id, s]) || []);

            // Combine the data
            return (invites as any).map((invite: any) => ({
                ...invite,
                sender: senderMap.get(invite.sender_id) || null
            }));
        } catch (error) {
            logger.error('[InviteService] Error fetching invites:', error);
            return [];
        }
    },

    /**
     * Accept an invite and join the match
     */
    async acceptInvite(inviteId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Usuário não autenticado');

            // Get the invite to find the match
            const { data: invite, error: inviteError } = await supabase
                .from('match_invites')
                .select('match_id, sender_id')
                .eq('id', inviteId)
                .single();

            if (inviteError) throw inviteError;

            const inviteData = invite as any;

            // Update invite status
            const { error: updateError } = await (supabase
                .from('match_invites') as any)
                .update({ status: 'accepted' })
                .eq('id', inviteId);

            if (updateError) throw updateError;

            // Add user to match_players
            const { error: joinError } = await supabase
                .from('match_players')
                .insert({
                    match_id: inviteData.match_id,
                    user_id: user.id,
                    status: 'confirmed',
                    team: null
                } as any);

            if (joinError && joinError.code !== '23505') { // Ignore duplicate key
                throw joinError;
            }

            return { success: true };
        } catch (error: any) {
            logger.error('[InviteService] Error accepting invite:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Decline an invite
     */
    async declineInvite(inviteId: string) {
        try {
            const { error } = await (supabase
                .from('match_invites') as any)
                .update({ status: 'declined' })
                .eq('id', inviteId);

            if (error) throw error;
            return { success: true };
        } catch (error: any) {
            logger.error('[InviteService] Error declining invite:', error);
            return { success: false, error: error.message };
        }
    },

    /**
     * Get followers to invite to a match
     */
    async getFollowersToInvite(matchId: string) {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return [];

            // Get user's followers
            const { data: followers, error } = await supabase
                .from('follows')
                .select(`
                    follower:profiles!follows_follower_id_fkey(id, full_name, avatar_url)
                `)
                .eq('following_id', user.id);

            if (error) throw error;

            // Get already invited users for this match
            const { data: existingInvites } = await supabase
                .from('match_invites')
                .select('recipient_id')
                .eq('match_id', matchId);

            const invitedIds = new Set((existingInvites as any)?.map((i: any) => i.recipient_id) || []);

            // Get users already in the match
            const { data: matchPlayers } = await supabase
                .from('match_players')
                .select('user_id')
                .eq('match_id', matchId);

            const playerIds = new Set((matchPlayers as any)?.map((p: any) => p.user_id) || []);

            // Filter out already invited/joined
            const availableFollowers = (followers as any)?.filter((f: any) => {
                const follower = f.follower;
                return follower && !invitedIds.has(follower.id) && !playerIds.has(follower.id);
            }).map((f: any) => f.follower) || [];

            return availableFollowers;
        } catch (error) {
            logger.error('[InviteService] Error fetching followers:', error);
            return [];
        }
    }
};
