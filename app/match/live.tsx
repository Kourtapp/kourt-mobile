import { View, Text, Pressable, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronDown, LocateFixed, Utensils, Play, Pause, UserPlus, Video, Check, Flag, Search } from 'lucide-react-native';
import { SPORTS } from '../../constants/sports';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { supabase } from '../../lib/supabase';



export default function LiveMatchScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const [isPlaying, setIsPlaying] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [scoreA, setScoreA] = useState(0);
    const [scoreB, setScoreB] = useState(0);
    const [sets, setSets] = useState(0);
    const [showFinishModal, setShowFinishModal] = useState(false);
    const [isSatellite, setIsSatellite] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Sport Selection State
    const [selectedSport, setSelectedSport] = useState(SPORTS[0]);
    const [showSportSelector, setShowSportSelector] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Save match result
    const saveAndFinish = async () => {
        setIsSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                Alert.alert('Erro', 'Você precisa estar logado');
                return;
            }

            // Create a quick match record with the results
            const { error } = await supabase
                .from('matches')
                .insert({
                    organizer_id: user.id,
                    sport: selectedSport.name,
                    title: `Partida de ${selectedSport.name}`,
                    date: new Date().toISOString().split('T')[0],
                    start_time: new Date().toISOString(),
                    max_players: 4,
                    status: 'completed',
                    score_final: `${scoreA}-${scoreB}`,
                    score: {
                        teamA: scoreA,
                        teamB: scoreB,
                        sets: sets,
                        duration: seconds,
                    },
                    winner_team: scoreA > scoreB ? 1 : 2,
                } as any)
                .select()
                .single();

            if (error) throw error;

            // Update user stats
            const userWon = scoreA > scoreB;
            const { data: profile } = await supabase
                .from('profiles')
                .select('wins, losses, matches_played, xp')
                .eq('id', user.id)
                .single();

            if (profile) {
                await (supabase
                    .from('profiles') as any)
                    .update({
                        wins: userWon ? ((profile as any).wins || 0) + 1 : (profile as any).wins || 0,
                        losses: !userWon ? ((profile as any).losses || 0) + 1 : (profile as any).losses || 0,
                        matches_played: ((profile as any).matches_played || 0) + 1,
                        xp: ((profile as any).xp || 0) + (userWon ? 25 : 15),
                    })
                    .eq('id', user.id);
            }

            Alert.alert(
                'Partida Salva! 🏆',
                `Resultado: ${scoreA} x ${scoreB}\n+${userWon ? 25 : 15} XP`,
                [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
            );
        } catch (error: any) {
            console.error('[LiveMatch] Save error:', error);
            Alert.alert('Erro', 'Não foi possível salvar a partida');
        } finally {
            setIsSaving(false);
            setShowFinishModal(false);
        }
    };

    const filteredSports = SPORTS.filter(sport =>
        sport.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handlePoint = (team: 'A' | 'B') => {
        if (team === 'A') setScoreA(s => s + 1);
        else setScoreB(s => s + 1);
    };

    const handleEndSet = () => {
        setSets(s => s + 1);
        setScoreA(0);
        setScoreB(0);
    };

    // Timer Logic
    useEffect(() => {
        let interval: any;
        if (isPlaying) {
            interval = setInterval(() => {
                setSeconds(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying]);

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Helper to render current sport icon
    const SportIcon = selectedSport.icon;

    return (
        <View className={`flex-1 ${isSatellite ? 'bg-[#0F172A]' : 'bg-[#ECFDF5]'}`}>
            {/* Full Screen Map Mock - Color changes based on mode */}

            {/* Court Visual Mock (Center) */}
            <View className="absolute top-[25%] left-0 right-0 items-center justify-center opacity-80">
                {/* Simplified Court Representation */}
                <View className="w-[280px] h-[160px] border-4 border-white bg-[#FDE047] rounded-lg -rotate-6 transform skew-x-12 shadow-lg relative overflow-hidden">
                    {/* Court Lines */}
                    <View className="absolute top-[50%] w-full h-1 bg-white opacity-60" />
                    <View className="absolute left-[50%] h-full w-1 bg-white opacity-60" />
                </View>

                {/* Dots / Markers */}
                <View className="absolute -top-10 flex-row gap-20">
                    <View className="w-4 h-4 rounded-full bg-black border-2 border-white" />
                    <View className="w-4 h-4 rounded-full bg-black border-2 border-white" />
                </View>
                <View className="absolute -bottom-10 flex-row gap-40">
                    <View className="w-4 h-4 rounded-full bg-[#3B82F6] border-2 border-white" />
                    <View className="w-4 h-4 rounded-full bg-[#3B82F6] border-2 border-white" />
                </View>
            </View>

            {/* Floating Top Controls */}
            <View style={{ paddingTop: insets.top + 10 }} className="px-5 flex-row justify-between z-10">
                {/* Back Button */}
                <Pressable
                    onPress={() => router.back()}
                    className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm"
                >
                    <ChevronDown size={24} color="#000" />
                </Pressable>

                {/* Map Layers */}
                <View className="items-end gap-3 opacity-90">
                    <View className="flex-row items-center gap-2">
                        <View className="bg-[#374151] px-3 py-1.5 rounded-lg">
                            <Text className="text-white text-[10px] font-bold">Global Heatmap</Text>
                        </View>
                        <View className="w-10 h-10 bg-[#FB923C] rounded-full shadow-sm border-2 border-white" />
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className="bg-[#374151] px-3 py-1.5 rounded-lg">
                            <Text className="text-white text-[10px] font-bold">Weekly Heatmap</Text>
                        </View>
                        <View className="w-10 h-10 bg-[#2DD4BF] rounded-full shadow-sm border-2 border-white items-center justify-center">
                            {/* Lock Icon Mock */}
                            <View className="w-3 h-4 border border-white rounded-t-sm" />
                        </View>
                    </View>
                    <View className="flex-row items-center gap-2">
                        <View className="bg-[#374151] px-3 py-1.5 rounded-lg">
                            <Text className="text-white text-[10px] font-bold">Points of Interest</Text>
                        </View>
                        <View className="w-10 h-10 bg-black rounded-full shadow-sm border-2 border-white items-center justify-center">
                            <Utensils size={16} color="#FFF" />
                        </View>
                    </View>
                </View>
            </View>

            {/* Right Side Floating Buttons */}
            <View className="absolute right-5 top-[40%] gap-4">
                <Pressable
                    onPress={() => setIsSatellite(!isSatellite)}
                    className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm active:opacity-80"
                >
                    <Text className="font-bold text-black text-xs">{isSatellite ? '2D' : '3D'}</Text>
                </Pressable>
                <View className="w-12 h-12 bg-white rounded-full items-center justify-center shadow-sm">
                    <LocateFixed size={20} color="#000" />
                </View>
            </View>


            {/* Bottom Sheet Control Panel */}
            <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[32px] shadow-[0_-5px_20px_rgba(0,0,0,0.1)] pb-10">
                {/* Drag Handle */}
                <View className="items-center pt-3 pb-2">
                    <View className="w-10 h-1 bg-gray-300 rounded-full" />
                </View>

                {/* Header */}
                <View className="px-6 flex-row items-center justify-between mb-6">
                    <Text className="text-xl font-bold text-black">{selectedSport.name}</Text>
                    <Pressable
                        onPress={() => setShowFinishModal(true)}
                        className="bg-black px-4 py-1.5 rounded-full"
                    >
                        <Text className="text-white font-bold text-xs">Finalizar</Text>
                    </Pressable>
                </View>

                {/* Stats Grid */}
                <View className="flex-row justify-between px-10 mb-8">
                    <View className="items-center">
                        <Text className="text-3xl font-extrabold text-black font-mono tracking-tighter">
                            {formatTime(seconds)}
                        </Text>
                        <Text className="text-gray-400 text-xs font-bold uppercase mt-1">Tempo</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-3xl font-extrabold text-black font-mono tracking-tighter">{scoreA}-{scoreB}</Text>
                        <Text className="text-gray-400 text-xs font-bold uppercase mt-1">Placar</Text>
                    </View>
                    <View className="items-center">
                        <Text className="text-3xl font-extrabold text-black font-mono tracking-tighter">{sets}</Text>
                        <Text className="text-gray-400 text-xs font-bold uppercase mt-1">Sets</Text>
                    </View>
                </View>

                {/* Controls Row - Updated to 4 items */}
                <View className="flex-row items-center justify-between px-8 mb-6">
                    {/* 1. Sport Icon */}
                    <Pressable
                        onPress={() => setShowSportSelector(true)}
                        className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center"
                    >
                        <SportIcon size={24} color="#000" />
                        <View className="absolute top-0 right-0 bg-black w-4 h-4 rounded-full items-center justify-center border border-white">
                            <Check size={10} color="#FFF" />
                        </View>
                    </Pressable>

                    {/* 2. Main Play Button */}
                    <Pressable
                        onPress={() => setIsPlaying(!isPlaying)}
                        className="w-20 h-20 bg-black rounded-full items-center justify-center shadow-lg active:scale-95"
                    >
                        {isPlaying ? (
                            <Pause size={32} color="#FFF" fill="#FFF" />
                        ) : (
                            <Play size={32} color="#FFF" fill="#FFF" style={{ marginLeft: 4 }} />
                        )}
                    </Pressable>

                    {/* 3. Players */}
                    <Pressable className="w-14 h-14 bg-gray-100 rounded-full items-center justify-center">
                        <UserPlus size={24} color="#000" />
                    </Pressable>

                    {/* 4. Record/Video (New) */}
                    <Pressable className="w-14 h-14 bg-red-50 rounded-full items-center justify-center">
                        <Video size={24} color="#ef4444" />
                    </Pressable>
                </View>

                {/* Scoring Controls - Visible when Playing */}
                {isPlaying && (
                    <Animated.View
                        entering={FadeInDown.springify()}
                        className="px-5 gap-3"
                    >
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={() => handlePoint('A')}
                                className="flex-1 bg-[#2563EB] h-12 rounded-xl items-center justify-center active:opacity-90"
                            >
                                <Text className="text-white font-bold text-sm">+1 Time A</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => handlePoint('B')}
                                className="flex-1 bg-[#2563EB] h-12 rounded-xl items-center justify-center active:opacity-90"
                            >
                                <Text className="text-white font-bold text-sm">+1 Time B</Text>
                            </Pressable>
                        </View>
                        <View className="flex-row gap-3">
                            <Pressable
                                onPress={handleEndSet}
                                className="flex-1 bg-gray-100 h-12 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
                            >
                                <Flag size={16} color="#374151" />
                                <Text className="text-gray-700 font-bold text-sm">Fim do Set</Text>
                            </Pressable>
                            <Pressable
                                onPress={() => setShowFinishModal(true)}
                                className="flex-1 bg-red-50 h-12 rounded-xl flex-row items-center justify-center gap-2 active:opacity-90"
                            >
                                <View className="w-3 h-3 bg-red-500 rounded-sm" />
                                <Text className="text-red-500 font-bold text-sm">Encerrar</Text>
                            </Pressable>
                        </View>
                    </Animated.View>
                )}

                {/* Labels Row (Optional, maybe skip for cleaner look as per screenshot) */}
                <View className="flex-row justify-between px-10 mt-2">
                    <Text className="text-[10px] font-bold text-transparent">.</Text>
                    <Text className="text-sm font-bold text-black">{isPlaying ? 'Pausar' : 'Iniciar'}</Text>
                    <Text className="text-[10px] font-bold text-transparent">.</Text>
                </View>

                {/* Sport Selector Modal */}
                {showSportSelector && (
                    <View className="absolute inset-0 z-50 justify-end bg-black/50">
                        <Pressable className="flex-1" onPress={() => setShowSportSelector(false)} />
                        <Animated.View
                            entering={FadeInDown.springify()}
                            className="bg-white rounded-t-[32px] p-6 pb-12"
                        >
                            <View className="items-center mb-6">
                                <View className="w-12 h-1.5 bg-gray-200 rounded-full" />
                            </View>

                            <Text className="text-xl font-bold text-black mb-4 px-2">Escolha o Esporte</Text>

                            {/* Search Bar */}
                            <View className="flex-row items-center bg-gray-100 rounded-xl px-4 h-12 mb-6">
                                <Search size={20} color="#9CA3AF" />
                                <TextInput
                                    placeholder="Buscar esporte..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    className="flex-1 ml-3 text-base text-black"
                                    placeholderTextColor="#9CA3AF"
                                />
                            </View>

                            <View className="flex-row flex-wrap gap-4 justify-between">
                                {filteredSports.map((sport) => {
                                    const Icon = sport.icon;
                                    const isSelected = selectedSport.id === sport.id;
                                    return (
                                        <Pressable
                                            key={sport.id}
                                            onPress={() => {
                                                setSelectedSport(sport);
                                                setShowSportSelector(false);
                                                setSearchQuery('');
                                            }}
                                            className={`w-[30%] aspect-square rounded-2xl items-center justify-center border-2 ${isSelected ? 'border-black bg-gray-50' : 'border-transparent bg-gray-50'}`}
                                        >
                                            <View className={`w-12 h-12 rounded-full items-center justify-center mb-2`} style={{ backgroundColor: sport.color + '20' }}>
                                                <Icon size={24} color={sport.color} />
                                            </View>
                                            <Text className="text-xs font-bold text-gray-900 text-center">{sport.name}</Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </Animated.View>
                    </View>
                )}

                {/* Confirmation Modal Overlay */}
                {showFinishModal && (
                    <View className="absolute inset-0 z-50 items-center justify-center bg-transparent">
                        {/* We can't easily overlay 'absolute' here if the view is clipped. 
                             Ideally this should be a Modal component or top-level absolute. 
                             For now, let's render it absolutely positioned within this bottom sheet container 
                             but with a high elevation or just use a conditional rendering replacing the content?
                             Actually, looking at the screenshot, it looks like a clean floating card.
                             Let's place it absolutely over the stats area.
                         */}
                        <Animated.View
                            entering={FadeInUp.springify()}
                            className="bg-white p-6 rounded-3xl shadow-xl border border-gray-100 w-[90%]"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 20, elevation: 10 }}
                        >
                            <Text className="text-lg font-bold text-black mb-1">Finalizar Partida</Text>
                            <Text className="text-gray-500 mb-6">
                                {scoreA > scoreB ? 'Time A venceu!' : scoreB > scoreA ? 'Time B venceu!' : 'Empate!'} Confirmar?
                            </Text>

                            <View className="flex-row gap-3">
                                <Pressable
                                    onPress={() => setShowFinishModal(false)}
                                    disabled={isSaving}
                                    className="flex-1 bg-gray-200 h-11 rounded-full items-center justify-center"
                                >
                                    <Text className="font-bold text-black">Cancelar</Text>
                                </Pressable>
                                <Pressable
                                    onPress={saveAndFinish}
                                    disabled={isSaving}
                                    className={`flex-1 h-11 rounded-full items-center justify-center ${isSaving ? 'bg-gray-400' : 'bg-[#ef4444]'}`}
                                >
                                    <Text className="font-bold text-white">
                                        {isSaving ? 'Salvando...' : 'Confirmar'}
                                    </Text>
                                </Pressable>
                            </View>
                        </Animated.View>
                    </View>
                )}
            </View>
        </View>
    );
}
