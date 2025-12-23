import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtPriceWeekendScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [percentage, setPercentage] = useState(data.weekendIncreasePercent || 10);
    const basePrice = data.priceWeekday || 180;

    // Calculate weekend price based on percentage
    const weekendPrice = Math.round(basePrice * (1 + percentage / 100));

    const handleContinue = () => {
        updateData({ weekendIncreasePercent: percentage });
        router.push('/court/new/private/discounts');
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
                <Text style={styles.title}>Defina um preço para fins de semana</Text>
                <Text style={styles.subtitle}>Acrescente um adicional para sextas e sábados.</Text>

                <View style={styles.priceDisplay}>
                    <Text style={styles.currency}>R$</Text>
                    <Text style={styles.priceValue}>{weekendPrice}</Text>
                </View>

                <View style={styles.sliderContainer}>
                    <View style={styles.sliderHeader}>
                        <View>
                            <Text style={styles.sliderLabel}>Adicional para fins de semana</Text>
                            <Text style={styles.sliderSubLabel}>Dica: experimente 10%</Text>
                        </View>
                        <View style={styles.percentageBadge}>
                            <Text style={styles.percentageText}>{percentage}%</Text>
                        </View>
                    </View>

                    {/* Custom Stepper since Slider dependency is missing */}
                    <View style={styles.stepperContainer}>
                        <Pressable
                            style={styles.stepperButton}
                            onPress={() => setPercentage(Math.max(0, percentage - 5))}
                        >
                            <Text style={styles.stepperText}>-</Text>
                        </Pressable>
                        <View style={styles.stepperBarContainer}>
                            <View style={[styles.stepperBar, { width: `${Math.min(100, percentage)}%` }]} />
                        </View>
                        <Pressable
                            style={styles.stepperButton}
                            onPress={() => setPercentage(Math.min(100, percentage + 5))}
                        >
                            <Text style={styles.stepperText}>+</Text>
                        </Pressable>
                    </View>
                    <View style={styles.sliderLabels}>
                        <Text style={styles.rangeText}>0%</Text>
                        <Text style={styles.rangeText}>100%</Text>
                    </View>
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
    content: { flex: 1, paddingHorizontal: 24, justifyContent: 'center' },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 40 },
    priceDisplay: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 60 },
    currency: { fontSize: 48, fontWeight: '800', color: '#000', marginRight: 8 },
    priceValue: { fontSize: 64, fontWeight: '800', color: '#000' },
    sliderContainer: {},
    sliderHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
    sliderLabel: { fontSize: 16, fontWeight: '600', color: '#000' },
    sliderSubLabel: { fontSize: 14, color: '#6B7280' },
    percentageBadge: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 },
    percentageText: { fontSize: 18, fontWeight: '700', color: '#000' },
    sliderLabels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 0, marginTop: 8 },
    rangeText: { fontSize: 12, color: '#6B7280' },

    // Custom Stepper Styles
    stepperContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 16 },
    stepperButton: { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
    stepperText: { fontSize: 24, fontWeight: '400', color: '#000', lineHeight: 28 },
    stepperBarContainer: { flex: 1, height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
    stepperBar: { height: '100%', backgroundColor: '#000' },

    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
