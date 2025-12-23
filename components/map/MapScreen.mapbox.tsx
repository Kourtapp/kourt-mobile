import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Dimensions, Animated, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import {
  MapPin,
  List,
  Map as MapIcon,
  Filter,
  Star,
  X,
  Locate,
} from 'lucide-react-native';
import { Colors, DEFAULT_LOCATION } from '../../constants';
import { Badge, FilterSheet, SearchInput } from '../../components/ui';
import type { FilterOptions } from '../../components/ui';
import { useLocation, formatDistance, calculateDistance } from '../../hooks/useLocation';
import { useCourts } from '../../hooks/useCourts';
import { SPORTS_MAP } from '../../constants/sports';
import MapboxGL from '@rnmapbox/maps';

// Initialize Mapbox
MapboxGL.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN || '');

Dimensions.get('window');

type ViewMode = 'map' | 'list';
type SportFilter = string | null;

export default function MapScreen() {
  const router = useRouter();
  const { location, requestPermission } = useLocation();
  const { courts } = useCourts();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
  const [sportFilter, setSportFilter] = useState<SportFilter>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const slideAnim = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<MapboxGL.Camera>(null);
  const mapRef = useRef<MapboxGL.MapView>(null);
  const [, setMapReady] = useState(false);

  // Use user's location if available, otherwise default to São Paulo
  const mapCenter: [number, number] = location
    ? [location.longitude, location.latitude]
    : [DEFAULT_LOCATION.longitude, DEFAULT_LOCATION.latitude];

  const courtsWithCoordinates = courts.map((court) => {
    // Use actual court coordinates if available
    const coordinates: [number, number] = court.longitude && court.latitude
      ? [court.longitude, court.latitude]
      : [mapCenter[0] + (Math.random() - 0.5) * 0.08, mapCenter[1] + (Math.random() - 0.5) * 0.08];

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

  // Center map on user location when it becomes available
  useEffect(() => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 13,
        animationDuration: 1000,
      });
    }
  }, [location]);

  useEffect(() => {
    if (selectedCourt) {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [selectedCourt, slideAnim]);

  const handleMarkerPress = useCallback((courtId: string) => {
    setSelectedCourt(courtId);
    const court = courtsWithCoordinates.find((c) => c.id === courtId);
    if (court && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: court.coordinates,
        zoomLevel: 15,
        animationDuration: 500,
      });
    }
  }, [courtsWithCoordinates]);

  const handleCourtPress = (courtId: string) => {
    router.push(`/court/${courtId}`);
  };

  const handleMyLocation = () => {
    if (location && cameraRef.current) {
      cameraRef.current.setCamera({
        centerCoordinate: [location.longitude, location.latitude],
        zoomLevel: 14,
        animationDuration: 1000,
      });
    } else {
      requestPermission();
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    if (filters.sports && filters.sports.length > 0) {
      setSportFilter(filters.sports[0]);
    } else {
      setSportFilter(null);
    }
    setShowFilters(false);
  };

  const selectedCourtData = filteredCourts.find((c) => c.id === selectedCourt);

  const renderPriceMarker = (court: typeof courtsWithCoordinates[0]) => {
    const isSelected = selectedCourt === court.id;

    return (
      <MapboxGL.MarkerView
        key={court.id}
        id={court.id}
        coordinate={court.coordinates}
        anchor={{ x: 0.5, y: 1 }}
      >
        <Pressable
          onPress={() => handleMarkerPress(court.id)}
          style={{ alignItems: 'center' }}
        >
          <View
            style={{
              backgroundColor: isSelected ? '#000' : '#fff',
              borderRadius: 20,
              paddingHorizontal: 12,
              paddingVertical: 8,
              flexDirection: 'row',
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <MapPin size={16} color={isSelected ? '#fff' : Colors.primary} />
            <Text
              style={{
                marginLeft: 4,
                fontWeight: '600',
                fontSize: 14,
                color: isSelected ? '#fff' : '#000',
              }}
            >
              {court.price ? `R$ ${court.price}` : 'Grátis'}
            </Text>
          </View>
          <View
            style={{
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 8,
              borderRightWidth: 8,
              borderTopWidth: 8,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: isSelected ? '#000' : '#fff',
              marginTop: -1,
            }}
          />
        </Pressable>
      </MapboxGL.MarkerView>
    );
  };

  const renderMapView = () => (
    <View className="flex-1">
      <MapboxGL.MapView
        ref={mapRef}
        style={{ flex: 1 }}
        styleURL={MapboxGL.StyleURL.Street}
        onPress={() => setSelectedCourt(null)}
        onDidFinishLoadingMap={() => setMapReady(true)}
        logoEnabled={false}
        attributionEnabled={false}
        compassEnabled
        compassPosition={{ top: 160, right: 16 }}
      >
        <MapboxGL.Camera
          ref={cameraRef}
          centerCoordinate={mapCenter}
          zoomLevel={13}
          animationMode="flyTo"
          animationDuration={500}
        />
        <MapboxGL.UserLocation visible androidRenderMode="compass" />
        {filteredCourts.map((court) => renderPriceMarker(court))}
      </MapboxGL.MapView>

      <Pressable
        onPress={handleMyLocation}
        className="absolute right-5 bottom-40 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Locate size={24} color={Colors.primary} />
      </Pressable>

      <Pressable
        onPress={() => setShowFilters(true)}
        className="absolute left-5 bottom-40 w-12 h-12 bg-white rounded-full items-center justify-center shadow-lg"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Filter size={24} color={Colors.neutral[700]} />
      </Pressable>

      {selectedCourtData && (
        <Animated.View
          style={{
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [200, 0],
                }),
              },
            ],
            position: 'absolute',
            bottom: 100,
            left: 20,
            right: 20,
          }}
        >
          <Pressable
            onPress={() => handleCourtPress(selectedCourtData.id)}
            className="bg-white rounded-2xl overflow-hidden"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 8,
            }}
          >
            <Pressable
              onPress={() => setSelectedCourt(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 bg-black/50 rounded-full items-center justify-center"
            >
              <X size={16} color="#fff" />
            </Pressable>
            <View className="h-28 bg-neutral-200" />
            <View className="p-4">
              <Text className="font-semibold text-black text-lg">
                {selectedCourtData.name}
              </Text>
              <View className="flex-row items-center mt-1">
                <MapPin size={14} color={Colors.neutral[500]} />
                <Text className="text-sm text-neutral-500 ml-1">
                  {formatDistance(Number(selectedCourtData.calculatedDistance) || 0)}
                </Text>
                <Text className="text-neutral-300 mx-2">•</Text>
                <Star size={14} fill={Colors.warning} color={Colors.warning} />
                <Text className="text-sm text-neutral-600 ml-1">
                  {selectedCourtData.rating}
                </Text>
              </View>
              <View className="flex-row items-center justify-between mt-3">
                <View className="flex-row gap-2">
                  <Badge variant="default">
                    {SPORTS_MAP[selectedCourtData.sport]?.emoji || '🏸'} {SPORTS_MAP[selectedCourtData.sport]?.name || selectedCourtData.sport}
                  </Badge>
                </View>
                <Text className="font-bold text-black">
                  {selectedCourtData.price ? `R$ ${selectedCourtData.price}/h` : 'Grátis'}
                </Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>
      )}
    </View>
  );

  const renderListView = () => (
    <ScrollView
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
    >
      <View className="px-5 py-4 gap-4">
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
  );

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

      <View
        className="absolute top-36 right-5 z-10 flex-row bg-white rounded-xl overflow-hidden"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 4,
          elevation: 4,
        }}
      >
        <Pressable
          onPress={() => setViewMode('map')}
          className={`px-4 py-2 ${viewMode === 'map' ? 'bg-black' : ''}`}
        >
          <MapIcon size={20} color={viewMode === 'map' ? '#fff' : Colors.neutral[600]} />
        </Pressable>
        <Pressable
          onPress={() => setViewMode('list')}
          className={`px-4 py-2 ${viewMode === 'list' ? 'bg-black' : ''}`}
        >
          <List size={20} color={viewMode === 'list' ? '#fff' : Colors.neutral[600]} />
        </Pressable>
      </View>

      {viewMode === 'map' ? renderMapView() : renderListView()}

      <View className="absolute bottom-28 left-0 right-0 items-center pointer-events-none">
        <View className="bg-black/80 px-4 py-2 rounded-full">
          <Text className="text-white text-sm">
            {filteredCourts.length} quadras encontradas
          </Text>
        </View>
      </View>

      <FilterSheet
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onApply={handleFilterChange}
        initialFilters={{}}
        resultsCount={filteredCourts.length}
      />
    </View>
  );
}
