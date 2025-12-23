
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, Calendar, Clock, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp, ZoomIn } from 'react-native-reanimated';

export default function BookingConfirmationScreen() {
    const router = useRouter();

    const handleFinish = () => {
        router.replace('/(tabs)' as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>

                {/* Success Icon */}
                <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.iconContainer}>
                    <Check size={48} color="#FFF" strokeWidth={4} />
                </Animated.View>

                <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>Reserva Confirmada!</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(300)} style={styles.subtitle}>
                    Tudo pronto para o seu jogo.
                </Animated.Text>

                {/* Ticket Info */}
                <Animated.View entering={FadeInUp.delay(500).springify()} style={styles.ticket}>
                    <View style={styles.ticketSection}>
                        <Text style={styles.ticketLabel}>Código da reserva</Text>
                        <Text style={styles.ticketCode}>#KRT-2024-8X7K</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.ticketSection}>
                        <Text style={styles.courtName}>Arena Beach Sports</Text>
                        <View style={styles.row}>
                            <Calendar size={16} color="#6B7280" />
                            <Text style={styles.infoText}>Terça, 10 de Dezembro</Text>
                        </View>
                        <View style={styles.row}>
                            <Clock size={16} color="#6B7280" />
                            <Text style={styles.infoText}>18:00 - 19:00</Text>
                        </View>
                        <View style={styles.row}>
                            <MapPin size={16} color="#6B7280" />
                            <Text style={styles.infoText}>Rua das Palmeiras, 123</Text>
                        </View>
                    </View>
                </Animated.View>

                <View style={{ flex: 1 }} />

                <Pressable style={styles.button} onPress={handleFinish}>
                    <Text style={styles.buttonText}>Voltar para o Início</Text>
                </Pressable>

            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
        shadowColor: '#22C55E',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 8,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#000', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },

    ticket: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 24,
    },
    ticketSection: { gap: 8 },
    ticketLabel: { fontSize: 12, textTransform: 'uppercase', color: '#6B7280', letterSpacing: 1 },
    ticketCode: { fontSize: 20, fontWeight: '700', color: '#000', letterSpacing: 1 },
    courtName: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 4 },

    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 16, borderStyle: 'dashed', borderWidth: 1, borderColor: '#E5E7EB' }, // Dashed simulation

    row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    infoText: { fontSize: 14, color: '#374151' },

    button: {
        width: '100%',
        backgroundColor: '#000',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    buttonText: { fontSize: 16, fontWeight: '700', color: '#FFF' },
});
