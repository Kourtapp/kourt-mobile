import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Plus, X } from 'lucide-react-native';

export default function PlusModal() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.overlay}>
            {/* Backdrop - Tap to close */}
            <Pressable style={styles.backdrop} onPress={() => router.back()} />

            {/* Bottom Sheet Content */}
            <View style={[styles.sheet, { paddingBottom: insets.bottom + 20 }]}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Novo</Text>
                    <Pressable onPress={() => router.back()} style={styles.closeButton}>
                        <View style={{ backgroundColor: '#F3F4F6', borderRadius: 12, padding: 4 }}>
                            <X size={20} color="#6B7280" />
                        </View>
                    </Pressable>
                </View>

                <Text style={styles.subtitle}>O que você quer fazer hoje?</Text>

                {/* Actions Grid */}
                <View style={styles.grid}>

                    {/* Register Match */}
                    <Pressable
                        style={[styles.card, styles.primaryCard]}
                        onPress={() => {
                            // Close modal then navigate, OR navigate directly (Expo Router handles stack)
                            // Navigating directly on top is usually fine
                            router.push('/match/live');
                        }}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                            <Camera size={28} color="#FFF" />
                        </View>
                        <View>
                            <Text style={[styles.cardTitle, { color: '#FFF' }]}>Registrar Partida</Text>
                            <Text style={[styles.cardDesc, { color: 'rgba(255,255,255,0.8)' }]}>
                                Fotos, placar e análise
                            </Text>
                        </View>
                    </Pressable>

                    {/* Create Match */}
                    <Pressable
                        style={styles.card}
                        onPress={() => router.push('/match/create')}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
                            <Plus size={28} color="#000" />
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>Criar Jogo</Text>
                            <Text style={styles.cardDesc}>Convide amigos para jogar</Text>
                        </View>
                    </Pressable>


                    {/* Find Court */}

                    {/* Register Court (Was Find Court) */}
                    <Pressable
                        style={styles.card}
                        onPress={() => {
                            router.dismiss(); // Close modal first
                            router.push('/court/new');
                        }}
                    >
                        <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
                            <Plus size={28} color="#000" />
                        </View>
                        <View>
                            <Text style={styles.cardTitle}>Registrar Quadra</Text>
                            <Text style={styles.cardDesc}>Cadastre sua arena ou quadra</Text>
                        </View>
                    </Pressable>



                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.4)', // Dimmed background
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
    },
    sheet: {
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        paddingHorizontal: 24,
        paddingTop: 24,
        // Short bottom sheet feel
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 24,
    },
    grid: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 16,
    },
    primaryCard: {
        backgroundColor: '#000000',
        borderWidth: 0,
        marginBottom: 4,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 13,
        color: '#6B7280',
    },
});
