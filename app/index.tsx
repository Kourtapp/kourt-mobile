import { Redirect } from 'expo-router';
// import { useAuthStore } from '../stores/authStore';

export default function Index() {
    // Temporarily bypass auth for development
    // const { session } = useAuthStore();

    // Always go to home for now
    return <Redirect href="/(tabs)" />;

    // Original auth logic:
    // if (session) {
    //     return <Redirect href="/(tabs)" />;
    // }
    // return <Redirect href="/(auth)/login" />;
}
