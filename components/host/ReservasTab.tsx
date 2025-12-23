import { View, Text, ScrollView, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { Calendar } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookingCard } from './BookingCard';
import { BookingWithDetails, BookingStats } from '../../services/hostDashboardService';

type FilterType = 'all' | 'today' | 'upcoming' | 'history';

interface ReservasTabProps {
    bookings: BookingWithDetails[];
    stats: BookingStats | null;
    filter: FilterType;
    onFilterChange: (filter: FilterType) => void;
    dateRange?: { start: string; end: string };
    onDateRangeChange: (range: { start: string; end: string } | undefined) => void;
    hasMore: boolean;
    onLoadMore: () => void;
    onBookingPress?: (booking: BookingWithDetails) => void;
    refreshing: boolean;
    onRefresh: () => void;
}

const filterOptions: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'today', label: 'Hoje' },
    { key: 'upcoming', label: 'Próximas' },
    { key: 'history', label: 'Histórico' },
];

const datePresets = [
    { label: 'Última semana', days: 7 },
    { label: 'Último mês', days: 30 },
    { label: 'Últimos 3 meses', days: 90 },
];

export function ReservasTab({
    bookings,
    stats,
    filter,
    onFilterChange,
    dateRange,
    onDateRangeChange,
    hasMore,
    onLoadMore,
    onBookingPress,
    refreshing,
    onRefresh,
}: ReservasTabProps) {
    const handlePresetSelect = (days: number) => {
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - days);
        onDateRangeChange({
            start: start.toISOString().split('T')[0],
            end: end.toISOString().split('T')[0],
        });
    };

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const renderHeader = () => (
        <View>
            {/* Filter Tabs */}
            <View className="flex-row bg-gray-100 rounded-xl p-1 mb-4">
                {filterOptions.map((option) => (
                    <TouchableOpacity
                        key={option.key}
                        onPress={() => onFilterChange(option.key)}
                        className={`flex-1 py-2 px-3 rounded-lg ${
                            filter === option.key ? 'bg-white' : ''
                        }`}
                        style={filter === option.key ? {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.05,
                            shadowRadius: 2,
                            elevation: 1,
                        } : {}}
                    >
                        <Text
                            className={`text-center text-sm font-medium ${
                                filter === option.key ? 'text-gray-900' : 'text-gray-500'
                            }`}
                        >
                            {option.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Date Range Presets (for history) */}
            {filter === 'history' && (
                <Animated.View entering={FadeInDown.duration(300)} className="mb-4">
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        {datePresets.map((preset) => (
                            <TouchableOpacity
                                key={preset.days}
                                onPress={() => handlePresetSelect(preset.days)}
                                className={`mr-2 px-4 py-2 rounded-full border ${
                                    dateRange &&
                                    Math.abs(
                                        (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) /
                                        (1000 * 60 * 60 * 24)
                                    ) === preset.days
                                        ? 'bg-green-50 border-green-200'
                                        : 'bg-white border-gray-200'
                                }`}
                            >
                                <Text
                                    className={`text-sm font-medium ${
                                        dateRange &&
                                        Math.abs(
                                            (new Date(dateRange.end).getTime() - new Date(dateRange.start).getTime()) /
                                            (1000 * 60 * 60 * 24)
                                        ) === preset.days
                                            ? 'text-green-600'
                                            : 'text-gray-600'
                                    }`}
                                >
                                    {preset.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </Animated.View>
            )}

            {/* Period Stats */}
            {stats && (
                <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-4">
                    <View className="bg-white rounded-2xl border border-gray-100 p-4">
                        <View className="flex-row">
                            <View className="flex-1 items-center border-r border-gray-100">
                                <Text className="text-2xl font-bold text-gray-900">
                                    {formatCurrency(stats.revenue)}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Total</Text>
                            </View>
                            <View className="flex-1 items-center border-r border-gray-100">
                                <Text className="text-2xl font-bold text-gray-900">
                                    {stats.total}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Reservas</Text>
                            </View>
                            <View className="flex-1 items-center border-r border-gray-100">
                                <Text className="text-2xl font-bold text-gray-900">
                                    {stats.cancellationRate.toFixed(1)}%
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Cancelamento</Text>
                            </View>
                            <View className="flex-1 items-center">
                                <Text className="text-2xl font-bold text-gray-900">
                                    R$ {stats.avgTicket.toFixed(0)}
                                </Text>
                                <Text className="text-xs text-gray-500 mt-1">Ticket médio</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            )}

            {/* List Header */}
            <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm font-medium text-gray-500">
                    {bookings.length} reserva{bookings.length !== 1 ? 's' : ''}
                </Text>
            </View>
        </View>
    );

    const renderEmpty = () => (
        <View className="flex-1 items-center justify-center py-16">
            <Calendar size={48} color="#D1D5DB" />
            <Text className="text-base font-medium text-gray-400 mt-4">
                Nenhuma reserva encontrada
            </Text>
            <Text className="text-sm text-gray-400 mt-1">
                {filter === 'history' ? 'Tente outro período' : 'As reservas aparecerão aqui'}
            </Text>
        </View>
    );

    return (
        <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
                <BookingCard
                    booking={item}
                    onPress={() => onBookingPress?.(item)}
                    delay={index * 50}
                />
            )}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={renderEmpty}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            onEndReached={hasMore ? onLoadMore : undefined}
            onEndReachedThreshold={0.5}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            showsVerticalScrollIndicator={false}
        />
    );
}
