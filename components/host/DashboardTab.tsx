import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { ChevronRight, DollarSign, Calendar, Percent, Wallet } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { StatCard } from './StatCard';
import { HealthScoreCard } from './HealthScoreCard';
import { BookingCard } from './BookingCard';
import { SmartInsightsCard } from './SmartInsightsCard';
import {
    DashboardStats,
    HealthScore,
    BookingWithDetails,
    RevenueTrendPoint,
    SmartInsight,
} from '../../services/hostDashboardService';

interface DashboardTabProps {
    stats: DashboardStats | null;
    healthScore: HealthScore | null;
    upcomingBookings: BookingWithDetails[];
    revenueTrend: RevenueTrendPoint[];
    insights: SmartInsight[];
    onViewAllBookings: () => void;
    onViewFinanceiro: () => void;
    onBookingPress?: (booking: BookingWithDetails) => void;
    refreshing: boolean;
    onRefresh: () => void;
}

export function DashboardTab({
    stats,
    healthScore,
    upcomingBookings,
    revenueTrend,
    insights,
    onViewAllBookings,
    onViewFinanceiro,
    onBookingPress,
    refreshing,
    onRefresh,
}: DashboardTabProps) {
    const formatCurrency = (value: number) => {
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}k`;
        }
        return value.toFixed(0);
    };

    return (
        <ScrollView
            className="flex-1"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View className="px-4 py-4">
                {/* Health Score Card */}
                {healthScore && (
                    <View className="mb-5">
                        <HealthScoreCard score={healthScore} delay={0} />
                    </View>
                )}

                {/* Quick Stats Grid */}
                {stats && (
                    <View className="mb-5">
                        <View className="flex-row mb-3">
                            <View className="flex-1 mr-2">
                                <StatCard
                                    title="Receita do mês"
                                    value={formatCurrency(stats.monthRevenue)}
                                    prefix="R$ "
                                    change={stats.monthRevenueChange}
                                    icon={<DollarSign size={16} color="#22C55E" />}
                                    delay={100}
                                />
                            </View>
                            <View className="flex-1 ml-2">
                                <StatCard
                                    title="Reservas"
                                    value={stats.monthBookings}
                                    change={stats.monthBookingsChange}
                                    icon={<Calendar size={16} color="#3B82F6" />}
                                    delay={150}
                                />
                            </View>
                        </View>
                        <View className="flex-row">
                            <View className="flex-1 mr-2">
                                <StatCard
                                    title="Ocupação"
                                    value={stats.occupancyRate.toFixed(0)}
                                    suffix="%"
                                    icon={<Percent size={16} color="#8B5CF6" />}
                                    delay={200}
                                />
                            </View>
                            <View className="flex-1 ml-2">
                                <StatCard
                                    title="Saldo disponível"
                                    value={formatCurrency(stats.availableBalance)}
                                    prefix="R$ "
                                    icon={<Wallet size={16} color="#F59E0B" />}
                                    delay={250}
                                />
                            </View>
                        </View>
                    </View>
                )}

                {/* Upcoming Bookings */}
                <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-5">
                    <View className="flex-row items-center justify-between mb-3">
                        <Text className="text-base font-bold text-gray-800">
                            Próximas Reservas
                        </Text>
                        <TouchableOpacity
                            onPress={onViewAllBookings}
                            className="flex-row items-center"
                        >
                            <Text className="text-sm font-medium text-green-600 mr-1">
                                Ver todas
                            </Text>
                            <ChevronRight size={16} color="#22C55E" />
                        </TouchableOpacity>
                    </View>

                    {upcomingBookings.length === 0 ? (
                        <View className="bg-gray-50 rounded-2xl p-6 items-center">
                            <Calendar size={32} color="#9CA3AF" />
                            <Text className="text-sm text-gray-500 mt-2 text-center">
                                Nenhuma reserva nos próximos dias
                            </Text>
                        </View>
                    ) : (
                        upcomingBookings.slice(0, 3).map((booking, index) => (
                            <BookingCard
                                key={booking.id}
                                booking={booking}
                                onPress={() => onBookingPress?.(booking)}
                                delay={350 + index * 50}
                            />
                        ))
                    )}
                </Animated.View>

                {/* Smart Insights */}
                {insights.length > 0 && (
                    <View className="mb-5">
                        <SmartInsightsCard insights={insights} delay={450} />
                    </View>
                )}

                {/* Quick Actions */}
                <Animated.View entering={FadeInDown.delay(500).duration(400)}>
                    <Text className="text-base font-bold text-gray-800 mb-3">
                        Ações Rápidas
                    </Text>
                    <View className="flex-row">
                        <TouchableOpacity
                            onPress={onViewFinanceiro}
                            className="flex-1 bg-green-50 rounded-xl p-4 mr-2 flex-row items-center"
                        >
                            <View className="w-10 h-10 rounded-full bg-green-100 items-center justify-center mr-3">
                                <Wallet size={20} color="#22C55E" />
                            </View>
                            <View className="flex-1">
                                <Text className="text-sm font-semibold text-gray-800">
                                    Sacar saldo
                                </Text>
                                <Text className="text-xs text-gray-500">
                                    R$ {stats?.availableBalance?.toLocaleString('pt-BR') || '0'}
                                </Text>
                            </View>
                            <ChevronRight size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        </ScrollView>
    );
}
