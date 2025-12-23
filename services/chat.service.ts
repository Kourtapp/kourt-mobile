import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender?: {
    id: string;
    name: string;
    avatar_url: string | null;
  };
}

export interface Conversation {
  id: string;
  created_at: string;
  participants: {
    id: string;
    name: string;
    avatar_url: string | null;
  }[];
  last_message?: Message;
  unread_count: number;
}

export const chatService = {
  /**
   * Get all conversations for user
   */
  async getConversations(userId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('conversation_participants')
      .select(`
        conversation:conversations (
          id,
          created_at,
          participants:conversation_participants (
            user:profiles (id, name, avatar_url)
          ),
          messages (
            id,
            content,
            sender_id,
            created_at,
            read
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (data || []).map((item: any) => {
      const conv = item.conversation;
      const otherParticipants = conv.participants
        .filter((p: any) => p.user.id !== userId)
        .map((p: any) => p.user);

      const messages = conv.messages.sort(
        (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      return {
        id: conv.id,
        created_at: conv.created_at,
        participants: otherParticipants,
        last_message: messages[0],
        unread_count: messages.filter((m: any) => !m.read && m.sender_id !== userId).length,
      };
    });
  },

  /**
   * Get messages for a conversation
   */
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (id, name, avatar_url)
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Send a message
   */
  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: senderId,
        content,
      } as any)
      .select(`
        *,
        sender:profiles!messages_sender_id_fkey (id, name, avatar_url)
      `)
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create or get conversation with user
   */
  async getOrCreateConversation(
    userId: string,
    otherUserId: string
  ): Promise<string> {
    // Check if conversation exists
    const { data: userConvs } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    const userConvIds = (userConvs || []).map((c: any) => c.conversation_id);

    if (userConvIds.length > 0) {
      const { data: existing } = await supabase
        .from('conversation_participants')
        .select('conversation_id')
        .eq('user_id', otherUserId)
        .in('conversation_id', userConvIds);

      if (existing && existing.length > 0) {
        return (existing[0] as any).conversation_id;
      }
    }

    // Create new conversation
    const { data: conv, error: convError } = await supabase
      .from('conversations')
      .insert({} as any)
      .select()
      .single();

    if (convError) throw convError;

    // Add participants
    await supabase.from('conversation_participants').insert([
      { conversation_id: (conv as any).id, user_id: userId },
      { conversation_id: (conv as any).id, user_id: otherUserId },
    ] as any);

    return (conv as any).id;
  },

  /**
   * Mark messages as read
   */
  async markAsRead(conversationId: string, userId: string): Promise<void> {
    await (supabase
      .from('messages') as any)
      .update({ read: true })
      .eq('conversation_id', conversationId)
      .neq('sender_id', userId)
      .eq('read', false);
  },

  /**
   * Subscribe to new messages in a conversation
   */
  subscribeToMessages(
    conversationId: string,
    onMessage: (message: Message) => void
  ) {
    const subscription = supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          const { data } = await supabase
            .from('messages')
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey (id, name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single();

          if (data) {
            onMessage(data);
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  },

  /**
   * Get unread count across all conversations
   */
  async getTotalUnreadCount(userId: string): Promise<number> {
    const { data: userConvs } = await supabase
      .from('conversation_participants')
      .select('conversation_id')
      .eq('user_id', userId);

    const userConvIds = (userConvs || []).map((c: any) => c.conversation_id);

    if (userConvIds.length === 0) return 0;

    const { count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .neq('sender_id', userId)
      .eq('read', false)
      .in('conversation_id', userConvIds);

    if (error) throw error;
    return count || 0;
  },
};
