import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, MapPin } from 'lucide-react-native';

export default function PrivateCourtLocationPinScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleContinue = () => {
        router.push('/court/new/private/location-address');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#000" />
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar e sair</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>O marcador está no local certo?</Text>
                <Text style={styles.subtitle}>Seu endereço só é compartilhado com os hóspedes depois que a reserva é confirmada.</Text>

                {/* Address Card Overlay */}
                <View style={styles.addressCard}>
                    <MapPin size={24} color="#000" />
                    <View style={{ flex: 1 }}>
                        <Text style={styles.addressText}>R. Luiz Rotella, Vinhedo - SP</Text>
                        <Text style={styles.zipText}>13280-000, Brasil</Text>
                    </View>
                </View>

                <View style={styles.mapContainer}>
                    <View style={styles.mapPlaceholder}>
                        <View style={styles.pinRed}>
                            <MapPin size={32} color="#FFF" fill="#FFF" />
                        </View>
                        <View style={styles.overlayButton}>
                            <Text style={styles.overlayText}>Arraste o mapa para reposicionar o marcador</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Avançar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    saveButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    saveText: { fontSize: 12, fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 24, position: 'relative' },
    title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
    addressCard: { position: 'absolute', top: 100, left: 24, right: 24, zIndex: 10, backgroundColor: '#FFF', padding: 16, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 12, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
    addressText: { fontSize: 14, fontWeight: '700', color: '#000' },
    zipText: { fontSize: 12, color: '#6B7280' },
    mapContainer: { flex: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 24, backgroundColor: '#E5E7EB' },
    mapPlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
    pinRed: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#222222', alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
    overlayButton: { position: 'absolute', bottom: 20, backgroundColor: '#000', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 24 },
    overlayText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
