import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, ScrollView, Modal } from 'react-native';
import { X, Star, MapPin, DollarSign } from 'lucide-react-native';
import { Colors } from '../../constants';
import { Button } from './index';

export interface FilterOptions {
  sports: string[];
  priceMin: number;
  priceMax: number;
  distance: number;
  minRating: number;
  amenities: string[];
  availability: 'any' | 'today' | 'tomorrow' | 'week';
}

interface FilterSheetProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: FilterOptions) => void;
  initialFilters?: Partial<FilterOptions>;
}

const SPORTS = [
  { id: 'beach-tennis', name: 'Beach Tennis', emoji: '🎾' },
  { id: 'padel', name: 'Padel', emoji: '🎾' },
  { id: 'tennis', name: 'Tênis', emoji: '🎾' },
  { id: 'futevolei', name: 'Futevôlei', emoji: '⚽' },
  { id: 'volleyball', name: 'Vôlei', emoji: '🏐' },
  { id: 'basketball', name: 'Basquete', emoji: '🏀' },
];

const AMENITIES = [
  { id: 'parking', name: 'Estacionamento' },
  { id: 'wifi', name: 'Wi-Fi' },
  { id: 'snackbar', name: 'Lanchonete' },
  { id: 'locker', name: 'Vestiário' },
  { id: 'shower', name: 'Chuveiro' },
  { id: 'equipment', name: 'Aluguel de equipamento' },
];

const DISTANCES = [1, 5, 10, 20, 50];

const DEFAULT_FILTERS: FilterOptions = {
  sports: [],
  priceMin: 0,
  priceMax: 300,
  distance: 10,
  minRating: 0,
  amenities: [],
  availability: 'any',
};

