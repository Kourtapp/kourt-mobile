import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Info, MapPin } from 'lucide-react-native';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtReviewScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, submitCourt } = usePrivateCourt();

    const handleCreate = async () => {
        await submitCourt();
        router.push('/court/new/private/success');
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <ChevronLeft size={28} color="#000" onPress={() => router.back()} />
                <View>
                    <Text style={styles.headerTitle}>Revisão</Text>
                    <Text style={styles.headerSubtitle}>Etapa 6 de 6</Text>
                </View>
            </View>

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Tudo certo?</Text>
                <Text style={styles.subtitle}>Confira os dados da sua quadra privada.</Text>

                <View style={styles.card}>
                    <View style={styles.row}>
                        <Info size={20} color="#3B82F6" />
                        <View>
                            <Text style={styles.label}>Nome</Text>
                            <Text style={styles.value}>{data.name}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <MapPin size={20} color="#3B82F6" />
                        <View>
                            <Text style={styles.label}>Endereço</Text>
                            <Text style={styles.value}>{data.address}, {data.number} - {data.city}/{data.state}</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.row}>
                        <View style={{ width: 20, alignItems: 'center' }}><Text>🪪</Text></View>
                        <View>
                            <Text style={styles.label}>Documentação</Text>
                            <Text style={styles.value}>CPF: {data.cpf} (Verificado)</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable style={styles.button} onPress={handleCreate}>
                    <Text style={styles.buttonText}>Criar Quadra</Text>
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
    card: { backgroundColor: '#F9FAFB', borderRadius: 16, padding: 20, gap: 16 },
    row: { flexDirection: 'row', gap: 12 },
    label: { fontSize: 12, color: '#6B7280', marginBottom: 2 },
    value: { fontSize: 16, fontWeight: '600', color: '#000' },
    divider: { height: 1, backgroundColor: '#E5E7EB' },
    footer: { paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    button: { backgroundColor: '#000', height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    buttonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
