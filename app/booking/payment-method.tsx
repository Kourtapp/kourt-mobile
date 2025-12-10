import { View, Text, Pressable, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

import { usePaymentStore } from '@/stores/usePaymentStore';

export default function PaymentMethodScreen() {
    const { cards, selectedCard, setSelectedCard } = usePaymentStore();

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
                <Text className="text-sm font-medium text-neutral-500 mb-3">
                    Seus cartões
                </Text>

                {cards.map((card) => (
                    <Pressable
                        key={card.id}
                        onPress={() => {
                            setSelectedCard(card);
                            router.back();
                        }}
                        className={`bg-white border rounded-2xl p-4 flex-row items-center mb-3 ${selectedCard?.id === card.id
                                ? 'border-black'
                                : 'border-neutral-200'
                            }`}
                    >
                        <View className="w-12 h-8 bg-neutral-100 rounded items-center justify-center">
                            <MaterialIcons name="credit-card" size={20} color="#000" />
                        </View>

                        <View className="flex-1 ml-3">
                            <Text className="font-medium text-black">
                                {card.brand} •••• {card.last4}
                            </Text>
                            <Text className="text-xs text-neutral-500">
                                Expira em {card.expiry}
                            </Text>
                        </View>

                        {selectedCard?.id === card.id && (
                            <MaterialIcons name="check-circle" size={24} color="#000" />
                        )}
                    </Pressable>
                ))}

                <Pressable
                    className="flex-row items-center justify-center gap-2 py-4 mt-2 border border-dashed border-neutral-300 rounded-2xl"
                >
                    <MaterialIcons name="add" size={20} color="#000" />
                    <Text className="font-medium text-black">Adicionar novo cartão</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}
