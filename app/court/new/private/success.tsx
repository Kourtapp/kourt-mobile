import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePrivateCourt } from './PrivateCourtContext';
import { PartyPopper, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function PrivateCourtSuccessScreen() {
    const insets = useSafeAreaInsets();
    const { data } = usePrivateCourt();

    const handleGoToHost = () => {
        router.dismissAll();
        router.replace('/court/my-listings');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.content}>
                <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.iconContainer}>
                    <PartyPopper size={64} color="#22C55E" />
                </Animated.View>

                <Animated.Text entering={FadeInUp.delay(400).springify()} style={styles.title}>
                    Quadra cadastrada!
                </Animated.Text>

                <Animated.Text entering={FadeInUp.delay(500).springify()} style={styles.subtitle}>
                    {data.name || 'Sua quadra'} está pronta para receber jogadores
                </Animated.Text>

                <Animated.View entering={FadeInUp.delay(600).springify()} style={styles.card}>
                    <Text style={styles.cardTitle}>Próximos passos</Text>
                    <View style={styles.stepsList}>
                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>1</Text>
                            </View>
                            <Text style={styles.stepText}>Configure seus horários disponíveis</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>2</Text>
                            </View>
                            <Text style={styles.stepText}>Defina regras e instruções para jogadores</Text>
                        </View>
                        <View style={styles.stepItem}>
                            <View style={styles.stepNumber}>
                                <Text style={styles.stepNumberText}>3</Text>
                            </View>
                            <Text style={styles.stepText}>Publique e comece a receber reservas</Text>
                        </View>
                    </View>
                </Animated.View>
            </View>

            <Animated.View
                entering={FadeInDown.delay(800).springify()}
                style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}
            >
                <Pressable style={styles.button} onPress={handleGoToHost}>
                    <Text style={styles.buttonText}>Ir para Área Host</Text>
                    <ArrowRight size={20} color="#FFF" />
                </Pressable>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    content: {
        flex: 1,
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 32,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
    },
    card: {
        backgroundColor: '#F9FAFB',
        borderRadius: 20,
        padding: 24,
        width: '100%',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
        marginBottom: 20,
    },
    stepsList: {
        gap: 16,
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    stepNumber: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '700',
    },
    stepText: {
        flex: 1,
        fontSize: 14,
        color: '#4B5563',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
    },
    button: {
        backgroundColor: '#000000',
        height: 56,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
