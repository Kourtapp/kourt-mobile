import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TeamService } from '../../services/teamService';
import { Team } from '../../types/team';

export default function TeamDetailsScreen() {
    const { id } = useLocalSearchParams();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const router = useRouter();
    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            TeamService.getTeamById(id as string).then(setTeam).finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-[#FAFAFA]">
                <ActivityIndicator color="#0F172A" />
            </View>
        );
    }

    if (!team) {
        return (
            <View className="flex-1 items-center justify-center bg-[#FAFAFA]">
                <Text className="text-neutral-500">Time não encontrado</Text>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-[#FAFAFA]">
            <Stack.Screen
                options={{
                    title: '',
                    headerTransparent: true,
                    headerTintColor: '#fff',
                }}
            />

            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header / Cover */}
                <View className="h-48 bg-neutral-900 relative">
                    {team.cover_url && (
                        <Image source={{ uri: team.cover_url }} className="w-full h-full opacity-60" resizeMode="cover" />
                    )}
                    <View className="absolute bottom-0 left-0 right-0 p-5 pt-20 bg-gradient-to-t from-black/80 to-transparent">
                        <View className="flex-row items-end">
                            <View className="w-20 h-20 bg-white rounded-2xl items-center justify-center border-4 border-[#FAFAFA] mr-4 shadow-sm">
                                {team.avatar_url ? (
                                    <Image source={{ uri: team.avatar_url }} className="w-full h-full rounded-xl" />
                                ) : (
                                    <MaterialIcons name="shield" size={40} color="#D1D5DB" />
                                )}
                            </View>
                            <View className="flex-1 pb-2">
                                <Text className="text-2xl font-bold text-white mb-1">{team.name}</Text>
                                <Text className="text-white/80 font-medium">{team.sport}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Content */}
                <View className="px-5 pt-4">
                    {/* Stats Grid */}
                    <View className="flex-row gap-3 mb-6">
                        <View className="flex-1 bg-white p-4 rounded-2xl border border-neutral-100 items-center">
                            <Text className="text-2xl font-bold text-neutral-900">{team.stats.matches}</Text>
                            <Text className="text-xs font-bold text-neutral-400 uppercase">Partidas</Text>
                        </View>
                        <View className="flex-1 bg-green-50 p-4 rounded-2xl border border-green-100 items-center">
                            <Text className="text-2xl font-bold text-green-700">{team.stats.wins}</Text>
                            <Text className="text-xs font-bold text-green-600 uppercase">Vitórias</Text>
                        </View>
                        <View className="flex-1 bg-red-50 p-4 rounded-2xl border border-red-100 items-center">
                            <Text className="text-2xl font-bold text-red-700">{team.stats.losses}</Text>
                            <Text className="text-xs font-bold text-red-600 uppercase">Derrotas</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {team.description && (
                        <View className="bg-white p-4 rounded-2xl border border-neutral-100 mb-6">
                            <Text className="text-sm font-semibold text-neutral-900 mb-2">Sobre</Text>
                            <Text className="text-neutral-500 leading-relaxed">{team.description}</Text>
                        </View>
                    )}

                    {/* Members (Mock) */}
                    <View className="mb-6">
                        <View className="flex-row justify-between items-center mb-3">
                            <Text className="text-lg font-bold text-neutral-900">Elenco</Text>
                            <TouchableOpacity className="flex-row items-center">
                                <MaterialIcons name="person-add" size={16} color="#22C55E" />
                                <Text className="text-green-500 font-bold ml-1">Convidar</Text>
                            </TouchableOpacity>
                        </View>

                        <View className="bg-white rounded-2xl border border-neutral-100 overflow-hidden">
                            {[1, 2, 3].map((item, index) => (
                                <View key={item} className={`p-4 flex-row items-center ${index !== 2 ? 'border-b border-neutral-100' : ''}`}>
                                    <View className="w-10 h-10 bg-neutral-100 rounded-full mr-3" />
                                    <View className="flex-1">
                                        <Text className="font-bold text-neutral-900">Jogador {item}</Text>
                                        <Text className="text-xs text-neutral-500">{index === 0 ? 'Capitão' : 'Membro'}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
