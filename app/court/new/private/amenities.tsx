import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Wifi, Tv, Utensils, Car, Snowflake, Monitor, Waves, Droplets, Flame, Dumbbell, ShieldCheck, Gamepad2, Wind, Sun } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

const AMENITIES = [
    { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
    { id: 'tv', label: 'TV', icon: Tv },
    { id: 'kitchen', label: 'Cozinha', icon: Utensils },
    { id: 'parking', label: 'Estacionamento incluído', icon: Car },
    { id: 'ac', label: 'Ar-condicionado', icon: Snowflake },
    { id: 'workspace', label: 'Espaço de trabalho', icon: Monitor },
    { id: 'pool', label: 'Piscina', icon: Waves },
    { id: 'jacuzzi', label: 'Jacuzzi', icon: Droplets },
    { id: 'patio', label: 'Pátio', icon: Sun },
    { id: 'bbq', label: 'Churrasqueira', icon: Flame },
    { id: 'pool_table', label: 'Mesa de bilhar', icon: Gamepad2 },
    { id: 'gym', label: 'Equipamento ginástica', icon: Dumbbell },
    { id: 'outdoor_shower', label: 'Chuveiro externo', icon: Wind }, // Using Wind as proxy
    { id: 'safety', label: 'Itens de segurança', icon: ShieldCheck },
];

export default function PrivateCourtAmenitiesScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { updateData } = usePrivateCourt();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleAmenity = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            setSelected([...selected, id]);
        }
    };

    const handleContinue = () => {
        updateData({ amenities: selected });
        router.push('/court/new/private/photos'); // Assuming photos is next
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
                <Text style={styles.title}>Informe aos jogadores o que seu espaço tem para oferecer</Text>
                <Text style={styles.subtitle}>Você pode adicionar mais comodidades depois de publicar.</Text>

                <View style={styles.grid}>
                    {AMENITIES.map((item) => {
                        const isSelected = selected.includes(item.id);
                        return (
                            <Pressable
                                key={item.id}
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => toggleAmenity(item.id)}
                            >
                                <item.icon size={32} color={isSelected ? '#000' : '#4B5563'} strokeWidth={1.5} />
                                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>{item.label}</Text>
                            </Pressable>
                        );
                    })}
                </View>

                <Text style={[styles.subtitle, { marginTop: 24 }]}>Você tem algum destes itens de segurança?</Text>
                <View style={styles.grid}>
                    <Pressable
                        style={[styles.card, selected.includes('smoke') && styles.cardSelected]}
                        onPress={() => toggleAmenity('smoke')}
                    >
                        <ShieldCheck size={32} color={selected.includes('smoke') ? '#000' : '#4B5563'} />
                        <Text style={[styles.cardLabel, selected.includes('smoke') && styles.cardLabelSelected]}>Detector de fumaça</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.card, selected.includes('first_aid') && styles.cardSelected]}
                        onPress={() => toggleAmenity('first_aid')}
                    >
                        <ShieldCheck size={32} color={selected.includes('first_aid') ? '#000' : '#4B5563'} />
                        <Text style={[styles.cardLabel, selected.includes('first_aid') && styles.cardLabelSelected]}>Kit de primeiros socorros</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.card, selected.includes('fire_ext') && styles.cardSelected]}
                        onPress={() => toggleAmenity('fire_ext')}
                    >
                        <ShieldCheck size={32} color={selected.includes('fire_ext') ? '#000' : '#4B5563'} />
                        <Text style={[styles.cardLabel, selected.includes('fire_ext') && styles.cardLabelSelected]}>Extintor de incêndio</Text>
                    </Pressable>
                    <Pressable
                        style={[styles.card, selected.includes('co_alarm') && styles.cardSelected]}
                        onPress={() => toggleAmenity('co_alarm')}
                    >
                        <ShieldCheck size={32} color={selected.includes('co_alarm') ? '#000' : '#4B5563'} />
                        <Text style={[styles.cardLabel, selected.includes('co_alarm') && styles.cardLabelSelected]}>Alarme de monóxido</Text>
                    </Pressable>
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
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingBottom: 40 },
    card: { width: '48%', backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 24, height: 120, justifyContent: 'space-between' }, // 48% for 2 columns with gap
    cardSelected: { borderColor: '#000', borderWidth: 2, backgroundColor: '#F9FAFB' },
    cardLabel: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
    cardLabelSelected: { color: '#000' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
