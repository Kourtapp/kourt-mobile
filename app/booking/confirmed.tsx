import React from 'react';
import {
  View,
  Text,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  CheckCircle,
  Calendar,
  Clock,
  MapPin,
  Share2,
  CalendarPlus,
  Home,
} from 'lucide-react-native';
import { Colors, SPORTS_CONFIG } from '../../constants';
import { Button, Card } from '../../components/ui';

export default function BookingConfirmedScreen() {
  const router = useRouter();
  const { courtName, sport, date, time, duration, price } = useLocalSearchParams<{
    courtId: string;
    courtName: string;
    sport: string;
    date: string;
    time: string;
    duration: string;
    price: string;
  }>();

  const sportConfig = SPORTS_CONFIG[(sport || 'beach-tennis') as keyof typeof SPORTS_CONFIG];

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const handleShare = async () => {
    // In real app, use Share API
    console.log('Sharing booking...');
  };

  const handleAddToCalendar = async () => {
    // In real app, use Calendar API
    console.log('Adding to calendar...');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top', 'bottom']}>
      <View className="flex-1 px-5 py-8 items-center justify-center">
        {/* Success Icon */}
        <View className="w-24 h-24 bg-green-100 rounded-full items-center justify-center mb-6">
          <CheckCircle size={56} color={Colors.success} />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-black text-center mb-2">
          Reserva confirmada!
        </Text>
        <Text className="text-neutral-500 text-center mb-8">
          Sua quadra foi reservada com sucesso
        </Text>

        {/* Booking Details */}
        <Card variant="elevated" className="w-full mb-6">
          <View className="flex-row items-center mb-4">
            <View
              className="w-14 h-14 rounded-xl items-center justify-center"
              style={{ backgroundColor: sportConfig?.iconBg }}
            >
              <Text className="text-2xl">{sportConfig?.emoji}</Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className="font-bold text-black text-lg">{courtName || 'Quadra'}</Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color={Colors.neutral[500]} />
                <Text className="ml-1 text-neutral-500">Reserva confirmada</Text>
              </View>
            </View>
          </View>

          <View className="h-px bg-neutral-100 mb-4" />

          <View className="gap-3">
            <View className="flex-row items-center">
              <Calendar size={18} color={Colors.neutral[600]} />
              <Text className="ml-3 text-black">{formatDate(date!)}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={18} color={Colors.neutral[600]} />
              <Text className="ml-3 text-black">
                {time} - {parseInt(duration || '60')} minutos
              </Text>
            </View>
          </View>

          <View className="h-px bg-neutral-100 my-4" />

          <View className="flex-row items-center justify-between">
            <Text className="text-neutral-600">Total pago</Text>
            <Text className="text-xl font-bold text-black">
              R$ {parseFloat(price || '0').toFixed(2)}
            </Text>
          </View>
        </Card>

        {/* Actions */}
        <View className="flex-row gap-3 w-full mb-6">
          <Pressable
            onPress={handleAddToCalendar}
            className="flex-1 flex-row items-center justify-center bg-neutral-100 py-4 rounded-xl"
          >
            <CalendarPlus size={20} color={Colors.neutral[700]} />
            <Text className="ml-2 font-medium text-neutral-700">
              Adicionar ao calendário
            </Text>
          </Pressable>
          <Pressable
            onPress={handleShare}
            className="w-14 h-14 bg-neutral-100 rounded-xl items-center justify-center"
          >
            <Share2 size={20} color={Colors.neutral[700]} />
          </Pressable>
        </View>

        {/* Booking Code */}
        <View className="bg-neutral-50 px-6 py-4 rounded-xl mb-8">
          <Text className="text-neutral-500 text-center text-sm mb-1">
            Código da reserva
          </Text>
          <Text className="text-black font-bold text-xl text-center tracking-widest">
            KRT-{Math.random().toString(36).substring(2, 8).toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Bottom Button */}
      <View className="px-5 pb-4">
        <Button
          onPress={() => router.replace('/(tabs)')}
          fullWidth
          size="lg"
          icon={Home}
        >
          Voltar ao início
        </Button>
      </View>
    </SafeAreaView>
  );
}
