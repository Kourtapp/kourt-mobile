import { View, Text, TextInput, Pressable, ScrollView, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

const SPORTS = [
    { id: 'padel', name: 'Padel', emoji: '🎾', players: '12.5k', courts: 45, color: 'bg-blue-50' },
    { id: 'beachtennis', name: 'Beach Tennis', emoji: '🏖️', players: '8.3k', courts: 32, color: 'bg-orange-50' },
    { id: 'football', name: 'Futebol', emoji: '⚽', players: '45k', courts: 120, color: 'bg-green-50' },
    { id: 'volleyball', name: 'Vôlei', emoji: '🏐', players: '9.8k', courts: 28, color: 'bg-yellow-50' },
    { id: 'basketball', name: 'Basquete', emoji: '🏀', players: '5.2k', courts: 15, color: 'bg-red-50' },
    { id: 'tennis', name: 'Tênis', emoji: '🎾', players: '15k', courts: 50, color: 'bg-emerald-50' },
    { id: 'handball', name: 'Handebol', emoji: '🤾', players: '2.1k', courts: 8, color: 'bg-purple-50' },
    { id: 'futevolei', name: 'Futevôlei', emoji: '⚽', players: '6.4k', courts: 18, color: 'bg-amber-50' },
    { id: 'pickleball', name: 'Pickleball', emoji: '🏓', players: '1.2k', courts: 5, color: 'bg-cyan-50' },
    { id: 'squash', name: 'Squash', emoji: '⚫', players: '800', courts: 4, color: 'bg-slate-50' },
];

const { width } = Dimensions.get('window');
const COLUMN_WIDTH = (width - 40 - 16) / 2; // 20px padding x2, 16px gap

export default function AllSportsScreen() {
    const router = useRouter();
    const [search, setSearch] = useState('');

    const filteredSports = SPORTS.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <View className="flex-1 bg-[#F8FAFC]">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-5 pb-4 bg-white z-10 border-b border-gray-100">
                    <View className="flex-row items-center justify-between mb-4">
                        <Pressable
                            onPress={() => router.back()}
                            className="w-10 h-10 bg-white border border-gray-100 rounded-full items-center justify-center shadow-sm"
                        >
                            <ArrowLeft size={20} color="#1E293B" />
                        </Pressable>
                        <Text className="text-lg font-bold text-slate-900">Todos os Esportes</Text>
                        <View className="w-10" />
                    </View>

                    {/* Search */}
                    <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
                        <Search size={20} color="#94A3B8" />
                        <TextInput
                            className="flex-1 ml-3 text-base text-slate-900"
                            placeholder="Buscar modalidade..."
                            placeholderTextColor="#94A3B8"
                            value={search}
                            onChangeText={setSearch}
                        />
                    </View>
                </View>

                {/* Grid */}
                <ScrollView
                    contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View className="flex-row flex-wrap gap-4">
                        {filteredSports.map((sport, index) => (
                            <Animated.View
                                key={sport.id}
                                entering={FadeInDown.delay(index * 50).springify()}
                                style={{ width: COLUMN_WIDTH }}
                            >
                                <Pressable
                                    className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm items-center justify-between h-40 active:opacity-90 active:scale-95 transition-all"
                                    onPress={() => console.log('Selected', sport.name)}
                                >
                                    <View className={`w-14 h-14 rounded-full ${sport.color} items-center justify-center mb-3`}>
                                        <Text className="text-2xl">{sport.emoji}</Text>
                                    </View>

                                    <View className="items-center">
                                        <Text className="font-bold text-slate-900 text-base mb-1">{sport.name}</Text>
                                        <Text className="text-xs text-gray-500 font-medium">
                                            {sport.players} jogadores
                                        </Text>
                                    </View>
                                </Pressable>
                            </Animated.View>
                        ))}
                    </View>

                    {filteredSports.length === 0 && (
                        <View className="items-center justify-center py-20">
                            <Text className="text-slate-400 font-medium">Nenhum esporte encontrado</Text>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        </View>
    );
}
