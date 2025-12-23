import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
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
import { getBooking, cancelBooking } from '../../services/bookings';
import { Badge, Button, Card, IconButton } from '../../components/ui';

interface BookingDetails {
  id: string;
  court_id: string;
  date: string;
  start_time: string;
  end_time: string;
  duration_hours: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status?: string;
  confirmation_code?: string;
  court?: {
    id: string;
    name: string;
    city?: string;
    address?: string;
    sport_type?: string;
    phone?: string;
  };
}

export default function BookingDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [codeCopied, setCodeCopied] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const loadBooking = useCallback(async () => {
    if (!id) return;
    try {
      const data = await getBooking(id);
      setBooking(data as BookingDetails);
    } catch (_error) {
      console.error('Error loading booking:', _error);
      Alert.alert('Erro', 'Não foi possível carregar os detalhes da reserva');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadBooking();
  }, [loadBooking]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-background items-center justify-center">
        <Text>Reserva não encontrada</Text>
        <Button onPress={() => router.back()} variant="ghost">Voltar</Button>
      </SafeAreaView>
    );
  }

  const sport = booking.court?.sport_type || 'beach-tennis';
  const sportConfig = SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG];
  const statusConfig = BOOKING_STATUS[booking.status];

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
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const handleShare = async () => {
    console.log('Sharing booking...');
  };

  const handleCancel = async () => {
    Alert.alert(
      'Cancelar Reserva',
      'Tem certeza que deseja cancelar esta reserva?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, cancelar',
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await cancelBooking(booking.id);
              Alert.alert('Sucesso', 'Reserva cancelada com sucesso');
              router.back();
            } catch {
              Alert.alert('Erro', 'Não foi possível cancelar a reserva');
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  const statusColors: Record<string, string> = {
    confirmed: 'bg-green-100',
    pending: 'bg-yellow-100',
    cancelled: 'bg-red-100',
    completed: 'bg-neutral-100',
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4 bg-white border-b border-neutral-100">
        <IconButton icon={ChevronLeft} onPress={() => router.back()} />
        <Text className="text-lg font-semibold text-black">Detalhes da Reserva</Text>
        <IconButton icon={Share2} onPress={handleShare} />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Status Banner */}
        <View className={`mx-5 mt-4 p-4 rounded-xl ${statusColors[booking.status]}`}>
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-sm text-neutral-600">Status</Text>
              <Text className="text-lg font-bold text-black">{statusConfig?.name || booking.status}</Text>
            </View>
            <Badge
              variant={booking.status === 'confirmed' ? 'success' : booking.status === 'cancelled' ? 'error' : 'warning'}
            >
              {statusConfig?.name || booking.status}
            </Badge>
          </View>
        </View>

        {/* Court Info */}
        <Card className="mx-5 mt-4">
          <View className="flex-row">
            <View
              className="w-16 h-16 rounded-xl items-center justify-center"
              style={{ backgroundColor: sportConfig?.iconBg || Colors.neutral[100] }}
            >
              <Text className="text-2xl">{sportConfig?.emoji || '🎾'}</Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-lg font-bold text-black">{booking.court?.name || 'Quadra'}</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color={Colors.neutral[500]} />
                <Text className="ml-1 text-neutral-500">{booking.court?.address || booking.court?.city}</Text>
              </View>
            </View>
          </View>
        </Card>

        {/* Date & Time */}
        <Card className="mx-5 mt-4">
          <View className="flex-row items-center mb-3">
            <Calendar size={20} color={Colors.primary} />
            <Text className="ml-3 text-black">{formatDate(booking.date)}</Text>
          </View>
          <View className="flex-row items-center">
            <Clock size={20} color={Colors.primary} />
            <Text className="ml-3 text-black">
              {booking.start_time?.slice(0, 5)} - {booking.end_time?.slice(0, 5)} ({booking.duration_hours}h)
            </Text>
          </View>
        </Card>

        {/* Payment */}
        <Card className="mx-5 mt-4">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <CreditCard size={20} color={Colors.primary} />
              <Text className="ml-3 text-black">Total</Text>
            </View>
            <Text className="text-xl font-bold text-black">R$ {booking.total_price}</Text>
          </View>
        </Card>

        {/* Confirmation Code */}
        {booking.confirmation_code && (
          <Card className="mx-5 mt-4">
            <Text className="text-sm text-neutral-500 mb-2">Código de Confirmação</Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-black tracking-widest">
                {booking.confirmation_code}
              </Text>
              <Pressable onPress={handleCopyCode} className="p-2">
                {codeCopied ? (
                  <Check size={20} color={Colors.success} />
                ) : (
                  <Copy size={20} color={Colors.neutral[500]} />
                )}
              </Pressable>
            </View>
          </Card>
        )}

        {/* Actions */}
        <View className="mx-5 mt-6 mb-8 gap-3">
          {booking.court?.phone && (
            <Button variant="outline" icon={Phone}>
              Ligar para a quadra
            </Button>
          )}
          <Button variant="outline" icon={Navigation}>
            Ver no mapa
          </Button>
          <Button variant="outline" icon={MessageCircle}>
            Enviar mensagem
          </Button>
          {canCancel && (
            <Button
              variant="ghost"
              icon={X}
              onPress={handleCancel}
              loading={cancelling}
              className="border border-red-200"
            >
              <Text className="text-red-600">Cancelar reserva</Text>
            </Button>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
