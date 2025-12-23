import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronDown, MapPin } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtLocationAddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();

    const [country, setCountry] = useState('Brasil');
    const [address, setAddress] = useState(data.address || '');
    const [apt, setApt] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState(data.city || '');
    const [state, setState] = useState(data.state || '');
    const [cep, setCep] = useState(data.cep || '');
    const [showSpecificLocation, setShowSpecificLocation] = useState(true);
    const [loadingInfo, setLoadingInfo] = useState(false);

    useEffect(() => {
        const fetchAddress = async () => {
            if (data.latitude && data.longitude && !address) {
                setLoadingInfo(true);
                try {
                    const [result] = await Location.reverseGeocodeAsync({
                        latitude: data.latitude,
                        longitude: data.longitude
                    });

                    if (result) {
                        setAddress(`${result.street || ''}, ${result.streetNumber || ''}`);
                        setNeighborhood(result.district || '');
                        setCity(result.city || result.subregion || '');
                        setState(result.region || '');
                        setCep(result.postalCode || '');
                        setCountry(result.country || 'Brasil');
                    }
                } catch (error) {
                    console.log('Error fetching address:', error);
                } finally {
                    setLoadingInfo(false);
                }
            }
        };

        fetchAddress();
        fetchAddress();
    }, [data.latitude, data.longitude, address]);

    const handleContinue = () => {
        updateData({ address, city, state, cep }); // Update context
        router.push('/court/new/private/structure');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {loadingInfo && (
                <View style={styles.loadingOverlay}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            )}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ChevronLeft size={24} color="#000" />
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar e sair</Text>
                </Pressable>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Confirme seu endereço</Text>

                <View style={styles.form}>
                    <View style={styles.inputGroupTop}>
                        <Text style={styles.label}>País/região</Text>
                        <View style={styles.selectRow}>
                            <Text style={styles.value}>{country}</Text>
                            <ChevronDown size={20} color="#000" />
                        </View>
                    </View>

                    <View style={styles.inputGroupMiddle}>
                        <Text style={styles.floatingLabel}>Endereço</Text>
                        <TextInput
                            style={styles.input}
                            value={address}
                            onChangeText={setAddress}
                            placeholder="Rua..."
                        />
                    </View>

                    <View style={styles.inputGroupMiddle}>
                        <TextInput
                            style={styles.input}
                            value={apt}
                            onChangeText={setApt}
                            placeholder="Apto, suíte, unidade (se aplicável)"
                            placeholderTextColor="#6B7280"
                        />
                    </View>

                    <View style={styles.inputGroupMiddle}>
                        <TextInput
                            style={styles.input}
                            value={neighborhood}
                            onChangeText={setNeighborhood}
                            placeholder="Bairro (se aplicável)"
                            placeholderTextColor="#6B7280"
                        />
                    </View>

                    <View style={styles.inputGroupMiddle}>
                        <Text style={styles.floatingLabel}>Cidade/município</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>

                    <View style={styles.inputGroupMiddle}>
                        <Text style={styles.floatingLabel}>Estado</Text>
                        <TextInput
                            style={styles.input}
                            value={state}
                            onChangeText={setState}
                        />
                    </View>

                    <View style={styles.inputGroupBottom}>
                        <Text style={styles.floatingLabel}>CEP</Text>
                        <TextInput
                            style={styles.input}
                            value={cep}
                            onChangeText={setCep}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={styles.privacySection}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.privacyTitle}>Mostre sua localização específica</Text>
                        <Text style={styles.privacyText}>
                            Indique claramente para os jogadores a localização da sua quadra.
                            Só compartilharemos seu endereço depois que a reserva for confirmada.
                        </Text>
                    </View>
                    <Switch
                        value={showSpecificLocation}
                        onValueChange={setShowSpecificLocation}
                        trackColor={{ false: "#767577", true: "#000" }}
                        thumbColor={showSpecificLocation ? "#FFF" : "#f4f3f4"}
                    />
                </View>

                {/* Map Preview Placeholder */}
                {showSpecificLocation && (
                    <View style={styles.mapPreview}>
                        <View style={styles.pinRed}>
                            <MapPin size={24} color="#FFF" />
                        </View>
                    </View>
                )}

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleContinue}>
                    <Text style={styles.buttonText}>Tudo certo</Text>
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
    title: { fontSize: 24, fontWeight: '700', color: '#000', marginBottom: 24 },
    form: { borderWidth: 1, borderColor: '#B0B0B0', borderRadius: 8, overflow: 'hidden', marginBottom: 32 },
    inputGroupTop: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#B0B0B0' },
    inputGroupMiddle: { padding: 12, borderBottomWidth: 1, borderBottomColor: '#B0B0B0', backgroundColor: '#FFF' },
    inputGroupBottom: { padding: 12, backgroundColor: '#FFF' },
    label: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
    floatingLabel: { fontSize: 12, color: '#6B7280' },
    selectRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    value: { fontSize: 16, color: '#000' },
    input: { fontSize: 16, color: '#000', paddingTop: 4 },
    privacySection: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24, gap: 16 },
    privacyTitle: { fontSize: 16, fontWeight: '600', color: '#000', marginBottom: 4 },
    privacyText: { fontSize: 14, color: '#6B7280', lineHeight: 20 },
    mapPreview: { height: 150, backgroundColor: '#E5E7EB', borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 40 },
    pinRed: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#222222', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.2, shadowRadius: 5 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    loadingOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(255,255,255,0.7)', justifyContent: 'center', alignItems: 'center', zIndex: 100 },
});
