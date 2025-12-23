import { View, Text, Pressable, Image, Alert, ActivityIndicator } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect, useRef } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { supabase } from '@/lib/supabase';

export default function PixPaymentScreen() {
    const params = useLocalSearchParams<{
        bookingId: string;
        pixQrCode: string;
        pixQrCodeBase64: string;
        expiresAt: string;
        paymentIntentId: string;
        amount: string;
    }>();

    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [status, setStatus] = useState<'pending' | 'succeeded' | 'expired'>('pending');
    const [copied, setCopied] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const subscriptionRef = useRef<any>(null);

    useEffect(() => {
        // Calculate time left
        if (params.expiresAt) {
            const expiresAt = new Date(params.expiresAt).getTime();
            const updateTimer = () => {
                const now = Date.now();
                const diff = Math.max(0, Math.floor((expiresAt - now) / 1000));
                setTimeLeft(diff);

                if (diff <= 0) {
                    setStatus('expired');
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                }
            };

            updateTimer();
            intervalRef.current = setInterval(updateTimer, 1000);
        }

        // Subscribe to booking updates for payment confirmation
        if (params.bookingId) {
            subscriptionRef.current = supabase
                .channel(`booking-${params.bookingId}`)
                .on(
                    'postgres_changes',
                    {
                        event: 'UPDATE',
                        schema: 'public',
                        table: 'bookings',
                        filter: `id=eq.${params.bookingId}`,
                    },
                    (payload) => {
                        if (payload.new.payment_status === 'succeeded') {
                            setStatus('succeeded');
                            // Navigate to confirmation
                            setTimeout(() => {
                                router.replace({
                                    pathname: '/booking/confirmed',
                                    params: { bookingId: params.bookingId },
                                });
                            }, 1500);
                        }
                    }
                )
                .subscribe();
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
            if (subscriptionRef.current) {
                supabase.removeChannel(subscriptionRef.current);
            }
        };
    }, [params.expiresAt, params.bookingId]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCopyCode = async () => {
        if (params.pixQrCode) {
            await Clipboard.setStringAsync(params.pixQrCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleCancel = () => {
        Alert.alert(
            'Cancelar pagamento?',
            'Se você sair, sua reserva será cancelada.',
            [
                { text: 'Continuar pagando', style: 'cancel' },
                {
                    text: 'Cancelar',
                    style: 'destructive',
                    onPress: () => router.replace('/'),
                },
            ]
        );
    };

    if (status === 'succeeded') {
        return (
            <View className="flex-1 bg-white items-center justify-center">
                <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
                    <MaterialIcons name="check" size={48} color="#22c55e" />
                </View>
                <Text className="text-xl font-bold text-black mb-2">Pagamento confirmado!</Text>
                <Text className="text-neutral-500">Redirecionando...</Text>
            </View>
        );
    }

    if (status === 'expired') {
        return (
            <View className="flex-1 bg-white items-center justify-center px-6">
                <View className="w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4">
                    <MaterialIcons name="schedule" size={48} color="#ef4444" />
                </View>
                <Text className="text-xl font-bold text-black mb-2">PIX expirado</Text>
                <Text className="text-neutral-500 text-center mb-6">
                    O tempo para pagamento expirou. Por favor, tente novamente.
                </Text>
                <Pressable
                    onPress={() => router.replace('/')}
                    className="bg-black px-8 py-4 rounded-2xl"
                >
                    <Text className="text-white font-bold">Voltar ao início</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-14 pb-4 flex-row items-center gap-4 border-b border-neutral-100">
                <Pressable onPress={handleCancel}>
                    <MaterialIcons name="close" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-bold text-black">Pagar com PIX</Text>
            </View>

            <View className="flex-1 items-center justify-center px-6">
                {/* Timer */}
                <View className="flex-row items-center gap-2 mb-6">
                    <MaterialIcons name="schedule" size={20} color="#737373" />
                    <Text className="text-neutral-600">
                        Expira em{' '}
                        <Text className={`font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-black'}`}>
                            {formatTime(timeLeft)}
                        </Text>
                    </Text>
                </View>

                {/* QR Code */}
                <View className="bg-white border-2 border-neutral-200 rounded-3xl p-6 mb-6">
                    {params.pixQrCodeBase64 ? (
                        <Image
                            source={{ uri: params.pixQrCodeBase64 }}
                            className="w-64 h-64"
                            resizeMode="contain"
                        />
                    ) : (
                        <View className="w-64 h-64 items-center justify-center">
                            <ActivityIndicator size="large" color="#000" />
                        </View>
                    )}
                </View>

                {/* Amount */}
                <Text className="text-3xl font-bold text-black mb-2">
                    R$ {parseFloat(params.amount || '0').toFixed(2)}
                </Text>
                <Text className="text-neutral-500 mb-6">Escaneie o QR code no app do seu banco</Text>

                {/* Copy Code Button */}
                <Pressable
                    onPress={handleCopyCode}
                    className="flex-row items-center gap-2 bg-neutral-100 px-6 py-3 rounded-full"
                >
                    <MaterialIcons
                        name={copied ? 'check' : 'content-copy'}
                        size={20}
                        color="#000"
                    />
                    <Text className="font-medium text-black">
                        {copied ? 'Código copiado!' : 'Copiar código PIX'}
                    </Text>
                </Pressable>

                {/* Instructions */}
                <View className="mt-8 px-4">
                    <Text className="text-sm text-neutral-500 text-center leading-5">
                        1. Abra o app do seu banco{'\n'}
                        2. Escolha pagar com PIX{'\n'}
                        3. Escaneie o QR code ou cole o código{'\n'}
                        4. Confirme o pagamento
                    </Text>
                </View>
            </View>

            {/* Footer */}
            <View className="px-5 py-4 pb-8 border-t border-neutral-100">
                <View className="flex-row items-center justify-center gap-2">
                    <ActivityIndicator size="small" color="#737373" />
                    <Text className="text-neutral-500">Aguardando confirmação do pagamento...</Text>
                </View>
            </View>
        </View>
    );
}
