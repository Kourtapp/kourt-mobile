import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Calendar, PenTool, User, Plus } from 'lucide-react-native';
import { usePrivateCourt } from './PrivateCourtContext';

export default function PrivateCourtPublishScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { data, submitCourt } = usePrivateCourt();

    const handlePublish = async () => {
        // Here we would actually submit the data
        console.log("Publishing Court Data:", JSON.stringify(data, null, 2));
        await submitCourt();
        // Redirect to the new KourtOS Dashboard
        router.push('/host/dashboard');
    };

    const coverPhoto = data.photos && data.photos.length > 0 ? data.photos[0] : null;
    const basePrice = data.priceWeekday;

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

            <ScrollView style={styles.content}>
                <Text style={styles.title}>Tudo pronto! Seu espaço está incrível.</Text>
                <Text style={styles.subtitle}>
                    Veja como sua quadra aparecerá no marketplace Kourt. Revise as informações antes de publicar.
                </Text>

                {/* Preview Card */}
                <View style={styles.previewCard}>
                    <View style={styles.previewImageContainer}>
                        {coverPhoto ? (
                            <Image source={{ uri: coverPhoto }} style={styles.previewImage} resizeMode="cover" />
                        ) : (
                            <View style={styles.placeholderImage}>
                                <Plus size={32} color="#9CA3AF" />
                                <Text style={{ color: '#9CA3AF' }}>Sem foto</Text>
                            </View>
                        )}
                        <View style={styles.previewBadge}>
                            <Text style={styles.previewBadgeText}>Prévia</Text>
                        </View>
                    </View>

                    <View style={styles.previewDetails}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Text style={styles.previewTitle}>{data.name || "Sua Quadra Premium"}</Text>
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>Novo ★</Text>
                            </View>
                        </View>
                        <View style={styles.priceRow}>
                            <Text style={styles.priceFinal}>R${basePrice} <Text style={styles.priceUnit}>/ hora</Text></Text>
                        </View>
                    </View>
                </View>

                {/* Next Steps */}
                <Text style={styles.sectionTitle}>Próximos passos</Text>

                <View style={styles.stepsList}>
                    <View style={styles.stepItem}>
                        <Calendar size={32} color="#000" strokeWidth={1.5} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stepTitle}>Agenda Inteligente</Text>
                            <Text style={styles.stepDesc}>Gerencie horários, bloqueios e reservas recorrentes facilmente.</Text>
                        </View>
                    </View>
                    <View style={styles.stepItem}>
                        <PenTool size={32} color="#000" strokeWidth={1.5} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stepTitle}>Preços Dinâmicos</Text>
                            <Text style={styles.stepDesc}>Ajuste valores para horários de pico e finais de semana.</Text>
                        </View>
                    </View>
                    <View style={styles.stepItem}>
                        <User size={32} color="#000" strokeWidth={1.5} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.stepTitle}>Divulgue seu espaço</Text>
                            <Text style={styles.stepDesc}>Compartilhe seu link exclusivo e comece a receber jogadores.</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>

            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable onPress={() => router.back()} style={{ padding: 12 }}>
                    <Text style={styles.backLink}>Voltar</Text>
                </Pressable>
                <Pressable style={styles.publishButton} onPress={handlePublish}>
                    <Text style={styles.publishButtonText}>Publicar e Faturar</Text>
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
    subtitle: { fontSize: 16, color: '#6B7280', marginBottom: 32 },

    previewCard: { backgroundColor: '#FFF', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E5E7EB', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, marginBottom: 40 },
    previewImageContainer: { height: 220, backgroundColor: '#F3F4F6', position: 'relative' },
    previewImage: { width: '100%', height: '100%' },
    placeholderImage: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    previewBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: '#FFF', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 },
    previewBadgeText: { fontSize: 12, fontWeight: '700', color: '#000' },
    previewDetails: { padding: 16 },
    previewTitle: { fontSize: 16, fontWeight: '600', color: '#000', flex: 1, marginRight: 8 },
    newBadge: { flexDirection: 'row', alignItems: 'center' },
    newBadgeText: { fontSize: 14, fontWeight: '600', color: '#000' },
    priceRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4, gap: 6 },
    priceOriginal: { fontSize: 16, color: '#6B7280', textDecorationLine: 'line-through' },
    priceFinal: { fontSize: 16, fontWeight: '700', color: '#000' },
    priceUnit: { fontWeight: '400', color: '#4B5563' },

    sectionTitle: { fontSize: 22, fontWeight: '700', color: '#000', marginBottom: 24 },
    stepsList: { gap: 24, paddingBottom: 40 },
    stepItem: { flexDirection: 'row', gap: 16 },
    stepTitle: { fontSize: 16, fontWeight: '700', color: '#000', marginBottom: 4 },
    stepDesc: { fontSize: 14, color: '#6B7280', lineHeight: 20 },

    footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingTop: 16, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
    backLink: { fontSize: 16, fontWeight: '600', textDecorationLine: 'underline', color: '#000' },
    publishButton: { backgroundColor: '#222222', paddingHorizontal: 32, height: 56, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
    publishButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
