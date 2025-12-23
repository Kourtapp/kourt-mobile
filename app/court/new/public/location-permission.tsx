import { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import * as Location from 'expo-location';

export default function LocationPermissionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // No animation needed
    useEffect(() => {
    }, []);

    const handleContinue = async () => {
        try {
            console.log("Solicitando permissão...");
            const { status } = await Location.requestForegroundPermissionsAsync();
            console.log("Status da permissão:", status);

            if (status === 'granted') {
                console.log("Permissão concedida. Navegando para verificação...");
                router.push('/court/new/public/location-verification');
            } else {
                console.log("Permissão negada.");
                Alert.alert(
                    "Permissão necessária",
                    "Precisamos da sua localização para verificar se você está no local da quadra. Por favor, habilite nas configurações."
                );
            }
        } catch (error) {
            console.error("Erro ao solicitar permissão:", error);
            Alert.alert("Erro", "Não foi possível solicitar a localização.");
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <View style={styles.imageContainer}>
                    <Image
                        source={require('../../../../assets/images/map-pin-3d.png')}
                        style={{ width: 220, height: 180 }}
                        resizeMode="contain"
                    />
                </View>

                <Text style={styles.title}>Precisamos da sua localização</Text>

                <Text style={styles.description}>
                    Para garantir que as quadras cadastradas são reais, precisamos verificar que você está no local.
                </Text>

                <View style={styles.benefitsContainer}>
                    <BenefitRow text="Fotos só podem ser tiradas no local" />
                    <BenefitRow text="Endereço preenchido automaticamente" />
                    <BenefitRow text="Sua localização não é compartilhada" />
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable onPress={() => router.back()} style={{ padding: 12, marginBottom: 8 }}>
                    <Text style={styles.skipText}>Não agora</Text>
                </Pressable>

                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Permitir Localização</Text>
                </Pressable>
            </View>
        </View>
    );
}

function BenefitRow({ text }: { text: string }) {
    return (
        <View style={styles.benefitRow}>
            <View style={styles.checkContainer}>
                <Check size={14} color="#FFF" strokeWidth={3} />
            </View>
            <Text style={styles.benefitText}>{text}</Text>
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
        paddingHorizontal: 24,
        alignItems: 'center',
    },
    imageContainer: {
        marginBottom: 32,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 40,
    },
    benefitsContainer: {
        width: '100%',
        gap: 12,
    },
    benefitRow: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4', // Very light green
        padding: 16,
        borderRadius: 12,
        gap: 12,
    },
    checkContainer: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    benefitText: {
        fontSize: 14,
        color: '#374151',
        flex: 1,
        fontWeight: '500',
    },
    footer: {
        paddingHorizontal: 24, // Matches screenshot margin
        alignItems: 'center',
    },
    skipText: {
        fontSize: 16,
        color: '#9CA3AF',
        fontWeight: '500',
    },
    button: {
        backgroundColor: '#000',
        width: '100%',
        height: 56,
        borderRadius: 16, // Screenshot shows somewhat rounded but not pill
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
