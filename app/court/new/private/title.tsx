import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtTitleScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [name, setName] = useState(data.name || '');

    const handleContinue = () => {
        updateData({ name });
        // Next would be description, then price vs review?
        // Following Airbnb flow: Title -> Highlights -> Description
        router.push('/court/new/private/highlights');
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
                <Text style={styles.title}>Agora, vamos dar um título para sua quadra</Text>
                <Text style={styles.subtitle}>Títulos curtos funcionam melhor. Não se preocupe, você pode trocar depois.</Text>

                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Quadra de Tênis no Centro"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    maxLength={32}
                />

                <Text style={styles.charCount}>{name.length}/32</Text>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, name.length === 0 && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={name.length === 0}
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
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
    input: { fontSize: 22, fontWeight: '600', color: '#000', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 24, minHeight: 120, textAlignVertical: 'top' },
    charCount: { fontSize: 12, color: '#6B7280', marginTop: 8, fontWeight: '600' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#D1D5DB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
