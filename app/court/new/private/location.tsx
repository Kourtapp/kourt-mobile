import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Lock } from 'lucide-react-native';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtLocationScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();

    const [cep, setCep] = useState(data.cep || '');
    const [address, setAddress] = useState(data.address || '');
    const [number, setNumber] = useState(data.number || '');
    const [city, setCity] = useState(data.city || '');
    const [state, setState] = useState(data.state || '');
    const [loadingCep, setLoadingCep] = useState(false);

    const isValid = address.length > 5 && number.length > 0 && city.length > 0 && state.length === 2;

    useEffect(() => {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length === 8) {
            fetchAddressFromCEP(cleanCep);
        }
    }, [cep]);

    const fetchAddressFromCEP = async (cleanCep: string) => {
        setLoadingCep(true);
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const json = await response.json();
            if (!json.erro) {
                setAddress(json.logradouro || '');
                setCity(json.localidade || '');
                setState(json.uf || '');
            }
        } catch (error) {
            console.log("CEP Error", error);
        } finally {
            setLoadingCep(false);
        }
    };

    const handleContinue = () => {
        if (!isValid) return;
        updateData({ cep, address, number, city, state });
        router.push('/court/new/private/photos');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <ChevronLeft size={28} color="#000" onPress={() => router.back()} />
                <View>
                    <Text style={styles.headerTitle}>Quadra Privada</Text>
                    <Text style={styles.headerSubtitle}>Etapa 3 de 5</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Localização</Text>
                <Text style={styles.subtitle}>Onde fica sua quadra?</Text>

                <View style={styles.privacyBanner}>
                    <Lock size={16} color="#4B5563" />
                    <Text style={styles.privacyText}>Endereço privado. Não visível no mapa público.</Text>
                </View>

                <View style={styles.section}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={styles.label}>CEP</Text>
                        {loadingCep && <ActivityIndicator size="small" color="#3B82F6" />}
                    </View>
                    <TextInput
                        style={styles.input}
                        placeholder="00000-000"
                        placeholderTextColor="#9CA3AF"
                        value={cep}
                        onChangeText={(t) => {
                            const raw = t.replace(/\D/g, '');
                            let masked = raw;
                            if (raw.length > 5) masked = raw.replace(/^(\d{5})(\d)/, '$1-$2');
                            setCep(masked);
                        }}
                        keyboardType="numeric"
                        maxLength={9}
                    />
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.section, { flex: 3 }]}>
                        <Text style={styles.label}>Endereço Completo *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Rua, Avenida..."
                            placeholderTextColor="#9CA3AF"
                            value={address}
                            onChangeText={setAddress}
                        />
                    </View>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.label}>Nº *</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="123"
                            placeholderTextColor="#9CA3AF"
                            value={number}
                            onChangeText={setNumber}
                            keyboardType="numeric"
                        />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', gap: 12 }}>
                    <View style={[styles.section, { flex: 2 }]}>
                        <Text style={styles.label}>Cidade *</Text>
                        <TextInput
                            style={styles.input}
                            value={city}
                            onChangeText={setCity}
                        />
                    </View>
                    <View style={[styles.section, { flex: 1 }]}>
                        <Text style={styles.label}>Estado *</Text>
                        <TextInput
                            style={styles.input}
                            value={state}
                            onChangeText={setState}
                            maxLength={2}
                            autoCapitalize="characters"
                        />
                    </View>
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
    container: { flex: 1, backgroundColor: '#FFFFFF' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, gap: 12 },
    headerTitle: { fontSize: 16, fontWeight: '700', color: '#000' },
    headerSubtitle: { fontSize: 12, color: '#6B7280' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 24, fontWeight: '800', color: '#000', marginBottom: 4 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 24 },
    privacyBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#F3F4F6', padding: 12, borderRadius: 12, marginBottom: 24 },
    privacyText: { fontSize: 13, color: '#4B5563', fontWeight: '500' },
    section: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 14, color: '#000' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#E5E7EB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    buttonTextDisabled: { color: '#9CA3AF' },
});
