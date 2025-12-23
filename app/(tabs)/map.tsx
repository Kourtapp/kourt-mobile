import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Mapbox from '@rnmapbox/maps';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useCourts } from '../../hooks/useCourts';
import { router } from 'expo-router';
import { CourtCard } from '../../components/home/CourtCard';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInUp } from 'react-native-reanimated';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';

// Initialize Mapbox
Mapbox.setAccessToken('pk.eyJ1Ijoia291cnRhcHAiLCJhIjoiY21panRpdzB3MTg1NDNmcHh1Nm93bzZ6biJ9.picIGTj8Qdw4yDgx1JCMBw');

export default function MapScreen() {
    const mapRef = useRef<Mapbox.MapView>(null);
    const cameraRef = useRef<Mapbox.Camera>(null);
    const bottomSheetRef = useRef<BottomSheet>(null);

    // Snap points for the bottom sheet
    const snapPoints = useMemo(() => ['15%', '45%', '90%'], []);

    const [followUser, setFollowUser] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number]>([-46.6333, -23.5505]); // Default São Paulo
    const [locationReady, setLocationReady] = useState(false);
    const { nearbyCourts } = useCourts();
    const [selectedCourtId, setSelectedCourtId] = useState<string | null>(null);

    // Get user location on mount
    useEffect(() => {
        const getLocation = async () => {
            try {
                console.log('🗺️ [Map] Requesting location permission...');
                const { status } = await Location.requestForegroundPermissionsAsync();
                console.log('🗺️ [Map] Permission status:', status);

                if (status !== 'granted') {
                    console.log('🗺️ [Map] Permission denied, using default');
                    setLocationReady(true);
                    return;
                }

                console.log('🗺️ [Map] Getting current position with HIGH accuracy...');
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.High
                });

                const coords: [number, number] = [location.coords.longitude, location.coords.latitude];
                console.log('🗺️ [Map] Got user location:', {
                    lat: location.coords.latitude,
                    lng: location.coords.longitude,
                    coords: coords
                });

                setUserLocation(coords);
                setLocationReady(true);

                // Immediately move camera
                if (cameraRef.current) {
                    console.log('🗺️ [Map] Moving camera immediately to:', coords);
                    cameraRef.current.setCamera({
                        centerCoordinate: coords,
                        zoomLevel: 14,
                        animationDuration: 1000,
                    });
                }
            } catch (error) {
                console.error('🗺️ [Map] Error getting location:', error);
                setLocationReady(true);
            }
        };

        // Small delay to let map initialize first
        const timer = setTimeout(getLocation, 500);
        return () => clearTimeout(timer);
    }, []);

    // Backup: Move camera when location state updates
    useEffect(() => {
        if (locationReady && userLocation && cameraRef.current) {
            console.log('🗺️ [Map] Location state changed, moving camera to:', userLocation);
            cameraRef.current.setCamera({
                centerCoordinate: userLocation,
                zoomLevel: 14,
                animationDuration: 1000,
            });
        }
    }, [locationReady, userLocation]);

    const handleCenterLocation = () => {
        setFollowUser(true);
        if (userLocation && cameraRef.current) {
            cameraRef.current.setCamera({
                centerCoordinate: userLocation,
                zoomLevel: 14,
                animationDuration: 1000,
            });
        }
    };

    const onMarkerPress = (court: any) => {
        setSelectedCourtId(court.id);
        setFollowUser(false);
        // Expand bottom sheet to mid height to show list or specific item logic could be added
        bottomSheetRef.current?.snapToIndex(1);

        // Center on court if it has coordinates
        if (cameraRef.current && court.longitude && court.latitude) {
            cameraRef.current.setCamera({
                centerCoordinate: [court.longitude, court.latitude],
                zoomLevel: 15,
                animationDuration: 500,
            });
        }
    };

    return (
        <View className="flex-1 bg-white">
            <Mapbox.MapView
                ref={mapRef}
                style={{ flex: 1 }}
                styleURL={Mapbox.StyleURL.Street}
                logoEnabled={false}
                attributionEnabled={false}
                onTouchStart={() => setFollowUser(false)}
            >
                <Mapbox.Camera
                    ref={cameraRef}
                    centerCoordinate={userLocation}
                    zoomLevel={13}
                    animationMode="flyTo"
                    animationDuration={1000}
                />

                <Mapbox.UserLocation visible={true} showsUserHeadingIndicator={true} />

                {/* Markers - Airbnb Style Prices */}
                {nearbyCourts.map((court, index) => {
                    const isSelected = selectedCourtId === court.id;
                    // Use actual court coordinates if available, otherwise place near user
                    const baseCoords = userLocation || [-46.6333, -23.5505];
                    const courtCoords: [number, number] = court.longitude && court.latitude
                        ? [court.longitude, court.latitude]
                        : [baseCoords[0] + (index * 0.01) - 0.02, baseCoords[1] + (index * 0.008) - 0.015];
                    return (
                        <Mapbox.PointAnnotation
                            key={court.id}
                            id={court.id}
                            coordinate={courtCoords}
                            onSelected={() => onMarkerPress(court)}
                        >
                            <View
                                className={`px-3 py-1.5 rounded-full shadow-md border ${isSelected ? 'bg-slate-900 border-slate-900 z-10 scale-110' : 'bg-white border-gray-200'}`}
                                style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3, elevation: 4 }}
                            >
                                <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {court.price ? `R$${court.price}` : 'Consultar'}
                                </Text>
                            </View>
                        </Mapbox.PointAnnotation>
                    )
                })}
            </Mapbox.MapView>

            {/* Top Search Bar */}
            <SafeAreaView className="absolute top-0 left-0 right-0 pointer-events-none" edges={['top']}>
                <Animated.View entering={FadeInUp.delay(200)} className="mx-5 my-2 pointer-events-auto flex-row items-center gap-2">
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                            console.log('🔍 Navigating to search...');
                            router.push('/search');
                        }}
                        className="flex-1 bg-white rounded-full shadow-lg flex-row items-center p-3 border border-gray-100"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}
                    >
                        <View className="ml-2 mr-3">
                            <Ionicons name="search" size={20} color="#000" />
                        </View>
                        <View className="flex-1">
                            <Text className="font-bold text-sm text-slate-900">Quadras por perto</Text>
                            <Text className="text-xs text-slate-500">Qualquer esporte • Qualquer horário</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={() => {
                            console.log('⚙️ Opening filters...');
                            router.push('/search');
                        }}
                        className="bg-white p-3 rounded-full shadow-lg border border-gray-100"
                        style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5 }}
                    >
                        <Ionicons name="options-outline" size={20} color="#000" />
                    </TouchableOpacity>
                </Animated.View>
            </SafeAreaView>

            {/* Re-center Button (positioned above bottom sheet if needed, or static) */}
            {!followUser && (
                <TouchableOpacity
                    onPress={handleCenterLocation}
                    className="absolute top-32 right-5 bg-white p-3 rounded-full shadow-lg border border-gray-100 items-center justify-center z-20"
                >
                    <MaterialIcons name="my-location" size={24} color="#000" />
                </TouchableOpacity>
            )}

            {/* Airbnb Style Bottom Sheet */}
            <BottomSheet
                ref={bottomSheetRef}
                index={0}
                snapPoints={snapPoints}
                enablePanDownToClose={false}
                backgroundStyle={{ borderRadius: 24, backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 }}
                handleIndicatorStyle={{ backgroundColor: '#E2E8F0', width: 40, height: 4 }}
            >
                <View className="px-5 pt-3 pb-4 border-b border-gray-100">
                    <Text className="text-center text-slate-500 font-medium text-sm mb-1">Encontramos {nearbyCourts.length} locais</Text>
                    <Text className="text-center text-slate-900 font-extrabold text-xl tracking-tight">Quadras na região</Text>
                </View>

                <BottomSheetFlatList
                    data={nearbyCourts}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40, paddingTop: 10 }}
                    renderItem={({ item }: { item: any }) => (
                        <View className="mb-6">
                            <CourtCard
                                court={item}
                                onPress={() => {
                                    router.push(`/court/${item.id}`);
                                    onMarkerPress(item); // Highlight on map
                                }}
                                variant="full" // Use full vertical card style
                            />
                        </View>
                    )}
                />
            </BottomSheet>
        </View>
    );
}
