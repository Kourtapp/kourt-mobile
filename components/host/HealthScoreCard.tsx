import { View, Text } from 'react-native';
import { Trophy, TrendingUp, Star, BarChart3 } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { HealthScore } from '../../services/hostDashboardService';

interface HealthScoreCardProps {
    score: HealthScore;
    delay?: number;
}

const levelConfig: Record<HealthScore['level'], { color: string; bg: string }> = {
    'Excelente': { color: '#22C55E', bg: '#DCFCE7' },
    'Bom': { color: '#3B82F6', bg: '#DBEAFE' },
    'Regular': { color: '#F59E0B', bg: '#FEF3C7' },
    'Precisa Melhorar': { color: '#EF4444', bg: '#FEE2E2' },
};

export function HealthScoreCard({ score, delay = 0 }: HealthScoreCardProps) {
    const config = levelConfig[score.level];

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(500)}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
            }}
        >
            {/* Main Score */}
            <View className="p-5 items-center">
                <View className="flex-row items-center mb-3">
                    <Trophy size={20} color={config.color} />
                    <Text className="text-sm font-semibold text-gray-600 ml-2">
                        Score da Quadra
                    </Text>
                </View>

                {/* Score Circle */}
                <View
                    className="w-28 h-28 rounded-full items-center justify-center mb-3"
                    style={{ backgroundColor: config.bg }}
                >
                    <Text
                        className="text-4xl font-black"
                        style={{ color: config.color }}
                    >
                        {score.score}
                    </Text>
                    <Text className="text-sm font-medium text-gray-500">/100</Text>
                </View>

                {/* Level Badge */}
                <View
                    className="px-4 py-1.5 rounded-full"
                    style={{ backgroundColor: config.bg }}
                >
                    <Text
                        className="text-sm font-bold"
                        style={{ color: config.color }}
                    >
                        {score.level}
                    </Text>
                </View>
            </View>

            {/* Breakdown Stats */}
            <View className="flex-row border-t border-gray-100 bg-gray-50/50">
                {/* Occupancy */}
                <View className="flex-1 p-4 items-center border-r border-gray-100">
                    <BarChart3 size={18} color="#6B7280" />
                    <Text className="text-xl font-bold text-gray-800 mt-1">
                        {score.occupancy.toFixed(0)}%
                    </Text>
                    <Text className="text-xs text-gray-500">Ocupação</Text>
                </View>

                {/* Rating */}
                <View className="flex-1 p-4 items-center border-r border-gray-100">
                    <Star size={18} color="#F59E0B" fill="#F59E0B" />
                    <Text className="text-xl font-bold text-gray-800 mt-1">
                        {score.rating.toFixed(1)}
                    </Text>
                    <Text className="text-xs text-gray-500">Avaliação</Text>
                </View>

                {/* Revenue Change */}
                <View className="flex-1 p-4 items-center">
                    <TrendingUp
                        size={18}
                        color={score.revenueChange >= 0 ? '#22C55E' : '#EF4444'}
                    />
                    <Text
                        className={`text-xl font-bold mt-1 ${
                            score.revenueChange >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}
                    >
                        {score.revenueChange >= 0 ? '+' : ''}
                        {score.revenueChange.toFixed(0)}%
                    </Text>
                    <Text className="text-xs text-gray-500">Receita</Text>
                </View>
            </View>
        </Animated.View>
    );
}
