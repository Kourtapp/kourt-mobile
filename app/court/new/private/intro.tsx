import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';

export default function PrivateCourtIntroScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const steps = [
        {
            id: 1,
            title: "Prepare o terreno",
            description: "Defina a localização e o tipo de quadra para os jogadores te encontrarem."
        },
        {
            id: 2,
            title: "Capriche no visual",
            description: "Adicione fotos da quadra, tipo de piso e comodidades (vestiário, bar, etc) para atrair mais jogos."
        },
        {
            id: 3,
            title: "Comece a faturar",
            description: "Configure preços por hora, conecte sua conta bancária e receba pagamentos automáticos."
        }
    ];

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.dismissAll()} style={styles.closeButton}>
                    <X size={24} color="#000" />
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Cadastre sua quadra, é fácil.</Text>

                <View style={styles.stepsContainer}>
                    {steps.map((step) => (
                        <View key={step.id} style={styles.stepRow}>
                            <View style={styles.textContainer}>
                                <Text style={styles.stepTitle}>{step.id} {step.title}</Text>
                                <Text style={styles.stepDescription}>{step.description}</Text>
                            </View>
                            {/* Placeholder for illustration - Airbnb has images on right */}
                            <View style={styles.illustrationPlaceholder} />
                        </View>
                    ))}
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={() => router.push('/court/new/private/step1-intro')}>
                    <Text style={styles.buttonText}>Começar</Text>
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
    title: { fontSize: 32, fontWeight: '800', color: '#000', marginBottom: 40, lineHeight: 38 },
    stepsContainer: { gap: 32 },
    stepRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 },
    textContainer: { flex: 1, paddingRight: 8 },
    stepTitle: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 4 },
    stepDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    illustrationPlaceholder: { width: 80, height: 80, backgroundColor: '#F3F4F6', borderRadius: 12 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF' },
    button: { backgroundColor: '#222222', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
