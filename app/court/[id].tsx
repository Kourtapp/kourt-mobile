import { View, Text, ScrollView, Pressable, Image, Dimensions, Alert, Linking, Platform } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { format, addDays, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useCourtStore } from '@/stores/useCourtStore';
import { useBookingStore } from '@/stores/useBookingStore';
import { supabase } from '@/services/supabase';
import { courtService } from '@/services/courtService';

// Conditional import for MapView (doesn't work on web)
let MapView: any = null;
let Marker: any = null;
if (Platform.OS !== 'web') {
  const maps = require('react-native-maps');
  MapView = maps.default;
  Marker = maps.Marker;
}

const { width } = Dimensions.get('window');

// Helper: Ícones das comodidades
const amenityIcons: Record<string, string> = {
  'Vestiário': 'shower',
  'Estacionamento': 'local-parking',
  'Iluminação': 'lightbulb',
  'Arquibancada': 'event-seat',
  'Bar': 'local-bar',
  'WiFi': 'wifi',
  'Bola': 'sports-tennis',
  'Raquete': 'sports-tennis',
};

// Helper: Gerar slots de horário
const generateTimeSlots = (opening: string, closing: string): string[] => {
  const slots: string[] = [];
  const openHour = parseInt(opening.split(':')[0]);
  const closeHour = parseInt(closing.split(':')[0]);

  for (let hour = openHour; hour < closeHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
  }

  return slots;
};

