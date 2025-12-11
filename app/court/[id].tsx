import { View, Text, ScrollView, Animated as RNAnimated, Dimensions, Platform } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Star, ShieldCheck, Clock } from 'lucide-react-native';

import { CourtHero } from '../../components/court/CourtHero';
import { AmenitiesList } from '../../components/court/AmenitiesList';
import { BookingCalendar } from '../../components/court/BookingCalendar';
import { useCourts } from '../../hooks/useCourts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CourtDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { courts } = useCourts();
  const insets = useSafeAreaInsets();

  const court = courts.find(c => c.id === id) || courts[0]; // Fallback to first if not found (mock)

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // Mock images if court doesn't have multiple
  const images = court.image ? [court.image, court.image, court.image] : [];

  // Derived state
  const totalPrice = court.price ? court.price : 0;
  const canBook = selectedTime !== null;

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="light" />
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Carousel */}
        <CourtHero
          images={images}
          isFavorite={false}
          onToggleFavorite={() => { }}
          onShare={() => { }}
        />

        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          {/* Header Info */}
          <Text style={{ fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 8 }}>
            {court.name}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000' }}>
              ★ {court.rating} <Text style={{ textDecorationLine: 'underline' }}>({Math.floor(Math.random() * 200)} comentários)</Text>
            </Text>
            <Text style={{ fontSize: 16, color: '#000' }}>·</Text>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#000', textDecorationLine: 'underline' }}>
              {court.distance}
            </Text>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 }} />

          {/* Host/Owner Info mockup */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>
                Anfitrião: Arena Sports
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 4 }}>
                Superhost · 3 anos hospedando
              </Text>
            </View>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>AS</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 }} />

          {/* Highlights */}
          <View style={{ gap: 24 }}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <Clock size={28} color="#000" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>Cancelamento gratuito por 48h</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>Tenha flexibilidade se seus planos mudarem.</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <ShieldCheck size={28} color="#000" />
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#000' }}>KourtCover</Text>
                <Text style={{ fontSize: 14, color: '#6B7280', marginTop: 2 }}>Sua reserva protegida contra cancelamentos de última hora.</Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 }} />

          {/* Description */}
          <Text style={{ fontSize: 16, lineHeight: 24, color: '#374151' }}>
            Venha jogar na melhor quadra de {court.sport} da região!
            Estrutura completa com iluminação de LED profissional, areia tratada (para esportes de areia) e vestiários premium.
            Perfeito para jogos casuais ou treinos competitivos.
          </Text>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: '#E5E7EB', marginVertical: 20 }} />

          {/* Amenities */}
          <AmenitiesList />

        </View>

        {/* Date/Time Selection */}
        <BookingCalendar
          pricePerHour={totalPrice}
          onSelectDate={setSelectedDate}
          onSelectTime={setSelectedTime}
        />
      </ScrollView>

      {/* Footer */}
      <View
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          paddingHorizontal: 20,
          paddingTop: 16,
          paddingBottom: Platform.OS === 'ios' ? insets.bottom + 10 : 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }}
      >
        <View>
          <Text style={{ fontSize: 16 }}>
            <Text style={{ fontWeight: '700', color: '#000', fontSize: 20 }}>
              {court.price ? `R$${court.price}` : 'Grátis'}
            </Text>
            <Text style={{ color: '#374151' }}> / hora</Text>
          </Text>
          <Text style={{ fontSize: 14, color: '#000', textDecorationLine: 'underline', fontWeight: '500', marginTop: 2 }}>
            14 - 19 de dez.
          </Text>
        </View>

        <View style={{
          backgroundColor: canBook ? '#E31C5F' : '#DDDDDD', // Airbnb Pink or Gray 
          borderRadius: 8,
          paddingVertical: 14,
          paddingHorizontal: 32,
        }}>
          <Text style={{ color: '#FFFFFF', fontWeight: '700', fontSize: 16 }}>
            Reservar
          </Text>
        </View>
      </View>
    </View>
  );
}
