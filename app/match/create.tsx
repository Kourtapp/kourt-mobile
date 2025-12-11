import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { X, Trophy, Search, Check, ChevronRight, Plus, Minus, Globe, Lock, Clock, Calendar, MapPin, Pencil } from 'lucide-react-native';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useMatchStore } from '@/stores/useMatchStore';
import { useCourts } from '@/hooks/useCourts';

const sports = [
    { id: 'beach-tennis', name: 'BeachTennis', icon: 'tennis' }, // Lucide doesn't have specific sports icons for everything, using generic or text
    { id: 'padel', name: 'Padel', icon: 'circle' },
    { id: 'football', name: 'Futebol', icon: 'trophy' },
    { id: 'tennis', name: 'Tênis', icon: 'activity' },
    { id: 'volleyball', name: 'Vôlei', icon: 'aperture' },
];

export default function CreateMatchScreen() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { courts } = useCourts();

    const {
        matchType,
        selectedSport,
        selectedCourt,
        selectedDate,
        selectedTime,
        duration,
        isPublic,
        maxPlayers,
        skillLevel,
        setMatchType,
        setSport,
        setCourt,
        setDate,
        setTime,
        setDuration,
        setIsPublic,
        setMaxPlayers,
        setSkillLevel,
        resetMatch,
    } = useMatchStore();

    // Default to first court if none selected (for UI demo)
    if (!selectedCourt && courts.length > 0) {
        setCourt(courts[0] as any);
    }
    // Default sport
    if (!selectedSport) {
        setSport('beach-tennis');
    }

    const handleCreate = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            // Navigate to Invite Screen
            router.push('/match/invite');
        }, 1500);
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-14 pb-4 flex-row items-center justify-between">
                <Pressable onPress={() => router.back()} className="p-2 -ml-2">
                    <X size={24} color="#000" />
                </Pressable>
                <View className="flex-row items-center gap-2">
                    <Text className="text-[17px] font-bold text-black">Criar Jogo</Text>
                </View>
                <View className="bg-black px-2 py-0.5 rounded-md">
                    <Text className="text-white text-[10px] font-bold">PRO</Text>
                </View>
            </View>

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

                {/* 1. Match Type (Casual / Ranked) */}
                <View className="px-5 mt-2">
                    <Text className="text-[15px] font-bold text-black mb-3">Tipo de partida</Text>
                    <View className="flex-row gap-3">
                        {/* Casual */}
                        <Pressable
                            className={`flex-1 p-4 rounded-2xl border-2 items-center justify-center h-[120px] ${matchType === 'casual' ? 'border-gray-200 bg-gray-50' : 'border-gray-100 bg-white'}`}
                            onPress={() => setMatchType('casual')}
                        >
                            <View className="w-10 h-10 rounded-full bg-gray-200 items-center justify-center mb-2">
                                <Search size={20} color="#666" />
                            </View>
                            <Text className="font-bold text-black text-sm">Casual</Text>
                            <Text className="text-gray-500 text-[11px] mt-0.5">Jogo informal</Text>
                        </Pressable>

                        {/* Ranked (Selected State Highlight) */}
                        <Pressable
                            className={`flex-1 p-4 rounded-2xl border-2 items-center justify-center h-[120px] ${matchType === 'ranked' ? 'border-[#FFC107] bg-[#FFFBEB]' : 'border-gray-100 bg-white'}`}
                            onPress={() => setMatchType('ranked')}
                        >
                            <View className="absolute top-3 right-3 bg-black px-1.5 py-0.5 rounded">
                                <Text className="text-white text-[9px] font-bold">PRO</Text>
                            </View>
                            <View className="w-10 h-10 rounded-full bg-black items-center justify-center mb-2">
                                <Trophy size={18} color="#FFF" />
                            </View>
                            <Text className="font-bold text-black text-sm">Ranqueada</Text>
                            <Text className="text-[#B45309] text-[11px] mt-0.5">Vale pontos XP</Text>
                        </Pressable>
                    </View>
                </View>

                {/* PRO Banner */}
                {matchType === 'ranked' && (
                    <View className="mx-5 mt-4 bg-[#FFF7ED] p-4 rounded-xl border border-[#FFEDD5]">
                        <View className="flex-row items-center gap-2 mb-2">
                            <Text className="text-[#C2410C] font-bold text-xs uppercase tracking-wide">Partida PRO Ativa</Text>
                        </View>
                        <View className="flex-row flex-wrap justify-between gap-y-2">
                            <View className="w-[48%] flex-row items-center gap-1.5">
                                <Check size={12} color="#EA580C" />
                                <Text className="text-[#9A3412] text-[11px] font-medium">3x XP por vitória</Text>
                            </View>
                            <View className="w-[48%] flex-row items-center gap-1.5">
                                <Check size={12} color="#EA580C" />
                                <Text className="text-[#9A3412] text-[11px] font-medium">Ranking PRO</Text>
                            </View>
                            <View className="w-[48%] flex-row items-center gap-1.5">
                                <Check size={12} color="#EA580C" />
                                <Text className="text-[#9A3412] text-[11px] font-medium">Estatísticas completas</Text>
                            </View>
                            <View className="w-[48%] flex-row items-center gap-1.5">
                                <Check size={12} color="#EA580C" />
                                <Text className="text-[#9A3412] text-[11px] font-medium">Análise IA</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* 2. Sport Selector */}
                <View className="mt-6">
                    <Text className="px-5 text-[15px] font-bold text-black mb-3">Qual esporte?</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
                        {sports.map((sport) => {
                            const isSelected = selectedSport === sport.id;
                            return (
                                <Pressable
                                    key={sport.id}
                                    onPress={() => setSport(sport.id)}
                                    className={`w-[100px] h-[100px] rounded-2xl items-center justify-center border-2 ${isSelected ? 'bg-black border-black' : 'bg-gray-50 border-transparent'}`}
                                >
                                    <View className="mb-2">
                                        {/* Simplified Icons for Demo */}
                                        {/* In real app, render Lucide Icon by name or SVGs */}
                                        <Text className="text-2xl">{isSelected ? '⚪️' : '⚫️'}</Text>
                                    </View>
                                    <Text className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-black'}`}>{sport.name}</Text>
                                </Pressable>
                            );
                        })}
                    </ScrollView>
                </View>

                {/* 3. Location */}
                <View className="px-5 mt-6">
                    <Text className="text-[15px] font-bold text-black mb-3">Onde vai ser?</Text>
                    <View className="bg-[#ECFDF5] border border-[#D1FAE5] p-4 rounded-2xl flex-row items-center justify-between">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-[#10B981] items-center justify-center">
                                <Check size={18} color="#FFF" />
                            </View>
                            <View>
                                <Text className="font-bold text-black text-[15px]">{selectedCourt?.name || 'Selecione a quadra'}</Text>
                                <Text className="text-gray-500 text-xs mt-0.5">{selectedSport === 'beach-tennis' ? 'BeachTennis' : 'Esporte'} · {(selectedCourt as any)?.distance || '?? km'}</Text>
                            </View>
                        </View>
                        <Pressable onPress={() => { }}>
                            <Pencil size={18} color="#9CA3AF" />
                        </Pressable>
                    </View>
                </View>

                {/* 4. Date & Time */}
                <View className="px-5 mt-6">
                    <Text className="text-[15px] font-bold text-black mb-3">Quando?</Text>
                    <View className="flex-row gap-3">
                        <View className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                            <Text className="text-gray-400 text-xs font-medium mb-2">Data</Text>
                            <View className="flex-row items-center gap-2">
                                <Calendar size={18} color="#000" />
                                <Text className="font-bold text-black text-[15px]">
                                    {format(selectedDate, 'EEE, d MMM', { locale: ptBR })}
                                </Text>
                            </View>
                        </View>
                        <View className="flex-1 bg-white border border-gray-200 rounded-2xl p-4">
                            <Text className="text-gray-400 text-xs font-medium mb-2">Horário</Text>
                            <View className="flex-row items-center gap-2">
                                <Clock size={18} color="#000" />
                                <Text className="font-bold text-black text-[15px]">{selectedTime || '18:00'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* 5. Duration */}
                <View className="px-5 mt-6">
                    <Text className="text-[15px] font-bold text-black mb-3">Duração</Text>
                    <View className="flex-row gap-2">
                        {[60, 90, 120, 150].map((d) => {
                            const label = d === 60 ? '1h' : d === 90 ? '1h30' : d === 120 ? '2h' : '2h30';
                            const isSelected = duration === d;
                            return (
                                <Pressable
                                    key={d}
                                    onPress={() => setDuration(d)}
                                    className={`flex-1 py-3 items-center justify-center rounded-xl ${isSelected ? 'bg-black' : 'bg-gray-100'}`}
                                >
                                    <Text className={`font-bold ${isSelected ? 'text-white' : 'text-black'}`}>{label}</Text>
                                </Pressable>
                            )
                        })}
                    </View>
                </View>

                {/* 6. Players */}
                <View className="px-5 mt-6">
                    <Text className="text-[15px] font-bold text-black mb-3">Quantos jogadores?</Text>
                    <View className="bg-white border border-gray-100 p-4 rounded-2xl flex-row items-center justify-between shadow-sm">
                        <View>
                            <Text className="font-bold text-black text-[15px]">Total de jogadores</Text>
                            <Text className="text-gray-400 text-xs">Incluindo você</Text>
                        </View>
                        <View className="flex-row items-center gap-4">
                            <Pressable
                                onPress={() => setMaxPlayers(Math.max(2, maxPlayers - 1))}
                                className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center"
                            >
                                <Minus size={20} color="#000" />
                            </Pressable>
                            <Text className="font-bold text-xl w-6 text-center">{maxPlayers}</Text>
                            <Pressable
                                onPress={() => setMaxPlayers(maxPlayers + 1)}
                                className="w-10 h-10 rounded-full bg-black items-center justify-center"
                            >
                                <Plus size={20} color="#FFF" />
                            </Pressable>
                        </View>
                    </View>
                </View>

                {/* 7. Skill Level */}
                <View className="px-5 mt-6">
                    <Text className="text-[15px] font-bold text-black mb-3">Nível dos jogadores</Text>
                    <View className="flex-row gap-2 bg-gray-50 p-1 rounded-xl">
                        {['beginner', 'intermediate', 'advanced'].map((level) => {
                            const labels: Record<string, string> = { beginner: 'Iniciante', intermediate: 'Intermed.', advanced: 'Avançado' };
                            const isSelected = skillLevel === level;
                            return (
                                <Pressable
                                    key={level}
                                    onPress={() => setSkillLevel(level)}
                                    className={`flex-1 py-3 items-center justify-center rounded-lg ${isSelected ? 'bg-black shadow-sm' : ''}`}
                                >
                                    <Text className={`font-bold text-[13px] ${isSelected ? 'text-white' : 'text-black'}`}>{labels[level]}</Text>
                                </Pressable>
                            )
                        })}
                    </View>
                </View>

                {/* 8. Visibility */}
                <View className="px-5 mt-6 mb-8">
                    <Text className="text-[15px] font-bold text-black mb-3">Visibilidade</Text>
                    <View className="flex-row gap-3">
                        <Pressable
                            onPress={() => setIsPublic(true)}
                            className={`flex-1 py-4 flex-row items-center justify-center gap-2 rounded-xl border ${isPublic ? 'bg-black border-black' : 'bg-gray-50 border-transparent'}`}
                        >
                            <Globe size={18} color={isPublic ? '#FFF' : '#000'} />
                            <Text className={`font-bold ${isPublic ? 'text-white' : 'text-black'}`}>Aberto</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setIsPublic(false)}
                            className={`flex-1 py-4 flex-row items-center justify-center gap-2 rounded-xl border ${!isPublic ? 'bg-black border-black' : 'bg-gray-50 border-transparent'}`}
                        >
                            <Lock size={18} color={!isPublic ? '#FFF' : '#000'} />
                            <Text className={`font-bold ${!isPublic ? 'text-white' : 'text-black'}`}>Privado</Text>
                        </Pressable>
                    </View>
                </View>

            </ScrollView>

            {/* Footer */}
            <View className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 pb-8">
                <Pressable
                    onPress={handleCreate}
                    className="w-full bg-[#84cc16] h-14 rounded-2xl flex-row items-center justify-center gap-2 shadow-sm active:opacity-90"
                >
                    {loading ? (
                        <ActivityIndicator color="#000" />
                    ) : (
                        <>
                            <Trophy size={20} color="#000" strokeWidth={2} />
                            <Text className="text-black font-bold text-[16px]">Criar Partida PRO</Text>
                        </>
                    )}
                </Pressable>
                <Text className="text-center text-gray-400 text-[10px] mt-2 font-medium">+150 XP por criar partida ranqueada</Text>
            </View>
        </View>
    );
}
