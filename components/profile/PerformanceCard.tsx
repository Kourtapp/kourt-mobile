import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface PerformanceCardProps {
    sport: string;
    stats?: {
        totalMatches: number;
        wins: number;
        losses: number;
        winRate: number;
        currentStreak: number;
        bestStreak: number;
        avgPointsScored: number;
        avgPointsConceded: number;
    };
}

export function PerformanceCard({ sport, stats }: PerformanceCardProps) {
    // Default/mock stats - in production would come from database
    const data = stats || {
        totalMatches: 0,
        wins: 0,
        losses: 0,
        winRate: 0,
        currentStreak: 0,
        bestStreak: 0,
        avgPointsScored: 0,
        avgPointsConceded: 0,
    };

    const hasMatches = data.totalMatches > 0;

    if (!hasMatches) {
        // No matches yet - show CTA
        return (
            <View className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-5 mb-8 border border-slate-200">
                <View className="items-center py-4">
                    <View className="w-14 h-14 bg-slate-200 rounded-full items-center justify-center mb-3">
                        <MaterialIcons name="sports-score" size={28} color="#64748B" />
                    </View>
                    <Text className="text-lg font-bold text-slate-900 mb-1">
                        Estatísticas de {sport}
                    </Text>
                    <Text className="text-slate-500 text-center text-sm mb-4">
                        Jogue partidas para começar a{'\n'}acompanhar seu desempenho
                    </Text>
                    <TouchableOpacity
                        onPress={() => router.push('/match/create')}
                        className="bg-black px-5 py-2.5 rounded-xl"
                    >
                        <Text className="text-white font-semibold">Criar partida</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    // Calculate derived stats
    const pointsDiff = data.avgPointsScored - data.avgPointsConceded;
    const isPositive = pointsDiff >= 0;

    return (
        <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-slate-100">
            {/* Header */}
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold text-slate-900">Desempenho</Text>
                <TouchableOpacity
                    onPress={() => router.push('/profile/statistics')}
                    className="flex-row items-center"
                >
                    <Text className="text-blue-500 text-sm font-medium mr-1">Ver tudo</Text>
                    <MaterialIcons name="chevron-right" size={18} color="#3B82F6" />
                </TouchableOpacity>
            </View>

            {/* Main Stats Row */}
            <View className="flex-row mb-4">
                {/* Win Rate Circle */}
                <View className="items-center mr-6">
                    <View className="w-20 h-20 rounded-full border-4 border-green-500 items-center justify-center bg-green-50">
                        <Text className="text-2xl font-black text-green-600">{data.winRate}%</Text>
                    </View>
                    <Text className="text-xs text-slate-500 mt-2">Win Rate</Text>
                </View>

                {/* Stats Grid */}
                <View className="flex-1 justify-center">
                    <View className="flex-row mb-3">
                        <View className="flex-1">
                            <Text className="text-xs text-slate-400 uppercase">Vitórias</Text>
                            <Text className="text-xl font-bold text-green-600">{data.wins}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-slate-400 uppercase">Derrotas</Text>
                            <Text className="text-xl font-bold text-red-500">{data.losses}</Text>
                        </View>
                    </View>
                    <View className="flex-row">
                        <View className="flex-1">
                            <Text className="text-xs text-slate-400 uppercase">Total</Text>
                            <Text className="text-xl font-bold text-slate-900">{data.totalMatches}</Text>
                        </View>
                        <View className="flex-1">
                            <Text className="text-xs text-slate-400 uppercase">Sequência</Text>
                            <View className="flex-row items-center">
                                {data.currentStreak > 0 && (
                                    <MaterialIcons name="local-fire-department" size={16} color="#F97316" />
                                )}
                                <Text className="text-xl font-bold text-slate-900">{data.currentStreak}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            {/* Points Stats */}
            <View className="bg-slate-50 rounded-xl p-3 flex-row">
                <View className="flex-1 items-center border-r border-slate-200">
                    <Text className="text-xs text-slate-400 mb-1">Pontos feitos</Text>
                    <Text className="text-lg font-bold text-slate-900">{data.avgPointsScored.toFixed(1)}</Text>
                    <Text className="text-[10px] text-slate-400">média/partida</Text>
                </View>
                <View className="flex-1 items-center border-r border-slate-200">
                    <Text className="text-xs text-slate-400 mb-1">Pontos sofridos</Text>
                    <Text className="text-lg font-bold text-slate-900">{data.avgPointsConceded.toFixed(1)}</Text>
                    <Text className="text-[10px] text-slate-400">média/partida</Text>
                </View>
                <View className="flex-1 items-center">
                    <Text className="text-xs text-slate-400 mb-1">Saldo</Text>
                    <Text className={`text-lg font-bold ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? '+' : ''}{pointsDiff.toFixed(1)}
                    </Text>
                    <Text className="text-[10px] text-slate-400">média/partida</Text>
                </View>
            </View>

            {/* Best Streak Badge */}
            {data.bestStreak > 2 && (
                <View className="mt-3 flex-row items-center justify-center bg-amber-50 py-2 px-3 rounded-lg">
                    <MaterialIcons name="emoji-events" size={16} color="#F59E0B" />
                    <Text className="text-amber-700 text-xs font-medium ml-1">
                        Melhor sequência: {data.bestStreak} vitórias
                    </Text>
                </View>
            )}
        </View>
    );
}
