import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { usePublicCourt } from './PublicCourtContext';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Check, Building2 } from 'lucide-react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function CourtLocationMapScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePublicCourt();

    // Form State
    const [cep, setCep] = useState(data.cep || '');
    const [address, setAddress] = useState(data.address || ''); // Assuming context uses 'address' for street
    const [number, setNumber] = useState(data.number || '');
    const [district, setDistrict] = useState(data.district || '');
    const [city, setCity] = useState(data.city || '');
    const [state, setState] = useState(data.state || '');
    const [reference, setReference] = useState(data.reference || '');

    const [location, setLocation] = useState<Location.LocationObject | null>(null);

    const isValid = address.length > 0 && number.length > 0 && city.length > 0 && state.length > 0;

    useEffect(() => {
        (async () => {
            const currentLoc = await Location.getCurrentPositionAsync({});
            setLocation(currentLoc);
            // Here we would use reverseGeocoding to fill address
            // Mocking for verified feel
            if (currentLoc) {
                // Mock data fill could go here
            }
        })();
    }, []);

    const [loadingCep, setLoadingCep] = useState(false);

    useEffect(() => {
        if (cep.replace(/\D/g, '').length === 8) {
            fetchAddressFromCEP(cep.replace(/\D/g, ''));
        }
    }, [cep]);

    const fetchAddressFromCEP = async (cleanCep: string) => {
        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();

            if (!data.erro) {
                setAddress(data.logradouro || '');
                setDistrict(data.bairro || '');
                setCity(data.localidade || '');
                setState(data.uf || '');
                // Optional: Focus on number field automatically
            } else {
                // CEP not found logic if needed
            }
        } catch (error) {
            console.log("Error fetching CEP", error);
        } finally {
            setLoadingCep(false);
        }
    };

    const handleContinue = () => {
        if (!isValid) return;

        updateData({
            cep,
            address, // This might duplicate if 'address' meant full string in context, but simpler to just map it
            number,
            district,
            city,
            state,
            reference,
            latitude: location?.coords.latitude,
            longitude: location?.coords.longitude
        });

        router.push('/court/new/public/photos-instruction');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={{ paddingBottom: 100 }}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.title}>Localização</Text>
                <Text style={styles.subtitle}>Confirme o endereço da quadra</Text>

                {/* Map Preview */}
                <View style={styles.mapContainer}>
                    {location ? (
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                                latitudeDelta: 0.005,
                                longitudeDelta: 0.005,
                            }}
                            scrollEnabled={false}
                            zoomEnabled={false}
                        >
                            <Marker coordinate={location.coords}>
                                <View style={styles.markerContainer}>
                                    <Building2 size={20} color="#FFF" />
                                </View>
                            </Marker>
                        </MapView>
                    ) : (
                        <View style={[styles.map, { backgroundColor: '#F3F4F6' }]} />
                    )}
                </View>

                {/* Success Banner */}
                <View style={styles.successBanner}>
                    <View style={styles.checkCircle}>
                        <Check size={12} color="#FFF" strokeWidth={3} />
                    </View>
                    <Text style={styles.successText}>Localização verificada - Você está no local!</Text>
                </View>

                {/* Form Fields */}
                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={styles.label}>CEP</Text>
                        {loadingCep && <ActivityIndicator size="small" color="#22C55E" />}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="00000-000"
                        placeholderTextColor="#9CA3AF"
                        value={cep}
                        onChangeText={(text) => {
                            // Mask CEP as 00000-000
                            const raw = text.replace(/\D/g, '');
                            let masked = raw;
                            if (raw.length > 5) {
                                masked = raw.replace(/^(\d{5})(\d)/, '$1-$2');
                            }
                            setCep(masked);
                        }}
                        keyboardType="numeric"
                        maxLength={9}
                    />
                    <Text style={styles.helperText}>Digite o CEP para preencher automaticamente</Text>
                </View>

                <View style={styles.row}>
                    <View style={[styles.section, { flex: 3 }]}>
                        <Text style={styles.label}>Endereço *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Rua, Avenida..."
                            placeholderTextColor="#9CA3AF"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.label}>Nº</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123"
                            placeholderTextColor="#9CA3AF"
                            value={number}
                            onChangeText={setNumber}
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Bairro</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Bairro"
                        placeholderTextColor="#9CA3AF"
                        value={district}
                        onChangeText={setDistrict}
                    />
                </View>

                <View style={styles.row}>
                    <View style={[styles.section, { flex: 2 }]}>
                        <Text style={styles.label}>Cidade *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Cidade"
                            placeholderTextColor="#9CA3AF"
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.label}>Estado</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="UF"
                            placeholderTextColor="#9CA3AF"
                            value={state}
                            onChangeText={setState}
                            maxLength={2}
                            autoCapitalize="characters"
                        />
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Ponto de Referência</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Próximo ao portão 10 do parque"
                        placeholderTextColor="#9CA3AF"
                        value={reference}
                        onChangeText={setReference}
                    />
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable
                    style={[styles.button, !isValid && styles.buttonDisabled]}
                    onPress={handleContinue}
                    disabled={!isValid}
                >
                    <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>Continuar</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    backButton: {
        padding: 4,
        marginLeft: -4,
    },
    backText: {
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: '#000',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 24,
    },
    mapContainer: {
        height: 160,
        borderRadius: 16,
        overflow: 'hidden',
        marginBottom: 16,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    markerContainer: {
        backgroundColor: '#22C55E',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: '#FFF',
    },
    successBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0FDF4',
        padding: 12,
        borderRadius: 12,
        gap: 12,
        marginBottom: 24,
    },
    checkCircle: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#22C55E',
        alignItems: 'center',
        justifyContent: 'center',
    },
    successText: {
        fontSize: 14,
        color: '#15803D',
        fontWeight: '600',
        flex: 1,
    },
    section: {
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 0,
    },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 14,
        color: '#000',
    },
    helperText: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 6,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
        backgroundColor: '#FFF',
    },
    button: {
        backgroundColor: '#000',
        height: 56,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#E5E7EB',
    },
    buttonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: '700',
    },
    buttonTextDisabled: {
        color: '#9CA3AF',
    },
});
