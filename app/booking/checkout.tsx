import { View, Text, Pressable, Alert, Image, ScrollView, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Use wrapper that handles Simulator gracefully
import { useStripe, usePlatformPay, PlatformPay } from '@/lib/stripeHooks';

import { useBookingStore } from '@/stores/useBookingStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { useUserStore } from '@/stores/useUserStore';
import {
    createBooking,
    checkAvailability,
    createPaymentForBooking,
    createPixPaymentForBooking,
    confirmBookingPayment
} from '@/services/bookings';

export default function CheckoutScreen() {
    const { court, date, time, duration } = useBookingStore();
    const { selectedCard } = usePaymentStore();
    const { profile } = useUserStore();
    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const { confirmPlatformPayPayment } = usePlatformPay();

    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [discount] = useState(0);
    const [couponCode] = useState<string | null>(null);

    if (!court || !time) return null;

    const subtotal = (court.price_per_hour || 0) * duration;
    const serviceFee = subtotal * 0.1; // 10%
    const total = subtotal + serviceFee - discount;

    const calculateEndTime = (startTime: string, durationHours: number) => {
        const [hours, minutes] = startTime.split(':').map(Number);
        const endHours = hours + durationHours;
        return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const handleConfirm = async () => {
        if (!selectedCard) {
            Alert.alert('Atenção', 'Selecione um método de pagamento');
            return;
        }

        if (!court || !time) {
            Alert.alert('Erro', 'Dados da reserva incompletos');
            return;
        }

        setLoading(true);

        try {
            const endTime = calculateEndTime(time, duration);
            const dateStr = format(date, 'yyyy-MM-dd');

            // 1. Verificar disponibilidade
            setLoadingMessage('Verificando disponibilidade...');
            const isAvailable = await checkAvailability(court.id, dateStr, time, endTime);
            if (!isAvailable) {
                Alert.alert(
                    'Horário Indisponível',
                    'Este horário já foi reservado. Por favor, escolha outro horário.'
                );
                setLoading(false);
                return;
            }

            // 2. Criar reserva no Supabase
            setLoadingMessage('Criando reserva...');
            const booking = await createBooking({
                court_id: court.id,
                date: dateStr,
                start_time: time,
                end_time: endTime,
                duration_hours: duration,
                total_price: total,
                subtotal: subtotal,
                service_fee: serviceFee,
                discount_amount: discount > 0 ? discount : undefined,
                coupon_code: couponCode || undefined,
                payment_method: selectedCard.brand || 'card',
            });

            // 3. Processar pagamento baseado no método selecionado
            setLoadingMessage('Processando pagamento...');

            const paymentMethod = selectedCard.id;

            if (paymentMethod === 'pix') {
                // PIX Payment
                await handlePixPayment(booking.id);
            } else if (paymentMethod === 'apple_pay' || paymentMethod === 'google_pay') {
                // Apple Pay / Google Pay
                await handlePlatformPay(booking.id);
            } else {
                // Card Payment (saved card or new card)
                await handleCardPayment(booking.id);
            }
        } catch (error: any) {
            console.error('[Checkout] Error:', error);
            Alert.alert('Erro', error.message || 'Ocorreu um erro ao processar sua reserva');
        } finally {
            setLoading(false);
            setLoadingMessage('');
        }
    };

    const handleCardPayment = async (bookingId: string) => {
        try {
            // Create PaymentIntent via Edge Function
            const { clientSecret, paymentIntentId } = await createPaymentForBooking({
                booking_id: bookingId,
                amount: total,
                customer_email: profile?.email,
            });

            // Initialize Payment Sheet
            const { error: initError } = await initPaymentSheet({
                paymentIntentClientSecret: clientSecret,
                merchantDisplayName: 'Kourt',
                defaultBillingDetails: {
                    name: profile?.name || '',
                    email: profile?.email || '',
                },
                returnURL: 'kourt://payment-complete',
            });

            if (initError) {
                throw new Error(initError.message);
            }

            // Present Payment Sheet
            const { error: presentError } = await presentPaymentSheet();

            if (presentError) {
                if (presentError.code === 'Canceled') {
                    // User cancelled - don't show error
                    return;
                }
                throw new Error(presentError.message);
            }

            // Payment successful
            await confirmBookingPayment(bookingId, paymentIntentId);

            router.replace({
                pathname: '/booking/confirmed',
                params: { bookingId },
            });
        } catch (error: any) {
            console.error('[handleCardPayment] Error:', error);
            throw error;
        }
    };

    const handlePlatformPay = async (bookingId: string) => {
        try {
            // Create PaymentIntent via Edge Function
            const { clientSecret, paymentIntentId } = await createPaymentForBooking({
                booking_id: bookingId,
                amount: total,
                customer_email: profile?.email,
            });

            // Confirm with Platform Pay
            const { error } = await confirmPlatformPayPayment(clientSecret, {
                applePay: {
                    cartItems: [
                        {
                            label: `Reserva ${court.name}`,
                            amount: total.toFixed(2),
                            paymentType: PlatformPay.PaymentType.Immediate,
                        },
                    ],
                    merchantCountryCode: 'BR',
                    currencyCode: 'BRL',
                },
                googlePay: {
                    testEnv: __DEV__,
                    merchantCountryCode: 'BR',
                    currencyCode: 'BRL',
                    merchantName: 'Kourt',
                },
            });

            if (error) {
                if (error.code === 'Canceled') {
                    return;
                }
                throw new Error(error.message);
            }

            // Payment successful
            await confirmBookingPayment(bookingId, paymentIntentId);

            router.replace({
                pathname: '/booking/confirmed',
                params: { bookingId },
            });
        } catch (error: any) {
            console.error('[handlePlatformPay] Error:', error);
            throw error;
        }
    };

    const handlePixPayment = async (bookingId: string) => {
        try {
            // Create PIX Payment via Edge Function
            const pixResult = await createPixPaymentForBooking({
                booking_id: bookingId,
                amount: total,
                customer_email: profile?.email,
                customer_name: profile?.name,
            });

            // Navigate to PIX screen with QR code
            router.replace({
                pathname: '/booking/pix',
                params: {
                    bookingId,
                    pixQrCode: pixResult.pixQrCode,
                    pixQrCodeBase64: pixResult.pixQrCodeBase64,
                    expiresAt: pixResult.expiresAt,
                    paymentIntentId: pixResult.paymentIntentId,
                    amount: total.toString(),
                },
            });
        } catch (error: any) {
            console.error('[handlePixPayment] Error:', error);
            throw error;
        }
    };

    return (
        <View className="flex-1 bg-[#fafafa]">
            {/* Header */}
            <View className="bg-white px-5 pt-14 pb-4 flex-row items-center gap-4 border-b border-neutral-100">
                <Pressable onPress={() => router.back()} disabled={loading}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-bold text-black">Checkout</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                {/* Resumo da Reserva */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-neutral-500 mb-3">
                        Sua reserva
                    </Text>
                    <View className="bg-white border border-neutral-200 rounded-2xl p-4 flex-row gap-4">
                        <Image
                            source={{ uri: court.cover_image || court.images?.[0] }}
                            className="w-20 h-20 rounded-xl bg-neutral-200"
                        />
                        <View className="flex-1">
                            <Text className="font-semibold text-black mb-2">{court.name}</Text>
                            <View className="flex-row items-center gap-1.5 mb-1">
                                <MaterialIcons name="event" size={14} color="#737373" />
                                <Text className="text-sm text-neutral-600">
                                    {format(date, "EEE, d 'de' MMM", { locale: ptBR })}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1.5 mb-1">
                                <MaterialIcons name="schedule" size={14} color="#737373" />
                                <Text className="text-sm text-neutral-600">
                                    {time} - {calculateEndTime(time, duration)}
                                </Text>
                            </View>
                            <View className="flex-row items-center gap-1.5">
                                <MaterialIcons name="timer" size={14} color="#737373" />
                                <Text className="text-sm text-neutral-600">
                                    {duration} hora{duration > 1 ? 's' : ''}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Pagamento */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-neutral-500 mb-3">
                        Pagamento
                    </Text>
                    <Pressable
                        onPress={() => router.push('/booking/payment-method')}
                        disabled={loading}
                        className="bg-white border border-neutral-200 rounded-2xl p-4 flex-row items-center"
                    >
                        {selectedCard ? (
                            <>
                                <View className="w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center">
                                    <MaterialIcons
                                        name={
                                            selectedCard.id === 'pix' ? 'qr-code-2' :
                                            selectedCard.id === 'apple_pay' ? 'apple' :
                                            selectedCard.id === 'google_pay' ? 'account-balance-wallet' :
                                            'credit-card'
                                        }
                                        size={20}
                                        color="#000"
                                    />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="font-medium text-black">
                                        {selectedCard.last4 ? `•••• ${selectedCard.last4}` : selectedCard.brand}
                                    </Text>
                                    {selectedCard.brand && selectedCard.last4 && (
                                        <Text className="text-sm text-neutral-500">
                                            {selectedCard.brand}
                                        </Text>
                                    )}
                                </View>
                            </>
                        ) : (
                            <>
                                <View className="w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center">
                                    <MaterialIcons name="add" size={20} color="#000" />
                                </View>
                                <Text className="flex-1 ml-3 text-neutral-500">
                                    Adicionar método de pagamento
                                </Text>
                            </>
                        )}
                        <MaterialIcons name="chevron-right" size={24} color="#A3A3A3" />
                    </Pressable>

                    {/* Cupom */}
                    <Pressable
                        onPress={() => Alert.alert('Em breve', 'Funcionalidade de cupom em desenvolvimento')}
                        className="flex-row items-center gap-2 mt-3"
                        disabled={loading}
                    >
                        <MaterialIcons name="local-offer" size={18} color="#737373" />
                        <Text className="text-sm text-neutral-600">Adicionar cupom</Text>
                    </Pressable>
                </View>

                {/* Resumo de Valores */}
                <View className="mb-6">
                    <Text className="text-sm font-medium text-neutral-500 mb-3">
                        Resumo
                    </Text>
                    <View className="bg-white border border-neutral-200 rounded-2xl p-4">
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-sm text-neutral-600">
                                {duration}h de quadra
                            </Text>
                            <Text className="text-sm text-black">
                                R$ {subtotal.toFixed(2)}
                            </Text>
                        </View>
                        <View className="flex-row justify-between mb-2">
                            <Text className="text-sm text-neutral-600">Taxa de serviço</Text>
                            <Text className="text-sm text-black">
                                R$ {serviceFee.toFixed(2)}
                            </Text>
                        </View>
                        {discount > 0 && (
                            <View className="flex-row justify-between mb-2">
                                <Text className="text-sm text-green-600">Desconto</Text>
                                <Text className="text-sm text-green-600">
                                    - R$ {discount.toFixed(2)}
                                </Text>
                            </View>
                        )}
                        <View className="h-px bg-neutral-100 my-2" />
                        <View className="flex-row justify-between">
                            <Text className="text-base font-bold text-black">Total</Text>
                            <Text className="text-base font-bold text-black">
                                R$ {total.toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Política */}
                <View className="mb-8">
                    <Text className="text-sm font-medium text-neutral-500 mb-2">
                        Política de cancelamento
                    </Text>
                    <Text className="text-sm text-neutral-600 leading-5">
                        Cancelamento grátis até 24h antes da reserva. Após esse período, será cobrada uma taxa de 50%.
                    </Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="bg-white border-t border-neutral-100 px-5 py-4 pb-8">
                {loading && loadingMessage ? (
                    <View className="flex-row items-center justify-center py-4">
                        <ActivityIndicator size="small" color="#000" />
                        <Text className="ml-3 text-neutral-600">{loadingMessage}</Text>
                    </View>
                ) : (
                    <Pressable
                        onPress={handleConfirm}
                        disabled={loading || !selectedCard}
                        className={`w-full py-4 rounded-2xl items-center justify-center ${
                            loading || !selectedCard ? 'bg-neutral-300' : 'bg-black'
                        }`}
                    >
                        <Text className="text-white font-bold text-base">
                            {loading ? 'Processando...' : `Confirmar e Pagar R$ ${total.toFixed(2)}`}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
