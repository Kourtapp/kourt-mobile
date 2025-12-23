import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';

const MOCK_PLAYERS = [
    {
        id: '1',
        name: 'Lucas M.',
        level: 14,
        sport: 'Beach Tennis',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=200&auto=format&fit=crop',
        isFollowing: false,
    },
    {
        id: '2',
        name: 'Ana P.',
        level: 11,
        sport: 'Padel',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop',
        isFollowing: true,
    },
    {
        id: '3',
        name: 'Marcos V.',
        level: 18,
        sport: 'Futebol',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop',
        isFollowing: false,
    },
];

export function PlayersTab() {
    return (
        <ScrollView
            className="flex-1 bg-[#fafafa]"
            contentContainerStyle={{ padding: 20, gap: 12 }}
            showsVerticalScrollIndicator={false}
        >
            <Text className="text-sm font-bold text-black mb-2">Sugestões para você</Text>

            {MOCK_PLAYERS.map((player) => (
                <View key={player.id} className="flex-row items-center bg-white p-3 rounded-xl border border-neutral-200">
                    <Image
                        source={{ uri: player.avatar }}
                        className="w-12 h-12 rounded-full bg-neutral-200"
                    />

                    <View className="flex-1 ml-3">
                        <Text className="font-bold text-black text-sm">{player.name}</Text>
                        <Text className="text-xs text-neutral-500">
                            Nível {player.level} · {player.sport}
                        </Text>
                    </View>

                    <TouchableOpacity>
                        <View className={`px-4 py-1.5 rounded-full border ${player.isFollowing
                            ? 'bg-white border-neutral-300'
                            : 'bg-black border-black'
                            }`}>
                            <Text className={`text-xs font-semibold ${player.isFollowing ? 'text-black' : 'text-white'
                                }`}>
                                {player.isFollowing ? 'Seguindo' : 'Seguir'}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}
