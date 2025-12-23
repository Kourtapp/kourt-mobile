import { View, Text, StyleSheet, Pressable, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtHostAddressScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();
    const [addressData, setAddressData] = useState(data.hostAddress || {
        country: 'Brasil',
        address: '',
        apt: '',
        neighborhood: '',
        city: '',
        state: '',
        cep: ''
    });

    const updateField = (field: keyof typeof addressData, value: string) => {
        setAddressData({ ...addressData, [field]: value });
    };

    const handleContinue = () => {
        updateData({ hostAddress: addressData });
        router.push('/court/new/private/business-type');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <Text style={styles.backText}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.saveButton}>
                    <Text style={styles.saveText}>Salvar e sair</Text>
                </Pressable>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView style={styles.content}>
                    <Text style={styles.title}>Forneça mais algumas informações</Text>
                    <Text style={styles.subtitle}>Qual é seu endereço residencial?</Text>
                    <Text style={[styles.subtitle, { marginTop: -24, fontSize: 14 }]}>Quem reserva com você não tem acesso a essas informações.</Text>

                    <View style={styles.form}>
                        {/* Country Dropdown (Mock) */}
                        <Pressable style={styles.dropdown}>
                            <View>
                                <Text style={styles.label}>País/região</Text>
                                <Text style={styles.value}>Brasil</Text>
                            </View>
                            <ChevronDown size={20} color="#000" />
                        </Pressable>

                        {/* Address */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Endereço</Text>
                            <TextInput
                                style={styles.input}
                                value={addressData.address}
                                onChangeText={(t) => updateField('address', t)}
                            />
                        </View>

                        {/* Apt */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Apto, suíte, unidade (se aplicável)</Text>
                            <TextInput
                                style={styles.input}
                                value={addressData.apt}
                                onChangeText={(t) => updateField('apt', t)}
                            />
                        </View>

                        {/* Neighborhood */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Bairro (se aplicável)</Text>
                            <TextInput
                                style={styles.input}
                                value={addressData.neighborhood}
                                onChangeText={(t) => updateField('neighborhood', t)}
                            />
                        </View>

                        {/* City */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Cidade/município</Text>
                            <TextInput
                                style={styles.input}
                                value={addressData.city}
                                onChangeText={(t) => updateField('city', t)}
                            />
                        </View>

                        {/* State */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.floatingLabel}>Distrito estadual/federal</Text>
                            <TextInput
                                style={styles.input}
                                value={addressData.state}
                                onChangeText={(t) => updateField('state', t)}
                            />
                        </View>

                        {/* CEP */}
                        <View style={[styles.inputContainer, { borderBottomWidth: 1 }]}>
                            <Text style={styles.floatingLabel}>CEP</Text>
                            <TextInput
                                style={styles.input}
                                value={addressData.cep}
                                onChangeText={(t) => updateField('cep', t)}
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

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
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
    backButton: { padding: 4, marginLeft: -4 },
    backText: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline' },
    saveButton: { padding: 8, backgroundColor: '#F3F4F6', borderRadius: 20 },
    saveText: { fontSize: 12, fontWeight: '600' },
    content: { flex: 1, paddingHorizontal: 24 },
    title: { fontSize: 26, fontWeight: '700', color: '#000', marginBottom: 12 },
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32, lineHeight: 24 },
    form: { borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, overflow: 'hidden', marginBottom: 40 },
    dropdown: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#D1D5DB' },
    label: { fontSize: 12, color: '#6B7280' },
    value: { fontSize: 16, color: '#000' },
    inputContainer: { paddingHorizontal: 16, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#D1D5DB', backgroundColor: '#FFF' },
    floatingLabel: { fontSize: 12, color: '#6B7280' },
    input: { fontSize: 16, color: '#000', paddingVertical: 4, height: 28 },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000000', height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
