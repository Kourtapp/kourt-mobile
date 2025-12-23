import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, TextInput, Alert } from 'react-native';
import { useState } from 'react';
import { Wallet, TrendingUp, ChevronRight, X } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { BalanceCard } from './BalanceCard';
import { RevenueChart } from './RevenueChart';
import { TransactionItem } from './TransactionItem';
import {
    FinancialSummary,
    RevenueByPeriod,
    Transaction,
} from '../../services/hostDashboardService';

interface FinanceiroTabProps {
    summary: FinancialSummary | null;
    monthlyRevenue: RevenueByPeriod[];
    transactions: Transaction[];
    revenueBreakdown: { courtId: string; courtName: string; revenue: number; percentage: number }[];
    onRequestWithdrawal: (amount: number) => Promise<{ success: boolean; error?: string }>;
    onViewPayoutHistory: () => void;
    refreshing: boolean;
    onRefresh: () => void;
}

export function FinanceiroTab({
    summary,
    monthlyRevenue,
    transactions,
    revenueBreakdown,
    onRequestWithdrawal,
    onViewPayoutHistory,
    refreshing,
    onRefresh,
}: FinanceiroTabProps) {
    const [withdrawModalVisible, setWithdrawModalVisible] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawing, setWithdrawing] = useState(false);

    const formatCurrency = (value: number) => {
        return value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount.replace(/[^0-9,]/g, '').replace(',', '.'));
        if (isNaN(amount) || amount <= 0) {
            Alert.alert('Erro', 'Digite um valor válido');
            return;
        }

        if (amount > (summary?.availableBalance || 0)) {
            Alert.alert('Erro', 'Valor maior que o saldo disponível');
            return;
        }

        setWithdrawing(true);
        const result = await onRequestWithdrawal(amount);
        setWithdrawing(false);

        if (result.success) {
            setWithdrawModalVisible(false);
            setWithdrawAmount('');
            Alert.alert('Sucesso', 'Solicitação de saque enviada!');
        } else {
            Alert.alert('Erro', result.error || 'Erro ao solicitar saque');
        }
    };

    return (
        <>
            <ScrollView
                className="flex-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className="px-4 py-4">
                    {/* Balance Card */}
                    {summary && (
                        <View className="mb-5">
                            <BalanceCard
                                availableBalance={summary.availableBalance}
                                pendingBalance={summary.pendingBalance}
                                nextPayoutDate={summary.nextPayoutDate}
                                onWithdraw={() => setWithdrawModalVisible(true)}
                                delay={0}
                            />
                        </View>
                    )}

                    {/* Period Summary Cards */}
                    <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-5">
                        <Text className="text-base font-bold text-gray-800 mb-3">
                            Resumo por Período
                        </Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {monthlyRevenue.slice(-3).reverse().map((item, index) => (
                                <View
                                    key={item.period}
                                    className="bg-white rounded-xl border border-gray-100 p-4 mr-3"
                                    style={{ width: 140 }}
                                >
                                    <Text className="text-xs text-gray-500 uppercase mb-1">
                                        {index === 0 ? 'Este mês' : index === 1 ? 'Mês passado' : item.period}
                                    </Text>
                                    <Text className="text-xl font-bold text-gray-900">
                                        {formatCurrency(item.revenue)}
                                    </Text>
                                    <View className="flex-row items-center mt-1">
                                        <TrendingUp
                                            size={12}
                                            color={item.change >= 0 ? '#22C55E' : '#EF4444'}
                                        />
                                        <Text
                                            className={`text-xs font-semibold ml-1 ${
                                                item.change >= 0 ? 'text-green-500' : 'text-red-500'
                                            }`}
                                        >
                                            {item.change >= 0 ? '+' : ''}{item.change.toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </Animated.View>

                    {/* Revenue Chart */}
                    {monthlyRevenue.length > 0 && (
                        <View className="mb-5">
                            <RevenueChart data={monthlyRevenue} delay={200} />
                        </View>
                    )}

                    {/* Revenue by Court Breakdown */}
                    {revenueBreakdown.length > 0 && (
                        <Animated.View entering={FadeInDown.delay(300).duration(400)} className="mb-5">
                            <View className="bg-white rounded-2xl border border-gray-100 p-4">
                                <Text className="text-sm font-bold text-gray-700 mb-4">
                                    Receita por Quadra
                                </Text>
                                {revenueBreakdown.map((item, index) => (
                                    <View key={item.courtId} className="mb-3 last:mb-0">
                                        <View className="flex-row items-center justify-between mb-1">
                                            <Text className="text-sm text-gray-700" numberOfLines={1}>
                                                {item.courtName}
                                            </Text>
                                            <Text className="text-sm font-semibold text-gray-900">
                                                {formatCurrency(item.revenue)}
                                            </Text>
                                        </View>
                                        <View className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <View
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${item.percentage}%`,
                                                    backgroundColor: index === 0 ? '#22C55E' : index === 1 ? '#3B82F6' : '#9CA3AF',
                                                }}
                                            />
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </Animated.View>
                    )}

                    {/* Recent Transactions */}
                    <Animated.View entering={FadeInDown.delay(400).duration(400)}>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-bold text-gray-800">
                                Movimentações Recentes
                            </Text>
                            <TouchableOpacity
                                onPress={onViewPayoutHistory}
                                className="flex-row items-center"
                            >
                                <Text className="text-sm font-medium text-green-600 mr-1">
                                    Ver histórico
                                </Text>
                                <ChevronRight size={16} color="#22C55E" />
                            </TouchableOpacity>
                        </View>

                        <View className="bg-white rounded-2xl border border-gray-100 px-4">
                            {transactions.length === 0 ? (
                                <View className="py-8 items-center">
                                    <Wallet size={32} color="#D1D5DB" />
                                    <Text className="text-sm text-gray-400 mt-2">
                                        Nenhuma movimentação ainda
                                    </Text>
                                </View>
                            ) : (
                                transactions.slice(0, 10).map((transaction) => (
                                    <TransactionItem
                                        key={transaction.id}
                                        transaction={transaction}
                                    />
                                ))
                            )}
                        </View>
                    </Animated.View>
                </View>
            </ScrollView>

            {/* Withdraw Modal */}
            <Modal
                visible={withdrawModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setWithdrawModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold text-gray-900">
                                Solicitar Saque
                            </Text>
                            <TouchableOpacity onPress={() => setWithdrawModalVisible(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <Text className="text-sm text-gray-500 mb-2">
                            Saldo disponível: {formatCurrency(summary?.availableBalance || 0)}
                        </Text>

                        <View className="bg-gray-50 rounded-xl p-4 mb-4">
                            <Text className="text-xs text-gray-500 mb-1">Valor do saque</Text>
                            <TextInput
                                value={withdrawAmount}
                                onChangeText={setWithdrawAmount}
                                placeholder="R$ 0,00"
                                keyboardType="numeric"
                                className="text-2xl font-bold text-gray-900"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={handleWithdraw}
                            disabled={withdrawing}
                            className={`rounded-xl py-4 items-center ${
                                withdrawing ? 'bg-gray-300' : 'bg-green-500'
                            }`}
                        >
                            <Text className="text-white font-semibold text-base">
                                {withdrawing ? 'Processando...' : 'Confirmar Saque'}
                            </Text>
                        </TouchableOpacity>

                        <Text className="text-xs text-gray-400 text-center mt-4">
                            O valor será transferido em até 3 dias úteis
                        </Text>
                    </View>
                </View>
            </Modal>
        </>
    );
}
