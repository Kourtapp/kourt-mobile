import { Stack } from 'expo-router';
import { PostMatchProvider } from './PostMatchContext';

export default function RegisterMatchLayout() {
    return (
        <PostMatchProvider>
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_bottom' }}>
                <Stack.Screen name="step1" />
                <Stack.Screen name="step2" />
                <Stack.Screen name="step3" />
                <Stack.Screen name="step4" />
            </Stack>
        </PostMatchProvider>
    );
}
