
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

export default function CondoCourtIntroScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const steps = [
        {
            id: 1,
            title: "Crie a comunidade",
            description: "Cadastre a quadra do seu prédio para organizar o uso entre vizinhos."
        },
        {
            id: 2,
            title: "Controle o acesso",
            description: "Gere um link de convite exclusivo ou adicione moradores manualmente."
        },
        {
            id: 3,
            title: "É de graça",
            description: "O Kourt é gratuito para condomínios. Sem taxas, sem pagamentos."
        }
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable onPress={() => router.dismissAll()} style={styles.closeButton}>
                    <X size={24} color="#000" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Quadra de Condomínio</Text>
                <Text style={styles.subtitle}>
                    A maneira mais fácil de organizar partidas com seus vizinhos, com segurança e privacidade.
                </Text>

                <View style={styles.stepsContainer}>
                    {steps.map((step) => (
                        <View key={step.id} style={styles.stepRow}>
                            <View style={styles.textContainer}>
                                <Text style={styles.stepTitle}>{step.id}. {step.title}</Text>
                                <Text style={styles.stepDescription}>{step.description}</Text>
                            </View>
                            {/* Placeholder for illustration */}
                            <View style={styles.illustrationPlaceholder} />
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={() => router.push('/court/new/condo/step1-access')}>
                    <Text style={styles.buttonText}>Começar Configuração</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingHorizontal: 20, paddingBottom: 16 },
    closeButton: { padding: 4 },
    content: { paddingHorizontal: 24, paddingBottom: 100 },
    title: { fontSize: 32, fontWeight: '800', color: '#000', marginBottom: 12, lineHeight: 38 },
    subtitle: { fontSize: 18, color: '#4B5563', marginBottom: 40, lineHeight: 26 },
    stepsContainer: { gap: 32 },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
    textContainer: { flex: 1, paddingRight: 8 },
    stepTitle: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 4 },
    stepDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    illustrationPlaceholder: { width: 64, height: 64, backgroundColor: '#F3F4F6', borderRadius: 12 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF' },
    button: { backgroundColor: '#8B5CF6', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }, // Purple
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
