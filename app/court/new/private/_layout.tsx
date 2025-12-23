import { Stack } from 'expo-router';
import { PrivateCourtProvider } from './PrivateCourtContext';

export default function PrivateCourtLayout() {
    return (
        <PrivateCourtProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#FFFFFF' },
                    animation: 'slide_from_right',
                }}
            />
        </PrivateCourtProvider>
    );
}
