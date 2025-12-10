import { View, Text, Pressable, Alert, Image, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format, addHours } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useBookingStore } from '@/stores/useBookingStore';
import { usePaymentStore } from '@/stores/usePaymentStore';
import { createBooking, processPayment } from '@/services/bookings';

export default function CheckoutScreen() {
    const { court, date, time, duration } = useBookingStore();
    const { selectedCard } = usePaymentStore();

    const [loading, setLoading] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [discount, setDiscount] = useState(0);

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

        setLoading(true);

        try {
            // 1. Criar reserva (Mocked for now as we don't have real user ID easily accessible without auth check)
            // const booking = await createBooking({
            //   court_id: court.id,
            //   date: format(date, 'yyyy-MM-dd'),
            //   start_time: time,
            //   duration_hours: duration,
            //   total_price: total,
            //   user_id: 'mock-user-id', // Needs real user
            // });

            // 2. Processar pagamento
            const payment = await processPayment({
                booking_id: 'mock-booking-id',
                amount: total,
                payment_method_id: selectedCard.id,
            });

            if (payment.status === 'succeeded') {
                // 3. Redirecionar para confirmação
                router.replace({
                    pathname: '/booking/confirmed',
                    params: { bookingId: 'mock-booking-id' },
                });
            } else {
                Alert.alert('Erro', 'Falha no pagamento. Tente novamente.');
            }
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Ocorreu um erro');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#fafafa]">
            {/* Header */}
            <View className="bg-white px-5 pt-14 pb-4 flex-row items-center gap-4 border-b border-neutral-100">
                <Pressable onPress={() => router.back()}>
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
                        className="bg-white border border-neutral-200 rounded-2xl p-4 flex-row items-center"
                    >
                        {selectedCard ? (
                            <>
                                <View className="w-10 h-10 bg-neutral-100 rounded-lg items-center justify-center">
                                    <MaterialIcons name="credit-card" size={20} color="#000" />
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="font-medium text-black">
                                        •••• {selectedCard.last4}
                                    </Text>
                                    <Text className="text-sm text-neutral-500">
                                        {selectedCard.brand}
                                    </Text>
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
                <Pressable
                    onPress={handleConfirm}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl items-center justify-center ${loading ? 'bg-neutral-300' : 'bg-black'
                        }`}
                >
                    <Text className="text-white font-bold text-base">
                        {loading ? 'Processando...' : `Confirmar e Pagar R$ ${total.toFixed(2)}`}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
