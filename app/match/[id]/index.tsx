import { View, Text, ScrollView, Pressable, Image, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { getMatch, joinMatch, leaveMatch } from '@/services/matches';

export default function MatchDetailScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [match, setMatch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isJoined, setIsJoined] = useState(false);

    useEffect(() => {
        fetchMatch();
    }, [id]);

    const fetchMatch = async () => {
        try {
            // Mock data for now
            const mockMatch = {
                id,
                sport: 'Beach Tennis',
                title: 'Beach Tennis com amigos',
                description: 'Partida casual, todos os níveis são bem-vindos!',
                date: new Date(),
                start_time: '14:00',
                max_players: 4,
                current_players: 2,
                is_public: true,
                skill_level: 'all',
                status: 'open',
                court: {
                    name: 'Arena Beach Tennis',
                    address: 'Av. Ibirapuera, 1234',
                    city: 'São Paulo',
                },
                created_by: {
                    name: 'Bruno Silva',
                    avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
                },
                players: [
                    {
                        id: '1',
                        name: 'Bruno Silva',
                        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
                        status: 'confirmed',
                    },
                    {
                        id: '2',
                        name: 'Marina Santos',
                        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop',
                        status: 'confirmed',
                    },
                ],
            };
            setMatch(mockMatch);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async () => {
        try {
            // await joinMatch(id, 'current-user-id');
            setIsJoined(true);
            Alert.alert('Sucesso', 'Você entrou na partida!');
        } catch (error: any) {
            Alert.alert('Erro', error.message);
        }
    };

    const handleLeave = async () => {
        Alert.alert(
            'Sair da Partida',
            'Tem certeza que deseja sair?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // await leaveMatch(id, 'current-user-id');
                            setIsJoined(false);
                        } catch (error: any) {
                            Alert.alert('Erro', error.message);
                        }
                    }
                }
            ]
        );
    };

    if (loading || !match) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <Text>Carregando...</Text>
            </View>
        );
    }

    const spotsLeft = match.max_players - match.current_players;
    const isFull = spotsLeft === 0;

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-14 pb-4 flex-row items-center gap-4 border-b border-neutral-100">
                <Pressable onPress={() => router.back()}>
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-bold text-black flex-1">Detalhes da Partida</Text>
                <Pressable>
                    <MaterialIcons name="share" size={24} color="#000" />
                </Pressable>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="px-5 py-6">
                    {/* Status Badge */}
                    <View className="flex-row items-center gap-2 mb-4">
                        <View className={`px-3 py-1.5 rounded-full ${match.status === 'open' ? 'bg-green-100' : 'bg-neutral-100'
                            }`}>
                            <Text className={`text-xs font-bold ${match.status === 'open' ? 'text-green-700' : 'text-neutral-600'
                                }`}>
                                {match.status === 'open' ? 'Aberta' : 'Fechada'}
                            </Text>
                        </View>
                        {isFull && (
                            <View className="px-3 py-1.5 bg-red-100 rounded-full">
                                <Text className="text-xs font-bold text-red-700">Lotada</Text>
                            </View>
                        )}
                    </View>

                    {/* Title */}
                    <Text className="text-2xl font-bold text-black mb-2">
                        {match.title}
                    </Text>

                    {/* Organizer */}
                    <View className="flex-row items-center gap-2 mb-6">
                        <Image
                            source={{ uri: match.created_by.avatar }}
                            className="w-6 h-6 rounded-full bg-neutral-200"
                        />
                        <Text className="text-sm text-neutral-500">
                            Organizado por <Text className="font-medium text-black">{match.created_by.name}</Text>
                        </Text>
                    </View>

                    {/* Info Cards */}
                    <View className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mb-6">
                        <View className="flex-row items-center gap-3 mb-3">
                            <MaterialIcons name="sports-tennis" size={20} color="#000" />
                            <Text className="font-semibold text-black">{match.sport}</Text>
                        </View>

                        <View className="flex-row items-center gap-3 mb-3">
                            <MaterialIcons name="location-on" size={20} color="#737373" />
                            <View className="flex-1">
                                <Text className="text-sm font-medium text-black">{match.court.name}</Text>
                                <Text className="text-xs text-neutral-500">{match.court.address}</Text>
                            </View>
                        </View>

                        <View className="flex-row items-center gap-3 mb-3">
                            <MaterialIcons name="event" size={20} color="#737373" />
                            <Text className="text-sm text-black">
                                {format(match.date, "EEEE, d 'de' MMMM", { locale: ptBR })}
                            </Text>
                        </View>

                        <View className="flex-row items-center gap-3">
                            <MaterialIcons name="schedule" size={20} color="#737373" />
                            <Text className="text-sm text-black">{match.start_time}</Text>
                        </View>
                    </View>

                    {/* Description */}
                    {match.description && (
                        <View className="mb-6">
                            <Text className="text-base font-bold text-black mb-2">Descrição</Text>
                            <Text className="text-sm text-neutral-600 leading-5">
                                {match.description}
                            </Text>
                        </View>
                    )}

                    {/* Players */}
                    <View className="mb-6">
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-base font-bold text-black">
                                Jogadores ({match.current_players}/{match.max_players})
                            </Text>
                            {!isFull && (
                                <Text className="text-sm text-green-600 font-medium">
                                    {spotsLeft} {spotsLeft === 1 ? 'vaga' : 'vagas'}
                                </Text>
                            )}
                        </View>

                        {match.players.map((player: any) => (
                            <View
                                key={player.id}
                                className="flex-row items-center gap-3 py-3 border-b border-neutral-100"
                            >
                                <Image
                                    source={{ uri: player.avatar }}
                                    className="w-12 h-12 rounded-full bg-neutral-200"
                                />
                                <View className="flex-1">
                                    <Text className="font-medium text-black">{player.name}</Text>
                                    <Text className="text-xs text-neutral-500">
                                        {player.status === 'confirmed' ? 'Confirmado' : 'Pendente'}
                                    </Text>
                                </View>
                                {player.id === match.created_by.id && (
                                    <View className="px-2 py-1 bg-amber-100 rounded">
                                        <Text className="text-xs font-medium text-amber-700">Organizador</Text>
                                    </View>
                                )}
                            </View>
                        ))}

                        {/* Empty slots */}
                        {Array.from({ length: spotsLeft }).map((_, i) => (
                            <View
                                key={`empty-${i}`}
                                className="flex-row items-center gap-3 py-3 border-b border-neutral-100"
                            >
                                <View className="w-12 h-12 rounded-full bg-neutral-100 items-center justify-center">
                                    <MaterialIcons name="person-add" size={24} color="#A3A3A3" />
                                </View>
                                <Text className="text-sm text-neutral-400">Vaga disponível</Text>
                            </View>
                        ))}
                    </View>

                    <View className="h-24" />
                </View>
            </ScrollView>

            {/* Footer */}
            <View className="px-5 py-4 pb-8 border-t border-neutral-100">
                {isJoined ? (
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={handleLeave}
                            className="flex-1 py-4 bg-white border border-neutral-300 rounded-2xl items-center"
                        >
                            <Text className="font-semibold text-black">Sair</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => router.push(`/match/${id}/live`)}
                            className="flex-1 py-4 bg-black rounded-2xl items-center"
                        >
                            <Text className="font-semibold text-white">Iniciar Partida</Text>
                        </Pressable>
                    </View>
                ) : (
                    <Pressable
                        onPress={handleJoin}
                        disabled={isFull}
                        className={`w-full py-4 rounded-2xl items-center ${isFull ? 'bg-neutral-300' : 'bg-black'
                            }`}
                    >
                        <Text className="font-semibold text-white">
                            {isFull ? 'Partida Lotada' : 'Entrar na Partida'}
                        </Text>
                    </Pressable>
                )}
            </View>
        </View>
    );
}
