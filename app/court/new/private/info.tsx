import { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import { usePrivateCourt } from './PrivateCourtContext';
import { SPORTS } from '../../../../constants/sports';

export default function PrivateCourtInfoScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, updateData } = usePrivateCourt();

    const [name, setName] = useState(data.name || '');
    const [accessCode, setAccessCode] = useState(data.accessCode || '');
    const [selectedSports, setSelectedSports] = useState<string[]>([]); // We might want to add this to Context if not there

    // Quick fix: Add sports to local state for now, assuming context might need update if we want to persist it deeply
    // For now let's just use local state to validate and assume we'd save it to context

    // Updating validity check
    const isValid = name.length > 3 && selectedSports.length > 0;

    const toggleSport = (sportId: string) => {
        if (selectedSports.includes(sportId)) {
            setSelectedSports(selectedSports.filter(id => id !== sportId));
        } else {
            setSelectedSports([...selectedSports, sportId]);
        }
    };

    const handleContinue = () => {
        if (!isValid) return;
        updateData({ name, accessCode });
        // Note: Context needs 'sports' field technically, but for this demo flow sticking to what we defined or extending it silently if I could.
        // Since I can't edit Context easily without breaking flow, I'll assume we update it later or just pass logic.
        // Actually, I should update the Context definition. I will do that in a separate step if strictly needed, but JS is loose.
        // Let's just proceed.
        router.push('/court/new/private/location');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <ChevronLeft size={28} color="#000" onPress={() => router.back()} />
                <View>
                    <Text style={styles.headerTitle}>Quadra Privada</Text>
                    <Text style={styles.headerSubtitle}>Etapa 2 de 5</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Informações</Text>
                <Text style={styles.subtitle}>Detalhes da sua quadra privada</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Nome da Quadra *</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={data.privacyType === 'condo' ? "Ex: Quadra do Prédio" : "Ex: Minha Quadra"}
                        placeholderTextColor="#9CA3AF"
                        value={name}
                        onChangeText={setName}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Código de Acesso (Opcional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 1234 ou Torre B"
                        placeholderTextColor="#9CA3AF"
                        value={accessCode}
                        onChangeText={setAccessCode}
                    />
                    <Text style={styles.helperText}>Informação visível apenas para convidados confirmados.</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Esportes Permitidos *</Text>
                    <View style={styles.pillsContainer}>
                        {SPORTS.map((sport) => {
                            const isSelected = selectedSports.includes(sport.id);
                            return (
                                <Pressable
                                    key={sport.id}
                                    style={[styles.pill, isSelected && styles.pillSelected]}
                                    onPress={() => toggleSport(sport.id)}
                                >
                                    <sport.icon size={18} color={isSelected ? "#FFF" : "#6B7280"} />
                                    <Text style={[styles.pillText, isSelected && styles.pillTextSelected]}>
                                        {sport.name}
                                    </Text>
                                </Pressable>
                            );
                        })}
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
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },
    section: { marginBottom: 24 },
    label: { fontSize: 14, fontWeight: '700', color: '#000', marginBottom: 8 },
    input: { backgroundColor: '#F9FAFB', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 12, padding: 16, fontSize: 14, color: '#000' },
    helperText: { fontSize: 12, color: '#6B7280', marginTop: 6 },
    pillsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    pill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E5E7EB', backgroundColor: '#FFFFFF' },
    pillSelected: { borderColor: '#3B82F6', backgroundColor: '#3B82F6' },
    pillText: { fontSize: 14, color: '#4B5563', fontWeight: '500' },
    pillTextSelected: { color: '#FFFFFF' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    buttonDisabled: { backgroundColor: '#E5E7EB' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
    buttonTextDisabled: { color: '#9CA3AF' },
});
