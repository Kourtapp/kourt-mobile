import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  Calendar,
  Clock,
  MapPin,
  Plus,
} from 'lucide-react-native';
import { Colors, SPORTS_CONFIG, BOOKING_STATUS } from '../../constants';
import { MOCK_BOOKINGS, MockBooking } from '../../mocks/data';
import { Avatar, Badge, Card, EmptyState, Button } from '../../components/ui';

type TabType = 'upcoming' | 'past';

export default function BookingsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');
  const [refreshing, setRefreshing] = useState(false);

  const now = new Date();

  const upcomingBookings = MOCK_BOOKINGS.filter(
    (b) => new Date(b.date) >= now && b.status !== 'cancelled'
  );

  const pastBookings = MOCK_BOOKINGS.filter(
    (b) => new Date(b.date) < now || b.status === 'completed' || b.status === 'cancelled'
  );

  const bookings = activeTab === 'upcoming' ? upcomingBookings : pastBookings;

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusBadge = (status: MockBooking['status']) => {
    const config = BOOKING_STATUS[status];
    const variants: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
      completed: 'default',
    };

    return (
      <Badge variant={variants[status] || 'default'} size="sm">
        {config.name}
      </Badge>
    );
  };

  const renderBooking = ({ item }: { item: MockBooking }) => {
    const sportConfig = SPORTS_CONFIG[item.court.sport as keyof typeof SPORTS_CONFIG];
    const bookingDate = new Date(item.date);

    return (
      <Pressable
        onPress={() => router.push(`/booking/${item.id}`)}
        className="mx-5 mb-4"
      >
        <Card variant="elevated">
          <View className="flex-row">
            {/* Sport Icon */}
            <View
              className="w-16 h-16 rounded-xl items-center justify-center"
              style={{ backgroundColor: sportConfig?.iconBg || Colors.neutral[100] }}
            >
              <Text className="text-2xl">{sportConfig?.emoji}</Text>
            </View>

            {/* Info */}
            <View className="flex-1 ml-4">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="font-semibold text-black" numberOfLines={1}>
                    {item.court.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <MapPin size={12} color={Colors.neutral[500]} />
                    <Text className="ml-1 text-neutral-500 text-sm">
                      {item.court.city}
                    </Text>
                  </View>
                </View>
                {getStatusBadge(item.status)}
              </View>

              {/* Date & Time */}
              <View className="flex-row items-center mt-3 gap-4">
                <View className="flex-row items-center">
                  <Calendar size={14} color={Colors.neutral[500]} />
                  <Text className="ml-1 text-neutral-600 text-sm">
                    {bookingDate.toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={14} color={Colors.neutral[500]} />
                  <Text className="ml-1 text-neutral-600 text-sm">
                    {item.time} ({item.duration}min)
                  </Text>
                </View>
              </View>

              {/* Players */}
              <View className="flex-row items-center mt-3">
                <View className="flex-row">
                  {item.players.slice(0, 4).map((player, i) => (
                    <View
                      key={player.id}
                      style={{ marginLeft: i > 0 ? -8 : 0 }}
                    >
                      <Avatar fallback={player.name} size="xs" />
                    </View>
                  ))}
                </View>
                {item.players.length > 4 && (
                  <Text className="ml-2 text-neutral-500 text-sm">
                    +{item.players.length - 4}
                  </Text>
                )}
                <View className="flex-1" />
                <Text className="font-bold text-black">R$ {item.price}</Text>
              </View>
            </View>
          </View>
        </Card>
      </Pressable>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="px-5 py-4 bg-white border-b border-neutral-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-black">Reservas</Text>
          <Button
            onPress={() => router.push('/(tabs)/map')}
            variant="primary"
            size="sm"
            icon={Plus}
          >
            Nova
          </Button>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-neutral-100 rounded-xl p-1">
          <Pressable
            onPress={() => setActiveTab('upcoming')}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === 'upcoming' ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'upcoming' ? 'text-black' : 'text-neutral-500'
              }`}
            >
              Próximas
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-lg ${
              activeTab === 'past' ? 'bg-white' : ''
            }`}
          >
            <Text
              className={`text-center font-medium ${
                activeTab === 'past' ? 'text-black' : 'text-neutral-500'
              }`}
            >
              Histórico
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        renderItem={renderBooking}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            icon={Calendar}
            title={
              activeTab === 'upcoming'
                ? 'Nenhuma reserva próxima'
                : 'Nenhuma reserva anterior'
            }
            description={
              activeTab === 'upcoming'
                ? 'Encontre uma quadra e faça sua primeira reserva!'
                : 'Suas reservas anteriores aparecerão aqui'
            }
            actionLabel={activeTab === 'upcoming' ? 'Explorar quadras' : undefined}
            onAction={
              activeTab === 'upcoming'
                ? () => router.push('/(tabs)/map')
                : undefined
            }
          />
        }
      />
    </SafeAreaView>
  );
}
