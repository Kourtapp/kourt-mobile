import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MenuItem } from '../MenuItem';
import { router } from 'expo-router';
import { useAuthStore } from '../../../stores/authStore';
import { useUserRankingStats } from '../../../hooks/useRanking';

import { useUserStore } from '../../../stores/useUserStore';
import { RadarChart } from '../RadarChart';
import SejaHostCard from '../../host/SejaHostCard';
import { TeamService } from '../../../services/teamService';
import { Team } from '../../../types/team';
import { useEffect, useState } from 'react';
import { PlayerPreferences } from '../PlayerPreferences';
import { LevelProgressCard } from '../LevelProgressCard';
import { SportIcon } from '../../SportIcon';

// Available sports for filter
const SPORTS_FILTER = [
    { id: 'beach-tennis', name: 'Beach Tennis' },
    { id: 'padel', name: 'Padel' },
    { id: 'tennis', name: 'Tênis' },
];

function RankingCard() {
    const { stats, loading } = useUserRankingStats();

    // Default values when no ranking data
    const rank = stats?.rank ?? '-';
    const totalPlayers = stats?.total_players ?? '-';
    const points = stats?.points ?? 0;
    const wins = stats?.wins ?? 0;
    const winRate = stats?.win_rate ?? 0;
    const streak = stats?.current_streak ?? 0;

    return (
        <TouchableOpacity
            onPress={() => router.push('/ranking')}
            className="bg-neutral-900 rounded-3xl p-6 mb-8 shadow-sm overflow-hidden relative"
        >
            {/* Background Decoration */}
            <View className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full -mr-10 -mt-10" />

            <View className="flex-row justify-between items-start mb-6">
                <View>
                    <View className="flex-row items-center gap-2 mb-1">
                        <MaterialIcons name="emoji-events" size={20} color="#FACC15" />
                        <Text className="text-yellow-400 font-bold tracking-wider text-xs uppercase">Ranking Global</Text>
                    </View>
                    <Text className="text-white font-bold text-3xl">
                        #{loading ? '-' : rank} <Text className="text-lg font-normal text-neutral-400">/ {loading ? '-' : totalPlayers}</Text>
                    </Text>
                </View>

                <View className="bg-neutral-800 px-3 py-1.5 rounded-full border border-neutral-700">
                    <Text className="text-white font-bold text-xs">{loading ? '-' : points} pts</Text>
                </View>
            </View>

            {/* Stats Grid */}
            <View className="flex-row border-t border-neutral-800 pt-4">
                <View className="flex-1 items-center border-r border-neutral-800">
                    <Text className="text-neutral-500 text-[10px] uppercase mb-1">Vitórias</Text>
                    <Text className="text-white font-bold text-lg">{loading ? '-' : wins}</Text>
                </View>
                <View className="flex-1 items-center border-r border-neutral-800">
                    <Text className="text-neutral-500 text-[10px] uppercase mb-1">Win Rate</Text>
                    <Text className="text-green-400 font-bold text-lg">{loading ? '-' : winRate}%</Text>
                </View>
                <View className="flex-1 items-center">
                    <Text className="text-neutral-500 text-[10px] uppercase mb-1">Sequência</Text>
                    <View className="flex-row items-center gap-1">
                        <MaterialIcons name="local-fire-department" size={14} color="#F97316" />
                        <Text className="text-white font-bold text-lg">{loading ? '-' : streak}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

export function OverviewTab() {
    const { signOut } = useAuthStore();
    const { profile } = useUserStore();
    const [teams, setTeams] = useState<Team[]>([]);
    const [selectedSport, setSelectedSport] = useState('beach-tennis');

    useEffect(() => {
        TeamService.getMyTeams().then(setTeams);
    }, []);

    const handleSignOut = () => {
        signOut();
        router.replace('/(auth)/login');
    };

    const selectedSportName = SPORTS_FILTER.find(s => s.id === selectedSport)?.name || 'Beach Tennis';

    return (
        <View className="pb-10 bg-white">
            {/* Weekly Stats Section */}
            <View className="px-5 pt-2">
                <Text className="text-lg font-bold text-black mb-4">Esta semana</Text>

                <View className="flex-row justify-between mb-6">
                    <View>
                        <Text className="text-neutral-500 text-xs mb-1">Partidas</Text>
                        <Text className="text-2xl font-bold text-black">{profile?.matches_count || 0}</Text>
                    </View>
                    <View>
                        <Text className="text-neutral-500 text-xs mb-1">Tempo</Text>
                        <Text className="text-2xl font-bold text-black">--</Text>
                    </View>
                    <View>
                        <Text className="text-neutral-500 text-xs mb-1">Vitórias</Text>
                        <Text className="text-2xl font-bold text-black">{profile?.wins || 0}</Text>
                    </View>
                </View>
            </View>

            {/* Sport Filter - Above Ranking */}
            <View className="mb-4">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                >
                    {SPORTS_FILTER.map((sport, index) => (
                        <TouchableOpacity
                            key={sport.id}
                            onPress={() => setSelectedSport(sport.id)}
                            style={{ marginRight: index < SPORTS_FILTER.length - 1 ? 10 : 0 }}
                            className={`flex-row items-center px-4 py-3 rounded-2xl border ${selectedSport === sport.id
                                ? 'bg-black border-black'
                                : 'bg-white border-neutral-200'
                                }`}
                        >
                            <View className="mr-2">
                                <SportIcon sport={sport.id} size={24} showBackground={false} />
                            </View>
                            <Text className={`font-semibold ${selectedSport === sport.id ? 'text-white' : 'text-neutral-700'}`}>
                                {sport.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Ranking Feature Card */}
            <View className="px-5">
                <RankingCard />
            </View>

            {/* Level Progress Card - Outside px-5 because it has its own margins */}
            <LevelProgressCard
                level={profile?.level || null}
                reliability={(profile as any)?.level_reliability}
                sport={selectedSportName}
                sportId={selectedSport}
                onStartAssessment={() => router.push('/level-assessment')}
            />

            {/* Player Preferences - Right after Level */}
            <PlayerPreferences />

            <View className="px-5">
                {/* Radar Chart (Stats) */}
                <View className="bg-white rounded-2xl p-5 mb-8 shadow-sm border border-slate-100">
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-lg font-bold text-slate-900">Análise de Performance</Text>
                        <View className="bg-violet-100 px-2 py-1 rounded-lg">
                            <Text className="text-violet-700 text-xs font-bold">Nível 42</Text>
                        </View>
                    </View>

                    <RadarChart
                        data={[
                            { label: 'Ataque', value: profile?.stats?.attack || 50, fullMark: 100 },
                            { label: 'Defesa', value: profile?.stats?.defense || 50, fullMark: 100 },
                            { label: 'Técnica', value: profile?.stats?.technique || 50, fullMark: 100 },
                            { label: 'Físico', value: profile?.stats?.physical || 50, fullMark: 100 },
                            { label: 'Mental', value: profile?.stats?.mental || 50, fullMark: 100 },
                        ]}
                    />

                    <Text className="text-center text-slate-400 text-xs mt-4">Baseado nas últimas 20 partidas</Text>
                </View>

                {/* Premium Banner */}
                <View className="bg-neutral-900 rounded-2xl p-5 mb-4 shadow-sm">
                    <View className="w-8 h-8 rounded-lg bg-yellow-600 items-center justify-center mb-3">
                        <MaterialIcons name="workspace-premium" size={20} color="black" />
                    </View>
                    <View className="flex-row items-center gap-2 mb-1">
                        <Text className="text-white font-bold text-lg">Kourt Premium</Text>
                        <View className="bg-yellow-500 px-1.5 py-0.5 rounded">
                            <Text className="text-[10px] font-bold text-black">PRO</Text>
                        </View>
                    </View>
                    <Text className="text-neutral-400 text-xs mb-3">Desbloqueie estatísticas, ranking global e jogue sem taxas.</Text>
                    <TouchableOpacity className="flex-row items-center">
                        <MaterialIcons name="chevron-right" size={20} color="#EAB308" />
                    </TouchableOpacity>
                </View>

                {/* Host Banner */}
                <SejaHostCard onPress={() => router.push('/court/my-listings')} />


            </View>

            {/* Menu List */}
            <View className="mb-8">
                <MenuItem icon="calendar-today" label="Atividades" onPress={() => router.push('/profile/activities')} />
                <MenuItem icon="bar-chart" label="Estatísticas" onPress={() => router.push('/profile/statistics')} />
                <MenuItem icon="sports-tennis" label="Equipamento" onPress={() => router.push('/profile/equipment')} />
            </View>

            <View className="px-5">
                {/* Trophy Case */}
                <TouchableOpacity
                    onPress={() => router.push('/achievements')}
                    className="flex-row justify-between items-center mb-4"
                >
                    <Text className="text-lg font-bold text-black">Sala de Troféus</Text>
                    <Text className="text-neutral-400 font-bold">0</Text>
                </TouchableOpacity>

                <View className="mb-2">
                    <View className="w-20 h-20 bg-neutral-100 rounded-xl items-center justify-center mb-2">
                        <MaterialIcons name="emoji-events" size={32} color="#D4D4D4" />
                    </View>
                    <Text className="text-xs text-neutral-400">Sem troféus</Text>
                </View>

                <TouchableOpacity className="mb-8" onPress={() => router.push('/achievements')}>
                    <Text className="text-neutral-500 text-sm">Todos os troféus →</Text>
                </TouchableOpacity>

                {/* My Teams */}
                <View className="flex-row justify-between items-center mb-4">
                    <Text className="text-lg font-bold text-black">Meus Times</Text>
                    <TouchableOpacity onPress={() => router.push('/teams')}>
                        <Text className="text-neutral-500 font-bold text-sm">Ver todos</Text>
                    </TouchableOpacity>
                </View>

                <View className="mb-10">
                    {teams.length > 0 ? (
                        teams.slice(0, 2).map(team => (
                            <TouchableOpacity
                                key={team.id}
                                onPress={() => router.push(`/teams/${team.id}`)}
                                className="flex-row items-center bg-neutral-50 p-3 rounded-xl border border-neutral-100 mb-2"
                            >
                                <View className="w-12 h-12 bg-white rounded-lg items-center justify-center border border-neutral-200 mr-3">
                                    <MaterialIcons name="shield" size={24} color="#9CA3AF" />
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-neutral-900">{team.name}</Text>
                                    <Text className="text-xs text-neutral-500">{team.sport} • {team.member_count} membros</Text>
                                </View>
                                <MaterialIcons name="chevron-right" size={20} color="#D1D5DB" />
                            </TouchableOpacity>
                        ))
                    ) : (
                        <TouchableOpacity
                            onPress={() => router.push('/teams/create')}
                            className="bg-neutral-50 border border-dashed border-neutral-300 rounded-xl p-4 items-center justify-center"
                        >
                            <View className="w-10 h-10 bg-neutral-200 rounded-full items-center justify-center mb-2">
                                <MaterialIcons name="add" size={20} color="#6B7280" />
                            </View>
                            <Text className="text-sm font-bold text-neutral-600">Criar meu primeiro time</Text>
                            <Text className="text-xs text-neutral-400">Junte seus amigos para jogar</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <View className="px-5">
                {/* Logout */}
                <TouchableOpacity
                    onPress={handleSignOut}
                    className="flex-row items-center justify-center gap-2 py-4 mb-8"
                >
                    <MaterialIcons name="logout" size={20} color="#EF4444" />
                    <Text className="text-red-500 font-medium">Sair da conta</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
