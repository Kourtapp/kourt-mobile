import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtBusinessTypeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [isCompany, setIsCompany] = useState<boolean | null>(data.isCompany);

    const handleContinue = () => {
        if (isCompany !== null) {
            updateData({ isCompany });
            router.push('/court/new/private/publish');
        }
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
                <Text style={styles.title}>Você atua como empresa?</Text>

                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        Isso significa que sua empresa provavelmente tem registro junto ao governo estadual ou federal. <Text style={styles.link}>Mais informações</Text>
                    </Text>
                </View>

                <View style={styles.buttonsRow}>
                    <Pressable
                        style={[styles.selectionButton, isCompany === true && styles.selectionButtonSelected]}
                        onPress={() => setIsCompany(true)}
                    >
                        <Text style={[styles.selectionText, isCompany === true && styles.selectionTextSelected]}>Sim</Text>
                    </Pressable>

                    <Pressable
                        style={[styles.selectionButton, isCompany === false && styles.selectionButtonSelected]}
                        onPress={() => setIsCompany(false)}
                    >
                        <Text style={[styles.selectionText, isCompany === false && styles.selectionTextSelected]}>Não</Text>
                    </Pressable>
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, isCompany === null && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={isCompany === null}
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
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 24 },
    infoBox: { marginBottom: 32 },
    infoText: { fontSize: 16, color: '#4B5563', lineHeight: 24 },
    link: { textDecorationLine: 'underline', color: '#000', fontWeight: '500' },
    buttonsRow: { flexDirection: 'row', gap: 16 },
    selectionButton: { flex: 1, paddingVertical: 16, borderRadius: 30, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center' },
    selectionButtonSelected: { borderColor: '#000', borderWidth: 2, backgroundColor: '#F9FAFB' },
    selectionText: { fontSize: 16, fontWeight: '600', color: '#000' },
    selectionTextSelected: { fontWeight: '700' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#E5E7EB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
