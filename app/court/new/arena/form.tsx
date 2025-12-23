
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Switch, Alert } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Building2, MapPin, Phone, Briefcase } from 'lucide-react-native';
import { useState } from 'react';

export default function ArenaFormScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const [name, setName] = useState('');
    const [cnpj, setCnpj] = useState('');
    const [is24Hours, setIs24Hours] = useState(false);

    const handleSubmit = () => {
        if (!name || !cnpj) {
            Alert.alert("Campos obrigatórios", "Por favor, preencha o nome e o CNPJ da arena.");
            return;
        }

        // Mock Success
        Alert.alert(
            "Solicitação Enviada! 🏢",
            "Nossa equipe B2B entrará em contato em até 24h para validar sua Arena.",
            [{ text: "OK", onPress: () => router.push('/') }]
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#1E293B" />
                </Pressable>
                <Text style={styles.title}>Dados da Arena</Text>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.form}>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Informações Comerciais</Text>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Fantasia</Text>
                        <View style={styles.inputContainer}>
                            <Building2 size={20} color="#94A3B8" />
                            <TextInput
                                style={styles.input}
                                placeholder="Ex: Arena Beach Point"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>CNPJ</Text>
                        <View style={styles.inputContainer}>
                            <Briefcase size={20} color="#94A3B8" />
                            <TextInput
                                style={styles.input}
                                placeholder="00.000.000/0000-00"
                                keyboardType="numeric"
                                value={cnpj}
                                onChangeText={setCnpj}
                            />
                        </View>
                    </View>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Localização e Contato</Text>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Endereço Comercial</Text>
                        <View style={styles.inputContainer}>
                            <MapPin size={20} color="#94A3B8" />
                            <TextInput style={styles.input} placeholder="CEP ou Endereço" />
                        </View>
                    </View>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Telefone / WhatsApp</Text>
                        <View style={styles.inputContainer}>
                            <Phone size={20} color="#94A3B8" />
                            <TextInput style={styles.input} placeholder="(11) 99999-9999" keyboardType="phone-pad" />
                        </View>
                    </View>
                </View>

                <View style={styles.row}>
                    <Text style={styles.switchLabel}>Funcionamento 24 Horas</Text>
                    <Switch
                        value={is24Hours}
                        onValueChange={setIs24Hours}
                        trackColor={{ true: '#8B5CF6', false: '#E2E8F0' }}
                    />
                </View>

            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitText}>Enviar Cadastro</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
    title: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
    backButton: { padding: 4 },

    form: { padding: 24, gap: 32 },
    section: { gap: 16 },
    sectionTitle: { fontSize: 14, fontWeight: '700', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },

    inputGroup: { gap: 8 },
    label: { fontSize: 14, fontWeight: '600', color: '#334155' },
    inputContainer: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#CBD5E1', borderRadius: 12, paddingHorizontal: 16, height: 56 },
    input: { flex: 1, fontSize: 16, color: '#1E293B' },

    row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#FFF', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#E2E8F0' },
    switchLabel: { fontSize: 16, fontWeight: '600', color: '#1E293B' },

    footer: { padding: 24, backgroundColor: '#FFF', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
    submitButton: { backgroundColor: '#1E293B', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    submitText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
