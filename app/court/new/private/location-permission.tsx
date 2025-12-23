import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Navigation } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function PrivateCourtLocationPermissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handlePermission = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
            // We could get location here, but let's just push to next screen where map is
            router.push('/court/new/private/location-map');
        } else {
            // Optional: Show alert or manual entry
            router.push('/court/new/private/location-map');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Onde sua quadra está localizada?</Text>
                <Text style={styles.subtitle}>Seu endereço é usado apenas para compartilhar com jogadores confirmados.</Text>

                {/* Map Graphics Placeholder - Airbnb style blue map icon */}
                <View style={styles.graphicsContainer}>
                    <View style={styles.mapIconCircle}>
                        <Navigation size={48} color="#FFF" fill="#FFF" />
                    </View>
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handlePermission}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Navigation size={20} color="#FFF" />
                        <Text style={styles.buttonText}>Usar localização atual</Text>
                    </View>
                </Pressable>
                <Pressable style={styles.manualButton} onPress={() => router.push('/court/new/private/location')}>
                    <Text style={styles.manualButtonText}>Inserir endereço manualmente</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingHorizontal: 24, paddingVertical: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    backText: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
    content: { flex: 1, paddingHorizontal: 24, paddingTop: 40 }, // Adjusted padding
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40, lineHeight: 24 },
    graphicsContainer: { alignItems: 'center', justifyContent: 'center', flex: 1, maxHeight: 300 },
    mapIconCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center', shadowColor: '#3B82F6', shadowOpacity: 0.3, shadowRadius: 20, elevation: 10 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    manualButton: { height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    manualButtonText: { color: '#000', fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
});
