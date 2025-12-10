import { useState, useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';

export function useAppState() {
    const [appState, setAppState] = useState<AppStateStatus>(AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', nextAppState => {
            setAppState(nextAppState);
        });

        return () => {
            subscription.remove();
        };
    }, []);

    return appState;
}

export const isForeground = (state: AppStateStatus) => state === 'active';
export const isBackground = (state: AppStateStatus) => state === 'background';
