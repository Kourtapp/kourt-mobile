import { View, Text } from 'react-native';
import { ArrowDownLeft, ArrowUpRight, RotateCcw } from 'lucide-react-native';
import { Transaction } from '../../services/hostDashboardService';

interface TransactionItemProps {
    transaction: Transaction;
}

const typeConfig: Record<Transaction['type'], { icon: any; color: string; bg: string; label: string }> = {
    booking: { icon: ArrowDownLeft, color: '#22C55E', bg: '#DCFCE7', label: 'Reserva' },
    payout: { icon: ArrowUpRight, color: '#3B82F6', bg: '#DBEAFE', label: 'Saque' },
    refund: { icon: RotateCcw, color: '#EF4444', bg: '#FEE2E2', label: 'Reembolso' },
};

export function TransactionItem({ transaction }: TransactionItemProps) {
    const config = typeConfig[transaction.type];
    const Icon = config.icon;

    const formatCurrency = (value: number) => {
        const absValue = Math.abs(value);
        const prefix = value >= 0 ? '+' : '-';
        return `${prefix} R$ ${absValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
        });
    };

    return (
        <View className="flex-row items-center py-3 border-b border-gray-50 last:border-0">
            {/* Icon */}
            <View
                className="w-10 h-10 rounded-full items-center justify-center mr-3"
                style={{ backgroundColor: config.bg }}
            >
                <Icon size={18} color={config.color} />
            </View>

            {/* Info */}
            <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-800">
                    {config.label}
                </Text>
                {transaction.courtName && (
                    <Text className="text-xs text-gray-500" numberOfLines={1}>
                        {transaction.courtName}
                    </Text>
                )}
            </View>

            {/* Amount & Date */}
            <View className="items-end">
                <Text
                    className={`text-sm font-bold ${
                        transaction.amount >= 0 ? 'text-green-600' : 'text-gray-700'
                    }`}
                >
                    {formatCurrency(transaction.amount)}
                </Text>
                <Text className="text-xs text-gray-400 mt-0.5">
                    {formatDate(transaction.date)}
                </Text>
            </View>
        </View>
    );
}
