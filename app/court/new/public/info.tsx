import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { usePublicCourt } from './PublicCourtContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SPORTS } from '../../../../constants/sports';

const FLOOR_TYPES = [
    'Areia', 'Saibro', 'Cimento', 'Grama',
    'Sintético', 'Madeira', 'Outro'
];

export default function CourtInfoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePublicCourt();

    // Form State
    const [name, setName] = useState(data.name || '');
    const [selectedSports, setSelectedSports] = useState<string[]>(data.sports || []);
    const [quantity, setQuantity] = useState(data.quantity || 1);
    const [floorTypes, setFloorTypes] = useState<string[]>(data.floorTypes || []);

    const isValid = name.length > 3 && selectedSports.length > 0 && floorTypes.length > 0;

    const toggleFloorType = (type: string) => {
        if (floorTypes.includes(type)) {
            setFloorTypes(floorTypes.filter(t => t !== type));
        } else {
            if (floorTypes.length < quantity) {
                setFloorTypes([...floorTypes, type]);
            } else {
                // Optional: Replace the last one or just ignore. 
                // Let's replace the last one if full, or maybe just warn? 
                // User requirement: "liberar... selecionar". Usually limits selection.
                // Let's just do nothing if limit reached, or maybe replace last one? 
                // Standard UX: Do nothing or replace. Taking the approach of removing the first one (FIFO) or just blocking?
                // Let's block adding more than quantity for now, behaves like radio if 1, multi if > 1.
                // Better UX: If quantity == 1, replace. If > 1, allow up to quantity.
                if (quantity === 1) {
                    setFloorTypes([type]);
                }
            }
        }
    };

    // Reset floor types if quantity changes to be less than current selection
    // useEffect(() => {
    //     if (floorTypes.length > quantity) {
    //         setFloorTypes(floorTypes.slice(0, quantity));
    //     }
    // }, [quantity]);

    const toggleSport = (sportId: string) => {
        if (selectedSports.includes(sportId)) {
            setSelectedSports(selectedSports.filter(id => id !== sportId));
        } else {
            setSelectedSports([...selectedSports, sportId]);
        }
    };

    const handleContinue = () => {
        if (!isValid) return;

        updateData({
            name,
            sports: selectedSports,
            quantity,
            floorTypes
        });

        // Navigate to next step
        router.push('/court/new/public/details');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Informações da Quadra</Text>
                <Text style={styles.subtitle}>Conte-nos sobre este espaço</Text>

                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={styles.label}>Nome do Local *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Quadra do Parque Ibirapuera"
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                {/* Sports Selection */}
                <View style={styles.section}>
                    <Text style={styles.label}>Esportes Disponíveis *</Text>
                    <View style={styles.pillsContainer}>
                        {SPORTS.map((sport) => {
                            const isSelected = selectedSports.includes(sport.id);
                            return (
                                <Pressable
                                    key={sport.id}
                                    style={[
                                        styles.pill,
                                        isSelected && styles.pillSelected
                                    ]}
                                    onPress={() => toggleSport(sport.id)}
                                >
                                    <sport.icon size={18} color={isSelected ? "#FFF" : "#6B7280"} />
                                    <Text style={[
                                        styles.pillText,
                                        isSelected && styles.pillTextSelected
                                    ]}>{sport.name}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Quantity Selection */}
                <View style={styles.section}>
                    <Text style={styles.label}>Quantidade de Quadras</Text>
                    <View style={styles.quantityContainer}>
                        {[1, 2, 3, 4, '5+'].map((qty) => {
                            const val = typeof qty === 'string' ? 5 : qty; // logic for value
                            const isSelected = quantity === val;
                            return (
                                <Pressable
                                    key={qty}
                                    style={[
                                        styles.quantityBox,
                                        isSelected && styles.quantityBoxSelected
                                    ]}
                                    onPress={() => setQuantity(val)}
                                >
                                    <Text style={[
                                        styles.quantityText,
                                        isSelected && styles.quantityTextSelected
                                    ]}>{qty}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>

                {/* Floor Type Selection */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <Text style={styles.label}>Tipo de Piso *</Text>
                        <Text style={styles.counterText}>
                            {floorTypes.length}/{quantity} selecionado{floorTypes.length !== 1 ? 's' : ''}
                        </Text>
                    </View>
                    <View style={styles.pillsContainer}>
                        {FLOOR_TYPES.map((type) => {
                            const isSelected = floorTypes.includes(type);
                            return (
                                <Pressable
                                    key={type}
                                    style={[
                                        styles.pill,
                                        isSelected && styles.pillSelected,
                                        // Disable style if full and not selected? Maybe confusing.
                                        (!isSelected && floorTypes.length >= quantity && quantity > 1) && { opacity: 0.5 }
                                    ]}
                                    onPress={() => toggleFloorType(type)}
                                // disabled={!isSelected && floorTypes.length >= quantity && quantity > 1} 
                                // Better to just let toggle handle it (maybe replace behavior) or show limit.
                                >
                                    <Text style={[
                                        styles.pillText,
                                        isSelected && styles.pillTextSelected
                                    ]}>{type}</Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !isValid && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!isValid}
                >
                    <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>Continuar</Text>
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
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
    },
    section: {
        marginBottom: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: '#000',
    },
    pillsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    pillSelected: {
        borderColor: '#22C55E',
        backgroundColor: '#22C55E'
    },
    pillText: {
        fontSize: 14,
        color: '#4B5563',
        fontWeight: '500',
    },
    pillTextSelected: {
        color: '#FFFFFF',
    },
    quantityContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    quantityBox: {
        width: 48,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 12,
        backgroundColor: '#F9FAFB',
        borderWidth: 1, // Added border to match unselected pills slightly
        borderColor: '#F3F4F6',
    },
    quantityBoxSelected: {
        backgroundColor: '#22C55E',
        borderColor: '#22C55E',
    },
    quantityText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    quantityTextSelected: {
        color: '#FFFFFF',
    },
    counterText: {
        fontSize: 12,
        color: '#9CA3AF',
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF', // Ensure footer covers content
    },
    button: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
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
