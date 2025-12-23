import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { useRouter, Stack, useLocalSearchParams } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Navigation, Clock, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { AutomationService } from '@/services/automationService';

export default function MatchCheckInScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { id } = useLocalSearchParams();

    // ...

    const handleCheckIn = async () => {
        try {
            await AutomationService.checkInMatch(id as string || 'mock', 'user-123');
            alert("Check-in realizado! ✅\nBom jogo!");
            router.back();
        } catch {
            alert("Erro ao fazer check-in.");
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Map Background Mock */}
            <View style={styles.mapContainer}>
                <Image
                    source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1774&auto=format&fit=crop' }}
                    style={styles.mapImage}
                />
                <View style={styles.mapOverlay} />
            </View>

            <View style={styles.content}>

                {/* Location Card */}
                <Animated.View entering={ZoomIn} style={styles.locationCard}>
                    <View style={styles.iconCircle}>
                        <MapPin size={24} color="#8B5CF6" />
                    </View>
                    <Text style={styles.venueName}>Arena 7 Beach Tennis</Text>
                    <Text style={styles.address}>Rua das Palmeiras, 123 - Jardins</Text>

                    <View style={styles.distanceTag}>
                        <Navigation size={12} color="#FFF" />
                        <Text style={styles.distanceText}>Você está aqui</Text>
                    </View>
                </Animated.View>

                {/* Match Info */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.infoContainer}>
                    <Text style={styles.matchTitle}>Partida de Duplas</Text>
                    <View style={styles.timeRow}>
                        <Clock size={16} color="#94A3B8" />
                        <Text style={styles.timeText}>Começa em <Text style={{ fontWeight: '700', color: '#F59E0B' }}>15 min</Text> (19:00)</Text>
                    </View>
                </Animated.View>

                {/* Big Button */}
                <Animated.View entering={FadeInDown.delay(400)} style={styles.actionContainer}>
                    <Pressable style={styles.checkInButton} onPress={handleCheckIn}>
                        <CheckCircle2 size={24} color="#FFF" />
                        <Text style={styles.buttonText}>Confirmar Presença</Text>
                    </Pressable>
                    <Text style={styles.hintText}>Isso notifica os outros jogadores que você chegou.</Text>
                </Animated.View>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    mapContainer: {
        height: '45%',
        width: '100%',
        position: 'relative',
    },
    mapImage: { width: '100%', height: '100%', resizeMode: 'cover' },
    mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(30, 41, 59, 0.4)' },

    content: {
        flex: 1,
        marginTop: -60,
        backgroundColor: '#FFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        padding: 24,
        alignItems: 'center',
    },

    locationCard: {
        alignItems: 'center',
        marginBottom: 32,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#F3E8FF',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        borderWidth: 4,
        borderColor: '#FFF',
    },
    venueName: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 4, textAlign: 'center' },
    address: { fontSize: 14, color: '#64748B', textAlign: 'center', marginBottom: 12 },
    distanceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#10B981',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    distanceText: { color: '#FFF', fontWeight: '700', fontSize: 12 },

    infoContainer: { alignItems: 'center', marginBottom: 40 },
    matchTitle: { fontSize: 18, fontWeight: '600', color: '#334155', marginBottom: 8 },
    timeRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    timeText: { fontSize: 16, color: '#64748B' },

    actionContainer: { width: '100%', alignItems: 'center' },
    checkInButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#1E293B',
        width: '100%',
        paddingVertical: 18,
        borderRadius: 20,
        marginBottom: 16,
        shadowColor: '#1E293B',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 8,
    },
    buttonText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
    hintText: { fontSize: 13, color: '#94A3B8', textAlign: 'center' },
});
