import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator, Modal } from 'react-native';
import { MapPin, Search, Navigation, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Location from 'expo-location';

interface LocationPickerSheetProps {
    visible: boolean;
    onClose: () => void;
    onSelectLocation: (location: string, coords?: { latitude: number; longitude: number }) => void;
    currentLocation?: string;
}

// Popular cities in Brazil
const POPULAR_CITIES = [
    { name: 'São Paulo, SP', latitude: -23.5505, longitude: -46.6333 },
    { name: 'Rio de Janeiro, RJ', latitude: -22.9068, longitude: -43.1729 },
    { name: 'Vinhedo, SP', latitude: -23.0333, longitude: -46.9667 },
    { name: 'Campinas, SP', latitude: -22.9056, longitude: -47.0608 },
    { name: 'Belo Horizonte, MG', latitude: -19.9167, longitude: -43.9345 },
    { name: 'Curitiba, PR', latitude: -25.4284, longitude: -49.2733 },
    { name: 'Porto Alegre, RS', latitude: -30.0346, longitude: -51.2177 },
    { name: 'Florianópolis, SC', latitude: -27.5954, longitude: -48.5480 },
    { name: 'Brasília, DF', latitude: -15.7801, longitude: -47.9292 },
    { name: 'Salvador, BA', latitude: -12.9714, longitude: -38.5014 },
];

export function LocationPickerSheet({
    visible,
    onClose,
    onSelectLocation,
    currentLocation,
}: LocationPickerSheetProps) {
    const insets = useSafeAreaInsets();
    const inputRef = useRef<TextInput>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoadingCurrentLocation, setIsLoadingCurrentLocation] = useState(false);

    const filteredCities = searchQuery.trim()
        ? POPULAR_CITIES.filter(city =>
            city.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : POPULAR_CITIES;

    const handleUseCurrentLocation = async () => {
        setIsLoadingCurrentLocation(true);
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setIsLoadingCurrentLocation(false);
                return;
            }

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });

            const [address] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });

            if (address) {
                const cityName = address.city || address.subregion || address.region;
                const locationString = cityName
                    ? `${cityName}, ${address.region || address.country}`
                    : address.region || address.country || 'Localização atual';

                onSelectLocation(locationString, {
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });
                onClose();
            }
        } catch (error) {
            console.error('Error getting location:', error);
        }
        setIsLoadingCurrentLocation(false);
    };

    const handleSelectCity = (city: typeof POPULAR_CITIES[0]) => {
        onSelectLocation(city.name, { latitude: city.latitude, longitude: city.longitude });
        onClose();
    };

    const handleCustomLocation = () => {
        if (searchQuery.trim()) {
            onSelectLocation(searchQuery.trim());
            onClose();
        }
    };

    if (!visible) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            presentationStyle="pageSheet"
            onRequestClose={onClose}
        >
            <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: insets.top }}>
                {/* Header */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 16,
                    borderBottomWidth: 1,
                    borderBottomColor: '#F3F4F6',
                }}>
                    <Text style={{ fontSize: 20, fontWeight: '700', color: '#000' }}>
                        Escolher localização
                    </Text>
                    <Pressable onPress={onClose} style={{ padding: 4 }}>
                        <X size={24} color="#6B7280" />
                    </Pressable>
                </View>

                <View style={{ flex: 1, paddingHorizontal: 20 }}>
                    {/* Search Input */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#F3F4F6',
                        borderRadius: 12,
                        paddingHorizontal: 12,
                        marginTop: 16,
                        marginBottom: 16,
                    }}>
                        <Search size={20} color="#9CA3AF" />
                        <TextInput
                            ref={inputRef}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                            placeholder="Buscar cidade..."
                            placeholderTextColor="#9CA3AF"
                            autoFocus
                            style={{
                                flex: 1,
                                paddingVertical: 14,
                                paddingHorizontal: 10,
                                fontSize: 16,
                                color: '#000',
                            }}
                            returnKeyType="search"
                            onSubmitEditing={handleCustomLocation}
                        />
                        {searchQuery.length > 0 && (
                            <Pressable onPress={() => setSearchQuery('')}>
                                <X size={18} color="#9CA3AF" />
                            </Pressable>
                        )}
                    </View>

                    {/* Use Current Location */}
                    <Pressable
                        onPress={handleUseCurrentLocation}
                        disabled={isLoadingCurrentLocation}
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            padding: 16,
                            backgroundColor: '#F0FDF4',
                            borderRadius: 12,
                            marginBottom: 20,
                            gap: 12,
                        }}
                    >
                        {isLoadingCurrentLocation ? (
                            <ActivityIndicator size="small" color="#22C55E" />
                        ) : (
                            <Navigation size={20} color="#22C55E" />
                        )}
                        <Text style={{ fontSize: 16, fontWeight: '600', color: '#22C55E' }}>
                            {isLoadingCurrentLocation ? 'Localizando...' : 'Usar minha localização atual'}
                        </Text>
                    </Pressable>

                    {/* Cities List */}
                    <Text style={{ fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 8 }}>
                        {searchQuery ? 'Resultados' : 'Cidades populares'}
                    </Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {filteredCities.map((city) => (
                            <Pressable
                                key={city.name}
                                onPress={() => handleSelectCity(city)}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 14,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#F3F4F6',
                                    gap: 12,
                                }}
                            >
                                <MapPin size={18} color="#6B7280" />
                                <Text style={{
                                    fontSize: 16,
                                    color: city.name === currentLocation ? '#22C55E' : '#374151',
                                    fontWeight: city.name === currentLocation ? '600' : '400',
                                }}>
                                    {city.name}
                                </Text>
                            </Pressable>
                        ))}
                        {searchQuery && filteredCities.length === 0 && (
                            <Pressable
                                onPress={handleCustomLocation}
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    paddingVertical: 14,
                                    gap: 12,
                                }}
                            >
                                <MapPin size={18} color="#3B82F6" />
                                <Text style={{ fontSize: 16, color: '#3B82F6' }}>
                                    Usar &quot;{searchQuery}&quot;
                                </Text>
                            </Pressable>
                        )}
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
}
