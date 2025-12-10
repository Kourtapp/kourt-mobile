import { useState, useEffect } from 'react';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';

export function useNetworkStatus() {
    const [networkState, setNetworkState] = useState<NetInfoState | null>(null);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            setNetworkState(state);
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return {
        isConnected: networkState?.isConnected ?? true, // Optimistic default
        isInternetReachable: networkState?.isInternetReachable ?? true,
        type: networkState?.type,
        details: networkState?.details,
    };
}
