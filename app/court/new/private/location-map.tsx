import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Search, Locate } from 'lucide-react-native';
import MapView, { Marker, Region, PROVIDER_DEFAULT } from 'react-native-maps';
import { useLocation } from '../../../../hooks/useLocation';

import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtLocationMapScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { location, loading, requestPermission } = useLocation();
    const { updateData } = usePrivateCourt();
    const mapRef = useRef<MapView>(null);

    const [region, setRegion] = useState<Region>({
        latitude: -23.5505,
        longitude: -46.6333,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
    });

    useEffect(() => {
        if (location) {
            const newRegion = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1000);
        }
    }, [location]);

    const handleContinue = () => {
        updateData({ latitude: region.latitude, longitude: region.longitude });
        router.push('/court/new/private/location-pin');
    };

    const handleCenterLocation = () => {
        if (location) {
            const newRegion = {
                latitude: location.latitude,
                longitude: location.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            setRegion(newRegion);
            mapRef.current?.animateToRegion(newRegion, 1000);
        } else {
            requestPermission();
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#000" />
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar e sair</Text>
                </Pressable>
            </View>

            <View style={styles.content}>
                <Text style={styles.title}>Onde fica sua quadra?</Text>
                <Text style={styles.subtitle}>Seu endereço só é compartilhado com os jogadores depois que a reserva é confirmada.</Text>

                <View style={styles.searchContainer}>
                    <Search size={20} color="#000" />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Insira seu endereço"
                        placeholderTextColor="#6B7280"
                    />
                </View>

                <View style={styles.mapContainer}>
                    {loading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#222222" />
                            <Text style={styles.loadingText}>Buscando localização...</Text>
                        </View>
                    ) : (
                        <MapView
                            ref={mapRef}
                            style={StyleSheet.absoluteFill}
                            provider={PROVIDER_DEFAULT}
                            region={region}
                            onRegionChangeComplete={setRegion}
                            showsUserLocation={true}
                            showsMyLocationButton={false} // Custom button used
                        >
                            <Marker
                                coordinate={{
                                    latitude: region.latitude,
                                    longitude: region.longitude
                                }}
                            >
                                <View style={styles.pinCircle}>
                                    <View style={styles.pinDot} />
                                </View>
                            </Marker>
                        </MapView>
                    )}

                    {/* Floating Center Button */}
                    <Pressable style={styles.centerButton} onPress={handleCenterLocation}>
                        <Locate size={24} color="#222222" />
                    </Pressable>
                </View>
            </View>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Avançar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    saveButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    saveText: { fontSize: 12, fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 8 },
    subtitle: { fontSize: 14, color: '#6B7280', marginBottom: 24 },
    searchContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#F3F4F6', borderRadius: 30, paddingHorizontal: 16, height: 50, marginBottom: 24, borderWidth: 1, borderColor: '#E5E7EB', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 2 },
    searchInput: { flex: 1, fontSize: 16, fontWeight: '600', color: '#000' },
    mapContainer: { flex: 1, borderRadius: 16, overflow: 'hidden', marginBottom: 24, backgroundColor: '#E5E7EB', position: 'relative' },
    loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F3F4F6' },
    loadingText: { marginTop: 12, fontSize: 14, color: '#6B7280' },
    centerButton: { position: 'absolute', bottom: 16, right: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
    pinCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222222', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: '#FFFFFF' },
    pinDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#FFFFFF' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#222222', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
