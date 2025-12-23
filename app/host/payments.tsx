import { View, Text, StyleSheet, Pressable, ScrollView, FlatList } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { ArrowLeft, DollarSign, TrendingUp, Download } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Mock payments data
const MOCK_PAYMENTS = [
    {
        id: '1',
        date: '14 Dez 2024',
        amount: 120,
        type: 'booking',
        description: 'Reserva - Maria Santos',
        court: 'Beach Tennis Premium',
        status: 'completed',
    },
    {
        id: '2',
        date: '13 Dez 2024',
        amount: 240,
        type: 'booking',
        description: 'Reserva - Pedro Oliveira',
        court: 'Beach Tennis Premium',
        status: 'completed',
    },
    {
        id: '3',
        date: '12 Dez 2024',
        amount: 100,
        type: 'booking',
        description: 'Reserva - Ana Costa',
        court: 'Tênis Coberta',
        status: 'pending',
    },
    {
        id: '4',
        date: '11 Dez 2024',
        amount: 360,
        type: 'booking',
        description: 'Reserva - João Silva (3h)',
        court: 'Beach Tennis Premium',
        status: 'completed',
    },
    {
        id: '5',
        date: '10 Dez 2024',
        amount: 1200,
        type: 'tournament',
        description: 'Copa Beach Pinheiros - Inscrições',
        court: 'Beach Tennis Premium',
        status: 'completed',
    },
    {
        id: '6',
        date: '05 Dez 2024',
        amount: 5400,
        type: 'withdrawal',
        description: 'Saque para conta Nubank',
        status: 'completed',
    },
];

const FILTERS = [
    { id: 'all', label: 'Todos' },
    { id: 'booking', label: 'Reservas' },
    { id: 'tournament', label: 'Torneios' },
    { id: 'withdrawal', label: 'Saques' },
];

const SUMMARY = {
    balance: 2420,
    thisMonth: 7820,
    pending: 100,
    growth: 12,
};

