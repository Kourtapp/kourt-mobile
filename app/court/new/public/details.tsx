import { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { usePublicCourt } from './PublicCourtContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Sun, Moon, Home,
    Unlock, Clock, Car, User,
    Droplets, Utensils, Wifi, Shield, Accessibility,
    BriefcaseMedical, Speaker, Lightbulb, Snowflake,
    Tv, ShoppingBag, GraduationCap, Baby, Sofa,
    Flower2, Check, Ban
} from 'lucide-react-native';

// Option Types
type OptionItem = {
    id: string;
    title: string;
    subtitle?: string;
    icon: any;
};

const LIGHTING_OPTIONS: OptionItem[] = [
    { id: 'day_only', title: 'Apenas diurno', subtitle: 'Sem iluminação para jogo noturno', icon: Sun },
    { id: 'night_available', title: 'Noturno disponível', subtitle: 'Possui iluminação para jogar à noite', icon: Moon },
];

const COVER_OPTIONS: OptionItem[] = [
    { id: 'uncovered', title: 'Descoberta', subtitle: 'Ao ar livre, sem cobertura', icon: Sun }, // Using Sun/CloudSun for open
    { id: 'covered', title: 'Coberta', subtitle: 'Protegida de sol e chuva', icon: Home },
];

const ACCESS_OPTIONS: OptionItem[] = [
    { id: 'public', title: 'Livre (qualquer pessoa)', icon: Unlock },
    { id: 'auth_required', title: 'Precisa de autorização', icon: Shield }, // Or Lock
    { id: 'specific_hours', title: 'Horários específicos', icon: Clock },
];

const AMENITIES = [
    { id: 'none', name: 'Nenhuma', icon: Ban }, // New None option
    { id: 'parking', name: 'Estacionamento', icon: Car },
    { id: 'locker_room', name: 'Vestiario', icon: User },
    { id: 'shower', name: 'Chuveiro', icon: Droplets },
    { id: 'bathroom', name: 'Banheiro', icon: User },
    { id: 'water', name: 'Bebedouro', icon: Droplets },
    { id: 'food', name: 'Lanchonete', icon: Utensils },
    { id: 'equipment', name: 'Aluguel de Equipamento', icon: SearchIconMock },
    { id: 'wifi', name: 'Wi-Fi', icon: Wifi },
    { id: 'security', name: 'Segurança', icon: Shield },
    { id: 'accessibility', name: 'Acessibilidade', icon: Accessibility },
    { id: 'first_aid', name: 'Primeiros Socorros', icon: BriefcaseMedical },
    { id: 'sound', name: 'Som Ambiente', icon: Speaker },
    { id: 'bleachers', name: 'Arquibancada', icon: LayersIconMock },
    { id: 'night_light', name: 'Iluminacao Noturna', icon: Lightbulb },
    { id: 'covered_court', name: 'Quadra Coberta', icon: Home },
    { id: 'ac', name: 'Ar Condicionado', icon: Snowflake },
    { id: 'scoreboard', name: 'Placar Eletronico', icon: Tv },
    { id: 'shop', name: 'Loja / Pro Shop', icon: ShoppingBag },
    { id: 'teacher', name: 'Professor Disponivel', icon: GraduationCap },
    { id: 'kids', name: 'Area Kids', icon: Baby },
    { id: 'lounge', name: 'Area VIP / Lounge', icon: Sofa },
    { id: 'massage', name: 'Massagem', icon: Flower2 },
];

// Helper for missing icons
function SearchIconMock(props: any) { return <Sun {...props} />; }
function LayersIconMock(props: any) { return <Sun {...props} />; }

