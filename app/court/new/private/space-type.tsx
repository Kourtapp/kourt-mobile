import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, DoorOpen, Users } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtSpaceTypeScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { updateData } = usePrivateCourt();
    const [selected, setSelected] = useState<string | null>(null);

    const options = [
        {
            id: 'entire',
            title: 'Uma quadra inteira',
            description: 'Os jogadores têm a quadra toda só para eles.',
            icon: Home
        },
        {
            id: 'part',
            title: 'Metade da quadra',
            description: 'Uso compartilhado ou meia quadra (ex: basquete 3x3).',
            icon: DoorOpen
        },
        {
            id: 'shared',
            title: 'Espaço compartilhado',
            description: 'Quadra em espaço comum sem exclusividade total.',
            icon: Users
        }
    ];

    const handleSelect = (id: string) => {
        setSelected(id);
    };

    const handleContinue = () => {
        if (!selected) return;
        // Logic for space type could go here into context if needed
        router.push('/court/new/private/location-permission');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Que tipo de espaço você oferece aos jogadores?</Text>

                <View style={styles.optionsContainer}>
                    {options.map((option) => {
                        const isSelected = selected === option.id;
                        return (
                            <Pressable
                                key={option.id}
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => handleSelect(option.id)}
                            >
                                <View style={styles.textContainer}>
                                    <Text style={styles.cardTitle}>{option.title}</Text>
                                    <Text style={styles.cardDescription}>{option.description}</Text>
                                </View>
                                <option.icon size={28} color={isSelected ? '#000' : '#4B5563'} />
                            </Pressable>
                        );
                    })}
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !selected && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!selected}
                >
                    <Text style={[styles.buttonText, !selected && styles.buttonTextDisabled]}>Avançar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { paddingHorizontal: 24, paddingVertical: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    backText: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 32 },
    optionsContainer: { gap: 12 },
    card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 24, borderRadius: 12, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFF' },
    cardSelected: { borderColor: '#000', borderWidth: 2, backgroundColor: '#F9FAFB' },
    textContainer: { flex: 1, paddingRight: 16 },
    cardTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    cardDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#E5E7EB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    buttonTextDisabled: { color: '#9CA3AF' },
});
