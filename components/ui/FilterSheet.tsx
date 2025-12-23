import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  Modal,
  Switch,
  TextInput,
  Dimensions,
} from 'react-native';
import { X, Clock, Calendar, CalendarDays, Zap, Key, CheckSquare } from 'lucide-react-native';
import Animated, { FadeIn, FadeOut, SlideInDown, SlideOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect, Circle, Line } from 'react-native-svg';
import { SPORTS } from '../../constants/sports';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Custom Icons
const LightIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <Path d="M10 12v6h4v-6" stroke={color} strokeWidth="2" />
    <Line x1="9" y1="18" x2="15" y2="18" stroke={color} strokeWidth="2" />
    <Line x1="9" y1="20" x2="15" y2="20" stroke={color} strokeWidth="2" />
  </Svg>
);



const LockerIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="6" width="18" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M7 6V4a5 5 0 0110 0v2" stroke={color} strokeWidth="2" />
  </Svg>
);

const RestaurantIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 3v18M3 9h6M9 3v6a3 3 0 01-6 0V3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M15 3v7a4 4 0 004 4h2M17 3v18" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const WifiIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M5 12.55a11 11 0 0114 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Path d="M8.53 16.11a6 6 0 016.95 0" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <Circle cx="12" cy="20" r="1" fill={color} />
  </Svg>
);

const RentIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth="2" />
    <Path d="M21 21l-4.35-4.35" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

const PrivateIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="3" y="8" width="18" height="12" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M4 8V6a4 4 0 018 0v2M12 8V6a4 4 0 018 0v2" stroke={color} strokeWidth="2" />
  </Svg>
);

const PublicIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2L2 7l10 5 10-5-10-5z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 17l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M2 12l10 5 10-5" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const HomeIcon = ({ size = 20, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    <Path d="M9 22V12h6v10" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);

const StarIcon = ({ size = 16, color = '#000' }: { size?: number; color?: string }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </Svg>
);



export interface FilterOptions {
  sports: string[];
  priceMin: number;
  priceMax: number;
  distance: number;
  minRating: number;
  amenities: string[];
  courtTypes: string[];
  bookingOptions: string[];
  availableNow: boolean;
  availableToday: boolean;
  availableThisWeek: boolean;
  includeFree: boolean;
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
  resultsCount?: number;
}



const COURT_TYPES = [
  { id: 'private', name: 'Privada', icon: PrivateIcon },
  { id: 'public', name: 'Pública', icon: PublicIcon },
  { id: 'particular', name: 'Particular', icon: HomeIcon },
];

const AMENITIES = [
  { id: 'lighting', name: 'Iluminação', icon: LightIcon },
  { id: 'parking', name: 'Estacionamento', iconText: 'P' },
  { id: 'locker', name: 'Vestiário', icon: LockerIcon },
  { id: 'restaurant', name: 'Restaurante', icon: RestaurantIcon },
  { id: 'wifi', name: 'Wi-Fi', icon: WifiIcon },
  { id: 'equipment', name: 'Aluguel equip.', icon: RentIcon },
];

const BOOKING_OPTIONS = [
  { id: 'instant', name: 'Reserva Instantânea', icon: Zap },
  { id: 'self-checkin', name: 'Self check-in', icon: Key },
  { id: 'free-cancel', name: 'Cancelamento grátis', icon: CheckSquare },
];

const DISTANCES = [
  { value: 1, label: '1 km' },
  { value: 5, label: '5 km' },
  { value: 10, label: '10 km' },
  { value: 20, label: '20+ km' },
];

