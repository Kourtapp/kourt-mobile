import { View, Text, Dimensions } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { RevenueByPeriod } from '../../services/hostDashboardService';

interface RevenueChartProps {
    data: RevenueByPeriod[];
    delay?: number;
}

export function RevenueChart({ data, delay = 0 }: RevenueChartProps) {
    const maxRevenue = Math.max(...data.map(d => d.revenue), 1);
    const chartWidth = Dimensions.get('window').width - 64; // padding
    const barWidth = (chartWidth / data.length) - 8;

    const formatCurrency = (value: number) => {
        if (value >= 1000) {
            return `R$ ${(value / 1000).toFixed(1)}k`;
        }
        return `R$ ${value.toFixed(0)}`;
    };

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            className="bg-white rounded-2xl border border-gray-100 p-4"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
            }}
        >
            {/* Header */}
            <View className="flex-row items-center justify-between mb-4">
                <Text className="text-sm font-bold text-gray-700">
                    Receita Mensal
                </Text>
                <Text className="text-xs text-gray-400">
                    Últimos {data.length} meses
                </Text>
            </View>

            {/* Chart */}
            <View className="h-40 flex-row items-end justify-between">
                {data.map((item, index) => {
                    const height = (item.revenue / maxRevenue) * 120;
                    const isHighest = item.revenue === maxRevenue;
                    const isLatest = index === data.length - 1;

                    return (
                        <View
                            key={item.period}
                            className="items-center"
                            style={{ width: barWidth }}
                        >
                            {/* Value Label */}
                            <Text
                                className={`text-xs font-semibold mb-1 ${
                                    isHighest || isLatest ? 'text-green-600' : 'text-gray-400'
                                }`}
                            >
                                {formatCurrency(item.revenue)}
                            </Text>

                            {/* Bar */}
                            <View
                                className={`w-full rounded-t-lg ${
                                    isLatest ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                                style={{ height: Math.max(height, 4) }}
                            />

                            {/* Period Label */}
                            <Text className="text-xs text-gray-500 mt-2 capitalize">
                                {item.period}
                            </Text>

                            {/* Change indicator */}
                            {item.change !== 0 && (
                                <Text
                                    className={`text-[10px] font-medium ${
                                        item.change >= 0 ? 'text-green-500' : 'text-red-500'
                                    }`}
                                >
                                    {item.change >= 0 ? '+' : ''}{item.change.toFixed(0)}%
                                </Text>
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Legend */}
            <View className="flex-row items-center justify-center mt-4 pt-3 border-t border-gray-50">
                <View className="flex-row items-center mr-4">
                    <View className="w-3 h-3 rounded bg-green-500 mr-1.5" />
                    <Text className="text-xs text-gray-500">Mês atual</Text>
                </View>
                <View className="flex-row items-center">
                    <View className="w-3 h-3 rounded bg-gray-200 mr-1.5" />
                    <Text className="text-xs text-gray-500">Meses anteriores</Text>
                </View>
            </View>
        </Animated.View>
    );
}
