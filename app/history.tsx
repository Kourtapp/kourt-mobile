import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Pressable, RefreshControl, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Filter, Check, X, History } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/ui/EmptyState';
import { MatchService } from '../services/matchService';
import { Colors } from '../constants';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoryMatch {
    id: string;
    sport: string;
    start_time: string;
    status: string;
    score_team_a?: number;
    score_team_b?: number;
    courts?: {
        name: string;
    } | null;
}

export default function HistoryScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [matches, setMatches] = useState<HistoryMatch[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [stats, setStats] = useState<{
        total: number;
        wins: number;
        losses: number;
        winRate: string;
    } | null>(null);

    const fetchHistory = useCallback(async () => {
        try {
            const data = await MatchService.getHistory();
            setMatches(data as HistoryMatch[]);

            // Calculate stats
            if (data.length > 0) {
                // For now, we'll calculate based on completed matches
                // In a real scenario, you'd have win/loss data per user
                const completed = data.filter((m: any) => m.status === 'completed');
                const wins = completed.filter((m: any) =>
                    m.score_team_a !== undefined && m.score_team_b !== undefined &&
                    m.score_team_a > m.score_team_b
                ).length;
                const losses = completed.length - wins;
                const winRate = completed.length > 0
                    ? Math.round((wins / completed.length) * 100)
                    : 0;

                setStats({
                    total: data.length,
                    wins,
                    losses,
                    winRate: `${winRate}%`
                });
            } else {
                setStats(null);
            }
        } catch (error) {
            console.error('[History] Error fetching:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [fetchHistory]);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    };

    const hasMatches = matches.length > 0;

    // Group matches by month
    const groupedMatches = matches.reduce((groups, match) => {
        const date = parseISO(match.start_time);
        const monthKey = format(date, 'MMMM yyyy', { locale: ptBR });
        const capitalizedMonth = monthKey.charAt(0).toUpperCase() + monthKey.slice(1);

        if (!groups[capitalizedMonth]) {
            groups[capitalizedMonth] = [];
        }
        groups[capitalizedMonth].push(match);
        return groups;
    }, {} as Record<string, HistoryMatch[]>);

    const StatBox = ({ value, label, color }: { value: string, label: string, color?: string }) => (
        <View className="flex-1 items-center">
            <Text className={`text-2xl font-black ${color || 'text-gray-900'}`}>{value}</Text>
            <Text className="text-xs text-gray-500 font-medium">{label}</Text>
        </View>
    );

    const MatchItem = ({ match }: { match: HistoryMatch }) => {
        const hasScore = match.score_team_a !== undefined && match.score_team_b !== undefined;
        const isWin = hasScore && (match.score_team_a || 0) > (match.score_team_b || 0);
        const score = hasScore
            ? `${match.score_team_a} - ${match.score_team_b}`
            : match.status === 'cancelled' ? 'Cancelada' : 'Sem placar';

        const matchDate = parseISO(match.start_time);
        const formattedDate = format(matchDate, "dd/MM 'às' HH:mm", { locale: ptBR });

        return (
            <Pressable
                onPress={() => router.push(`/match/${match.id}`)}
                className="flex-row items-center bg-white border border-gray-100 rounded-2xl p-4 mb-3"
                accessible={true}
                accessibilityLabel={`Partida de ${match.sport}. ${score}. ${formattedDate}`}
                accessibilityHint="Toque para ver detalhes da partida"
            >
                <View className={`w-12 h-12 rounded-full items-center justify-center mr-4 ${hasScore ? (isWin ? 'bg-green-100' : 'bg-red-100') : 'bg-gray-100'
                    }`}>
                    {hasScore ? (
                        isWin ? <Check size={20} color={Colors.successDark} /> : <X size={20} color={Colors.error} />
                    ) : (
                        <History size={20} color={Colors.neutral[500]} />
                    )}
                </View>

                <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="font-bold text-gray-900 text-base">{match.sport}</Text>
                        <Text className={`font-bold text-base ${hasScore ? (isWin ? 'text-green-600' : 'text-red-500') : 'text-gray-500'
                            }`}>
                            {score}
                        </Text>
                    </View>
                    <Text className="text-gray-500 text-sm">
                        {formattedDate}
                        {match.courts?.name && ` · ${match.courts.name}`}
                    </Text>
                </View>
            </Pressable>
        );
    };

    if (loading) {
        return (
            <View className="flex-1 bg-white">
                <View
                    className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100 bg-white"
                    style={{ paddingTop: insets.top }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-gray-50"
                        accessible={true}
                        accessibilityLabel="Voltar"
                        accessibilityRole="button"
                    >
                        <ArrowLeft size={24} color={Colors.text} />
                    </Pressable>
                    <Text className="font-bold text-lg text-gray-900">Histórico</Text>
                    <View className="w-10 h-10" />
                </View>
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text className="text-neutral-500 mt-4">Carregando histórico...</Text>
                </View>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-5 py-3 border-b border-gray-100 bg-white"
                style={{ paddingTop: insets.top }}
            >
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-gray-50"
                    accessible={true}
                    accessibilityLabel="Voltar"
                    accessibilityRole="button"
                >
                    <ArrowLeft size={24} color="#000" />
                </Pressable>
                <Text className="font-bold text-lg text-gray-900">Histórico</Text>
                <Pressable
                    className="w-10 h-10 items-center justify-center -mr-2 rounded-full active:bg-gray-50"
                    accessible={true}
                    accessibilityLabel="Filtrar partidas"
                    accessibilityRole="button"
                >
                    <Filter size={20} color={Colors.text} />
                </Pressable>
            </View>

            {!hasMatches ? (
                <EmptyState
                    icon={History}
                    title="Nenhuma partida no histórico"
                    description="Suas partidas jogadas aparecerão aqui com estatísticas detalhadas"
                    actionLabel="Encontrar partida"
                    onAction={() => router.push('/(tabs)/map')}
                />
            ) : (
                <ScrollView
                    className="flex-1"
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {/* Summary Stats */}
                    {stats && (
                        <View className="flex-row justify-between px-5 py-8 border-b border-gray-50">
                            <StatBox value={String(stats.total)} label="Partidas" />
                            <StatBox value={String(stats.wins)} label="Vitórias" color="text-green-600" />
                            <StatBox value={String(stats.losses)} label="Derrotas" color="text-red-500" />
                            <StatBox value={stats.winRate} label="Win Rate" />
                        </View>
                    )}

                    {/* List content */}
                    <View className="px-5 pt-6 pb-10">
                        {Object.entries(groupedMatches).map(([month, monthMatches]) => (
                            <View key={month}>
                                <Text className="font-bold text-gray-500 text-xs mb-4 mt-4 uppercase tracking-wide">
                                    {month}
                                </Text>
                                {monthMatches.map(match => (
                                    <MatchItem key={match.id} match={match} />
                                ))}
                            </View>
                        ))}
                    </View>

                    {matches.length >= 10 && (
                        <Pressable
                            className="mx-5 bg-gray-50 py-4 rounded-xl items-center mb-8"
                            accessible={true}
                            accessibilityLabel="Carregar mais partidas"
                            accessibilityRole="button"
                        >
                            <Text className="font-bold text-gray-900">Carregar mais</Text>
                        </Pressable>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
