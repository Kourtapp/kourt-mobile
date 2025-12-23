import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Star, Calendar, DollarSign, MapPin, MoreHorizontal } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CourtWithAnalytics } from '../../services/hostDashboardService';

interface CourtCardProps {
    court: CourtWithAnalytics;
    onPress?: () => void;
    onMenuPress?: () => void;
    delay?: number;
}

export function CourtCard({ court, onPress, onMenuPress, delay = 0 }: CourtCardProps) {
    const defaultImage = 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400';

    return (
        <Animated.View entering={FadeInDown.delay(delay).duration(400)}>
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.7}
                className="bg-white rounded-2xl border border-gray-100 mb-4 overflow-hidden"
                style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.03,
                    shadowRadius: 8,
                    elevation: 1,
                }}
            >
                {/* Image */}
                <View className="relative">
                    <Image
                        source={{ uri: court.cover_image || court.images?.[0] || defaultImage }}
                        className="w-full h-36 bg-gray-200"
                        resizeMode="cover"
                    />
                    {/* Status Badge */}
                    <View
                        className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${
                            court.is_active ? 'bg-green-500' : 'bg-gray-400'
                        }`}
                    >
                        <Text className="text-xs font-semibold text-white">
                            {court.is_active ? 'Ativo' : 'Inativo'}
                        </Text>
                    </View>
                    {/* Menu Button */}
                    <TouchableOpacity
                        onPress={onMenuPress}
                        className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 items-center justify-center"
                    >
                        <MoreHorizontal size={18} color="#374151" />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View className="p-4">
                    {/* Title & Location */}
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                        {court.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                        <MapPin size={13} color="#9CA3AF" />
                        <Text className="text-sm text-gray-500 ml-1" numberOfLines={1}>
                            {court.neighborhood || court.city}, {court.state}
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View className="flex-row items-center mt-4 pt-3 border-t border-gray-50">
                        {/* Rating */}
                        <View className="flex-row items-center flex-1">
                            <Star size={14} color="#F59E0B" fill="#F59E0B" />
                            <Text className="text-sm font-semibold text-gray-700 ml-1">
                                {(court.rating || 0).toFixed(1)}
                            </Text>
                            <Text className="text-xs text-gray-400 ml-0.5">
                                ({court.rating_count || 0})
                            </Text>
                        </View>

                        {/* Bookings */}
                        <View className="flex-row items-center flex-1 justify-center">
                            <Calendar size={14} color="#6B7280" />
                            <Text className="text-sm font-semibold text-gray-700 ml-1">
                                {court.totalBookings}
                            </Text>
                            <Text className="text-xs text-gray-400 ml-0.5">reservas</Text>
                        </View>

                        {/* Revenue */}
                        <View className="flex-row items-center flex-1 justify-end">
                            <DollarSign size={14} color="#22C55E" />
                            <Text className="text-sm font-semibold text-green-600">
                                R$ {(court.monthRevenue / 1000).toFixed(1)}k
                            </Text>
                        </View>
                    </View>

                    {/* Occupancy Bar */}
                    <View className="mt-3">
                        <View className="flex-row items-center justify-between mb-1">
                            <Text className="text-xs text-gray-500">Ocupação</Text>
                            <Text className="text-xs font-semibold text-gray-700">
                                {court.occupancyRate.toFixed(0)}%
                            </Text>
                        </View>
                        <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <View
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${Math.min(court.occupancyRate, 100)}%` }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
}
