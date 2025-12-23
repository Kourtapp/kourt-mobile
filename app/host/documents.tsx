import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, FileText, Download, Calendar, CheckCircle, AlertCircle, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';

// Mock documents
const MOCK_DOCUMENTS = [
    {
        id: '1',
        type: 'invoice',
        name: 'Nota Fiscal - Dezembro 2024',
        date: '01 Dez 2024',
        amount: 5400,
        status: 'available',
    },
    {
        id: '2',
        type: 'invoice',
        name: 'Nota Fiscal - Novembro 2024',
        date: '01 Nov 2024',
        amount: 4800,
        status: 'available',
    },
    {
        id: '3',
        type: 'receipt',
        name: 'Comprovante de Pagamento',
        date: '28 Nov 2024',
        amount: 4800,
        status: 'available',
    },
    {
        id: '4',
        type: 'annual',
        name: 'Relatório Anual 2024',
        date: 'Em processamento',
        status: 'processing',
    },
];

const DOCUMENT_TYPES = {
    invoice: { label: 'Nota Fiscal', color: '#3B82F6', bg: '#DBEAFE' },
    receipt: { label: 'Comprovante', color: '#22C55E', bg: '#DCFCE7' },
    annual: { label: 'Relatório', color: '#8B5CF6', bg: '#EDE9FE' },
};

export default function DocumentsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const formatCurrency = (value?: number) => {
        if (!value) return '';
        return `R$ ${value.toLocaleString('pt-BR')}`;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Documentos Fiscais</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                {/* Info Card */}
                <Animated.View entering={FadeIn.delay(100)} style={styles.infoCard}>
                    <FileText size={24} color="#3B82F6" />
                    <View style={styles.infoContent}>
                        <Text style={styles.infoTitle}>Seus documentos fiscais</Text>
                        <Text style={styles.infoText}>
                            Aqui você encontra todas as notas fiscais e comprovantes
                            gerados automaticamente para suas transações.
                        </Text>
                    </View>
                </Animated.View>

                {/* Tax Summary */}
                <Animated.View entering={FadeIn.delay(200)} style={styles.taxCard}>
                    <Text style={styles.taxTitle}>Resumo Fiscal 2024</Text>
                    <View style={styles.taxGrid}>
                        <View style={styles.taxItem}>
                            <Text style={styles.taxLabel}>Total Recebido</Text>
                            <Text style={styles.taxValue}>R$ 45.200</Text>
                        </View>
                        <View style={styles.taxItem}>
                            <Text style={styles.taxLabel}>Notas Emitidas</Text>
                            <Text style={styles.taxValue}>12</Text>
                        </View>
                    </View>
                    <View style={styles.taxNote}>
                        <AlertCircle size={16} color="#F59E0B" />
                        <Text style={styles.taxNoteText}>
                            Lembre-se de declarar seus rendimentos no imposto de renda
                        </Text>
                    </View>
                </Animated.View>

                {/* Documents List */}
                <Text style={styles.sectionTitle}>Documentos</Text>

                {MOCK_DOCUMENTS.map((doc, index) => {
                    const typeInfo = DOCUMENT_TYPES[doc.type as keyof typeof DOCUMENT_TYPES];
                    const isProcessing = doc.status === 'processing';

                    return (
                        <Animated.View key={doc.id} entering={FadeInDown.delay(index * 100)}>
                            <Pressable style={styles.documentCard}>
                                <View style={[styles.documentIcon, { backgroundColor: typeInfo.bg }]}>
                                    <FileText size={20} color={typeInfo.color} />
                                </View>

                                <View style={styles.documentContent}>
                                    <View style={styles.documentHeader}>
                                        <View style={[styles.typeBadge, { backgroundColor: typeInfo.bg }]}>
                                            <Text style={[styles.typeText, { color: typeInfo.color }]}>
                                                {typeInfo.label}
                                            </Text>
                                        </View>
                                        {isProcessing ? (
                                            <View style={styles.processingBadge}>
                                                <Clock size={12} color="#F59E0B" />
                                                <Text style={styles.processingText}>Processando</Text>
                                            </View>
                                        ) : (
                                            <View style={styles.availableBadge}>
                                                <CheckCircle size={12} color="#22C55E" />
                                                <Text style={styles.availableText}>Disponível</Text>
                                            </View>
                                        )}
                                    </View>

                                    <Text style={styles.documentName}>{doc.name}</Text>

                                    <View style={styles.documentMeta}>
                                        <View style={styles.metaItem}>
                                            <Calendar size={14} color="#6B7280" />
                                            <Text style={styles.metaText}>{doc.date}</Text>
                                        </View>
                                        {doc.amount && (
                                            <Text style={styles.documentAmount}>
                                                {formatCurrency(doc.amount)}
                                            </Text>
                                        )}
                                    </View>
                                </View>

                                {!isProcessing && (
                                    <Pressable style={styles.downloadButton}>
                                        <Download size={20} color="#3B82F6" />
                                    </Pressable>
                                )}
                            </Pressable>
                        </Animated.View>
                    );
                })}

                {/* Help Card */}
                <Animated.View entering={FadeInDown.delay(500)} style={styles.helpCard}>
                    <Text style={styles.helpTitle}>Precisa de ajuda?</Text>
                    <Text style={styles.helpText}>
                        Se você tiver dúvidas sobre seus documentos fiscais ou precisar
                        de um documento específico, entre em contato com nosso suporte.
                    </Text>
                    <Pressable style={styles.helpButton}>
                        <Text style={styles.helpButtonText}>Falar com suporte</Text>
                    </Pressable>
                </Animated.View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    backButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    content: {
        padding: 16,
        paddingBottom: 100,
    },
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#DBEAFE',
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        gap: 12,
    },
    infoContent: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1E40AF',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#1E40AF',
        lineHeight: 18,
    },
    taxCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 24,
    },
    taxTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 16,
    },
    taxGrid: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 16,
    },
    taxItem: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        padding: 12,
    },
    taxLabel: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 4,
    },
    taxValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#111827',
    },
    taxNote: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#FFFBEB',
        borderRadius: 8,
        padding: 12,
    },
    taxNoteText: {
        flex: 1,
        fontSize: 12,
        color: '#92400E',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
        marginBottom: 16,
    },
    documentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    documentIcon: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    documentContent: {
        flex: 1,
        marginLeft: 12,
    },
    documentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 6,
    },
    typeText: {
        fontSize: 10,
        fontWeight: '600',
    },
    processingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    processingText: {
        fontSize: 10,
        color: '#F59E0B',
        fontWeight: '500',
    },
    availableBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    availableText: {
        fontSize: 10,
        color: '#22C55E',
        fontWeight: '500',
    },
    documentName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 4,
    },
    documentMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6B7280',
    },
    documentAmount: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
    downloadButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#EFF6FF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    helpCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginTop: 12,
    },
    helpTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 8,
    },
    helpText: {
        fontSize: 13,
        color: '#6B7280',
        lineHeight: 18,
        marginBottom: 12,
    },
    helpButton: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: 'center',
    },
    helpButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#111827',
    },
});
