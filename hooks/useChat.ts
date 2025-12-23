import { useState, useEffect, useCallback, useRef } from 'react';
import { chatService, Conversation, Message } from '../services/chat.service';
import { useAuthStore } from '../stores/authStore';
import { logger } from '../utils/logger';

export function useConversations() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await chatService.getConversations(userId);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return { conversations, loading, error, refetch: fetchConversations };
}

export function useMessages(conversationId: string | undefined) {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await chatService.getMessages(conversationId);
      setMessages(data);
      setError(null);

      // Mark as read
      if (userId) {
        await chatService.markAsRead(conversationId, userId);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [conversationId, userId]);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    if (conversationId) {
      unsubscribeRef.current = chatService.subscribeToMessages(
        conversationId,
        (newMessage) => {
          setMessages((prev) => [...prev, newMessage]);
          // Mark as read if from other user
          if (userId && newMessage.sender_id !== userId) {
            chatService.markAsRead(conversationId, userId);
          }
        }
      );
    }

    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [conversationId, fetchMessages, userId]);

  return { messages, loading, error, refetch: fetchMessages };
}

export function useSendMessage() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const sendMessage = useCallback(
    async (conversationId: string, content: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);
        const message = await chatService.sendMessage(conversationId, userId, content);
        return message;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { sendMessage, loading, error };
}

export function useStartConversation() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const startConversation = useCallback(
    async (otherUserId: string) => {
      if (!userId) {
        throw new Error('User not authenticated');
      }

      try {
        setLoading(true);
        setError(null);
        const conversationId = await chatService.getOrCreateConversation(userId, otherUserId);
        return conversationId;
      } catch (err) {
        setError(err as Error);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  return { startConversation, loading, error };
}

export function useUnreadMessagesCount() {
  const { session } = useAuthStore();
  const userId = session?.user?.id;

  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCount = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const unreadCount = await chatService.getTotalUnreadCount(userId);
      setCount(unreadCount);
    } catch (err) {
      logger.error('[useChat] Error fetching unread count:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  return { count, loading, refetch: fetchCount };
}
