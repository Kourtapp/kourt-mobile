import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtFirstGuestScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [selected, setSelected] = useState<'any' | 'experienced'>(data.firstGuestType || 'any');

    const handleContinue = () => {
        updateData({ firstGuestType: selected });
        router.push('/court/new/private/price-weekday');
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
                <Text style={styles.title}>Escolha quem receber na sua primeira reserva</Text>
                <Text style={styles.subtitle}>Depois da sua primeira hospedagem, qualquer pessoa poderá reservar sua acomodação.</Text>

                <Pressable
                    style={[styles.card, selected === 'any' && styles.cardSelected]}
                    onPress={() => setSelected('any')}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Qualquer atleta do Kourt</Text>
                        <Text style={styles.cardDescription}>
                            Ao aceitar receber qualquer pessoa da comunidade Kourt, você tem chance de receber reservas mais rapidamente.
                        </Text>
                    </View>
                    <View style={styles.radio}>
                        {selected === 'any' && <View style={styles.radioInner} />}
                    </View>
                </Pressable>

                <Pressable
                    style={[styles.card, selected === 'experienced' && styles.cardSelected]}
                    onPress={() => setSelected('experienced')}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Um hóspede experiente</Text>
                        <Text style={styles.cardDescription}>
                            Em sua primeira reserva, receba alguém com um bom histórico no Kourt.
                        </Text>
                    </View>
                    <View style={styles.radio}>
                        {selected === 'experienced' && <View style={styles.radioInner} />}
                    </View>
                </Pressable>
            </View>

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
    card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 16 },
    cardSelected: { borderColor: '#000', borderWidth: 2, backgroundColor: '#F9FAFB' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    cardDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, paddingRight: 16 },
    radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
    radioInner: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#000' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
