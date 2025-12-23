import { View, Text, StyleSheet, Pressable, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Building, Home, Warehouse, Trees, Tent, Castle, Dumbbell, Trophy, ChevronLeft } from 'lucide-react-native';
import { usePrivateCourt } from './PrivateCourtContext';
import { useState } from 'react';

const PROPERTY_TYPES = [
    { id: 'house', label: 'Casa', icon: Home },
    { id: 'apartment', label: 'Apartamento', icon: Building },
    { id: 'condo', label: 'Condomínio', icon: Castle },
    { id: 'farm', label: 'Sítio', icon: Trees },
    { id: 'barn', label: 'Chácara', icon: Warehouse },
    { id: 'club', label: 'Clube', icon: Tent },
    { id: 'arena', label: 'Arena', icon: Trophy },
    { id: 'gym', label: 'Academia', icon: Dumbbell },
];

export default function PrivateCourtTypeScreen() {
    const insets = useSafeAreaInsets();
    const { updateData } = usePrivateCourt();
    const [selected, setSelected] = useState<string | null>(null);

    const handleSelect = (typeId: string) => {
        setSelected(typeId);
    };

    const handleContinue = () => {
        if (!selected) return;

        // Map selection to privacy type
        const isCondo = selected === 'condo';
        const privacyType = isCondo ? 'condo' : 'house';

        updateData({ privacyType, courtCategory: selected as any });

        // Navigate to appropriate flow
        if (isCondo) {
            router.push('/court/new/condo/intro');
        } else {
            router.push('/court/new/private/structure');
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#000" />
                </Pressable>
                <Pressable style={styles.helpButton}>
                    <Text style={styles.helpText}>Dúvidas?</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Qual destas opções{'\n'}descreve melhor seu espaço?</Text>

                <FlatList
                    data={PROPERTY_TYPES}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => {
                        const isSelected = selected === item.id;
                        return (
                            <Pressable
                                style={[styles.card, isSelected && styles.cardSelected]}
                                onPress={() => handleSelect(item.id)}
                            >
                                <item.icon size={32} color={isSelected ? '#000' : '#6B7280'} strokeWidth={1.5} />
                                <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        );
                    }}
                />
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !selected && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!selected}
                >
                    <Text style={[styles.buttonText, !selected && styles.buttonTextDisabled]}>
                        Avançar
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
    },
    helpButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    helpText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000',
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000',
        marginBottom: 32,
        lineHeight: 36,
    },
    grid: {
        paddingBottom: 24,
    },
    row: {
        gap: 12,
        marginBottom: 12,
    },
    card: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 20,
        height: 110,
        justifyContent: 'space-between',
    },
    cardSelected: {
        borderColor: '#000',
        borderWidth: 2,
        backgroundColor: '#FAFAFA',
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6B7280',
    },
    cardLabelSelected: {
        color: '#000',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#000000',
        height: 56,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonTextDisabled: {
        color: '#9CA3AF',
    },
});
