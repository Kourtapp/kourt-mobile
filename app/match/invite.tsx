import { View, Text, ScrollView, Pressable, TextInput, Share } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, X, Check, Share2 } from 'lucide-react-native';
import { useMatchStore } from '@/stores/useMatchStore';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Typings
interface Player {
    id: string;
    name: string;
    username: string;
    avatar?: string;
    level: string;
    rating: number;
    gamesCount: number;
    distance?: string;
    sports?: string[];
    isVerified?: boolean;
    mutualGames?: number;
    status?: 'none' | 'invited' | 'confirmed';
}

// Mock Data
const FRIENDS: Player[] = [
    { id: '1', name: 'João Paulo', username: '@joaopaulo', level: 'Intermed.', rating: 4.8, gamesCount: 42, mutualGames: 12, status: 'none', sports: ['Padel', 'BeachTennis'] },
    { id: '2', name: 'Roberto Lima', username: '@robertolima', level: 'Avançado', rating: 4.9, gamesCount: 156, mutualGames: 8, status: 'none', sports: ['BeachTennis'] },
    { id: '3', name: 'Marina Silva', username: '@marinasilva', level: 'Intermed.', rating: 4.7, gamesCount: 30, mutualGames: 5, status: 'invited', sports: ['BeachTennis'] },
];

const SEARCH_RESULTS: Player[] = [
    { id: '4', name: 'Lucas Mendes', username: '@lucasmendes', level: 'Intermed.', rating: 4.8, gamesCount: 89, distance: '2.3 km', isVerified: true, sports: ['BeachTennis', 'Padel'], status: 'none' },
    { id: '5', name: 'Fernanda Oliveira', username: '@feoliveira', level: 'Avançado', rating: 4.9, gamesCount: 156, distance: '3.1 km', sports: ['BeachTennis'], status: 'none' },
    { id: '6', name: 'Ricardo Santos', username: '@ricardosantos', level: 'Intermed.', rating: 4.7, gamesCount: 67, distance: '1.8 km', sports: ['BeachTennis', 'Tênis'], status: 'invited' },
];