export default function CourtDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  // Local state for court data to avoid store complexity for now, or sync with store
  const [court, setCourt] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  const { setBookingCourt, setBookingDate, setBookingTime } = useBookingStore();

  useEffect(() => {
    fetchCourt();
  }, [id]);

  useEffect(() => {
    if (court) {
      fetchAvailableSlots();
    }
  }, [court, selectedDate]);

  const fetchCourt = async () => {
    try {
      // Try fetching real data
      // const data = await courtService.getCourtDetails(id);
      // setCourt(data);

      // Fallback to mock data if ID is from mock
      if (id) {
        const mockCourt = {
          id,
          name: 'Arena Beach Tennis',
          description: 'Quadra de beach tennis coberta com areia de alta qualidade. Ideal para jogos em qualquer clima. Possui iluminação LED profissional e área de convivência.',
          type: 'private',
          sport: 'Beach Tennis',
          address: 'Av. Ibirapuera, 1234',
          city: 'São Paulo',
          state: 'SP',
          latitude: -23.5505,
          longitude: -46.6333,
          price_per_hour: 80,
          is_free: false,
          rating: 4.8,
          total_reviews: 127,
          opening_time: '08:00',
          closing_time: '22:00',
          amenities: ['Vestiário', 'Estacionamento', 'Iluminação', 'Bar', 'WiFi'],
          images: [
            'https://images.unsplash.com/photo-1617693322135-1383c4e72320?q=80&w=800&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554068865-2484cd13263b?q=80&w=800&auto=format&fit=crop'
          ],
          rules: 'Uso obrigatório de roupas adequadas. Proibido entrar com bebidas alcoólicas na quadra.',
          reviews: [
            {
              id: '1',
              rating: 5,
              comment: 'Excelente quadra! Areia muito boa.',
              user: { name: 'Pedro' }
            }
          ]
        };
        setCourt(mockCourt);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    // Mock availability logic
    if (!court) return;

    const slots = generateTimeSlots(court.opening_time, court.closing_time);
    // Randomly disable some slots to simulate bookings
    const available = slots.filter(() => Math.random() > 0.3);
    setAvailableSlots(available);
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleReserve = () => {
    if (!selectedTime) {
      Alert.alert('Atenção', 'Selecione um horário');
      return;
    }

    setBookingCourt(court);
    setBookingDate(selectedDate);
    setBookingTime(selectedTime);
    router.push('/booking/checkout');
  };

  const openMaps = () => {
    if (!court) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${court.latitude},${court.longitude}`;
    Linking.openURL(url);
  };

  if (loading || !court) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header com Galeria */}
        <View className="relative">
          {/* Galeria de Fotos */}
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setCurrentImageIndex(index);
            }}
          >
            {court.images?.map((image: string, index: number) => (
              <Pressable
                key={index}
                onPress={() => { }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width, height: 280 }}
                  className="bg-neutral-200"
                />
              </Pressable>
            ))}
          </ScrollView>

          {/* Overlay Header */}
          <View className="absolute top-12 left-0 right-0 px-4 flex-row justify-between">
            <Pressable
              onPress={() => router.back()}
              className="w-10 h-10 bg-white rounded-full items-center justify-center shadow"
            >
              <MaterialIcons name="arrow-back" size={20} color="#000" />
            </Pressable>

            <View className="flex-row gap-2">
              <Pressable
                onPress={toggleFavorite}
                className="w-10 h-10 bg-white rounded-full items-center justify-center shadow"
              >
                <MaterialIcons
                  name={isFavorite ? 'favorite' : 'favorite-border'}
                  size={20}
                  color={isFavorite ? '#EF4444' : '#000'}
                />
              </Pressable>
              <Pressable
                onPress={() => { }}
                className="w-10 h-10 bg-white rounded-full items-center justify-center shadow"
              >
                <MaterialIcons name="more-vert" size={20} color="#000" />
              </Pressable>
            </View>
          </View>

          {/* Indicador de Fotos */}
          <View className="absolute bottom-4 left-4 px-2 py-1 bg-black/60 rounded-full">
            <Text className="text-white text-xs font-medium">
              {currentImageIndex + 1}/{court.images?.length || 1}
            </Text>
          </View>

          {/* Dots */}
          <View className="absolute bottom-4 right-0 left-0 flex-row justify-center gap-1">
            {court.images?.map((_: any, index: number) => (
              <View
                key={index}
                className={`w-1.5 h-1.5 rounded-full ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </View>
        </View>

        {/* Conteúdo */}
        <View className="px-5 py-4">
          {/* Título e Rating */}
          <View className="mb-4">
            <Text className="text-xl font-bold text-black mb-2">
              {court.name}
            </Text>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="star" size={16} color="#FBBF24" />
              <Text className="text-sm font-medium text-black">
                {court.rating}
              </Text>
              <Text className="text-sm text-neutral-500">
                ({court.total_reviews} avaliações)
              </Text>
            </View>
          </View>

          {/* Localização */}
          <Pressable
            onPress={openMaps}
            className="flex-row items-start gap-3 mb-6"
          >
            <MaterialIcons name="location-on" size={20} color="#737373" />
            <View className="flex-1">
              <Text className="text-sm text-black">{court.address}</Text>
              <Text className="text-sm text-neutral-500">
                {court.city}, {court.state}
              </Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#A3A3A3" />
          </Pressable>

          {/* Sobre */}
          <View className="mb-6">
            <Text className="text-base font-bold text-black mb-2">Sobre</Text>
            <Text
              className="text-sm text-neutral-600 leading-5"
              numberOfLines={descriptionExpanded ? undefined : 3}
            >
              {court.description}
            </Text>
            {court.description?.length > 150 && (
              <Pressable onPress={() => setDescriptionExpanded(!descriptionExpanded)}>
                <Text className="text-sm text-black font-medium mt-1">
                  {descriptionExpanded ? 'Ver menos' : 'Ver mais'}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Comodidades */}
          <View className="mb-6">
            <Text className="text-base font-bold text-black mb-3">Comodidades</Text>
            <View className="flex-row flex-wrap gap-2">
              {court.amenities?.map((amenity: string) => (
                <View
                  key={amenity}
                  className="flex-row items-center gap-1.5 px-3 py-2 bg-neutral-100 rounded-lg"
                >
                  <MaterialIcons
                    name={amenityIcons[amenity] as any || 'check'}
                    size={16}
                    color="#525252"
                  />
                  <Text className="text-xs text-neutral-700">{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Horários */}
          <View className="mb-6">
            <Text className="text-base font-bold text-black mb-3">
              Horários disponíveis
            </Text>

            {/* Date Selector */}
            <View className="flex-row items-center justify-between mb-4">
              <Pressable
                onPress={() => setSelectedDate(subDays(selectedDate, 1))}
                className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center"
              >
                <MaterialIcons name="chevron-left" size={24} color="#000" />
              </Pressable>

              <Text className="text-sm font-medium text-black">
                {format(selectedDate, "EEE, d 'de' MMM", { locale: ptBR })}
              </Text>

              <Pressable
                onPress={() => setSelectedDate(addDays(selectedDate, 1))}
                className="w-10 h-10 bg-neutral-100 rounded-full items-center justify-center"
              >
                <MaterialIcons name="chevron-right" size={24} color="#000" />
              </Pressable>
            </View>

            {/* Time Slots Grid */}
            <View className="flex-row flex-wrap gap-2">
              {generateTimeSlots(court.opening_time, court.closing_time).map((time) => {
                const isAvailable = availableSlots.includes(time);
                const isSelected = selectedTime === time;

                return (
                  <Pressable
                    key={time}
                    onPress={() => isAvailable && setSelectedTime(time)}
                    disabled={!isAvailable}
                    className={`w-[72px] py-3 rounded-xl items-center ${isSelected
                      ? 'bg-black'
                      : isAvailable
                        ? 'bg-white border border-neutral-200'
                        : 'bg-neutral-100'
                      }`}
                  >
                    <Text
                      className={`text-sm font-medium ${isSelected
                        ? 'text-white'
                        : isAvailable
                          ? 'text-black'
                          : 'text-neutral-300'
                        }`}
                    >
                      {time}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Mapa */}
          <View className="mb-6">
            <Text className="text-base font-bold text-black mb-3">Localização</Text>
            <View className="h-40 rounded-2xl overflow-hidden mb-2">
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: court.latitude,
                  longitude: court.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: court.latitude,
                    longitude: court.longitude,
                  }}
                />
              </MapView>
            </View>
            <Pressable
              onPress={openMaps}
              className="flex-row items-center gap-2"
            >
              <MaterialIcons name="directions" size={18} color="#000" />
              <Text className="text-sm font-medium text-black">Como chegar</Text>
            </Pressable>
          </View>

          {/* Regras */}
          {court.rules && (
            <View className="mb-6">
              <Text className="text-base font-bold text-black mb-3">
                Regras da quadra
              </Text>
              <Text className="text-sm text-neutral-600 leading-5">
                {court.rules}
              </Text>
            </View>
          )}

          {/* Espaço para footer */}
          <View className="h-24" />
        </View>
      </ScrollView>

      {/* Footer Fixo */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 pb-8">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-2xl font-bold text-black">
              {court.is_free ? 'Gratuita' : `R$ ${court.price_per_hour}`}
            </Text>
            {!court.is_free && (
              <Text className="text-sm text-neutral-500">por hora</Text>
            )}
          </View>

          <Pressable
            onPress={handleReserve}
            disabled={!selectedTime}
            className={`px-8 py-4 rounded-2xl ${selectedTime ? 'bg-black' : 'bg-neutral-300'
              }`}
          >
            <Text className="text-white font-semibold text-[15px]">
              Reservar
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
