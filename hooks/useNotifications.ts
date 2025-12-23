import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

export interface Notification {
    id: string;
    type: 'match_invite' | 'match_reminder' | 'follow' | 'like' | 'comment' | 'system';
    title: string;
    body: string;
    data?: Record<string, any>;
    read: boolean;
    created_at: string;
}

export function useNotifications() {
    const { session } = useAuthStore();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchNotifications = useCallback(async () => {
        if (!session?.user?.id) {
            setNotifications([]);
            setUnreadCount(0);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', session.user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) {
                // Table might not exist yet
                logger.warn('[useNotifications] Error or table not exists:', error.message);
                setNotifications([]);
                setUnreadCount(0);
                return;
            }

            const formattedNotifications: Notification[] = (data || []).map((n: any) => ({
                id: n.id,
                type: n.type || 'system',
                title: n.title || '',
                body: n.body || '',
                data: n.data,
                read: n.read || false,
                created_at: n.created_at,
            }));

            setNotifications(formattedNotifications);
            setUnreadCount(formattedNotifications.filter(n => !n.read).length);
        } catch (error) {
            logger.error('[useNotifications] Exception:', error);
            setNotifications([]);
            setUnreadCount(0);
        } finally {
            setLoading(false);
        }
    }, [session?.user?.id]);

    const markAsRead = useCallback(async (notificationId: string) => {
        if (!session?.user?.id) return;

        try {
            await (supabase
                .from('notifications') as any)
                .update({ read: true })
                .eq('id', notificationId)
                .eq('user_id', session.user.id);

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (error) {
            logger.error('[useNotifications] Error marking as read:', error);
        }
    }, [session?.user?.id]);

    const markAllAsRead = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            await (supabase
                .from('notifications') as any)
                .update({ read: true })
                .eq('user_id', session.user.id)
                .eq('read', false);

            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (error) {
            logger.error('[useNotifications] Error marking all as read:', error);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        fetchNotifications();
    }, [fetchNotifications]);

    // Subscribe to realtime notifications
    useEffect(() => {
        if (!session?.user?.id) return;

        const channel = supabase
            .channel('notifications')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${session.user.id}`,
                },
                (payload) => {
                    const newNotification: Notification = {
                        id: payload.new.id,
                        type: payload.new.type || 'system',
                        title: payload.new.title || '',
                        body: payload.new.body || '',
                        data: payload.new.data,
                        read: false,
                        created_at: payload.new.created_at,
                    };
                    setNotifications(prev => [newNotification, ...prev]);
                    setUnreadCount(prev => prev + 1);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [session?.user?.id]);

    return {
        notifications,
        unreadCount,
        loading,
        refetch: fetchNotifications,
        markAsRead,
        markAllAsRead,
    };
}
