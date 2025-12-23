import { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Crosshair } from 'lucide-react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSpring,
    withSequence,
    withTiming,
    Easing
} from 'react-native-reanimated';

export default function LocationVerificationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // Animation Values
    const scale = useSharedValue(1);
    const progress = useSharedValue(0);

    useEffect(() => {
        // Pulse animation for the icon background
        scale.value = withRepeat(
            withSequence(
                withSpring(1.2, { damping: 10, stiffness: 100 }),
                withSpring(1, { damping: 10, stiffness: 100 })
            ),
            -1,
            true
        );

        // Progress bar animation (simulating verification)
        progress.value = withTiming(100, {
            duration: 3000,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });

        // Mock navigation after "verification"
        const timer = setTimeout(() => {
            router.push('/court/new/public/info');
        }, 3500);

        return () => clearTimeout(timer);
    }, [scale, progress, router]);

    const animatedIconStyle = useAnimatedStyle(() => {
        return {
            transform: [{ scale: scale.value }],
        };
    });

    const animatedProgressStyle = useAnimatedStyle(() => {
        return {
            width: `${progress.value}%`,
        };
    });

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                {/* Pulsing Icon */}
                <Animated.View style={[styles.iconContainer, animatedIconStyle]}>
                    <Crosshair size={48} color="#22C55E" />
                </Animated.View>

                <Text style={styles.title}>Verificando sua localização...</Text>

                {/* Loading Bar */}
                <View style={styles.loadingTrack}>
                    <Animated.View style={[styles.loadingBar, animatedProgressStyle]} />
                </View>
            </View>

            {/* Footer with Disabled Loading Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <View style={styles.buttonDisabled}>
                    <ActivityIndicator color="#FFF" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        marginBottom: 100, // Visual centering adjust
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#DCFCE7', // Light Green
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000',
        textAlign: 'center',
        marginBottom: 24,
    },
    loadingTrack: {
        width: '100%',
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        overflow: 'hidden',
    },
    loadingBar: {
        height: '100%',
        backgroundColor: '#22C55E',
        borderRadius: 4,
    },
    footer: {
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#D1D5DB', // Disabled gray
        width: '100%',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
