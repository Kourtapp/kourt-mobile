import React, { useEffect, useState } from 'react';
import { View, Text, Animated, Pressable } from 'react-native';
import { WifiOff, RefreshCw } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

interface OfflineIndicatorProps {
    /** Callback when retry is pressed */
    onRetry?: () => void;
    /** Whether to show at top or bottom */
    position?: 'top' | 'bottom';
}

export function OfflineIndicator({ onRetry, position = 'top' }: OfflineIndicatorProps) {
    const { isConnected, isInternetReachable } = useNetworkStatus();
    const insets = useSafeAreaInsets();
    const [slideAnim] = useState(new Animated.Value(-100));
    const [visible, setVisible] = useState(false);

    const isOffline = !isConnected || isInternetReachable === false;

    useEffect(() => {
        if (isOffline) {
            setVisible(true);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
                friction: 10,
            }).start();
        } else if (visible) {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }
    }, [isOffline, slideAnim, visible]);

    if (!visible) return null;

    const topPadding = position === 'top' ? insets.top : 0;
    const bottomPadding = position === 'bottom' ? insets.bottom : 0;

    return (
        <Animated.View
            style={{
                transform: [{ translateY: slideAnim }],
                position: 'absolute',
                left: 0,
                right: 0,
                [position]: 0,
                zIndex: 1000,
            }}
            accessible={true}
            accessibilityRole="alert"
            accessibilityLabel="Sem conexão com a internet"
            accessibilityLiveRegion="polite"
        >
            <View
                className="bg-amber-500 flex-row items-center justify-center px-4 py-3"
                style={{
                    paddingTop: position === 'top' ? topPadding + 8 : 8,
                    paddingBottom: position === 'bottom' ? bottomPadding + 8 : 8,
                }}
            >
                <WifiOff size={18} color="#fff" />
                <Text className="text-white font-medium ml-2 flex-1">
                    Sem conexão com a internet
                </Text>
                {onRetry && (
                    <Pressable
                        onPress={onRetry}
                        className="ml-3 p-2 bg-white/20 rounded-full"
                        accessible={true}
                        accessibilityRole="button"
                        accessibilityLabel="Tentar novamente"
                        accessibilityHint="Toque para verificar a conexão"
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <RefreshCw size={16} color="#fff" />
                    </Pressable>
                )}
            </View>
        </Animated.View>
    );
}

/**
 * Hook to show offline-aware content
 */
export function useOfflineState<T>(
    onlineData: T,
    offlineData: T,
    options?: { showOfflineFirst?: boolean }
): T {
    const { isConnected } = useNetworkStatus();

    if (!isConnected && options?.showOfflineFirst) {
        return offlineData;
    }

    return isConnected ? onlineData : offlineData;
}