export function FilterSheet({
  visible,
  onClose,
  onApply,
  initialFilters,
}: FilterSheetProps) {
  const [filters, setFilters] = useState<FilterOptions>({
    ...DEFAULT_FILTERS,
    ...initialFilters,
  });

  useEffect(() => {
    if (visible) {
      setFilters({ ...DEFAULT_FILTERS, ...initialFilters });
    }
  }, [visible, initialFilters]);

  const toggleSport = (sportId: string) => {
    setFilters((prev) => ({
      ...prev,
      sports: prev.sports.includes(sportId)
        ? prev.sports.filter((s) => s !== sportId)
        : [...prev.sports, sportId],
    }));
  };

  const toggleAmenity = (amenityId: string) => {
    setFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const handleClear = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const activeFiltersCount =
    filters.sports.length +
    filters.amenities.length +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.distance !== 10 ? 1 : 0) +
    (filters.priceMax !== 300 || filters.priceMin !== 0 ? 1 : 0) +
    (filters.availability !== 'any' ? 1 : 0);

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View className="flex-1 bg-background">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-4 border-b border-neutral-100">
          <Pressable onPress={onClose}>
            <X size={24} color={Colors.primary} />
          </Pressable>
          <Text className="text-lg font-bold text-black">Filtros</Text>
          <Pressable onPress={handleClear}>
            <Text className="text-neutral-500">Limpar</Text>
          </Pressable>
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Sports */}
          <View className="px-5 py-4 border-b border-neutral-100">
            <Text className="font-semibold text-black mb-3">Esportes</Text>
            <View className="flex-row flex-wrap gap-2">
              {SPORTS.map((sport) => {
                const isSelected = filters.sports.includes(sport.id);
                return (
                  <Pressable
                    key={sport.id}
                    onPress={() => toggleSport(sport.id)}
                    className={`flex-row items-center px-4 py-2 rounded-full border ${
                      isSelected
                        ? 'bg-black border-black'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text className="mr-1">{sport.emoji}</Text>
                    <Text
                      className={isSelected ? 'text-white' : 'text-neutral-700'}
                    >
                      {sport.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Distance */}
          <View className="px-5 py-4 border-b border-neutral-100">
            <View className="flex-row items-center mb-3">
              <MapPin size={18} color={Colors.neutral[600]} />
              <Text className="font-semibold text-black ml-2">Distância</Text>
            </View>
            <View className="flex-row gap-2">
              {DISTANCES.map((d) => (
                <Pressable
                  key={d}
                  onPress={() => setFilters((prev) => ({ ...prev, distance: d }))}
                  className={`flex-1 py-3 rounded-xl items-center ${
                    filters.distance === d ? 'bg-black' : 'bg-neutral-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      filters.distance === d ? 'text-white' : 'text-neutral-600'
                    }`}
                  >
                    {d}km
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Price Range */}
          <View className="px-5 py-4 border-b border-neutral-100">
            <View className="flex-row items-center mb-3">
              <DollarSign size={18} color={Colors.neutral[600]} />
              <Text className="font-semibold text-black ml-2">Faixa de preço</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-neutral-500">
                R$ {filters.priceMin} - R$ {filters.priceMax}
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2 mt-3">
              {[
                { min: 0, max: 50, label: 'Até R$50' },
                { min: 50, max: 100, label: 'R$50-100' },
                { min: 100, max: 150, label: 'R$100-150' },
                { min: 150, max: 300, label: 'R$150+' },
              ].map((range) => {
                const isSelected =
                  filters.priceMin === range.min && filters.priceMax === range.max;
                return (
                  <Pressable
                    key={range.label}
                    onPress={() =>
                      setFilters((prev) => ({
                        ...prev,
                        priceMin: range.min,
                        priceMax: range.max,
                      }))
                    }
                    className={`px-4 py-2 rounded-full border ${
                      isSelected
                        ? 'bg-black border-black'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text className={isSelected ? 'text-white' : 'text-neutral-700'}>
                      {range.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Rating */}
          <View className="px-5 py-4 border-b border-neutral-100">
            <View className="flex-row items-center mb-3">
              <Star size={18} color={Colors.warning} />
              <Text className="font-semibold text-black ml-2">
                Avaliação mínima
              </Text>
            </View>
            <View className="flex-row gap-2">
              {[0, 3, 3.5, 4, 4.5].map((rating) => (
                <Pressable
                  key={rating}
                  onPress={() =>
                    setFilters((prev) => ({ ...prev, minRating: rating }))
                  }
                  className={`flex-1 py-3 rounded-xl items-center ${
                    filters.minRating === rating ? 'bg-black' : 'bg-neutral-100'
                  }`}
                >
                  <Text
                    className={`font-medium ${
                      filters.minRating === rating
                        ? 'text-white'
                        : 'text-neutral-600'
                    }`}
                  >
                    {rating === 0 ? 'Todas' : `${rating}+`}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Amenities */}
          <View className="px-5 py-4 border-b border-neutral-100">
            <Text className="font-semibold text-black mb-3">Comodidades</Text>
            <View className="flex-row flex-wrap gap-2">
              {AMENITIES.map((amenity) => {
                const isSelected = filters.amenities.includes(amenity.id);
                return (
                  <Pressable
                    key={amenity.id}
                    onPress={() => toggleAmenity(amenity.id)}
                    className={`px-4 py-2 rounded-full border ${
                      isSelected
                        ? 'bg-black border-black'
                        : 'bg-white border-neutral-200'
                    }`}
                  >
                    <Text
                      className={isSelected ? 'text-white' : 'text-neutral-700'}
                    >
                      {amenity.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Availability */}
          <View className="px-5 py-4">
            <Text className="font-semibold text-black mb-3">Disponibilidade</Text>
            <View className="flex-row gap-2">
              {[
                { id: 'any', label: 'Qualquer' },
                { id: 'today', label: 'Hoje' },
                { id: 'tomorrow', label: 'Amanhã' },
                { id: 'week', label: 'Esta semana' },
              ].map((opt) => (
                <Pressable
                  key={opt.id}
                  onPress={() =>
                    setFilters((prev) => ({
                      ...prev,
                      availability: opt.id as FilterOptions['availability'],
                    }))
                  }
                  className={`flex-1 py-3 rounded-xl items-center ${
                    filters.availability === opt.id ? 'bg-black' : 'bg-neutral-100'
                  }`}
                >
                  <Text
                    className={`font-medium text-sm ${
                      filters.availability === opt.id
                        ? 'text-white'
                        : 'text-neutral-600'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="h-32" />
        </ScrollView>

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-neutral-100 px-5 py-4 pb-8">
          <Button onPress={handleApply} className="w-full">
            Aplicar filtros{activeFiltersCount > 0 && ` (${activeFiltersCount})`}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