export default function PaymentsScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPayments = MOCK_PAYMENTS.filter(payment =>
        activeFilter === 'all' || payment.type === activeFilter
    );

    const formatCurrency = (value: number) => {
        return `R$ ${value.toLocaleString('pt-BR')}`;
    };

    const renderPayment = ({ item, index }: { item: typeof MOCK_PAYMENTS[0]; index: number }) => (
        <Animated.View entering={FadeInDown.delay(index * 50)}>
            <Pressable style={styles.paymentCard}>
                <View style={[
                    styles.paymentIcon,
                    item.type === 'withdrawal' && styles.paymentIconWithdrawal,
                    item.type === 'tournament' && styles.paymentIconTournament,
                ]}>
                    <DollarSign size={20} color={
                        item.type === 'withdrawal' ? '#EF4444' :
                            item.type === 'tournament' ? '#F59E0B' : '#22C55E'
                    } />
                </View>

                <View style={styles.paymentContent}>
                    <Text style={styles.paymentDescription}>{item.description}</Text>
                    {item.court && (
                        <Text style={styles.paymentCourt}>{item.court}</Text>
                    )}
                    <Text style={styles.paymentDate}>{item.date}</Text>
                </View>

                <View style={styles.paymentRight}>
                    <Text style={[
                        styles.paymentAmount,
                        item.type === 'withdrawal' && styles.paymentAmountNegative
                    ]}>
                        {item.type === 'withdrawal' ? '- ' : '+ '}
                        {formatCurrency(item.amount)}
                    </Text>
                    <View style={[
                        styles.statusBadge,
                        item.status === 'pending' && styles.statusPending
                    ]}>
                        <Text style={[
                            styles.statusText,
                            item.status === 'pending' && styles.statusTextPending
                        ]}>
                            {item.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Text>
                    </View>
                </View>
            </Pressable>
        </Animated.View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <Stack.Screen options={{ headerShown: false }} />

            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text style={styles.headerTitle}>Pagamentos</Text>
                <Pressable style={styles.exportButton}>
                    <Download size={20} color="#6B7280" />
                </Pressable>
            </View>

            {/* Summary Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.summaryContainer}
            >
                <Animated.View entering={FadeIn.delay(100)} style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Saldo Disponível</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(SUMMARY.balance)}</Text>
                    <Pressable style={styles.withdrawButton}>
                        <Text style={styles.withdrawButtonText}>Sacar</Text>
                    </Pressable>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(200)} style={[styles.summaryCard, styles.summaryCardSecondary]}>
                    <Text style={styles.summaryLabel}>Este mês</Text>
                    <Text style={styles.summaryValue}>{formatCurrency(SUMMARY.thisMonth)}</Text>
                    <View style={styles.growthBadge}>
                        <TrendingUp size={14} color="#22C55E" />
                        <Text style={styles.growthText}>+{SUMMARY.growth}%</Text>
                    </View>
                </Animated.View>

                <Animated.View entering={FadeIn.delay(300)} style={[styles.summaryCard, styles.summaryCardSecondary]}>
                    <Text style={styles.summaryLabel}>Pendente</Text>
                    <Text style={styles.summaryValuePending}>{formatCurrency(SUMMARY.pending)}</Text>
                    <Text style={styles.pendingNote}>Aguardando liberação</Text>
                </Animated.View>
            </ScrollView>

            {/* Filters */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filtersContainer}
            >
                {FILTERS.map((filter) => (
                    <Pressable
                        key={filter.id}
                        style={[
                            styles.filterChip,
                            activeFilter === filter.id && styles.filterChipActive
                        ]}
                        onPress={() => setActiveFilter(filter.id)}
                    >
                        <Text style={[
                            styles.filterText,
                            activeFilter === filter.id && styles.filterTextActive
                        ]}>
                            {filter.label}
                        </Text>
                    </Pressable>
                ))}
            </ScrollView>

            {/* Payments List */}
            <FlatList
                data={filteredPayments}
                renderItem={renderPayment}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <DollarSign size={48} color="#D1D5DB" />
                        <Text style={styles.emptyTitle}>Nenhum pagamento</Text>
                        <Text style={styles.emptyText}>
                            Seus pagamentos aparecerão aqui
                        </Text>
                    </View>
                }
            />
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
    exportButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
    },
    summaryContainer: {
        paddingHorizontal: 16,
        paddingVertical: 16,
        gap: 12,
    },
    summaryCard: {
        backgroundColor: '#22C55E',
        borderRadius: 16,
        padding: 16,
        width: 160,
        marginRight: 12,
    },
    summaryCardSecondary: {
        backgroundColor: '#FFF',
    },
    summaryLabel: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
        marginBottom: 4,
    },
    summaryValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FFF',
        marginBottom: 8,
    },
    summaryValuePending: {
        fontSize: 24,
        fontWeight: '700',
        color: '#F59E0B',
        marginBottom: 8,
    },
    withdrawButton: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingVertical: 8,
        borderRadius: 8,
        alignItems: 'center',
    },
    withdrawButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFF',
    },
    growthBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    growthText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#22C55E',
    },
    pendingNote: {
        fontSize: 12,
        color: '#6B7280',
    },
    filtersContainer: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        gap: 8,
    },
    filterChip: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        marginRight: 8,
    },
    filterChipActive: {
        backgroundColor: '#111827',
        borderColor: '#111827',
    },
    filterText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    filterTextActive: {
        color: '#FFF',
    },
    listContent: {
        paddingHorizontal: 16,
        paddingBottom: 100,
    },
    paymentCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    paymentIcon: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#DCFCE7',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paymentIconWithdrawal: {
        backgroundColor: '#FEE2E2',
    },
    paymentIconTournament: {
        backgroundColor: '#FEF3C7',
    },
    paymentContent: {
        flex: 1,
        marginLeft: 12,
    },
    paymentDescription: {
        fontSize: 15,
        fontWeight: '600',
        color: '#111827',
    },
    paymentCourt: {
        fontSize: 13,
        color: '#6B7280',
        marginTop: 2,
    },
    paymentDate: {
        fontSize: 12,
        color: '#9CA3AF',
        marginTop: 4,
    },
    paymentRight: {
        alignItems: 'flex-end',
    },
    paymentAmount: {
        fontSize: 16,
        fontWeight: '700',
        color: '#22C55E',
    },
    paymentAmountNegative: {
        color: '#EF4444',
    },
    statusBadge: {
        backgroundColor: '#DCFCE7',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 8,
        marginTop: 4,
    },
    statusPending: {
        backgroundColor: '#FEF3C7',
    },
    statusText: {
        fontSize: 10,
        fontWeight: '600',
        color: '#166534',
    },
    statusTextPending: {
        color: '#92400E',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginTop: 16,
    },
    emptyText: {
        fontSize: 14,
        color: '#6B7280',
        marginTop: 4,
    },
});
