import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LayoutGrid } from 'lucide-react-native'; // Placeholder icon

export default function PrivateCourtStep2Intro() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                {/* Isometric Graphic Placeholder */}
                <View style={styles.graphicContainer}>
                    <LayoutGrid size={120} color="#222222" strokeWidth={1} />
                </View>

                <View style={styles.textContainer}>
                    <Text style={styles.stepLabel}>Etapa 2</Text>
                    <Text style={styles.title}>Faça sua quadra se destacar</Text>
                    <Text style={styles.description}>
                        Nessa etapa, você adicionará algumas das comodidades que sua quadra oferece, além de 5 fotos ou mais. Depois, você deverá criar um título e uma descrição.
                    </Text>
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={() => router.push('/court/new/private/amenities')}>
                    <Text style={styles.buttonText}>Avançar</Text>
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
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    graphicContainer: { alignItems: 'center', marginBottom: 40 },
    textContainer: {},
    stepLabel: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 8 },
    title: { fontSize: 40, fontWeight: '800', color: '#000', marginBottom: 16, lineHeight: 44 },
    description: { fontSize: 18, color: '#4B5563', lineHeight: 26 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
