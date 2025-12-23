import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Zap, CalendarCheck } from 'lucide-react-native'; // Zap for instant
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtReservationSettingsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [selected, setSelected] = useState<'approve_first_5' | 'instant'>(data.reservationType || 'approve_first_5');

    const handleContinue = () => {
        updateData({ reservationType: selected });
        router.push('/court/new/private/first-guest');
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
                <Text style={styles.title}>Escolha suas configurações de reserva</Text>
                <Text style={styles.subtitle}>Você pode mudar essa configuração a qualquer momento.</Text>

                <Pressable
                    style={[styles.card, selected === 'approve_first_5' && styles.cardSelected]}
                    onPress={() => setSelected('approve_first_5')}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Aprove suas 5 primeiras reservas</Text>
                        <Text style={styles.cardTag}>Recomendado</Text>
                        <Text style={styles.cardDescription}>
                            Comece analisando os pedidos de reserva e, em seguida, mude para a Reserva Instantânea para que os hóspedes possam reservar automaticamente.
                        </Text>
                    </View>
                    <CalendarCheck size={32} color={selected === 'approve_first_5' ? '#000' : '#4B5563'} strokeWidth={1.5} />
                </Pressable>

                <Pressable
                    style={[styles.card, selected === 'instant' && styles.cardSelected]}
                    onPress={() => setSelected('instant')}
                >
                    <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>Usar Reserva Instantânea</Text>
                        <Text style={styles.cardDescription}>
                            Permita que os hóspedes reservem automaticamente.
                        </Text>
                    </View>
                    <Zap size={32} color={selected === 'instant' ? '#000' : '#4B5563'} strokeWidth={1.5} />
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
    card: { flexDirection: 'row', justifyContent: 'space-between', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, marginBottom: 16 },
    cardSelected: { borderColor: '#000', borderWidth: 2, backgroundColor: '#F9FAFB' },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    cardTag: { fontSize: 14, fontWeight: '600', color: '#16A34A', marginBottom: 4 }, // Green color
    cardDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20, paddingRight: 16 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
