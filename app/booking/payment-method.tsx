import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Platform, Alert } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { usePaymentStore } from '@/stores/usePaymentStore';

// Use wrapper that handles Simulator gracefully
import { usePlatformPay } from '@/lib/stripeHooks';

type PaymentMethodType = 'apple_pay' | 'google_pay' | 'pix' | 'credit_card' | 'debit_card' | 'saved_card';

export default function PaymentMethodScreen() {
    const { cards, selectedCard, setSelectedCard } = usePaymentStore();
    const { isPlatformPaySupported } = usePlatformPay();
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(
        selectedCard ? 'saved_card' : null
    );
    const [platformPayAvailable, setPlatformPayAvailable] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const isSupported = await isPlatformPaySupported();
                setPlatformPayAvailable(isSupported);
            } catch {
                setPlatformPayAvailable(false);
            }
        })();
    }, [isPlatformPaySupported]);

    const isApple = Platform.OS === 'ios';

    const handleSelectMethod = (method: PaymentMethodType, card?: any) => {
        setSelectedMethod(method);

        if (method === 'saved_card' && card) {
            setSelectedCard(card);
        } else if (method === 'apple_pay' || method === 'google_pay') {
            setSelectedCard({ id: method, brand: method === 'apple_pay' ? 'Apple Pay' : 'Google Pay', last4: '' });
        } else if (method === 'pix') {
            setSelectedCard({ id: 'pix', brand: 'PIX', last4: '' });
        } else if (method === 'credit_card') {
            // New credit card - Stripe PaymentSheet will handle input
            setSelectedCard({ id: 'new_card', brand: 'Cartão de Crédito', last4: '' });
        } else if (method === 'debit_card') {
            // New debit card - Stripe PaymentSheet will handle input
            setSelectedCard({ id: 'new_card', brand: 'Cartão de Débito', last4: '' });
        } else {
            setSelectedCard(null);
        }
    };

    const handleConfirm = () => {
        if (!selectedMethod) {
            Alert.alert('Atenção', 'Selecione um método de pagamento');
            return;
        }

        // All methods now go back to checkout - the checkout handles the actual payment
        // via Stripe PaymentSheet (for cards) or PIX flow
        router.back();
    };

    const PaymentOption = ({
        icon,
        iconColor = '#000',
        title,
        subtitle,
        method,
        card,
        disabled = false,
    }: {
        icon: string;
        iconColor?: string;
        title: string;
        subtitle?: string;
        method: PaymentMethodType;
        card?: any;
        disabled?: boolean;
    }) => {
        const isSelected = selectedMethod === method &&
            (method !== 'saved_card' || selectedCard?.id === card?.id);

        return (
            <Pressable
                onPress={() => !disabled && handleSelectMethod(method, card)}
                disabled={disabled}
                className={`flex-row items-center p-4 rounded-2xl border mb-3 ${
                    isSelected ? 'border-black bg-neutral-50' : 'border-neutral-200 bg-white'
                } ${disabled ? 'opacity-50' : ''}`}
            >
                <View className={`w-12 h-12 rounded-xl items-center justify-center ${
                    isSelected ? 'bg-black' : 'bg-neutral-100'
                }`}>
                    <MaterialIcons name={icon as any} size={24} color={isSelected ? '#fff' : iconColor} />
                </View>
                <View className="flex-1 ml-4">
                    <Text className={`font-semibold text-base ${isSelected ? 'text-black' : 'text-neutral-800'}`}>
                        {title}
                    </Text>
                    {subtitle && (
                        <Text className="text-neutral-500 text-sm mt-0.5">{subtitle}</Text>
                    )}
                </View>
                {isSelected ? (
                    <View className="w-6 h-6 rounded-full bg-black items-center justify-center">
                        <MaterialIcons name="check" size={16} color="#fff" />
                    </View>
                ) : (
                    <View className="w-6 h-6 rounded-full border-2 border-neutral-300" />
                )}
            </Pressable>
        );
    };

    return (
        <View className="flex-1 bg-[#fafafa]">
            {/* Header */}
            <View className="bg-white px-5 pt-14 pb-4 flex-row items-center gap-4 border-b border-neutral-100">
                <Pressable onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-bold text-black">Forma de Pagamento</Text>
            </View>

            <ScrollView className="flex-1" contentContainerStyle={{ padding: 20 }}>
                {/* Carteiras Digitais */}
                {platformPayAvailable && (
                    <View className="mb-6">
                        <Text className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wide">
                            Carteiras Digitais
                        </Text>

                        {isApple ? (
                            <PaymentOption
                                icon="apple"
                                iconColor="#000"
                                title="Apple Pay"
                                subtitle="Pague com seu iPhone"
                                method="apple_pay"
                            />
                        ) : (
                            <PaymentOption
                                icon="account-balance-wallet"
                                iconColor="#4285F4"
                                title="Google Pay"
                                subtitle="Pague com sua conta Google"
                                method="google_pay"
                            />
                        )}
                    </View>
                )}

                {/* PIX */}
                <View className="mb-6">
                    <Text className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wide">
                        Transferência Instantânea
                    </Text>
                    <PaymentOption
                        icon="qr-code-2"
                        iconColor="#32BCAD"
                        title="PIX"
                        subtitle="Aprovação instantânea · Sem taxas"
                        method="pix"
                    />
                </View>

                {/* Cartões Salvos */}
                {cards && cards.length > 0 && (
                    <View className="mb-6">
                        <Text className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wide">
                            Cartões Salvos
                        </Text>
                        {cards.map((card) => (
                            <PaymentOption
                                key={card.id}
                                icon="credit-card"
                                title={`•••• ${card.last4}`}
                                subtitle={`${card.brand} · Expira ${card.expiry}`}
                                method="saved_card"
                                card={card}
                            />
                        ))}
                    </View>
                )}

                {/* Adicionar Cartão */}
                <View className="mb-6">
                    <Text className="text-xs font-medium text-neutral-500 mb-3 uppercase tracking-wide">
                        Cartão
                    </Text>

                    <PaymentOption
                        icon="credit-card"
                        title="Cartão de Crédito"
                        subtitle="Visa, Mastercard, Elo, Amex"
                        method="credit_card"
                    />

                    <PaymentOption
                        icon="credit-card"
                        title="Cartão de Débito"
                        subtitle="Débito à vista"
                        method="debit_card"
                    />
                </View>

                {/* Info de Segurança */}
                <View className="bg-neutral-100 rounded-xl p-4 mb-8">
                    <Text className="text-sm text-neutral-600 text-center">
                        🔒 Seus dados de pagamento são criptografados e processados com segurança pelo Stripe
                    </Text>
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="bg-white border-t border-neutral-100 px-5 py-4 pb-8">
                <Pressable
                    onPress={handleConfirm}
                    disabled={!selectedMethod}
                    className={`w-full py-4 rounded-2xl items-center justify-center ${
                        selectedMethod ? 'bg-black' : 'bg-neutral-300'
                    }`}
                >
                    <Text className="text-white font-bold text-base">
                        {selectedMethod === 'credit_card' || selectedMethod === 'debit_card'
                            ? 'Continuar'
                            : 'Confirmar'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );
}
