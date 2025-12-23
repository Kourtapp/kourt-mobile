
import { View, Text, ScrollView, StyleSheet, Pressable, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, CreditCard, Smartphone, ShieldCheck } from 'lucide-react-native';
import { useState } from 'react';

export default function BookingPaymentScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { amount, id } = params;
    const [method, setMethod] = useState<'card' | 'pix' | 'boleto'>('card');

    const handlePay = () => {
        // Simulate API call
        setTimeout(() => {
            router.push({
                pathname: '/court/[id]/book/confirmation',
                params: { id: id as string, amount: amount as string }
            });
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Pagamento</Text>
                <View style={styles.secureBadge}>
                    <ShieldCheck size={14} color="#059669" />
                    <Text style={styles.secureText}>Seguro</Text>
                </View>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.label}>Como você prefere pagar?</Text>

                {/* Payment Methods */}
                <View style={styles.methodsContainer}>
                    <Pressable
                        onPress={() => setMethod('card')}
                        style={[styles.methodCard, method === 'card' && styles.methodSelected]}
                    >
                        <View style={[styles.radio, method === 'card' && styles.radioSelected]} />
                        <CreditCard size={24} color="#000" />
                        <Text style={styles.methodTitle}>Cartão de Crédito</Text>
                    </Pressable>

                    <Pressable
                        onPress={() => setMethod('pix')}
                        style={[styles.methodCard, method === 'pix' && styles.methodSelected]}
                    >
                        <View style={[styles.radio, method === 'pix' && styles.radioSelected]} />
                        <Smartphone size={24} color="#000" />
                        <Text style={styles.methodTitle}>Pix (Aprovação imediata)</Text>
                    </Pressable>
                    {/* Boleto omitted for brevity/UX preference */}
                </View>

                {/* Card Form */}
                {method === 'card' && (
                    <View style={styles.cardForm}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Número do cartão</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="0000 0000 0000 0000"
                                keyboardType="numeric"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                        <View style={styles.row}>
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>Validade</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="MM/AA"
                                    keyboardType="numeric"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                            <View style={{ width: 16 }} />
                            <View style={[styles.inputGroup, { flex: 1 }]}>
                                <Text style={styles.inputLabel}>CVV</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="123"
                                    keyboardType="numeric"
                                    secureTextEntry
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.inputLabel}>Nome no cartão</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="NOME COMO NO CARTAO"
                                autoCapitalize="characters"
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>
                    </View>
                )}

                {method === 'pix' && (
                    <View style={styles.pixInfo}>
                        <Text style={styles.pixText}>
                            Ao clicar em pagar, você receberá um código QR Code para efetuar o pagamento. A liberação é imediata.
                        </Text>
                    </View>
                )}

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValue}>R$ {parseFloat(amount as string || '0').toFixed(2)}</Text>
                </View>
                <Pressable
                    style={styles.payButton}
                    onPress={handlePay}
                >
                    <Text style={styles.payButtonText}>Pagar Agora</Text>
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
    secureBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 99 },
    secureText: { fontSize: 12, fontWeight: '600', color: '#059669' },

    content: { padding: 24 },
    label: { fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 20 },

    methodsContainer: { gap: 12, marginBottom: 24 },
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        backgroundColor: '#FFF',
        gap: 12,
    },
    methodSelected: {
        borderColor: '#000',
        backgroundColor: '#F9FAFB',
    },
    methodTitle: { fontSize: 16, fontWeight: '500', color: '#000' },

    radio: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#D1D5DB',
    },
    radioSelected: {
        borderColor: '#000',
        backgroundColor: '#000',
        borderWidth: 6,
    },

    cardForm: { gap: 16 },
    row: { flexDirection: 'row' },
    inputGroup: { marginBottom: 12 },
    inputLabel: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 8 },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        color: '#000',
    },

    pixInfo: {
        backgroundColor: '#F3F4F6',
        padding: 16,
        borderRadius: 12,
    },
    pixText: { fontSize: 14, color: '#4B5563', lineHeight: 20, textAlign: 'center' },

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
        backgroundColor: '#000', // Black for primary action here
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 8,
    },
    payButtonText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
