import { View, Text, Pressable, FlatList, Dimensions } from 'react-native';
import { useState } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { router } from 'expo-router';

import { SearchBar } from './SearchBar';
import { FilterPills } from './FilterPills';
import { PricePin } from './PricePin';
import { CourtListItem } from './CourtListItem';
import { useCourts } from '../../hooks/useCourts';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export function MapScreen() {
    const { courts } = useCourts();

    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);
    const [filter, setFilter] = useState('all');
    const [showFilters, setShowFilters] = useState(false);

    // Bottom sheet animation
    const translateY = useSharedValue(SCREEN_HEIGHT * 0.6);

    const panGesture = Gesture.Pan()
        .onUpdate((e) => {
            translateY.value = Math.max(100, Math.min(SCREEN_HEIGHT * 0.8, translateY.value + e.translationY));
        })
        .onEnd(() => {
            if (translateY.value < SCREEN_HEIGHT * 0.4) {
                translateY.value = withSpring(100);
            } else {
                translateY.value = withSpring(SCREEN_HEIGHT * 0.6);
            }
        });

    const bottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        height: SCREEN_HEIGHT,
    }));

    const filteredCourts = courts.filter((court) => {
        if (filter === 'all') return true;
        if (filter === 'free') return court.price === null;
        if (filter === 'available') return court.available_now;
        return court.sport === filter;
    });

    return (
        <View className="flex-1 bg-[#fafafa]">
            {/* Search Bar */}
            <View className="absolute top-12 left-0 right-0 z-30 bg-white px-4 pt-3 pb-3 border-b border-neutral-100 shadow-sm">
                <SearchBar onFilterPress={() => setShowFilters(true)} />
                <FilterPills selected={filter} onSelect={setFilter} />
            </View>

            {/* Map */}
            <MapView
                style={{ flex: 1 }}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: -23.5505,
                    longitude: -46.6333,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
            >
                {filteredCourts.map((court) => (
                    <Marker
                        key={court.id}
                        coordinate={{
                            latitude: court.latitude,
                            longitude: court.longitude,
                        }}
                        onPress={() => setSelectedCourt(court.id)}
                    >
                        <PricePin
                            price={court.price}
                            selected={selectedCourt === court.id}
                        />
                    </Marker>
                ))}
            </MapView>

            {/* Bottom Sheet */}
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={bottomSheetStyle}
                    className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl shadow-lg"
                >
                    {/* Handle */}
                    <View className="w-12 h-1 bg-neutral-300 rounded-full mx-auto mt-3 mb-4" />

                    {/* Header */}
                    <View className="px-5 flex-row items-center justify-between mb-3">
                        <Text className="text-base font-bold text-black">
                            {filteredCourts.length} quadras encontradas
                        </Text>
                        <Pressable className="px-3 py-1.5 bg-neutral-100 rounded-full">
                            <Text className="text-xs text-black font-medium">Lista</Text>
                        </Pressable>
                    </View>

                    {/* Court List */}
                    <FlatList
                        data={filteredCourts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <CourtListItem
                                court={item}
                                onPress={() => router.push(`/court/${item.id}` as any)}
                            />
                        )}
                        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 150 }}
                        ItemSeparatorComponent={() => <View className="h-3" />}
                    />
                </Animated.View>
            </GestureDetector>
        </View>
    );
}