export default function InvitePlayersScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [searchQuery, setSearchQuery] = useState('');
    const [players, setPlayers] = useState<Player[]>([...FRIENDS, ...SEARCH_RESULTS]); // In real app, manage this better
    const { selectedSport, selectedDate, selectedTime, selectedCourt, maxPlayers } = useMatchStore();

    // Derived state
    const isSearching = searchQuery.length > 0;
    const displayList = isSearching
        ? SEARCH_RESULTS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.username.includes(searchQuery.toLowerCase()))
        : FRIENDS;

    const invitedCount = players.filter(p => p.status === 'invited' || p.status === 'confirmed').length;

    const toggleInvite = (id: string) => {
        setPlayers(prev => prev.map(p => {
            if (p.id === id) {
                return { ...p, status: p.status === 'none' ? 'invited' : 'none' };
            }
            return p;
        }));
    };

    const handleShare = async () => {
        try {
            await Share.share({
                message: `Bora jogar ${selectedSport || 'Beach Tennis'}? 🎾\n📅 ${selectedDate.toLocaleDateString()} às ${selectedTime}\n📍 ${selectedCourt?.name || 'Local a definir'}\n\nEntra aí pelo link: kourt.app/m/12345`,
            });
        } catch (error) {
            console.log(error);
        }
    };

    const PlayerCard = ({ player, rich = false }: { player: Player, rich?: boolean }) => (
        <View className={`bg-white rounded-2xl p-4 border border-gray-100 mb-3 ${rich ? 'shadow-sm' : ''}`}>
            <View className="flex-row gap-3">
                {/* Avatar */}
                <View className="w-12 h-12 bg-gray-200 rounded-full items-center justify-center">
                    <Text className="text-gray-500 font-bold text-lg">{player.name.charAt(0)}</Text>
                    {/* In real app: <Image source={{ uri: player.avatar }} ... /> */}
                    {player.status === 'confirmed' && (
                        <View className="absolute -bottom-1 -right-1 bg-green-500 w-4 h-4 rounded-full border-2 border-white items-center justify-center">
                            <Check size={8} color="#FFF" strokeWidth={4} />
                        </View>
                    )}
                </View>

                {/* Info */}
                <View className="flex-1">
                    <View className="flex-row items-center gap-1">
                        <Text className="font-bold text-black text-[15px]">{player.name}</Text>
                        {player.isVerified && <View className="w-3 h-3 bg-blue-500 rounded-full items-center justify-center"><Check size={8} color="#FFF" /></View>}
                    </View>

                    {/* Subtitle Line */}
                    {rich ? (
                        <View>
                            <Text className="text-gray-500 text-xs mb-1">{player.username} · {player.distance}</Text>
                            <View className="flex-row items-center gap-2 mb-2">
                                <View className="bg-gray-100 px-1.5 py-0.5 rounded">
                                    <Text className="text-[10px] font-bold text-gray-700 uppercase">{player.level}</Text>
                                </View>
                                <Text className="text-gray-500 text-xs">★ {player.rating} · {player.gamesCount} jogos</Text>
                            </View>
                            <View className="flex-row items-center gap-1">
                                <Search size={10} color="#9CA3AF" />
                                <Text className="text-gray-400 text-[11px]">{player.sports?.join(', ')}</Text>
                            </View>
                        </View>
                    ) : (
                        <View>
                            <Text className="text-gray-500 text-xs mb-1">
                                {player.status === 'confirmed' ? 'Confirmado' : player.status === 'invited' ? 'Aguardando resposta' : `Amigo · ${player.sports?.join(', ')}`}
                            </Text>
                            {player.mutualGames && <Text className="text-[10px] text-orange-500">★ {player.mutualGames} jogos em comum</Text>}
                        </View>
                    )}
                </View>

                {/* Action Button */}
                <Pressable
                    onPress={() => toggleInvite(player.id)}
                    className={`h-9 px-4 rounded-full items-center justify-center ${player.status === 'invited'
                        ? 'bg-gray-100'
                        : player.status === 'confirmed'
                            ? 'bg-green-100'
                            : 'bg-black'
                        }`}
                >
                    <Text className={`font-bold text-xs ${player.status === 'invited' ? 'text-gray-600'
                        : player.status === 'confirmed' ? 'text-green-700'
                            : 'text-white'
                        }`}>
                        {player.status === 'invited' ? 'Convidado'
                            : player.status === 'confirmed' ? 'Confirmado'
                                : 'Convidar'}
                    </Text>
                </Pressable>
            </View>
        </View>
    );

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-4 pb-2 flex-row items-center justify-between" style={{ marginTop: insets.top }}>
                <View className="flex-row items-center gap-3">
                    <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
                        <ArrowLeft size={24} color="#000" />
                    </Pressable>
                    <Text className="text-xl font-bold text-black">{isSearching ? 'Buscar Jogadores' : 'Convidar Jogadores'}</Text>
                </View>
                {!isSearching && (
                    <Pressable onPress={() => router.push('/(tabs)')}>
                        <Text className="font-bold text-sm text-black">Pular</Text>
                    </Pressable>
                )}
            </View>

            {/* Search Bar */}
            <View className="px-5 mb-4">
                <View className="bg-gray-100 rounded-xl flex-row items-center px-4 h-12">
                    <Search size={20} color="#9CA3AF" />
                    <TextInput
                        className="flex-1 ml-3 text-base text-black h-full"
                        placeholder="Buscar jogadores..."
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                    {isSearching && (
                        <Pressable onPress={() => setSearchQuery('')}>
                            <X size={18} color="#9CA3AF" />
                        </Pressable>
                    )}
                </View>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* Filters (Only in Search) */}
                {isSearching && (
                    <View className="flex-row gap-2 mb-6" style={{ overflow: 'hidden' }}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="overflow-visible">
                            <View className="bg-black px-4 py-2 rounded-full mr-2 flex-row items-center gap-2">
                                <Search size={14} color="#FFF" />
                                <Text className="text-white font-bold text-xs">BeachTennis</Text>
                            </View>
                            <View className="bg-gray-100 px-4 py-2 rounded-full mr-2">
                                <Text className="text-black font-bold text-xs">Intermediário</Text>
                            </View>
                            <View className="bg-gray-100 px-4 py-2 rounded-full mr-2">
                                <Text className="text-black font-bold text-xs">Perto de mim</Text>
                            </View>
                        </ScrollView>
                    </View>
                )}

                {/* Match Summary Banner (Only in Default View) */}
                {!isSearching && (
                    <View className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 shadow-sm flex-row items-center justify-between">
                        <View className="flex-row items-center gap-4">
                            <View className="w-12 h-12 bg-black rounded-xl items-center justify-center">
                                <Search size={24} color="#FFF" />
                            </View>
                            <View>
                                <Text className="font-bold text-black text-sm">
                                    {(selectedSport || 'Beach Tennis').replace('-', ' ')} · Hoje · {selectedTime || '18:00'}
                                </Text>
                                <Text className="text-gray-500 text-xs mt-0.5">{selectedCourt?.name || 'Local a definir'}</Text>
                            </View>
                        </View>
                        <View className="items-end">
                            <Text className="font-bold text-black text-sm">{invitedCount + 1}/{maxPlayers}</Text>
                            <Text className="text-gray-400 text-[10px]">jogadores</Text>
                        </View>
                    </View>
                )}

                {/* Section Title */}
                <Text className="text-xs font-bold text-gray-400 mb-3 uppercase tracking-wide">
                    {isSearching ? `${displayList.length} jogadores encontrados` : 'Seus Amigos'}
                </Text>

                {/* Player Lists */}
                {displayList.map(player => (
                    <PlayerCard key={player.id} player={player} rich={isSearching} />
                ))}

                {/* Share Section (Only in Default View) */}
                {!isSearching && (
                    <View className="mt-6 bg-gray-50 rounded-3xl p-5 mb-6">
                        <View className="flex-row items-center gap-3 mb-4">
                            <View className="w-10 h-10 bg-white rounded-xl items-center justify-center border border-gray-100">
                                <Share2 size={20} color="#000" />
                            </View>
                            <View>
                                <Text className="font-bold text-black text-sm">Compartilhar link</Text>
                                <Text className="text-gray-500 text-xs">Convide por WhatsApp ou redes sociais</Text>
                            </View>
                        </View>
                        <Pressable
                            className="bg-[#25D366] py-3 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
                            onPress={handleShare}
                        >
                            <Share2 size={18} color="#FFF" />
                            <Text className="font-bold text-white text-sm">Compartilhar no WhatsApp</Text>
                        </Pressable>
                    </View>
                )}

            </ScrollView>

            {/* Footer Button (Only in Default View) */}
            {!isSearching && (
                <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 pb-8">
                    <Pressable
                        onPress={() => router.push('/match/success')}
                        className="w-full bg-black h-14 rounded-2xl items-center justify-center shadow-sm active:opacity-90"
                    >
                        <Text className="text-white font-bold text-[16px]">Concluir ({invitedCount + 1}/{maxPlayers} jogadores)</Text>
                    </Pressable>
                </View>
            )}
        </View>
    );
}
