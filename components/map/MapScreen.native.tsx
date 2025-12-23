import { View, Pressable, FlatList, Dimensions, StyleSheet, Text } from 'react-native';
import { useState, useCallback } from 'react';
import MapView, { Marker, PROVIDER_DEFAULT } from 'react-native-maps';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, SlidersHorizontal } from 'lucide-react-native';

import { PricePin } from './PricePin';
import { CourtCard } from '../home/CourtCard';
import { useCourts } from '../../hooks/useCourts';
import { FilterSheet, FilterOptions } from '../ui/FilterSheet';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SNAP_POINTS = [SCREEN_HEIGHT * 0.15, SCREEN_HEIGHT * 0.45, SCREEN_HEIGHT - 120]; // Keep ~120px visible at bottom

export default function MapScreen() {
    const insets = useSafeAreaInsets();
    const { courts } = useCourts();

    const [selectedCourt, setSelectedCourt] = useState<string | null>(null);

    // Animation Values
    const translateY = useSharedValue(SCREEN_HEIGHT * 0.45);
    const context = useSharedValue({ y: 0 });

    const scrollTo = useCallback((destination: number) => {
        'worklet';
        translateY.value = withTiming(destination, { duration: 300 });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = { y: translateY.value };
        })
        .onUpdate((e) => {
            translateY.value = Math.max(
                insets.top + 50, // Top limit
                Math.min(SCREEN_HEIGHT - 120, context.value.y + e.translationY) // Bottom limit
            );
        })
        .onEnd((e) => {
            // Find closest snap point
            const dest = SNAP_POINTS.reduce((prev, curr) =>
                Math.abs(curr - translateY.value) < Math.abs(prev - translateY.value) ? curr : prev
            );
            scrollTo(dest);
        });

    const bottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
        top: 0, // Position from top instead of bottom/height hacks
        bottom: 0,
        position: 'absolute',
        left: 0,
        right: 0,
    }));

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        sports: [],
        priceMin: 0,
        priceMax: 900,
        distance: 20,
        minRating: 0,
        amenities: [],
        courtTypes: [],
        bookingOptions: [],
        availableNow: false,
        availableToday: false,
        availableThisWeek: false,
        includeFree: false
    });

    const [showFilters, setShowFilters] = useState(false);

    const filteredCourts = courts.filter((court) => {
        // Price filter
        if (court.price !== null) {
            if (court.price < filterOptions.priceMin || court.price > filterOptions.priceMax) return false;
        } else if (!filterOptions.includeFree && filterOptions.priceMax < 900) {
            // Logic: if price is null (free) but user didn't explicitly select 'free' option 
            // AND set a max price, we might exclude. But usually free is included unless specific price range excludes 0? 
            // Let's keep it simple: if free, only show if includeFree is true OR priceMin is 0.
            if (filterOptions.priceMin > 0) return false;
        }

        // Availability
        if (filterOptions.availableNow && !court.available_now) return false;

        // Sports
        if (filterOptions.sports.length > 0 && !filterOptions.sports.includes(court.sport)) return false;

        return true;
    });

    const handleApplyFilters = (newFilters: FilterOptions) => {
        setFilterOptions(newFilters);
        setShowFilters(false);
        // Scroll to list view on filter apply to show results
        scrollTo(SCREEN_HEIGHT * 0.45);
    };

    return (
        <View className="flex-1 bg-white">
            {/* Full Screen Map */}
            <MapView
                style={StyleSheet.absoluteFill}
                provider={PROVIDER_DEFAULT}
                initialRegion={{
                    latitude: -23.5505,
                    longitude: -46.6333,
                    latitudeDelta: 0.05,
                    longitudeDelta: 0.05,
                }}
                onPress={() => scrollTo(SCREEN_HEIGHT - 120)} // Close sheet on map press
            >
                {filteredCourts.map((court) => (
                    <Marker
                        key={court.id}
                        coordinate={{
                            latitude: court.latitude,
                            longitude: court.longitude,
                        }}
                        onPress={(e) => {
                            e.stopPropagation();
                            setSelectedCourt(court.id);
                            scrollTo(SCREEN_HEIGHT * 0.45); // Snap to mid on marker press
                        }}
                    >
                        <PricePin
                            price={court.price}
                            selected={selectedCourt === court.id}
                        />
                    </Marker>
                ))}
            </MapView>

            {/* Floating Search Pill (Airbnb Style) */}
            <View
                style={{
                    position: 'absolute',
                    top: insets.top + 10,
                    left: 20,
                    right: 20,
                    zIndex: 10
                }}
            >
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#FFFFFF',
                        borderRadius: 30,
                        padding: 8,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.15,
                        shadowRadius: 12,
                        elevation: 5,
                    }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        style={{ padding: 8 }}
                    >
                        <ArrowLeft size={20} color="#000" />
                    </Pressable>

                    <Pressable
                        style={{ flex: 1, marginLeft: 8 }}
                        onPress={() => router.push('/search')}
                    >
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#000' }}>
                            Quadras por perto
                        </Text>
                        <Text style={{ fontSize: 12, color: '#6B7280' }}>
                            Qualquer data · Hóspedes?
                        </Text>
                    </Pressable>

                    <Pressable
                        style={{
                            padding: 8,
                            backgroundColor: '#F3F4F6',
                            borderRadius: 20,
                            marginRight: 4
                        }}
                        onPress={() => setShowFilters(true)}
                    >
                        <SlidersHorizontal size={18} color="#000" />
                    </Pressable>
                </View>
            </View>

            {/* Bottom Sheet */}
            <GestureDetector gesture={panGesture}>
                <Animated.View
                    style={[
                        bottomSheetStyle,
                        {
                            backgroundColor: '#FFFFFF',
                            borderTopLeftRadius: 24,
                            borderTopRightRadius: 24,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 8,
                            elevation: 10,
                        }
                    ]}
                >
                    {/* Drag Handle */}
                    <View style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 8 }}>
                        <View style={{ width: 40, height: 4, backgroundColor: '#E5E7EB', borderRadius: 2 }} />
                    </View>

                    {/* Header Text */}
                    <View style={{ alignItems: 'center', paddingBottom: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>
                            Mais de {filteredCourts.length} quadras
                        </Text>
                    </View>

                    {/* Content */}
                    <FlatList
                        data={filteredCourts}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <View style={{ alignItems: 'center', marginBottom: 24, width: '100%', paddingHorizontal: 24 }}>
                                <CourtCard
                                    court={item}
                                    variant="full"
                                    onPress={() => router.push(`/court/${item.id}` as any)}
                                />
                            </View>
                        )}
                        contentContainerStyle={{
                            paddingTop: 8,
                            paddingBottom: 100
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </Animated.View>
            </GestureDetector>

            <FilterSheet
                visible={showFilters}
                onClose={() => setShowFilters(false)}
                onApply={handleApplyFilters}
                resultsCount={filteredCourts.length}
            />
        </View>
    );
}
