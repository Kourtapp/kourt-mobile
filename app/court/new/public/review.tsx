import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { usePublicCourt } from './PublicCourtContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Search, Layers, Sun, CloudSun, LayoutDashboard } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Removing MOCK_DATA, will derive from context

export default function ReviewSuggestionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, submitCourt } = usePublicCourt();

    // Derived Data
    const photos = [
        data.mandatoryPhotos.general,
        data.mandatoryPhotos.net,
        data.mandatoryPhotos.floor,
        ...Object.values(data.optionalPhotos)
    ].filter(Boolean) as string[];

    const coverImage = photos[0] || 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?q=80&w=600&auto=format&fit=crop';
    const sportName = data.sports.join(', ') || 'Esporte não definido';
    const addressDisplay = data.address || 'Endereço não informado';
    const neighborhoodDisplay = data.district && data.city ? `${data.district}, ${data.city}` : (data.city || '');

    // Lighting/Cover/Flooring text
    const lightingDisplay = data.lighting === 'day_only' ? 'Apenas diurno' : 'Noturno disponível';
    const coverDisplay = data.cover === 'covered' ? 'Coberta' : 'Descoberta';
    const floorDisplay = data.floorTypes?.join(', ') || 'Piso não informado';

    const handleContinue = async () => {
        await submitCourt();
        router.push('/court/new/public/success');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Revisar Sugestão</Text>
                <Text style={styles.subtitle}>Confira antes de enviar</Text>

                {/* Cover Image Card */}
                <View style={styles.coverCard}>
                    <Image source={{ uri: coverImage }} style={styles.coverImage} />
                    <LinearGradient
                        colors={['transparent', 'rgba(0,0,0,0.8)']}
                        style={styles.gradientOverlay}
                    >
                        <Text style={styles.coverTitle}>{data.name || 'Nova Quadra'}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <LayoutDashboard size={14} color="#D1D5DB" />
                            <Text style={styles.coverSubtitle}>Quadra Pública</Text>
                        </View>
                    </LinearGradient>
                </View>

                {/* Details Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardHeader}>INFORMAÇÕES</Text>

                    <View style={styles.infoRow}>
                        <Search size={18} color="#6B7280" />
                        <Text style={styles.infoText}>{sportName}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Layers size={18} color="#6B7280" />
                        <Text style={styles.infoText}>{floorDisplay} · {data.quantity} quadra(s)</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <Sun size={18} color="#6B7280" />
                        <Text style={styles.infoText}>{lightingDisplay}</Text>
                    </View>

                    <View style={styles.infoRow}>
                        <CloudSun size={18} color="#6B7280" />
                        <Text style={styles.infoText}>{coverDisplay}</Text>
                    </View>
                </View>

                {/* Location Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.cardHeader}>LOCALIZAÇÃO</Text>
                    <View style={styles.infoRow}>
                        <MapPin size={18} color="#6B7280" />
                        <View>
                            <Text style={styles.infoText}>{addressDisplay}</Text>
                            <Text style={styles.infoSubText}>{neighborhoodDisplay}</Text>
                        </View>
                    </View>
                </View>

                {/* Photos List */}
                <View style={{ marginTop: 24, marginBottom: 8 }}>
                    <Text style={[styles.cardHeader, { marginBottom: 12 }]}>FOTOS ({photos.length})</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                        {photos.map((photo, index) => (
                            <Image key={index} source={{ uri: photo }} style={styles.miniPhoto} />
                        ))}
                    </ScrollView>
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Continuar</Text>
                </Pressable>
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
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 24,
    },
    coverCard: {
        height: 200,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 24,
        backgroundColor: '#F3F4F6',
    },
    coverImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'flex-end',
        padding: 16,
    },
    coverTitle: {
        color: '#FFF',
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 4,
    },
    coverSubtitle: {
        color: '#D1D5DB',
        fontSize: 14,
    },
    infoCard: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
    },
    cardHeader: {
        fontSize: 12,
        fontWeight: '700',
        color: '#000',
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
    },
    infoSubText: {
        fontSize: 14,
        color: '#6B7280',
    },
    miniPhoto: {
        width: 100,
        height: 70,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
