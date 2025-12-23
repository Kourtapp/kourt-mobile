
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, Wand2, Save } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { AutomationService } from '@/services/automationService';

export default function EditProfileScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    // State
    const [name, setName] = useState('Bruno Silva');
    const [username, setUsername] = useState('brunosilva');
    const [bio, setBio] = useState('Apaixonado por Beach Tennis 🎾');
    const [cpf, setCpf] = useState('');
    const [birthDate, setBirthDate] = useState('');

    // Loading state for automation
    const [isAutoFilling, setIsAutoFilling] = useState(false);


    // ...

    const handleAutoFill = async () => {
        if (cpf.length < 11) {
            Alert.alert("CPF Inválido", "Digite um CPF válido para buscar os dados.");
            return;
        }

        setIsAutoFilling(true);

        try {
            const data = await AutomationService.autoFillProfile(cpf);
            setName(data.name);
            setBirthDate(data.birthDate);
            Alert.alert("Automação Concluída", "Dados encontrados e preenchidos automaticamente! 🤖");
        } catch {
            Alert.alert("Erro", "Não foi possível buscar os dados.");
        } finally {
            setIsAutoFilling(false);
        }
    };

    const handleSave = () => {
        // Here we would sync with Supabase
        Alert.alert("Perfil Atualizado", "Seus dados foram salvos com sucesso.");
        router.back();
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Editar Perfil</Text>
                <Pressable onPress={handleSave} style={styles.saveButton}>
                    <Save size={20} color="#FFF" />
                    <Text style={styles.saveText}>Salvar</Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Automation Section */}
                <Animated.View entering={FadeInDown.delay(100)} style={styles.automationCard}>
                    <View style={styles.automationHeader}>
                        <Wand2 size={20} color="#8B5CF6" />
                        <Text style={styles.automationTitle}>Preenchimento Automático</Text>
                    </View>
                    <Text style={styles.automationDesc}>
                        Digite seu CPF para buscarmos seus dados oficiais automaticamente.
                    </Text>

                    <View style={styles.row}>
                        <TextInput
                            style={[styles.input, { flex: 1, marginBottom: 0 }]}
                            placeholder="CPF (apenas números)"
                            value={cpf}
                            onChangeText={setCpf}
                            keyboardType="numeric"
                            maxLength={11}
                        />
                        <Pressable
                            style={styles.autoButton}
                            onPress={handleAutoFill}
                            disabled={isAutoFilling}
                        >
                            {isAutoFilling ? (
                                <ActivityIndicator color="#FFF" />
                            ) : (
                                <Text style={styles.autoButtonText}>Buscar</Text>
                            )}
                        </Pressable>
                    </View>
                </Animated.View>

                {/* Form Fields */}
                <Animated.View entering={FadeInDown.delay(200)} style={styles.form}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome Completo</Text>
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Data de Nascimento</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="DD/MM/AAAA"
                            value={birthDate}
                            onChangeText={setBirthDate}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Nome de Usuário</Text>
                        <TextInput
                            style={styles.input}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Bio</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={bio}
                            onChangeText={setBio}
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />
                    </View>
                </Animated.View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
    },
    backButton: { padding: 4 },
    headerTitle: { fontSize: 18, fontWeight: '700', color: '#0F172A' },
    saveButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#0F172A',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20
    },
    saveText: { color: '#FFF', fontWeight: '600', fontSize: 14 },

    content: { padding: 20 },

    automationCard: {
        backgroundColor: '#F3E8FF',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#E9D5FF',
    },
    automationHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
    automationTitle: { fontSize: 16, fontWeight: '700', color: '#7C3AED' },
    automationDesc: { fontSize: 14, color: '#6B7280', marginBottom: 16, lineHeight: 20 },

    row: { flexDirection: 'row', gap: 12 },
    autoButton: {
        backgroundColor: '#7C3AED',
        paddingHorizontal: 20,
        justifyContent: 'center',
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    autoButtonText: { color: '#FFF', fontWeight: '700' },

    form: { gap: 20 },
    inputGroup: {},
    label: { fontSize: 14, fontWeight: '600', color: '#334155', marginBottom: 8 },
    input: {
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#CBD5E1',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#0F172A',
    },
    textArea: { height: 120 },
});
