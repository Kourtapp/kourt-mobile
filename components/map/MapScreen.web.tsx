import React, { useState } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  Map as MapIcon,
  Star,
} from 'lucide-react-native';
import { Colors, DEFAULT_LOCATION } from '../../constants';
import { Badge, SearchInput } from '../../components/ui';
import { useLocation, formatDistance, calculateDistance } from '../../hooks/useLocation';
import { useCourts } from '../../hooks/useCourts';
import { SPORTS_MAP } from '../../constants/sports';

type SportFilter = string | null;

export default function MapScreen() {
  const router = useRouter();
  const { location } = useLocation();
  const { courts } = useCourts();
  const [sportFilter, setSportFilter] = useState<SportFilter>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const courtsWithCoordinates = courts.map((court) => {
    const latOffset = (Math.random() - 0.5) * 0.08;
    const lngOffset = (Math.random() - 0.5) * 0.08;
    const coordinates: [number, number] = [
      DEFAULT_LOCATION.longitude + lngOffset,
      DEFAULT_LOCATION.latitude + latOffset,
    ];

    const distance = location
      ? calculateDistance(
          location.latitude,
          location.longitude,
          coordinates[1],
          coordinates[0]
        )
      : 0;

    return {
      ...court,
      coordinates,
      calculatedDistance: distance,
    };
  }).sort((a, b) => a.calculatedDistance - b.calculatedDistance);

  const filteredCourts = courtsWithCoordinates.filter((court) => {
    const matchesSport = !sportFilter || court.sport === sportFilter || court.sport?.toLowerCase().includes(sportFilter.toLowerCase());
    const matchesSearch = !searchQuery ||
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (court.city && court.city.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSport && matchesSearch;
  });

  const handleCourtPress = (courtId: string) => {
    router.push(`/court/${courtId}`);
  };

  const sports = [
    { id: 'beach-tennis', name: 'Beach Tennis', emoji: '🎾' },
    { id: 'padel', name: 'Padel', emoji: '🎾' },
    { id: 'tennis', name: 'Tênis', emoji: '🎾' },
    { id: 'futevolei', name: 'Futevôlei', emoji: '⚽' },
    { id: 'volleyball', name: 'Vôlei', emoji: '🏐' },
  ];

  return (
    <View className="flex-1 bg-background">
      <View className="bg-white pt-14 pb-4 px-5 border-b border-neutral-100">
        <SearchInput
          placeholder="Buscar quadras..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mt-3 -mx-5 px-5"
          contentContainerStyle={{ gap: 8 }}
        >
          <Pressable
            onPress={() => setSportFilter(null)}
            className={`px-4 py-2 rounded-full ${sportFilter === null ? 'bg-black' : 'bg-neutral-100'}`}
          >
            <Text className={`font-medium ${sportFilter === null ? 'text-white' : 'text-neutral-600'}`}>
              Todos
            </Text>
          </Pressable>
          {sports.map((sport) => (
            <Pressable
              key={sport.id}
              onPress={() => setSportFilter(sport.id)}
              className={`flex-row items-center px-4 py-2 rounded-full ${sportFilter === sport.id ? 'bg-black' : 'bg-neutral-100'}`}
            >
              <Text className="mr-1">{sport.emoji}</Text>
              <Text className={`font-medium ${sportFilter === sport.id ? 'text-white' : 'text-neutral-600'}`}>
                {sport.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        className="flex-1 bg-background"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View className="px-5 py-4 gap-4">
          <View className="bg-neutral-100 rounded-xl p-4 mb-2">
            <View className="flex-row items-center mb-2">
              <MapIcon size={20} color={Colors.neutral[500]} />
              <Text className="text-neutral-600 font-medium ml-2">
                Visualização de Mapa
              </Text>
            </View>
            <Text className="text-neutral-500 text-sm">
              O mapa interativo está disponível apenas no app mobile. Use a lista abaixo para navegar pelas quadras.
            </Text>
          </View>

          {filteredCourts.map((court) => (
            <Pressable
              key={court.id}
              onPress={() => handleCourtPress(court.id)}
              className="bg-white rounded-2xl overflow-hidden border border-neutral-100"
            >
              <View className="h-36 bg-neutral-200" />
              <View className="p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-semibold text-black text-lg">
                      {court.name}
                    </Text>
                    <View className="flex-row items-center mt-1">
                      <MapPin size={14} color={Colors.neutral[500]} />
                      <Text className="text-sm text-neutral-500 ml-1">
                        {formatDistance(Number(court.calculatedDistance) || 0)}
                      </Text>
                      <Text className="text-neutral-300 mx-2">•</Text>
                      <Star size={14} fill={Colors.warning} color={Colors.warning} />
                      <Text className="text-sm text-neutral-600 ml-1">
                        {court.rating}
                      </Text>
                    </View>
                  </View>
                  <Text className="font-bold text-black text-lg">
                    {court.price ? `R$ ${court.price}/h` : 'Grátis'}
                  </Text>
                </View>
                <View className="flex-row gap-2 mt-3">
                  <Badge variant="default">
                    {SPORTS_MAP[court.sport]?.emoji || '🏸'} {SPORTS_MAP[court.sport]?.name || court.sport}
                  </Badge>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className="absolute bottom-28 left-0 right-0 items-center pointer-events-none">
        <View className="bg-black/80 px-4 py-2 rounded-full">
          <Text className="text-white text-sm">
            {filteredCourts.length} quadras encontradas
          </Text>
        </View>
      </View>
    </View>
  );
}
