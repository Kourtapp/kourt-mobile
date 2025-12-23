
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, Users } from 'lucide-react-native';
import { useState } from 'react';

export default function CondoAccessStep() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [selectedMode, setSelectedMode] = useState<'link' | 'manual' | null>(null);

    const handleContinue = () => {
        // save mode to context (mock)
        router.push('/court/new/condo/success'); // Skip to success for this demo
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Como os moradores vão acessar?</Text>
                <Text style={styles.subtitle}>Escolha o nível de controle que você deseja para o condomínio.</Text>

                <View style={styles.optionsContainer}>
                    <Pressable
                        onPress={() => setSelectedMode('link')}
                        style={[styles.optionCard, selectedMode === 'link' && styles.selectedCard]}
                    >
                        <View style={styles.iconContainer}>
                            <Link size={24} color={selectedMode === 'link' ? '#8B5CF6' : '#000'} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Link de Convite (Recomendado)</Text>
                            <Text style={styles.optionDesc}>
                                Sistema gera um link único. Você envia no grupo do prédio e quem clicar entra automaticamente.
                            </Text>
                        </View>
                        <View style={styles.radio}>
                            {selectedMode === 'link' && <View style={styles.radioInner} />}
                        </View>
                    </Pressable>

                    <Pressable
                        onPress={() => setSelectedMode('manual')}
                        style={[styles.optionCard, selectedMode === 'manual' && styles.selectedCard]}
                    >
                        <View style={styles.iconContainer}>
                            <Users size={24} color={selectedMode === 'manual' ? '#8B5CF6' : '#000'} />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.optionTitle}>Convite Manual</Text>
                            <Text style={styles.optionDesc}>
                                Você cadastra o email de cada morador. Apenas quem estiver na lista consegue acessar.
                            </Text>
                        </View>
                        <View style={styles.radio}>
                            {selectedMode === 'manual' && <View style={styles.radioInner} />}
                        </View>
                    </Pressable>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !selectedMode && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!selectedMode}
                >
                    <Text style={styles.buttonText}>Continuar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingHorizontal: 20, paddingBottom: 16 },
    backButton: { padding: 4 },
    backText: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },

    content: { paddingHorizontal: 24 },
    title: { fontSize: 28, fontWeight: '800', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },

    optionsContainer: { gap: 16 },
    optionCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFF',
    },
    selectedCard: {
        borderColor: '#8B5CF6',
        backgroundColor: '#F5F3FF', // Very light purple
    },
    iconContainer: {
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
        marginRight: 16,
    },
    optionTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    optionDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 },

    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#D1D5DB',
        alignItems: 'center',
        justifyContent: 'center',
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#8B5CF6',
    },

    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6', position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#FFF' },
    button: { backgroundColor: '#000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#E5E7EB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
