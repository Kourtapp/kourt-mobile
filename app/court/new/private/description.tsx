import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtDescriptionScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [text, setText] = useState(data.description || '');

    const handleContinue = () => {
        updateData({ description: text });
        router.push('/court/new/private/step3-intro');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar e sair</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Crie sua descrição</Text>
                <Text style={styles.subtitle}>Explique o que sua quadra tem de especial.</Text>

                <TextInput
                    style={styles.input}
                    value={text}
                    onChangeText={setText}
                    placeholder="Você vai se divertir muito..."
                    placeholderTextColor="#9CA3AF"
                    multiline
                    maxLength={500}
                />

                <Text style={styles.charCount}>{text.length}/500</Text>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, text.length === 0 && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={text.length === 0}
                >
                    <Text style={styles.buttonText}>Avançar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    backText: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
    saveButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    saveText: { fontSize: 12, fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
    input: { fontSize: 18, color: '#000', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 24, minHeight: 200, textAlignVertical: 'top', lineHeight: 26 },
    charCount: { fontSize: 12, color: '#6B7280', marginTop: 8, fontWeight: '600' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#D1D5DB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