const RATINGS = [
  { value: 3, label: '3+' },
  { value: 3.5, label: '3.5+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

const DEFAULT_FILTERS: FilterOptions = {
  sports: [],
  priceMin: 50,
  priceMax: 200,
  distance: 5,
  minRating: 0,
  amenities: [],
  courtTypes: [],
  bookingOptions: [],
  availableNow: false,
  availableToday: false,
  availableThisWeek: false,
  includeFree: true,
};

// Price histogram data (mock)
const HISTOGRAM_DATA = [
  8, 15, 25, 35, 45, 40, 50, 55, 60, 55, 50, 45, 40, 35, 30, 25, 20, 18, 15, 12, 10, 8, 6, 5
];

export function FilterSheet({
  visible,
  onClose,
  onApply,
  initialFilters,
  resultsCount = 47,
}: FilterSheetProps) {
  const insets = useSafeAreaInsets();
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });
  const [showAllAmenities, setShowAllAmenities] = useState(false);

  useEffect(() => {
    if (visible) {
      setFilters({ ...DEFAULT_FILTERS, ...initialFilters });
    }
  }, [visible, initialFilters]);

  const toggleArrayItem = (key: keyof FilterOptions, item: string) => {
    setFilters((prev) => {
      const arr = prev[key] as string[];
      return {
        ...prev,
        [key]: arr.includes(item)
          ? arr.filter((i) => i !== item)
          : [...arr, item],
      };
    });
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const visibleAmenities = showAllAmenities ? AMENITIES : AMENITIES.slice(0, 6);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="none" transparent statusBarTranslucent>
      <View style={{ flex: 1 }}>
        {/* Backdrop */}
        <Animated.View
          entering={FadeIn.duration(200)}
          exiting={FadeOut.duration(200)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        >
          <Pressable style={{ flex: 1 }} onPress={onClose} />
        </Animated.View>

        {/* Sheet */}
        <Animated.View
          entering={SlideInDown.duration(300)}
          exiting={SlideOutDown.duration(300)}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            maxHeight: '92%',
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
          }}
        >
          {/* Handle */}
          <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
            <View style={{ width: 40, height: 4, backgroundColor: '#D1D5DB', borderRadius: 2 }} />
          </View>

          {/* Header */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingBottom: 16,
            position: 'relative',
          }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000' }}>Filtros</Text>
            <Pressable
              onPress={onClose}
              style={{ position: 'absolute', right: 20 }}
            >
              <X size={24} color="#000" />
            </Pressable>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
          >
            {/* Faixa de preço */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 4 }}>
                Faixa de preço
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
                Preço por hora de reserva
              </Text>

              {/* Histogram */}
              <View style={{ height: 60, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
                {HISTOGRAM_DATA.map((value, index) => (
                  <View
                    key={index}
                    style={{
                      width: (SCREEN_WIDTH - 60) / HISTOGRAM_DATA.length - 2,
                      height: value,
                      backgroundColor: '#22C55E',
                      borderRadius: 2,
                    }}
                  />
                ))}
              </View>

              {/* Min/Max inputs */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Mínimo</Text>
                  <View style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}>
                    <TextInput
                      value={`R$ ${filters.priceMin}`}
                      onChangeText={(text) => {
                        const num = parseInt(text.replace(/\D/g, ''), 10) || 0;
                        setFilters(prev => ({ ...prev, priceMin: num }));
                      }}
                      style={{ fontSize: 16, color: '#000' }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
                <Text style={{ fontSize: 16, color: '#9CA3AF', marginTop: 20 }}>—</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 4 }}>Máximo</Text>
                  <View style={{
                    borderWidth: 1,
                    borderColor: '#E5E7EB',
                    borderRadius: 12,
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                  }}>
                    <TextInput
                      value={`R$ ${filters.priceMax}+`}
                      onChangeText={(text) => {
                        const num = parseInt(text.replace(/\D/g, ''), 10) || 0;
                        setFilters(prev => ({ ...prev, priceMax: num }));
                      }}
                      style={{ fontSize: 16, color: '#000' }}
                      keyboardType="numeric"
                    />
                  </View>
                </View>
              </View>

              {/* Include free toggle */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: 16,
              }}>
                <Text style={{ fontSize: 16, color: '#000' }}>Incluir quadras gratuitas</Text>
                <Switch
                  value={filters.includeFree}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, includeFree: value }))}
                  trackColor={{ false: '#E5E7EB', true: '#22C55E' }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>

            {/* Esportes */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Esportes
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {SPORTS.map((sport) => {
                  const isSelected = filters.sports.includes(sport.id);
                  const Icon = sport.icon;
                  return (
                    <Pressable
                      key={sport.id}
                      onPress={() => toggleArrayItem('sports', sport.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 24,
                        backgroundColor: isSelected ? '#22C55E' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                        gap: 6,
                      }}
                    >
                      <Icon size={16} color={isSelected ? '#FFFFFF' : '#000'} />
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: isSelected ? '#FFFFFF' : '#000',
                      }}>
                        {sport.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Tipo de quadra */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Tipo de quadra
              </Text>
              <View style={{ gap: 12 }}>
                {COURT_TYPES.map((type) => {
                  const isSelected = filters.courtTypes.includes(type.id);
                  const IconComponent = type.icon;
                  return (
                    <Pressable
                      key={type.id}
                      onPress={() => toggleArrayItem('courtTypes', type.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingHorizontal: 20,
                        paddingVertical: 16,
                        borderRadius: 16,
                        borderWidth: 2,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                        backgroundColor: '#FFFFFF',
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <IconComponent size={20} color="#000" />
                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#000' }}>
                          {type.name}
                        </Text>
                      </View>
                      <View style={{
                        width: 24,
                        height: 24,
                        borderRadius: 12,
                        borderWidth: 2,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                        backgroundColor: isSelected ? '#22C55E' : '#FFFFFF',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {isSelected && (
                          <Svg width={12} height={12} viewBox="0 0 24 24" fill="none">
                            <Path d="M5 12l5 5 9-9" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                          </Svg>
                        )}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Comodidades */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Comodidades
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                {visibleAmenities.map((amenity) => {
                  const isSelected = filters.amenities.includes(amenity.id);
                  return (
                    <Pressable
                      key={amenity.id}
                      onPress={() => toggleArrayItem('amenities', amenity.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 10,
                        borderRadius: 24,
                        backgroundColor: isSelected ? '#22C55E' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                        gap: 8,
                      }}
                    >
                      {amenity.iconText ? (
                        <Text style={{
                          fontSize: 14,
                          fontWeight: 'bold',
                          color: isSelected ? '#FFFFFF' : '#000',
                        }}>
                          {amenity.iconText}
                        </Text>
                      ) : amenity.icon ? (
                        <amenity.icon size={16} color={isSelected ? '#FFFFFF' : '#000'} />
                      ) : null}
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: isSelected ? '#FFFFFF' : '#000',
                      }}>
                        {amenity.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {AMENITIES.length > 6 && (
                <Pressable onPress={() => setShowAllAmenities(!showAllAmenities)} style={{ marginTop: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#000', textDecorationLine: 'underline' }}>
                    {showAllAmenities ? 'Mostrar menos' : 'Mostrar mais'}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Opções de reserva */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Opções de reserva
              </Text>
              <View style={{ gap: 8 }}>
                {BOOKING_OPTIONS.map((option) => {
                  const isSelected = filters.bookingOptions.includes(option.id);
                  const IconComponent = option.icon;
                  return (
                    <Pressable
                      key={option.id}
                      onPress={() => toggleArrayItem('bookingOptions', option.id)}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 24,
                        backgroundColor: isSelected ? '#22C55E' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                        gap: 8,
                        alignSelf: 'flex-start',
                      }}
                    >
                      <IconComponent size={16} color={isSelected ? '#FFFFFF' : '#000'} />
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '500',
                        color: isSelected ? '#FFFFFF' : '#000',
                      }}>
                        {option.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Distância máxima */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 4 }}>
                Distância máxima
              </Text>
              <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 16 }}>
                Até onde você quer ir?
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {DISTANCES.map((d) => {
                  const isSelected = filters.distance === d.value;
                  return (
                    <Pressable
                      key={d.value}
                      onPress={() => setFilters(prev => ({ ...prev, distance: d.value }))}
                      style={{
                        paddingHorizontal: 20,
                        paddingVertical: 12,
                        borderRadius: 24,
                        backgroundColor: isSelected ? '#22C55E' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                      }}
                    >
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: isSelected ? '#FFFFFF' : '#000',
                      }}>
                        {d.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Avaliação mínima */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Avaliação mínima
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {RATINGS.map((r) => {
                  const isSelected = filters.minRating === r.value;
                  return (
                    <Pressable
                      key={r.value}
                      onPress={() => setFilters(prev => ({ ...prev, minRating: r.value }))}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 16,
                        paddingVertical: 12,
                        borderRadius: 24,
                        backgroundColor: isSelected ? '#22C55E' : '#FFFFFF',
                        borderWidth: 1,
                        borderColor: isSelected ? '#22C55E' : '#E5E7EB',
                        gap: 6,
                      }}
                    >
                      <StarIcon size={14} color={isSelected ? '#FFFFFF' : '#000'} />
                      <Text style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: isSelected ? '#FFFFFF' : '#000',
                      }}>
                        {r.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Disponibilidade */}
            <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Disponibilidade
              </Text>
              <View style={{ gap: 16 }}>
                {/* Disponível agora */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Clock size={20} color="#6B7280" />
                    <Text style={{ fontSize: 16, color: '#000' }}>Disponível agora</Text>
                  </View>
                  <Switch
                    value={filters.availableNow}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, availableNow: value }))}
                    trackColor={{ false: '#E5E7EB', true: '#22C55E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Disponível hoje */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <Calendar size={20} color="#6B7280" />
                    <Text style={{ fontSize: 16, color: '#000' }}>Disponível hoje</Text>
                  </View>
                  <Switch
                    value={filters.availableToday}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, availableToday: value }))}
                    trackColor={{ false: '#E5E7EB', true: '#22C55E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>

                {/* Disponível esta semana */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <CalendarDays size={20} color="#6B7280" />
                    <Text style={{ fontSize: 16, color: '#000' }}>Disponível esta semana</Text>
                  </View>
                  <Switch
                    value={filters.availableThisWeek}
                    onValueChange={(value) => setFilters(prev => ({ ...prev, availableThisWeek: value }))}
                    trackColor={{ false: '#E5E7EB', true: '#22C55E' }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#F3F4F6',
            paddingHorizontal: 20,
            paddingTop: 16,
            paddingBottom: 16 + insets.bottom,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Pressable onPress={handleClear}>
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#000',
                textDecorationLine: 'underline',
              }}>
                Limpar tudo
              </Text>
            </Pressable>
            <Pressable
              onPress={handleApply}
              style={{
                backgroundColor: '#22C55E',
                paddingHorizontal: 24,
                paddingVertical: 14,
                borderRadius: 28,
              }}
            >
              <Text style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#FFFFFF',
              }}>
                Mostrar {resultsCount} quadras
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
