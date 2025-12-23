import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BookingWithDetails } from '../../services/hostDashboardService';

interface BookingCardProps {
    booking: BookingWithDetails;
    onPress?: () => void;
    delay?: number;
}

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    confirmed: { label: 'Confirmado', color: 'text-green-600', bg: 'bg-green-50' },
    pending: { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    cancelled: { label: 'Cancelado', color: 'text-red-600', bg: 'bg-red-50' },
    completed: { label: 'Concluído', color: 'text-blue-600', bg: 'bg-blue-50' },
};

export function BookingCard({ booking, onPress, delay = 0 }: BookingCardProps) {
    const status = statusConfig[booking.status || 'pending'] || statusConfig.pending;

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + 'T00:00:00');
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Hoje';
        }
        if (date.toDateString() === tomorrow.toDateString()) {
            return 'Amanhã';
        }

        return date.toLocaleDateString('pt-BR', {
            day: 'numeric',
            month: 'short',
        });
    };

    const formatTime = (time: string) => {
        return time?.slice(0, 5) || '';
    };

    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="bg-white rounded-2xl p-4 border border-gray-100 mb-3"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.03,
                    shadowRadius: 8,
                    elevation: 1,
                }}
            >
                <View className="flex-row items-center">
                    {/* Guest Avatar */}
                    <Image
                        source={{ uri: booking.guest.avatar_url || 'https://i.pravatar.cc/100' }}
                        className="w-12 h-12 rounded-full bg-gray-200"
                    />

                    {/* Info */}
                    <View className="flex-1 ml-3">
                        <Text className="text-base font-semibold text-gray-900" numberOfLines={1}>
                            {booking.guest.name}
                        </Text>
                        <View className="flex-row items-center mt-1">
                            <MapPin size={12} color="#9CA3AF" />
                            <Text className="text-sm text-gray-500 ml-1" numberOfLines={1}>
                                {booking.court.name}
                            </Text>
                        </View>
                    </View>

                    {/* Price & Status */}
                    <View className="items-end">
                        <Text className="text-base font-bold text-gray-900">
                            R$ {booking.total_price?.toLocaleString('pt-BR')}
                        </Text>
                        <View className={`${status.bg} px-2 py-0.5 rounded-full mt-1`}>
                            <Text className={`text-xs font-medium ${status.color}`}>
                                {status.label}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Date & Time */}
                <View className="flex-row items-center mt-3 pt-3 border-t border-gray-50">
                    <View className="flex-row items-center flex-1">
                        <Calendar size={14} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-1.5">
                            {formatDate(booking.date)}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Clock size={14} color="#6B7280" />
                        <Text className="text-sm text-gray-600 ml-1.5">
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                        </Text>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
