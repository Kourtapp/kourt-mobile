import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    prefix?: string;
    suffix?: string;
    icon?: React.ReactNode;
    delay?: number;
}

export function StatCard({
    title,
    value,
    change,
    prefix = '',
    suffix = '',
    icon,
    delay = 0,
}: StatCardProps) {
    const isPositive = (change || 0) >= 0;
    const formattedValue = typeof value === 'number'
        ? value.toLocaleString('pt-BR')
        : value;

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            className="flex-1 bg-white rounded-2xl p-4 border border-gray-100"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
            }}
        >
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    {title}
                </Text>
                {icon && <View className="opacity-60">{icon}</View>}
            </View>

            <Text className="text-2xl font-bold text-gray-900">
                {prefix}{formattedValue}{suffix}
            </Text>

            {change !== undefined && (
                <View className="flex-row items-center mt-2">
                    {isPositive ? (
                        <TrendingUp size={14} color="#22C55E" />
                    ) : (
                        <TrendingDown size={14} color="#EF4444" />
                    )}
                    <Text
                        className={`text-xs font-semibold ml-1 ${
                            isPositive ? 'text-green-500' : 'text-red-500'
                        }`}
                    >
                        {isPositive ? '+' : ''}{change.toFixed(1)}%
                    </Text>
                    <Text className="text-xs text-gray-400 ml-1">vs mês anterior</Text>
                </View>
            )}
        </Animated.View>
    );
}
