import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtStructureScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();

    // Adapted Fields for Courts
    const [players, setPlayers] = useState(data.capacity || 1);
    const [courts, setCourts] = useState(data.courtCount || 1);
    const [benches, setBenches] = useState(data.benches || 0);
    const [beverage, setBeverage] = useState(data.restrooms || 0);

    const handleContinue = () => {
        updateData({
            capacity: players,
            courtCount: courts,
            benches,
            restrooms: beverage
        });
        router.push('/court/new/private/step2-intro');
    };

    const Counter = ({ label, value, setValue }: { label: string, value: number, setValue: (v: number) => void }) => (
        <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>{label}</Text>
            <View style={styles.counterControls}>
                <Pressable
                    style={[styles.counterButton, value <= 0 && styles.counterButtonDisabled]}
                    onPress={() => value > 0 && setValue(value - 1)}
                    disabled={value <= 0}
                >
                    <Minus size={20} color={value <= 0 ? "#D1D5DB" : "#6B7280"} />
                </Pressable>
                <TextInput
                    style={styles.counterInput}
                    value={value.toString()}
                    onChangeText={(text) => {
                        if (text === '') {
                            setValue(0);
                            return;
                        }
                        const num = parseInt(text, 10);
                        if (!isNaN(num)) setValue(num);
                    }}
                    keyboardType="numeric"
                    maxLength={3}
                />
                <Pressable
                    style={styles.counterButton}
                    onPress={() => setValue(value + 1)}
                >
                    <Plus size={20} color="#6B7280" />
                </Pressable>
            </View>
        </View>
    );

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
                <Text style={styles.title}>Compartilhe algumas informações básicas sobre sua quadra</Text>
                <Text style={styles.subtitle}>Você adicionará mais informações depois, como fotos e regras.</Text>

                <View style={styles.countersContainer}>
                    <Counter label="Jogadores (Capacidade)" value={players} setValue={setPlayers} />
                    <View style={styles.divider} />
                    <Counter label="Quadras disponíveis" value={courts} setValue={setCourts} />
                    <View style={styles.divider} />
                    <Counter label="Bancos / Assentos" value={benches} setValue={setBenches} />
                    <View style={styles.divider} />
                    <Counter label="Banheiros / Vestiários" value={beverage} setValue={setBeverage} />
                </View>
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
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
    countersContainer: { gap: 0 },
    counterRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 24 },
    counterLabel: { flex: 1, fontSize: 16, color: '#000', fontWeight: '500' },
    counterControls: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    counterButton: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
    counterButtonDisabled: { borderColor: '#F3F4F6' },
    counterInput: { fontSize: 16, fontWeight: '600', color: '#000', minWidth: 40, textAlign: 'center', padding: 0 },
    divider: { height: 1, backgroundColor: '#F3F4F6', width: '100%' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
