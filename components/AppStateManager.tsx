import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppState } from '../hooks/useAppState';
import { useNetworkStatus } from '../hooks/useNetworkStatus';
import { logger } from '../utils/logger';

export function AppStateManager({ children }: { children: React.ReactNode }) {
    const appState = useAppState();
    const { isConnected, isInternetReachable } = useNetworkStatus();
    const insets = useSafeAreaInsets();

    // Just logging for now, but could be extended to show an offline banner
    useEffect(() => {
        if (appState === 'active') {
            // App came to foreground - good place to sync data
            logger.log('[AppStateManager] App returned to foreground');
        }
    }, [appState]);

    const showOfflineBanner = !isConnected || (isInternetReachable === false);

    return (
        <View style={{ flex: 1 }}>
            {children}
            {showOfflineBanner && (
                <View style={[styles.offlineBanner, { paddingBottom: Math.max(insets.bottom, 20) }]}>
                    <Text style={styles.offlineText}>Sem conexão com a internet</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    offlineBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#DC2626',
        padding: 12,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    offlineText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
