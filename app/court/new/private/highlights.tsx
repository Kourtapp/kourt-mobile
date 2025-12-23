import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Star, Users, MapPin, Sparkles, Coffee } from 'lucide-react-native'; // Placeholders
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

const HIGHLIGHTS = [
    { id: 'peaceful', label: 'Tranquila', icon: Coffee },
    { id: 'unique', label: 'Única', icon: Sparkles },
    { id: 'family', label: 'Ideal para famílias', icon: Users },
    { id: 'stylish', label: 'Cheia de estilo', icon: Home },
    { id: 'central', label: 'Central', icon: MapPin },
    { id: 'spacious', label: 'Espaçosa', icon: Star },
];

export default function PrivateCourtHighlightsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { updateData } = usePrivateCourt();
    const [selected, setSelected] = useState<string[]>([]);

    const toggleHighlight = (id: string) => {
        if (selected.includes(id)) {
            setSelected(selected.filter(item => item !== id));
        } else {
            if (selected.length < 2) {
                setSelected([...selected, id]);
            }
        }
    };

    const handleContinue = () => {
        updateData({ highlights: selected });
        router.push('/court/new/private/description');
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
                <Text style={styles.title}>A seguir, vamos descrever sua quadra</Text>
                <Text style={styles.subtitle}>Escolha até dois destaques. Vamos usá-los para iniciar sua descrição.</Text>

                <View style={styles.pillsContainer}>
                    {HIGHLIGHTS.map((item) => {
                        const isSelected = selected.includes(item.id);
                        return (
                            <Pressable
                                key={item.id}
                                style={[styles.pill, isSelected && styles.pillSelected]}
                                onPress={() => toggleHighlight(item.id)}
                            >
                                <item.icon size={20} color={isSelected ? '#000' : '#4B5563'} />
                                <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>{item.label}</Text>
                            </Pressable>
                        );
                    })}
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
    pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
    pillSelected: { borderColor: '#000', borderWidth: 2, backgroundColor: '#F9FAFB' },
    pillText: { fontSize: 16, fontWeight: '600', color: '#4B5563' },
    pillTextSelected: { color: '#000' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
