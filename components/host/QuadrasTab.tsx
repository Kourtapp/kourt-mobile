import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { Plus, BarChart3, Clock, X, TrendingUp, Ban } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { CourtCard } from './CourtCard';
import { CourtWithAnalytics, CourtAnalytics } from '../../services/hostDashboardService';

interface QuadrasTabProps {
    courts: CourtWithAnalytics[];
    selectedCourtId: string | null;
    selectedCourtAnalytics: CourtAnalytics | null;
    onCourtPress: (court: CourtWithAnalytics) => void;
    onAddCourt: () => void;
    onEditCourt: (courtId: string) => void;
    onViewAnalytics: (courtId: string) => void;
    onToggleStatus: (courtId: string, isActive: boolean) => Promise<{ success: boolean; error?: string }>;
    refreshing: boolean;
    onRefresh: () => void;
}

export function QuadrasTab({
    courts,
    selectedCourtId,
    selectedCourtAnalytics,
    onCourtPress,
    onAddCourt,
    onEditCourt,
    onViewAnalytics,
    onToggleStatus,
    refreshing,
    onRefresh,
}: QuadrasTabProps) {
    const [menuVisible, setMenuVisible] = useState(false);
    const [selectedCourt, setSelectedCourt] = useState<CourtWithAnalytics | null>(null);
    const [analyticsModalVisible, setAnalyticsModalVisible] = useState(false);

    const handleMenuPress = (court: CourtWithAnalytics) => {
        setSelectedCourt(court);
        setMenuVisible(true);
    };

    const handleToggleStatus = async () => {
        if (!selectedCourt) return;

        const newStatus = !selectedCourt.is_active;
        const result = await onToggleStatus(selectedCourt.id, newStatus);

        if (result.success) {
            setMenuVisible(false);
            Alert.alert(
                'Sucesso',
                newStatus ? 'Quadra ativada!' : 'Quadra desativada!'
            );
        } else {
            Alert.alert('Erro', result.error || 'Erro ao alterar status');
        }
    };

    const handleViewAnalytics = () => {
        if (selectedCourt) {
            setMenuVisible(false);
            onViewAnalytics(selectedCourt.id);
            setAnalyticsModalVisible(true);
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
                    {/* Add Court Button */}
                    <Animated.View entering={FadeInDown.duration(400)}>
                        <TouchableOpacity
                            onPress={onAddCourt}
                            className="bg-green-500 rounded-2xl p-4 flex-row items-center justify-center mb-5"
                            activeOpacity={0.8}
                        >
                            <Plus size={20} color="white" />
                            <Text className="text-white font-semibold text-base ml-2">
                                Adicionar Nova Quadra
                            </Text>
                        </TouchableOpacity>
                    </Animated.View>

                    {/* Stats Summary */}
                    {courts.length > 0 && (
                        <Animated.View entering={FadeInDown.delay(100).duration(400)} className="mb-5">
                            <View className="flex-row">
                                <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4 mr-2">
                                    <Text className="text-2xl font-bold text-gray-900">
                                        {courts.length}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        Quadras cadastradas
                                    </Text>
                                </View>
                                <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4 mr-2">
                                    <Text className="text-2xl font-bold text-green-600">
                                        {courts.filter(c => c.is_active).length}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        Ativas
                                    </Text>
                                </View>
                                <View className="flex-1 bg-white rounded-xl border border-gray-100 p-4">
                                    <Text className="text-2xl font-bold text-gray-900">
                                        {courts.reduce((sum, c) => sum + c.totalBookings, 0)}
                                    </Text>
                                    <Text className="text-xs text-gray-500">
                                        Reservas/mês
                                    </Text>
                                </View>
                            </View>
                        </Animated.View>
                    )}

                    {/* Courts List */}
                    {courts.length === 0 ? (
                        <View className="items-center py-16">
                            <BarChart3 size={48} color="#D1D5DB" />
                            <Text className="text-base font-medium text-gray-400 mt-4">
                                Nenhuma quadra cadastrada
                            </Text>
                            <Text className="text-sm text-gray-400 mt-1">
                                Adicione sua primeira quadra
                            </Text>
                        </View>
                    ) : (
                        courts.map((court, index) => (
                            <CourtCard
                                key={court.id}
                                court={court}
                                onPress={() => onCourtPress(court)}
                                onMenuPress={() => handleMenuPress(court)}
                                delay={200 + index * 100}
                            />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Court Menu Modal */}
            <Modal
                visible={menuVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setMenuVisible(false)}
            >
                <TouchableOpacity
                    className="flex-1 bg-black/50"
                    activeOpacity={1}
                    onPress={() => setMenuVisible(false)}
                >
                    <View className="flex-1" />
                    <View className="bg-white rounded-t-3xl p-6">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold text-gray-900" numberOfLines={1}>
                                {selectedCourt?.name}
                            </Text>
                            <TouchableOpacity onPress={() => setMenuVisible(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <View className="space-y-2">
                            <TouchableOpacity
                                onPress={() => {
                                    setMenuVisible(false);
                                    if (selectedCourt) onEditCourt(selectedCourt.id);
                                }}
                                className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-2"
                            >
                                <BarChart3 size={20} color="#6B7280" />
                                <Text className="text-base font-medium text-gray-700 ml-3">
                                    Editar informações
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleViewAnalytics}
                                className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-2"
                            >
                                <TrendingUp size={20} color="#6B7280" />
                                <Text className="text-base font-medium text-gray-700 ml-3">
                                    Ver analytics
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={handleToggleStatus}
                                className="flex-row items-center p-4 bg-gray-50 rounded-xl"
                            >
                                {selectedCourt?.is_active ? (
                                    <>
                                        <Ban size={20} color="#EF4444" />
                                        <Text className="text-base font-medium text-red-500 ml-3">
                                            Desativar quadra
                                        </Text>
                                    </>
                                ) : (
                                    <>
                                        <Plus size={20} color="#22C55E" />
                                        <Text className="text-base font-medium text-green-500 ml-3">
                                            Ativar quadra
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* Analytics Modal */}
            <Modal
                visible={analyticsModalVisible}
                transparent
                animationType="slide"
                onRequestClose={() => setAnalyticsModalVisible(false)}
            >
                <View className="flex-1 bg-black/50 justify-end">
                    <View className="bg-white rounded-t-3xl p-6 max-h-[80%]">
                        <View className="flex-row items-center justify-between mb-6">
                            <Text className="text-xl font-bold text-gray-900">
                                Analytics
                            </Text>
                            <TouchableOpacity onPress={() => setAnalyticsModalVisible(false)}>
                                <X size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        {selectedCourtAnalytics ? (
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {/* Main Stats */}
                                <View className="flex-row mb-4">
                                    <View className="flex-1 bg-green-50 rounded-xl p-4 mr-2">
                                        <Text className="text-xs text-gray-500">Ocupação</Text>
                                        <Text className="text-2xl font-bold text-green-600">
                                            {selectedCourtAnalytics.occupancyRate.toFixed(0)}%
                                        </Text>
                                    </View>
                                    <View className="flex-1 bg-blue-50 rounded-xl p-4">
                                        <Text className="text-xs text-gray-500">Horário de pico</Text>
                                        <Text className="text-2xl font-bold text-blue-600">
                                            {selectedCourtAnalytics.peakHour}
                                        </Text>
                                    </View>
                                </View>

                                <View className="flex-row mb-6">
                                    <View className="flex-1 bg-purple-50 rounded-xl p-4 mr-2">
                                        <Text className="text-xs text-gray-500">Receita/hora</Text>
                                        <Text className="text-2xl font-bold text-purple-600">
                                            R$ {selectedCourtAnalytics.revenuePerHour.toFixed(0)}
                                        </Text>
                                    </View>
                                    <View className="flex-1 bg-red-50 rounded-xl p-4">
                                        <Text className="text-xs text-gray-500">Cancelamentos</Text>
                                        <Text className="text-2xl font-bold text-red-600">
                                            {selectedCourtAnalytics.cancellationRate.toFixed(1)}%
                                        </Text>
                                    </View>
                                </View>

                                {/* Popular Hours */}
                                <Text className="text-base font-bold text-gray-800 mb-3">
                                    Horários Mais Populares
                                </Text>
                                {selectedCourtAnalytics.popularHours.map((hour, index) => (
                                    <View key={hour.hour} className="flex-row items-center mb-2">
                                        <View className="w-16">
                                            <Text className="text-sm font-medium text-gray-700">
                                                {hour.hour}
                                            </Text>
                                        </View>
                                        <View className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden mr-2">
                                            <View
                                                className="h-full rounded-full"
                                                style={{
                                                    width: `${hour.rate}%`,
                                                    backgroundColor: index === 0 ? '#22C55E' : '#9CA3AF',
                                                }}
                                            />
                                        </View>
                                        <Text className="text-sm text-gray-500 w-12 text-right">
                                            {hour.rate.toFixed(0)}%
                                        </Text>
                                    </View>
                                ))}
                            </ScrollView>
                        ) : (
                            <View className="items-center py-8">
                                <Clock size={32} color="#D1D5DB" />
                                <Text className="text-sm text-gray-400 mt-2">
                                    Carregando analytics...
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </Modal>
        </>
    );
}
