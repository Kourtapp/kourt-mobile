import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { TeamService } from '../../services/teamService';
import { TeamCard } from '../../components/teams/TeamCard';
import { Team } from '../../types/team';

export default function MyTeamsScreen() {
    const router = useRouter();
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            const data = await TeamService.getMyTeams();
            setTeams(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View className="flex-1 bg-[#FAFAFA]">
            <Stack.Screen
                options={{
                    title: 'Meus Times',
                    headerShadowVisible: false,
                    headerStyle: { backgroundColor: '#FAFAFA' },
                    headerRight: () => (
                        <TouchableOpacity onPress={() => router.push('/teams/create')}>
                            <MaterialIcons name="add" size={24} color="#0F172A" />
                        </TouchableOpacity>
                    )
                }}
            />

            {loading ? (
                <View className="flex-1 items-center justify-center">
                    <ActivityIndicator color="#0F172A" />
                </View>
            ) : (
                <ScrollView contentContainerStyle={{ padding: 20 }}>
                    {teams.length > 0 ? (
                        <>
                            <Text className="text-sm font-bold text-neutral-400 uppercase mb-4">Gerenciar Times ({teams.length})</Text>
                            {teams.map(team => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    onPress={() => router.push(`/teams/${team.id}`)}
                                />
                            ))}
                        </>
                    ) : (
                        <View className="items-center justify-center py-20">
                            <View className="w-20 h-20 bg-neutral-100 rounded-full items-center justify-center mb-4">
                                <MaterialIcons name="groups" size={40} color="#D1D5DB" />
                            </View>
                            <Text className="text-lg font-bold text-neutral-900 mb-2">Você não tem times</Text>
                            <Text className="text-center text-neutral-500 max-w-[250px] mb-6">
                                Crie um time para organizar partidas, convidar amigos e subir no ranking de equipes.
                            </Text>
                            <TouchableOpacity
                                onPress={() => router.push('/teams/create')}
                                className="bg-neutral-900 px-6 py-3 rounded-full flex-row items-center gap-2"
                            >
                                <MaterialIcons name="add" size={20} color="white" />
                                <Text className="text-white font-bold">Criar novo time</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>
            )}
        </View>
    );
}
