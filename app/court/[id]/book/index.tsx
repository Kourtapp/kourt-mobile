
import { View, Text, ScrollView, StyleSheet, Pressable, Image } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Clock, Calendar } from 'lucide-react-native';

export default function BookingCheckoutScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { id, date, time } = params;

    // Mock Data (In real app, fetch court details by id)
    const court = {
        name: 'Arena Beach Sports',
        sport: 'Beach Tennis',
        image: 'https://images.unsplash.com/photo-1626243306935-7c9752b0f49c?q=80&w=600&auto=format&fit=crop', // Mock image
        address: 'Rua das Palmeiras, 123 - Pinheiros',
        pricePerHour: 120,
    };

    const bookingDate = new Date(date as string);
    const formattedDate = bookingDate.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    const serviceFee = court.pricePerHour * 0.05; // 5% fee
    const totalPrice = court.pricePerHour + serviceFee;

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Booking Summary Card */}
                <Text style={styles.sectionTitle}>Resumo da reserva</Text>
                <View style={styles.card}>
                    <View style={styles.cardRow}>
                        <Image source={{ uri: court.image }} style={styles.courtImage} />
                        <View style={styles.courtInfo}>
                            <Text style={styles.courtName}>{court.name}</Text>
                            <Text style={styles.courtSport}>{court.sport} • Quadra 1</Text>
                            <View style={styles.infoRow}>
                                <Calendar size={14} color="#6B7280" />
                                <Text style={styles.infoText}>{formattedDate}</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Clock size={14} color="#6B7280" />
                                <Text style={styles.infoText}>{time} (1 hora)</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <MapPin size={14} color="#6B7280" />
                                <Text style={styles.infoText} numberOfLines={1}>{court.address}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Price Breakdown */}
                <Text style={styles.sectionTitle}>Valores</Text>
                <View style={styles.card}>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Quadra (1h)</Text>
                        <Text style={styles.priceValue}>R$ {court.pricePerHour.toFixed(2)}</Text>
                    </View>
                    <View style={styles.priceRow}>
                        <Text style={styles.priceLabel}>Taxa de serviço</Text>
                        <Text style={styles.priceValue}>R$ {serviceFee.toFixed(2)}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.priceRowTotal}>
                        <Text style={styles.priceLabelTotal}>Total</Text>
                        <Text style={styles.priceValueTotal}>R$ {totalPrice.toFixed(2)}</Text>
                    </View>
                </View>

                {/* Cancellation Policy */}
                <Text style={styles.sectionTitle}>Política de cancelamento</Text>
                <Text style={styles.policyText}>
                    Cancelamento gratuito até 24h antes. Após esse prazo, será cobrado 50% do valor da reserva.
                </Text>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total a pagar</Text>
                    <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
                </View>
                <Pressable
                    style={styles.payButton}
                    onPress={() => router.push({
                        pathname: '/court/[id]/book/payment',
                        params: { id: id as string, amount: totalPrice.toString() }
                    })}
                >
                    <Text style={styles.payButtonText}>Ir para pagamento</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
    content: { padding: 24, paddingBottom: 100 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 12, marginTop: 8 },
    card: {
        backgroundColor: '#FFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        padding: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardRow: { flexDirection: 'row', gap: 12 },
    courtImage: { width: 80, height: 80, borderRadius: 8, backgroundColor: '#F3F4F6' },
    courtInfo: { flex: 1, justifyContent: 'space-between' },
    courtName: { fontSize: 16, fontWeight: '700', color: '#000' },
    courtSport: { fontSize: 14, color: '#6B7280', marginBottom: 4 },
    infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 },
    infoText: { fontSize: 13, color: '#4B5563' },

    priceRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    priceLabel: { fontSize: 14, color: '#4B5563' },
    priceValue: { fontSize: 14, color: '#000' },
    divider: { height: 1, backgroundColor: '#E5E7EB', marginVertical: 12 },
    priceRowTotal: { flexDirection: 'row', justifyContent: 'space-between' },
    priceLabelTotal: { fontSize: 16, fontWeight: '700', color: '#000' },
    priceValueTotal: { fontSize: 16, fontWeight: '700', color: '#000' },

    policyText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#FFF',
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
        padding: 24,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalContainer: { justifyContent: 'center' },
    totalLabel: { fontSize: 12, color: '#6B7280' },
    totalValue: { fontSize: 20, fontWeight: '700', color: '#000' },
    payButton: {
        backgroundColor: '#E31C5F',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 8,
    },
    payButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
