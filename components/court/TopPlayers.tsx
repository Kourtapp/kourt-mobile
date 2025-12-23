import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

interface Player {
    id: string;
    name: string;
    avatar_url?: string;
    rank: number;
}

interface TopPlayersProps {
    players?: Player[];
}

const MOCK_PLAYERS: Player[] = [
    { id: '1', name: 'Carlos', avatar_url: 'https://i.pravatar.cc/100?img=12', rank: 1 },
    { id: '2', name: 'Ana', avatar_url: 'https://i.pravatar.cc/100?img=47', rank: 2 },
    { id: '3', name: 'Pedro', avatar_url: 'https://i.pravatar.cc/100?img=33', rank: 3 },
    { id: '4', name: 'Marina', avatar_url: 'https://i.pravatar.cc/100?img=23', rank: 4 },
    { id: '5', name: 'João', avatar_url: 'https://i.pravatar.cc/100?img=53', rank: 5 },
    { id: '6', name: 'Lucia', avatar_url: 'https://i.pravatar.cc/100?img=45', rank: 6 },
];

export function TopPlayers({ players = MOCK_PLAYERS }: TopPlayersProps) {
    const router = useRouter();

    return (
        <View style={{ marginBottom: 24 }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#000', marginBottom: 16 }}>
                Top jogadores
            </Text>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16 }}
            >
                {players.map((player) => (
                    <TouchableOpacity
                        key={player.id}
                        onPress={() => router.push(`/user/${player.id}`)}
                        style={{ alignItems: 'center', width: 70 }}
                    >
                        {/* Avatar with rank badge */}
                        <View style={{ position: 'relative', marginBottom: 8 }}>
                            <View style={{
                                width: 56,
                                height: 56,
                                borderRadius: 28,
                                overflow: 'hidden',
                                borderWidth: player.rank <= 3 ? 2 : 0,
                                borderColor: player.rank === 1 ? '#FBBF24' : player.rank === 2 ? '#9CA3AF' : player.rank === 3 ? '#CD7F32' : 'transparent',
                            }}>
                                {player.avatar_url ? (
                                    <Image
                                        source={{ uri: player.avatar_url }}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <View style={{ flex: 1, backgroundColor: '#22C55E', alignItems: 'center', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 18, fontWeight: '700', color: '#fff' }}>
                                            {player.name[0]}
                                        </Text>
                                    </View>
                                )}
                            </View>
                            {/* Rank badge */}
                            <View style={{
                                position: 'absolute',
                                bottom: -4,
                                left: '50%',
                                marginLeft: -10,
                                width: 20,
                                height: 20,
                                borderRadius: 10,
                                backgroundColor: player.rank === 1 ? '#FBBF24' : player.rank === 2 ? '#9CA3AF' : player.rank === 3 ? '#CD7F32' : '#E5E7EB',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderWidth: 2,
                                borderColor: '#fff',
                            }}>
                                <Text style={{
                                    fontSize: 10,
                                    fontWeight: '700',
                                    color: player.rank <= 3 ? '#fff' : '#6B7280',
                                }}>
                                    {player.rank}
                                </Text>
                            </View>
                        </View>
                        <Text style={{ fontSize: 12, fontWeight: '500', color: '#374151' }} numberOfLines={1}>
                            {player.name}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
}
