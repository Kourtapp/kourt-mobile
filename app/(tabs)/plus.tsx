import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Plus, MapPin, X } from 'lucide-react-native';

export default function PlusScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={[styles.header, { marginTop: insets.top }]}>
                <Text style={styles.title}>Novo</Text>
                <Pressable onPress={() => router.back()} style={styles.closeButton}>
                    <X size={24} color="#000" />
                </Pressable>
            </View>

            <Text style={styles.subtitle}>O que você quer fazer hoje?</Text>

            {/* Main Actions Grid */}
            <View style={styles.grid}>

                {/* Register Match - PRIMARY ACTION */}
                <Pressable
                    style={[styles.card, styles.primaryCard]}
                    onPress={() => router.push('/post-match/register/step1')}
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
                <Pressable style={styles.card}>
                    <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
                        <Plus size={28} color="#000" />
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>Criar Jogo</Text>
                        <Text style={styles.cardDesc}>Convide amigos para jogar</Text>
                    </View>
                </Pressable>

                {/* Find Court */}
                <Pressable style={styles.card} onPress={() => router.push('/(tabs)/map')}>
                    <View style={[styles.iconContainer, { backgroundColor: '#F3F4F6' }]}>
                        <MapPin size={28} color="#000" />
                    </View>
                    <View>
                        <Text style={styles.cardTitle}>Encontrar Quadra</Text>
                        <Text style={styles.cardDesc}>Reserve nos melhores locais</Text>
                    </View>
                </Pressable>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingHorizontal: 24,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        height: 56,
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
        marginBottom: 32,
    },
    grid: {
        gap: 16,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        gap: 16,
        // Shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    primaryCard: {
        backgroundColor: '#000000',
        borderWidth: 0,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '700',
        color: '#000',
        marginBottom: 2,
    },
    cardDesc: {
        fontSize: 14,
        color: '#6B7280',
    },
});
