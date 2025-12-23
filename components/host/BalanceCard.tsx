import { View, Text, TouchableOpacity } from 'react-native';
import { Wallet, Clock, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface BalanceCardProps {
    availableBalance: number;
    pendingBalance: number;
    nextPayoutDate?: string | null;
    onWithdraw?: () => void;
    delay?: number;
}

export function BalanceCard({
    availableBalance,
    pendingBalance,
    nextPayoutDate,
    onWithdraw,
    delay = 0,
}: BalanceCardProps) {
    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
            }}
        >
            {/* Available Balance */}
            <View className="p-5 bg-gradient-to-br from-green-50 to-white">
                <View className="flex-row items-center mb-2">
                    <View className="w-8 h-8 rounded-full bg-green-100 items-center justify-center mr-2">
                        <Wallet size={16} color="#22C55E" />
                    </View>
                    <Text className="text-sm font-medium text-gray-600">
                        Saldo Disponível
                    </Text>
                </View>
                <Text className="text-3xl font-bold text-gray-900">
                    {formatCurrency(availableBalance)}
                </Text>

                {/* Withdraw Button */}
                {availableBalance > 0 && (
                    <TouchableOpacity
                        onPress={onWithdraw}
                        className="mt-4 bg-green-500 rounded-xl py-3 flex-row items-center justify-center"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-semibold text-base">
                            Sacar
                        </Text>
                        <ArrowRight size={18} color="white" className="ml-2" />
                    </TouchableOpacity>
                )}
            </View>

            {/* Pending & Next Payout */}
            <View className="flex-row border-t border-gray-100">
                {/* Pending Balance */}
                <View className="flex-1 p-4 border-r border-gray-100">
                    <View className="flex-row items-center mb-1">
                        <Clock size={14} color="#9CA3AF" />
                        <Text className="text-xs text-gray-500 ml-1">Pendente</Text>
                    </View>
                    <Text className="text-lg font-bold text-gray-800">
                        {formatCurrency(pendingBalance)}
                    </Text>
                </View>

                {/* Next Payout */}
                <View className="flex-1 p-4">
                    <Text className="text-xs text-gray-500 mb-1">Próx. Pagamento</Text>
                    <Text className="text-lg font-bold text-gray-800">
                        {nextPayoutDate ? formatDate(nextPayoutDate) : '-'}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
}