export default function CourtDetailsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePublicCourt();

    // State
    const [lighting, setLighting] = useState<string | null>(data.lighting || null);
    const [cover, setCover] = useState<string | null>(data.cover || null);
    const [access, setAccess] = useState<string | null>(data.access || null);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>(data.amenities || []);

    const isValid = lighting && cover && access && selectedAmenities.length > 0;

    const toggleAmenity = (id: string) => {
        if (id === 'none') {
            // If selecting 'none', clear everything else. If deselecting, just clear.
            if (selectedAmenities.includes('none')) {
                setSelectedAmenities([]);
            } else {
                setSelectedAmenities(['none']);
            }
            return;
        }

        // If selecting any other amenity, ensure 'none' is removed
        let newSelection = [...selectedAmenities];
        if (newSelection.includes('none')) {
            newSelection = [];
        }

        if (newSelection.includes(id)) {
            newSelection = newSelection.filter(item => item !== id);
        } else {
            newSelection.push(id);
        }
        setSelectedAmenities(newSelection);
    };

    const handleContinue = () => {
        if (!isValid) return;
        updateData({ lighting, cover, access, amenities: selectedAmenities });
        router.push('/court/new/public/location-map');
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
                <Text style={styles.title}>Detalhes do Espaço</Text>
                <Text style={styles.subtitle}>Mais informações sobre a quadra</Text>

                {/* Lighting Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Iluminação</Text>
                    <View style={styles.optionsContainer}>
                        {LIGHTING_OPTIONS.map((option) => (
                            <SelectionCard
                                key={option.id}
                                item={option}
                                selected={lighting === option.id}
                                onSelect={() => setLighting(option.id)}
                            />
                        ))}
                    </View>
                </View>

                {/* Cover Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Cobertura</Text>
                    <View style={styles.optionsContainer}>
                        {COVER_OPTIONS.map((option) => (
                            <SelectionCard
                                key={option.id}
                                item={option}
                                selected={cover === option.id}
                                onSelect={() => setCover(option.id)}
                            />
                        ))}
                    </View>
                </View>

                {/* Access Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Acesso</Text>
                    <View style={styles.optionsContainer}>
                        {ACCESS_OPTIONS.map((option) => (
                            <SelectionCard
                                key={option.id}
                                item={option}
                                selected={access === option.id}
                                onSelect={() => setAccess(option.id)}
                                compact
                            />
                        ))}
                    </View>
                </View>

                {/* Amenities Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Comodidades</Text>
                    <Text style={styles.helperText}>Selecione as comodidades disponíveis no local</Text>
                    <View style={styles.pillsContainer}>
                        {AMENITIES.map((amenity) => {
                            const isSelected = selectedAmenities.includes(amenity.id);
                            return (
                                <Pressable
                                    key={amenity.id}
                                    style={[
                                        styles.pill,
                                        isSelected && styles.pillSelected,
                                        amenity.id === 'none' && isSelected && { borderColor: '#EF4444', backgroundColor: '#FEF2F2' },
                                        amenity.id === 'none' && isSelected && styles.nonePillSelected // Optional extra style
                                    ]}
                                    onPress={() => toggleAmenity(amenity.id)}
                                >
                                    <amenity.icon size={16} color={isSelected ? "#000" : "#6B7280"} />
                                    <Text style={[
                                        styles.pillText,
                                        isSelected && styles.pillTextSelected,
                                        amenity.id === 'none' && isSelected && { color: '#B91C1C' }
                                    ]}>
                                        {amenity.name}
                                    </Text>
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

// Sub-components
function SelectionCard({ item, selected, onSelect, compact = false }: { item: OptionItem, selected: boolean, onSelect: () => void, compact?: boolean }) {
    return (
        <Pressable
            style={[
                styles.card,
                selected && styles.cardSelected,
                compact && styles.cardCompact
            ]}
            onPress={onSelect}
        >
            <View style={styles.cardContent}>
                <item.icon size={24} color={selected ? "#22C55E" : "#6B7280"} />
                <View style={styles.cardTextContainer}>
                    <Text style={[styles.cardTitle, selected && styles.cardTitleSelected]}>{item.title}</Text>
                    {item.subtitle && (
                        <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                    )}
                </View>
            </View>
            {selected && (
                <View style={styles.checkCircle}>
                    <Check size={14} color="#FFF" strokeWidth={3} />
                </View>
            )}
        </Pressable>
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
        marginBottom: 12,
    },
    helperText: {
        fontSize: 14,
        color: '#9CA3AF',
        marginBottom: 12,
        marginTop: -8,
    },
    optionsContainer: {
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        paddingRight: 56, // Massive padding to ensure text doesn't touch absolute icon
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
        position: 'relative', // Context for absolute positioning
    },
    cardCompact: {
        paddingVertical: 12,
    },
    cardSelected: {
        borderColor: '#22C55E',
        backgroundColor: '#F0FDF4',
    },
    cardContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    cardTextContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: '#374151',
    },
    cardTitleSelected: {
        color: '#15803D',
    },
    cardSubtitle: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 2,
    },
    checkCircle: {
        position: 'absolute', // Nuclear option
        right: 16,
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
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
        paddingHorizontal: 12, // Slightly smaller
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        backgroundColor: '#FFFFFF',
    },
    pillSelected: {
        borderColor: '#22C55E', // Let's go with Green border for consistency
        backgroundColor: '#F0FDF4',
    },
    nonePillSelected: {
        borderColor: '#EF4444',
        backgroundColor: '#FEF2F2',
    },
    pillText: {
        fontSize: 13,
        color: '#6B7280',
        fontWeight: '500',
    },
    pillTextSelected: {
        color: '#166534', // Dark green
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF',
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
