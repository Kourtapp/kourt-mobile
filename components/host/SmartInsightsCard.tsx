import { View, Text, TouchableOpacity } from 'react-native';
import { Lightbulb, DollarSign, Tag, AlertTriangle, ChevronRight } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SmartInsight } from '../../services/hostDashboardService';

interface SmartInsightsCardProps {
    insights: SmartInsight[];
    delay?: number;
}

const typeConfig: Record<SmartInsight['type'], { icon: any; color: string; bg: string }> = {
    pricing: { icon: DollarSign, color: '#22C55E', bg: '#DCFCE7' },
    promotion: { icon: Tag, color: '#8B5CF6', bg: '#EDE9FE' },
    warning: { icon: AlertTriangle, color: '#F59E0B', bg: '#FEF3C7' },
    tip: { icon: Lightbulb, color: '#3B82F6', bg: '#DBEAFE' },
};

export function SmartInsightsCard({ insights, delay = 0 }: SmartInsightsCardProps) {
    if (insights.length === 0) return null;

    return (
        <Animated.View
            entering={FadeInDown.delay(delay).duration(400)}
            className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
            }}
        >
            {/* Header */}
            <View className="flex-row items-center px-4 py-3 border-b border-gray-50">
                <Lightbulb size={18} color="#F59E0B" />
                <Text className="text-sm font-bold text-gray-700 ml-2">
                    Insights Inteligentes
                </Text>
            </View>

            {/* Insights List */}
            <View className="p-2">
                {insights.map((insight, index) => {
                    const config = typeConfig[insight.type];
                    const Icon = config.icon;

                    return (
                        <TouchableOpacity
                            key={insight.id}
                            activeOpacity={insight.actionLabel ? 0.7 : 1}
                            className="flex-row items-start p-3 rounded-xl mb-1 last:mb-0"
                            style={{ backgroundColor: index === 0 ? config.bg + '40' : 'transparent' }}
                        >
                            <View
                                className="w-8 h-8 rounded-full items-center justify-center mr-3 mt-0.5"
                                style={{ backgroundColor: config.bg }}
                            >
                                <Icon size={16} color={config.color} />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-800">
                                    {insight.title}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-0.5 leading-4">
                                    {insight.description}
                                </Text>
                                {insight.actionLabel && (
                                    <View className="flex-row items-center mt-2">
                                        <Text
                                            className="text-xs font-semibold"
                                            style={{ color: config.color }}
                                        >
                                            {insight.actionLabel}
                                        </Text>
                                        <ChevronRight size={14} color={config.color} />
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </Animated.View>
    );
}
