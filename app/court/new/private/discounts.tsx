import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtDiscountsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [discounts, setDiscounts] = useState(data.discounts || {
        newListing: true,
        lastMinute: false,
        weekly: false,
        monthly: false
    });

    const toggleDiscount = (key: keyof typeof discounts) => {
        setDiscounts({ ...discounts, [key]: !discounts[key] });
    };

    const handleContinue = () => {
        updateData({ discounts });
        // Proceed to Documents (ID verification)
        router.push('/court/new/private/documents');
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
                <Text style={styles.title}>Adicione descontos</Text>
                <Text style={styles.subtitle}>
                    Ajude seu espaço a se destacar para receber reservas mais rapidamente e ganhar suas primeiras avaliações.
                </Text>

                <View style={styles.cardsContainer}>
                    {/* New Listing Promotion */}
                    <Pressable style={styles.card} onPress={() => toggleDiscount('newListing')}>
                        <View style={styles.percentBadge}><Text style={styles.percentText}>20%</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Promoção para anúncios novos</Text>
                            <Text style={styles.cardDescription}>Ofereça 20% de desconto nas suas três primeiras reservas</Text>
                        </View>
                        <View style={[styles.checkbox, discounts.newListing && styles.checkboxChecked]}>
                            {discounts.newListing && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
                    </Pressable>

                    {/* Last Minute Discount */}
                    <Pressable style={styles.card} onPress={() => toggleDiscount('lastMinute')}>
                        <View style={styles.percentBadge}><Text style={styles.percentText}>11%</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Desconto de última hora</Text>
                            <Text style={styles.cardDescription}>Para estadias reservadas 14 dias ou menos antes da chegada</Text>
                        </View>
                        <View style={[styles.checkbox, discounts.lastMinute && styles.checkboxChecked]}>
                            {discounts.lastMinute && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
                    </Pressable>

                    {/* Weekly Discount */}
                    <Pressable style={styles.card} onPress={() => toggleDiscount('weekly')}>
                        <View style={styles.percentBadge}><Text style={styles.percentText}>10%</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Desconto semanal</Text>
                            <Text style={styles.cardDescription}>Para estadias de 7 noites ou mais</Text>
                        </View>
                        <View style={[styles.checkbox, discounts.weekly && styles.checkboxChecked]}>
                            {discounts.weekly && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
                    </Pressable>

                    {/* Monthly Discount */}
                    <Pressable style={styles.card} onPress={() => toggleDiscount('monthly')}>
                        <View style={styles.percentBadge}><Text style={styles.percentText}>25%</Text></View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.cardTitle}>Desconto mensal</Text>
                            <Text style={styles.cardDescription}>Para estadias de 28 noites ou mais</Text>
                        </View>
                        <View style={[styles.checkbox, discounts.monthly && styles.checkboxChecked]}>
                            {discounts.monthly && <Check size={14} color="#FFF" strokeWidth={3} />}
                        </View>
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
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
    cardsContainer: { gap: 16 },
    card: { flexDirection: 'row', alignItems: 'center', padding: 20, borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, gap: 16, backgroundColor: '#FAFAFA' },
    percentBadge: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFF' },
    percentText: { fontSize: 18, fontWeight: '700', color: '#000' },
    cardTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
    cardDescription: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    checkbox: { width: 24, height: 24, borderRadius: 6, borderWidth: 1, borderColor: '#000', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF' },
    checkboxChecked: { backgroundColor: '#000' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
