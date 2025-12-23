import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtSafetyScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [safety, setSafety] = useState(data.safety || {
        camera: false,
        noiseMonitor: false,
        weapons: false
    });

    const toggleSafety = (key: keyof typeof safety) => {
        setSafety({ ...safety, [key]: !safety[key] });
    };

    const handleContinue = () => {
        updateData({ safety });
        router.push('/court/new/private/host-address');
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

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Compartilhe as informações de segurança</Text>
                <Text style={styles.subtitle}>Sua acomodação tem alguma dessas opções?</Text>

                <View style={styles.optionsContainer}>
                    <Pressable style={styles.optionRow} onPress={() => toggleSafety('camera')}>
                        <Text style={styles.optionLabel}>Presença de câmera de segurança na parte externa</Text>
                        <View style={[styles.checkbox, safety.camera && styles.checkboxChecked]}>
                            {safety.camera && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
                    </Pressable>

                    <Pressable style={styles.optionRow} onPress={() => toggleSafety('noiseMonitor')}>
                        <Text style={styles.optionLabel}>Presença de medidor de ruído</Text>
                        <View style={[styles.checkbox, safety.noiseMonitor && styles.checkboxChecked]}>
                            {safety.noiseMonitor && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
                    </Pressable>

                    <Pressable style={styles.optionRow} onPress={() => toggleSafety('weapons')}>
                        <Text style={styles.optionLabel}>Armas na propriedade</Text>
                        <View style={[styles.checkbox, safety.weapons && styles.checkboxChecked]}>
                            {safety.weapons && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
                    </Pressable>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>O que é importante saber</Text>
                    <Text style={styles.infoText}>
                        Câmeras de segurança que monitoram espaços internos não são permitidas, mesmo que estejam desligadas. É obrigatório informar sobre a presença de todas as câmeras de segurança na parte externa.
                    </Text>
                    <Text style={[styles.infoText, { marginTop: 12 }]}>
                        Confirme se você cumpre as <Text style={styles.link}>leis locais</Text> e consulte a <Text style={styles.link}>Política de Antidiscriminação</Text> do Kourt.
                    </Text>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
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
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
    optionsContainer: { gap: 24, marginBottom: 40 },
    optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
    optionLabel: { fontSize: 16, color: '#000', flex: 1, marginRight: 16 },
    checkbox: { width: 32, height: 32, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
    checkboxChecked: { backgroundColor: '#000', borderColor: '#000' },
    infoSection: { marginTop: 20, paddingBottom: 40 },
    infoTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 8 },
    infoText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
    link: { textDecorationLine: 'underline', color: '#000', fontWeight: '500' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
