import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, ShieldCheck } from 'lucide-react-native';

export default function PublicCourtSuccessScreen() {
    const insets = useSafeAreaInsets();

    const handleFinish = () => {
        router.dismissAll();
        router.replace('/(tabs)' as any);
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom + 20 }]}>
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <View style={styles.iconCircle}>
                        <Check size={48} color="#FFF" strokeWidth={3} />
                    </View>
                    <View style={styles.badge}>
                        <ShieldCheck size={16} color="#FFF" />
                    </View>
                </View>

                <Text style={styles.title}>Sugestão Enviada!</Text>

                <Text style={styles.description}>
                    Obrigado por contribuir com a comunidade Kourt. Sua sugestão foi recebida com sucesso.
                </Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Próximos Passos:</Text>
                    <Text style={styles.infoText}>
                        • Nossa equipe analisará as informações em até 24 horas.{'\n'}
                        • Você receberá uma notificação quando a quadra for aprovada.{'\n'}
                        • Seus pontos de XP serão creditados automaticamente.
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <Pressable style={styles.button} onPress={handleFinish}>
                    <Text style={styles.buttonText}>Voltar ao Início</Text>
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
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    iconContainer: {
        position: 'relative',
        marginBottom: 32,
    },
    iconCircle: {
        width: 96,
        height: 96,
        borderRadius: 48,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#22C55E",
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 15,
    },
    badge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#15803D',
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFFFFF',
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 16,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 40,
        lineHeight: 24,
    },
    infoBox: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
        marginBottom: 12,
    },
    infoText: {
        fontSize: 14,
        color: '#4B5563',
        lineHeight: 24,
    },
    footer: {
        paddingHorizontal: 24,
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
