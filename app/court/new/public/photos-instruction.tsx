import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Camera, Lightbulb } from 'lucide-react-native';

export default function PhotoInstructionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleContinue = () => {
        router.push('/court/new/public/photos-mandatory');
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
                <Text style={styles.title}>Vamos tirar as fotos</Text>
                <Text style={styles.subtitle}>Siga o guia para melhores resultados</Text>

                {/* Standard Info Card */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoCardTitle}>PADRÃO KOURT DE FOTOS</Text>
                    <Text style={styles.infoCardText}>
                        Para manter a qualidade do app, todas as quadras seguem o mesmo padrão.
                    </Text>
                </View>

                {/* Required Photos Preview */}
                <Text style={styles.sectionTitle}>3 FOTOS OBRIGATÓRIAS:</Text>
                <View style={styles.photosPreviewContainer}>
                    <PhotoPlaceholder label="Visão Geral" />
                    <PhotoPlaceholder label="Rede / Tabela" />
                    <PhotoPlaceholder label="Piso" />
                </View>

                {/* Tips Card */}
                <View style={styles.tipsCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Lightbulb size={20} color="#F59E0B" fill="#F59E0B" />
                        <Text style={styles.tipsCardTitle}>Dicas:</Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Segure o celular na horizontal</Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Evite pessoas nas fotos</Text>
                    </View>
                    <View style={styles.tipRow}>
                        <Text style={styles.bullet}>•</Text>
                        <Text style={styles.tipText}>Boa iluminação é essencial</Text>
                    </View>
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Começar a Tirar Fotos</Text>
                </Pressable>
            </View>
        </View>
    );
}

function PhotoPlaceholder({ label }: { label: string }) {
    return (
        <View style={styles.photoPlaceholderWrapper}>
            <View style={styles.photoPlaceholder}>
                <Camera size={24} color="#9CA3AF" />
            </View>
            <Text style={styles.photoLabel}>{label}</Text>
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
        marginBottom: 32,
    },
    infoCard: {
        backgroundColor: '#F0FDF4', // Light green
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
    },
    infoCardTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#15803D', // Dark green
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    infoCardText: {
        fontSize: 14,
        color: '#166534',
        lineHeight: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '800',
        color: '#000',
        marginBottom: 16,
        textTransform: 'uppercase',
    },
    photosPreviewContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    photoPlaceholderWrapper: {
        alignItems: 'center',
        gap: 8,
        flex: 1,
    },
    photoPlaceholder: {
        width: '100%',
        aspectRatio: 1, // Square-ish or maybe slightly rectangular? Print looks like 4:3 maybe but square works for preview icons.
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: 100, // Limit width so they don't stretch too much
    },
    photoLabel: {
        fontSize: 12,
        color: '#4B5563',
        textAlign: 'center',
    },
    tipsCard: {
        backgroundColor: '#FFFBEB', // Light yellow
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: '#FEF3C7',
    },
    tipsCardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#92400E', // Dark yellow/brown
    },
    tipRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginTop: 4,
    },
    bullet: {
        color: '#92400E',
        fontSize: 14,
    },
    tipText: {
        fontSize: 14,
        color: '#92400E',
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
