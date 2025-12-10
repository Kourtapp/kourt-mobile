import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  CreditCard,
  Phone,
  Navigation,
  Share2,
  X,
  MessageCircle,
  Copy,
  Check,
} from 'lucide-react-native';
import { Colors, SPORTS_CONFIG, BOOKING_STATUS } from '../../constants';
import { MOCK_BOOKINGS } from '../../mocks/data';
import { Avatar, Badge, Button, Card, IconButton } from '../../components/ui';

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const booking = MOCK_BOOKINGS.find((b) => b.id === id) || MOCK_BOOKINGS[0];
  const sportConfig = SPORTS_CONFIG[booking.court.sport as keyof typeof SPORTS_CONFIG];
  const statusConfig = BOOKING_STATUS[booking.status];

  const [codeCopied, setCodeCopied] = useState(false);

  const bookingDate = new Date(booking.date);
  const isPast = bookingDate < new Date();
  const canCancel = !isPast && booking.status === 'confirmed';

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const handleCopyCode = () => {
    // In real app, use Clipboard API
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShare = async () => {
    console.log('Sharing booking...');
  };

  const handleCall = () => {
    // In real app, use Linking to call
    console.log('Calling court...');
  };

  const handleDirections = () => {
    // In real app, open maps
    console.log('Opening directions...');
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancelar reserva',
      'Tem certeza que deseja cancelar esta reserva? Você será reembolsado conforme nossa política de cancelamento.',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Cancelar reserva',
          style: 'destructive',
          onPress: () => {
            // Handle cancellation
            router.back();
          },
        },
      ]
    );
  };

  const handleMessage = () => {
    router.push({
      pathname: '/chat/[id]',
      params: { id: booking.court.id, name: booking.court.name },
    });
  };

  const getStatusBadge = () => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
      completed: 'default',
    };

    return (
      <Badge variant={variants[booking.status] || 'default'}>
        {statusConfig.name}
      </Badge>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-5 py-4 bg-white border-b border-neutral-100">
        <IconButton
          icon={ChevronLeft}
          onPress={() => router.back()}
          variant="default"
          iconColor={Colors.primary}
        />
        <Text className="flex-1 text-xl font-bold text-black text-center">
          Detalhes da reserva
        </Text>
        <IconButton
          icon={Share2}
          onPress={handleShare}
          variant="default"
          iconColor={Colors.neutral[600]}
        />
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Status Banner */}
        <View
          className="mx-5 mt-4 p-4 rounded-xl flex-row items-center"
          style={{ backgroundColor: statusConfig.color + '15' }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: statusConfig.color + '30' }}
          >
            <Check size={20} color={statusConfig.color} />
          </View>
          <View className="flex-1 ml-3">
            <Text style={{ color: statusConfig.color }} className="font-bold">
              {statusConfig.name}
            </Text>
            <Text style={{ color: statusConfig.color + 'cc' }} className="text-sm">
              {booking.status === 'confirmed'
                ? 'Sua reserva está confirmada'
                : booking.status === 'pending'
                ? 'Aguardando confirmação'
                : booking.status === 'cancelled'
                ? 'Esta reserva foi cancelada'
                : 'Partida finalizada'}
            </Text>
          </View>
        </View>

        {/* Booking Code */}
        <Pressable
          onPress={handleCopyCode}
          className="mx-5 mt-4 p-4 bg-neutral-100 rounded-xl flex-row items-center justify-between"
        >
          <View>
            <Text className="text-neutral-500 text-sm">Código da reserva</Text>
            <Text className="font-bold text-black text-lg tracking-widest">
              KRT-{booking.id.toUpperCase().slice(0, 6)}
            </Text>
          </View>
          {codeCopied ? (
            <Check size={20} color={Colors.success} />
          ) : (
            <Copy size={20} color={Colors.neutral[500]} />
          )}
        </Pressable>

        {/* Court Info */}
        <Card variant="elevated" className="mx-5 mt-4">
          <View className="flex-row">
            <View
              className="w-16 h-16 rounded-xl items-center justify-center"
              style={{ backgroundColor: sportConfig?.iconBg }}
            >
              <Text className="text-3xl">{sportConfig?.emoji}</Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-bold text-black text-lg">{booking.court.name}</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color={Colors.neutral[500]} />
                <Text className="ml-1 text-neutral-500">{booking.court.city}</Text>
              </View>
              <View className="flex-row gap-2 mt-2">
                {getStatusBadge()}
                <Badge variant="default">{sportConfig?.name}</Badge>
              </View>
            </View>
          </View>

          <View className="h-px bg-neutral-100 my-4" />

          {/* Quick Actions */}
          <View className="flex-row gap-3">
            <Pressable
              onPress={handleCall}
              className="flex-1 flex-row items-center justify-center bg-neutral-100 py-3 rounded-xl"
            >
              <Phone size={18} color={Colors.neutral[700]} />
              <Text className="ml-2 font-medium text-neutral-700">Ligar</Text>
            </Pressable>
            <Pressable
              onPress={handleDirections}
              className="flex-1 flex-row items-center justify-center bg-neutral-100 py-3 rounded-xl"
            >
              <Navigation size={18} color={Colors.neutral[700]} />
              <Text className="ml-2 font-medium text-neutral-700">Direções</Text>
            </Pressable>
            <Pressable
              onPress={handleMessage}
              className="flex-1 flex-row items-center justify-center bg-neutral-100 py-3 rounded-xl"
            >
              <MessageCircle size={18} color={Colors.neutral[700]} />
              <Text className="ml-2 font-medium text-neutral-700">Chat</Text>
            </Pressable>
          </View>
        </Card>

        {/* Date & Time */}
        <Card variant="outlined" className="mx-5 mt-4">
          <Text className="font-bold text-black mb-4">Data e horário</Text>

          <View className="gap-3">
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center">
                <Calendar size={18} color={Colors.neutral[600]} />
              </View>
              <Text className="ml-3 text-black">{formatDate(booking.date)}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center">
                <Clock size={18} color={Colors.neutral[600]} />
              </View>
              <Text className="ml-3 text-black">
                {booking.time} - {booking.duration} minutos
              </Text>
            </View>
          </View>
        </Card>

        {/* Players */}
        <Card variant="outlined" className="mx-5 mt-4">
          <View className="flex-row items-center justify-between mb-4">
            <View className="flex-row items-center">
              <Users size={18} color={Colors.neutral[600]} />
              <Text className="ml-2 font-bold text-black">Jogadores</Text>
            </View>
            <Badge variant="default">{booking.players.length} confirmados</Badge>
          </View>

          <View className="gap-3">
            {booking.players.map((player, index) => (
              <Pressable
                key={player.id}
                onPress={() => router.push(`/user/${player.id}`)}
                className="flex-row items-center"
              >
                <Avatar fallback={player.name} size="md" />
                <View className="flex-1 ml-3">
                  <Text className="font-medium text-black">{player.name}</Text>
                  <Text className="text-neutral-500 text-sm">
                    {index === 0 ? 'Organizador' : 'Jogador'}
                  </Text>
                </View>
                {index === 0 && (
                  <Badge variant="success" size="sm">Confirmado</Badge>
                )}
              </Pressable>
            ))}
          </View>
        </Card>

        {/* Payment Info */}
        <Card variant="outlined" className="mx-5 mt-4">
          <View className="flex-row items-center mb-4">
            <CreditCard size={18} color={Colors.neutral[600]} />
            <Text className="ml-2 font-bold text-black">Pagamento</Text>
          </View>

          <View className="gap-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-neutral-600">Quadra ({booking.duration}min)</Text>
              <Text className="text-black">R$ {booking.price}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-neutral-600">Taxa de serviço</Text>
              <Text className="text-black">R$ 0,00</Text>
            </View>
            <View className="h-px bg-neutral-100 my-2" />
            <View className="flex-row items-center justify-between">
              <Text className="font-bold text-black">Total pago</Text>
              <Text className="font-bold text-black text-lg">R$ {booking.price}</Text>
            </View>
          </View>

          <View className="mt-4 p-3 bg-neutral-50 rounded-xl flex-row items-center">
            <CreditCard size={16} color={Colors.neutral[500]} />
            <Text className="ml-2 text-neutral-600 text-sm">
              Pago via PIX • {new Date(booking.date).toLocaleDateString('pt-BR')}
            </Text>
          </View>
        </Card>

        {/* Cancellation Policy */}
        {canCancel && (
          <View className="mx-5 mt-4 p-4 bg-amber-50 rounded-xl">
            <Text className="font-semibold text-amber-800 mb-1">
              Política de cancelamento
            </Text>
            <Text className="text-amber-700 text-sm">
              Cancelamento gratuito até 24 horas antes do horário marcado.
              Após esse período, será cobrada uma taxa de 50%.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      {canCancel && (
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 pb-8">
          <Button
            onPress={handleCancel}
            variant="danger"
            fullWidth
            size="lg"
            icon={X}
          >
            Cancelar reserva
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
