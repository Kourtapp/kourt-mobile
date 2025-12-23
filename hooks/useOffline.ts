/**
 * Offline Mode Hook
 * Handles network state and queues actions for when back online
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../lib/supabase';
import { logger } from '../utils/logger';

const OFFLINE_QUEUE_KEY = '@kourt/offline_queue';

interface QueuedAction {
    id: string;
    type: string;
    payload: any;
    timestamp: number;
    retryCount: number;
}

interface OfflineState {
    isOnline: boolean;
    isConnected: boolean;
    connectionType: string | null;
    queuedActionsCount: number;
}

/**
 * Hook for managing offline state and action queue
 */
export function useOffline() {
    const [state, setState] = useState<OfflineState>({
        isOnline: true,
        isConnected: true,
        connectionType: null,
        queuedActionsCount: 0,
    });

    const queueRef = useRef<QueuedAction[]>([]);
    const processingRef = useRef(false);

    // Load queued actions from storage
    useEffect(() => {
        loadQueue();
    }, []);

    // Subscribe to network changes
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((netState: NetInfoState) => {
            const isOnline = netState.isConnected === true && netState.isInternetReachable === true;

            setState(prev => ({
                ...prev,
                isOnline,
                isConnected: netState.isConnected ?? false,
                connectionType: netState.type,
            }));

            // Process queue when back online
            if (isOnline) {
                processQueue();
            }
        });

        return () => unsubscribe();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle app state changes (for battery optimization)
    useEffect(() => {
        const handleAppStateChange = (nextAppState: AppStateStatus) => {
            if (nextAppState === 'background') {
                // Disconnect realtime channels to save battery
                disconnectRealtimeChannels();
            } else if (nextAppState === 'active') {
                // Reconnect when app becomes active
                if (state.isOnline) {
                    reconnectRealtimeChannels();
                }
            }
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);
        return () => subscription?.remove();
    }, [state.isOnline]);

    const loadQueue = async () => {
        try {
            const stored = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
            if (stored) {
                queueRef.current = JSON.parse(stored);
                setState(prev => ({
                    ...prev,
                    queuedActionsCount: queueRef.current.length,
                }));
            }
        } catch (error) {
            logger.error('[useOffline] Error loading queue:', error);
        }
    };

    const saveQueue = async () => {
        try {
            await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queueRef.current));
            setState(prev => ({
                ...prev,
                queuedActionsCount: queueRef.current.length,
            }));
        } catch (error) {
            logger.error('[useOffline] Error saving queue:', error);
        }
    };

    /**
     * Queue an action to be executed when online
     */
    const queueAction = useCallback(async (type: string, payload: any) => {
        const action: QueuedAction = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            type,
            payload,
            timestamp: Date.now(),
            retryCount: 0,
        };

        queueRef.current.push(action);
        await saveQueue();

        logger.log('[useOffline] Action queued:', type);

        // Try to process immediately if online
        if (state.isOnline) {
            processQueue();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.isOnline]);

    /**
     * Process queued actions
     */
    const processQueue = async () => {
        if (processingRef.current || queueRef.current.length === 0) {
            return;
        }

        processingRef.current = true;
        logger.log(`[useOffline] Processing queue: ${queueRef.current.length} actions`);

        const processed: string[] = [];

        for (const action of queueRef.current) {
            try {
                await executeAction(action);
                processed.push(action.id);
            } catch {
                action.retryCount++;

                // Max 3 retries
                if (action.retryCount >= 3) {
                    logger.error('[useOffline] Action failed after 3 retries:', action.type);
                    processed.push(action.id);
                }
            }
        }

        // Remove processed actions
        queueRef.current = queueRef.current.filter(a => !processed.includes(a.id));
        await saveQueue();

        processingRef.current = false;
    };

    /**
     * Execute a queued action
     */
    const executeAction = async (action: QueuedAction) => {
        switch (action.type) {
            case 'like_post':
                await supabase
                    .from('post_likes')
                    .insert(action.payload as any);
                break;

            case 'follow_user':
                await supabase
                    .from('follows')
                    .insert(action.payload as any);
                break;

            case 'join_match':
                await (supabase.rpc as any)('join_match', action.payload);
                break;

            case 'update_profile':
                await (supabase.from('profiles') as any)
                    .update(action.payload.data)
                    .eq('id', action.payload.userId);
                break;

            default:
                logger.warn('[useOffline] Unknown action type:', action.type);
        }
    };

    /**
     * Clear the action queue
     */
    const clearQueue = async () => {
        queueRef.current = [];
        await saveQueue();
    };

    return {
        ...state,
        queueAction,
        clearQueue,
        processQueue,
    };
}

// =============================================================================
// Realtime Channel Management (Battery Optimization)
// =============================================================================

const activeChannels: Set<string> = new Set();

/**
 * Disconnect all realtime channels (for background mode)
 */
function disconnectRealtimeChannels() {
    logger.log('[useOffline] Disconnecting realtime channels for battery save');

    // Store active channel names before disconnecting
    const channels = supabase.getChannels();
    channels.forEach(channel => {
        activeChannels.add(channel.topic);
        supabase.removeChannel(channel);
    });
}

/**
 * Reconnect realtime channels (when app becomes active)
 */
function reconnectRealtimeChannels() {
    logger.log('[useOffline] Reconnecting realtime channels');

    // Note: Components should handle their own reconnection
    // This just clears the stored list
    activeChannels.clear();
}

/**
 * Check if we should skip a network request (offline mode)
 */
export function shouldSkipRequest(): boolean {
    // This is a sync check - for async use the hook
    return false; // NetInfo state is async, so we can't sync check here
}

/**
 * Hook for components that need realtime subscriptions
 * Automatically handles background/foreground transitions
 */
export function useRealtimeWithBatteryOptimization(
    channelName: string,
    config: {
        event: string;
        schema: string;
        table: string;
        filter?: string;
    },
    callback: (payload: any) => void
) {
    const { isOnline } = useOffline();
    const channelRef = useRef<any>(null);

    useEffect(() => {
        if (!isOnline) return;

        // Subscribe
        channelRef.current = supabase
            .channel(channelName)
            .on(
                'postgres_changes' as any,
                {
                    event: config.event,
                    schema: config.schema,
                    table: config.table,
                    filter: config.filter,
                },
                callback
            )
            .subscribe();

        // Cleanup
        return () => {
            if (channelRef.current) {
                supabase.removeChannel(channelRef.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOnline, channelName, config.event, config.schema, config.table, config.filter]);

    return { isSubscribed: !!channelRef.current && isOnline };
}
