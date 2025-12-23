import { Stack } from 'expo-router';
import { PublicCourtProvider } from './PublicCourtContext';

export default function PublicCourtLayout() {
    return (
        <PublicCourtProvider>
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#FFFFFF' },
                    animation: 'slide_from_right',
                }}
            />
        </PublicCourtProvider>
    );
}
