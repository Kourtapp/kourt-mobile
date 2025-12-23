import { View, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { router, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Copy, Share2, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';

export default function CondoSuccessScreen() {
    const insets = useSafeAreaInsets();
    const inviteLink = "kourt.app/condominio/flores/join?token=xyz789";

    const copyToClipboard = () => {
        Alert.alert("Link Copiado", "O link de convite foi copiado para a área de transferência.");
    };

    const handleGoToHost = () => {
        router.dismissAll();
        router.replace('/court/my-listings');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.content}>

                <Animated.View entering={ZoomIn.duration(600)} style={styles.iconContainer}>
                    <Check size={48} color="#FFF" />
                </Animated.View>

                <Animated.Text entering={FadeInDown.delay(200)} style={styles.title}>Quadra Criada!</Animated.Text>
                <Animated.Text entering={FadeInDown.delay(300)} style={styles.subtitle}>
                    Agora é só convidar os moradores.
                </Animated.Text>

                {/* Invite Link Card */}
                <Animated.View entering={FadeInDown.delay(500)} style={styles.linkCard}>
                    <Text style={styles.linkLabel}>SEU LINK DE CONVITE</Text>
                    <View style={styles.linkRow}>
                        <Text style={styles.linkText} numberOfLines={1}>{inviteLink}</Text>
                    </View>
                    <View style={styles.actionsRow}>
                        <Pressable style={styles.actionButton} onPress={copyToClipboard}>
                            <Copy size={20} color="#8B5CF6" />
                            <Text style={styles.actionText}>Copiar Link</Text>
                        </Pressable>
                        <Pressable style={styles.actionButton}>
                            <Share2 size={20} color="#8B5CF6" />
                            <Text style={styles.actionText}>Compartilhar</Text>
                        </Pressable>
                    </View>
                </Animated.View>

            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleGoToHost}>
                    <Text style={styles.buttonText}>Ir para Área Host</Text>
                    <ArrowRight size={20} color="#FFF" />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#8B5CF6',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 32,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    title: { fontSize: 24, fontWeight: '800', color: '#000', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40, textAlign: 'center' },

    linkCard: {
        width: '100%',
        backgroundColor: '#F5F3FF',
        borderRadius: 16,
        padding: 24,
        borderWidth: 1,
        borderColor: '#EDE9FE',
    },
    linkLabel: { fontSize: 12, fontWeight: '700', color: '#8B5CF6', marginBottom: 12, letterSpacing: 1 },
    linkRow: {
        backgroundColor: '#FFF',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    linkText: { fontSize: 14, color: '#4B5563' },
    actionsRow: { flexDirection: 'row', gap: 16 },
    actionButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#FFF',
        paddingVertical: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    actionText: { fontWeight: '600', color: '#8B5CF6' },

    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF' },
    button: { backgroundColor: '#000', height: 56, borderRadius: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
