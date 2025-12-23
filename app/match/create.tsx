import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Image } from 'react-native';
import { useRouter } from 'expo-router';
import {
    X,
    Trophy,
    Search,
    Check,
    Plus,
    Minus,
    Globe,
    Lock,
    Clock,
    Calendar,
    MapPin,
    ChevronLeft,
    ChevronRight,
    Star
} from 'lucide-react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useMatchStore } from '../../stores/useMatchStore';
import { useAuthStore } from '../../stores/authStore';
import { useCourts } from '../../hooks/useCourts';

// 3D Icons (using try/catch or requiring images)
// We assume images are at assets/images/sports/
const ICONS = {
    'beach-tennis': require('../../assets/images/sports/beach-tennis.png'),
    'padel': require('../../assets/images/sports/padel.png'),
    'football': require('../../assets/images/sports/football.png'), // Will need to ensure this exists or fallback
    'tennis': require('../../assets/images/sports/tennis.png'),
    'volleyball': require('../../assets/images/sports/volleyball.png'),
};

const STEPS = [
    { id: 'sport', title: 'Qual é o jogo?' },
    { id: 'location', title: 'Onde vai ser?' },
    { id: 'datetime', title: 'Quando?' },
    { id: 'details', title: 'Detalhes da partida' },
    { id: 'review', title: 'Revisão' },
];

const SPORTS = [
    { id: 'beach-tennis', name: 'Beach Tennis' },
    { id: 'padel', name: 'Padel' },
    { id: 'football', name: 'Futebol' },
    { id: 'tennis', name: 'Tênis' },
    { id: 'volleyball', name: 'Vôlei' },
];

export default function CreateMatchScreen() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(false);

    // Stores
    const { courts } = useCourts();
    const { session } = useAuthStore();
    const {
        matchType, selectedSport, selectedCourt, selectedDate, selectedTime,
        duration, isPublic, maxPlayers, skillLevel,
        setMatchType, setSport, setCourt, setDuration,
        setIsPublic, setMaxPlayers, setSkillLevel, createMatch
    } = useMatchStore();

    // Refs for scrolling if needed
    const scrollViewRef = useRef<ScrollView>(null);

    // Initial Defaults
    useEffect(() => {
        if (!selectedSport) setSport('beach-tennis');
        if (!selectedCourt && courts.length > 0) setCourt(courts[0] as any);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handlers
    const handleNext = async () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            // Finish
            await handleCreate();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        } else {
            router.back();
        }
    };

    const handleCreate = async () => {
        if (!session?.user) return;
        setLoading(true);
        const result = await createMatch(session.user.id);
        setLoading(false);

        if (result.success) {
            router.push('/match/invite');
        } else {
            console.error(result.error);
            // Alert.alert("Erro", "Não foi possível criar a partida.");
        }
    };

    // --- Render Steps ---

    const renderStep1_Sport = () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className="text-xl font-bold text-slate-900 mb-6">Escolha a modalidade</Text>

            <View className="flex-row flex-wrap gap-3 mb-8">
                {SPORTS.map((sport) => {
                    const isSelected = selectedSport === sport.id;
                    const iconSource = ICONS[sport.id as keyof typeof ICONS];

                    return (
                        <Pressable
                            key={sport.id}
                            onPress={() => setSport(sport.id)}
                            className={`w-[48%] aspect-square rounded-3xl p-4 justify-between border-2 transition-all ${isSelected ? 'bg-[#1E293B] border-[#1E293B]' : 'bg-white border-slate-100'}`}
                        >
                            <View className="flex-1 items-center justify-center">
                                {iconSource ? (
                                    <View className="bg-white rounded-2xl p-1 overflow-hidden" style={{ elevation: 2 }}>
                                        <Image source={iconSource} className="w-16 h-16 rounded-xl" resizeMode="contain" />
                                    </View>
                                ) : (
                                    <Text className="text-3xl">⚽</Text>
                                )}
                            </View>
                            <View>
                                <Text className={`font-bold text-base text-center leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                    {sport.name}
                                </Text>
                            </View>
                            {isSelected && (
                                <View className="absolute top-3 right-3 bg-green-500 w-6 h-6 rounded-full items-center justify-center">
                                    <Check size={14} color="#FFF" strokeWidth={3} />
                                </View>
                            )}
                        </Pressable>
                    )
                })}
            </View>

            <Text className="text-xl font-bold text-slate-900 mb-4">Tipo de partida</Text>
            <View className="gap-3">
                <Pressable
                    onPress={() => setMatchType('casual')}
                    className={`p-4 rounded-xl border-2 flex-row items-center gap-4 ${matchType === 'casual' ? 'bg-slate-50 border-[#1E293B]' : 'bg-white border-slate-100'}`}
                >
                    <View className="w-12 h-12 rounded-full bg-slate-100 items-center justify-center">
                        <Search size={20} color={matchType === 'casual' ? '#1E293B' : '#64748b'} />
                    </View>
                    <View className="flex-1">
                        <Text className="font-bold text-base text-slate-900">Casual</Text>
                        <Text className="text-slate-500 text-sm">Jogo amistoso, sem valer pontos oficiais.</Text>
                    </View>
                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${matchType === 'casual' ? 'border-[#1E293B]' : 'border-slate-300'}`}>
                        {matchType === 'casual' && <View className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />}
                    </View>
                </Pressable>

                <Pressable
                    onPress={() => setMatchType('ranked')}
                    className={`p-4 rounded-xl border-2 flex-row items-center gap-4 ${matchType === 'ranked' ? 'bg-yellow-50/50 border-yellow-500' : 'bg-white border-slate-100'}`}
                >
                    <View className="w-12 h-12 rounded-full bg-yellow-100 items-center justify-center">
                        <Trophy size={20} color="#CA8A04" />
                    </View>
                    <View className="flex-1">
                        <View className="flex-row items-center gap-2">
                            <Text className="font-bold text-base text-slate-900">Ranqueada</Text>
                            <View className="bg-[#1E293B] px-1.5 rounded">
                                <Text className="text-white text-[10px] font-bold">PRO</Text>
                            </View>
                        </View>
                        <Text className="text-slate-500 text-sm">Vale pontos para o ranking e XP em dobro.</Text>
                    </View>
                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${matchType === 'ranked' ? 'border-yellow-600' : 'border-slate-300'}`}>
                        {matchType === 'ranked' && <View className="w-2.5 h-2.5 rounded-full bg-yellow-600" />}
                    </View>
                </Pressable>
            </View>
        </Animated.View>
    );

    const renderStep2_Location = () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className="text-xl font-bold text-slate-900 mb-2">Onde será o jogo?</Text>
            <Text className="text-slate-500 mb-6">Selecione uma das quadras parceiras ou adicione um local.</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-5 px-5 mb-6">
                {/* Map Placeholder */}
                <View className="w-[300px] h-[150px] bg-slate-100 rounded-2xl items-center justify-center mr-4 border border-slate-200">
                    <MapPin size={32} color="#CBD5E1" />
                    <Text className="text-slate-400 font-bold mt-2">Mapa indisponível na prévia</Text>
                </View>
            </ScrollView>

            <Text className="font-bold text-base mb-4">Quadras Próximas</Text>
            <View className="gap-4">
                {courts.map((court) => {
                    const isSelected = selectedCourt?.id === court.id;
                    return (
                        <Pressable
                            key={court.id}
                            onPress={() => setCourt(court as any)}
                            className={`flex-row p-3 rounded-2xl border-2 bg-white ${isSelected ? 'border-green-500' : 'border-slate-100'}`}
                        >
                            <Image
                                source={{ uri: court.images?.[0] || 'https://images.unsplash.com/photo-1552668693-b0c79f050ce9?q=80&w=800&auto=format&fit=crop' }}
                                className="w-24 h-24 rounded-xl bg-slate-200"
                            />
                            <View className="flex-1 ml-3 justify-center">
                                <View className="flex-row items-center justify-between">
                                    <Text className="font-bold text-base text-slate-900">{court.name}</Text>
                                    {isSelected && <Check size={18} color="#22C55E" />}
                                </View>
                                <Text className="text-slate-500 text-xs mt-1">{court.distance || '2km'} • {court.type === 'private' ? 'Particular' : 'Pública'}</Text>
                                <View className="flex-row items-center gap-1 mt-2">
                                    <Star size={12} fill="#FACC15" color="#FACC15" />
                                    <Text className="text-xs font-bold">{court.rating}</Text>
                                </View>
                            </View>
                        </Pressable>
                    )
                })}
            </View>
        </Animated.View>
    );

    const renderStep3_DateTime = () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className="text-xl font-bold text-slate-900 mb-6">Quando vai rolar?</Text>

            <View className="bg-white border border-slate-200 rounded-3xl overflow-hidden mb-6">
                <View className="p-4 border-b border-slate-100 flex-row items-center justify-between">
                    <View className="flex-1">
                        <Text className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Data</Text>
                        <Text className="text-lg font-bold">{format(selectedDate, 'EEEE, d MMMM', { locale: ptBR })}</Text>
                    </View>
                    <Calendar size={24} color="#1E293B" />
                </View>
                <View className="p-4 flex-row items-center justify-between bg-slate-50/50">
                    <View className="flex-1">
                        <Text className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Horário</Text>
                        <Text className="text-lg font-bold">{selectedTime || '18:00'}</Text>
                    </View>
                    <Clock size={24} color="#1E293B" />
                </View>
            </View>

            <Text className="font-bold text-base mb-4">Duração</Text>
            <View className="flex-row gap-3">
                {[60, 90, 120].map(mins => {
                    const isSelected = duration === mins;
                    return (
                        <Pressable
                            key={mins}
                            onPress={() => setDuration(mins)}
                            className={`flex-1 py-4 rounded-xl border-2 items-center justify-center ${isSelected ? 'bg-[#1E293B] border-[#1E293B]' : 'bg-white border-slate-200'}`}
                        >
                            <Text className={`font-bold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                                {mins === 60 ? '1h' : mins === 90 ? '1.5h' : '2h'}
                            </Text>
                        </Pressable>
                    )
                })}
            </View>
        </Animated.View>
    );

    const renderStep4_Details = () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className="text-xl font-bold text-slate-900 mb-6">Configurações da partida</Text>

            {/* Players Count */}
            <View className="mb-8">
                <View className="flex-row justify-between items-end mb-4">
                    <Text className="font-bold text-base">Jogadores</Text>
                    <Text className="text-2xl font-bold">{maxPlayers}</Text>
                </View>

                <View className="flex-row items-center justify-between bg-slate-100 p-2 rounded-2xl">
                    <Pressable onPress={() => setMaxPlayers(Math.max(2, maxPlayers - 1))} className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm">
                        <Minus size={20} color="#1E293B" />
                    </Pressable>
                    <Text className="text-slate-500 font-medium">limite de vagas</Text>
                    <Pressable onPress={() => setMaxPlayers(maxPlayers + 1)} className="w-12 h-12 bg-white rounded-xl items-center justify-center shadow-sm">
                        <Plus size={20} color="#1E293B" />
                    </Pressable>
                </View>
            </View>

            {/* Skill Level */}
            <View className="mb-8">
                <Text className="font-bold text-base mb-4">Nível sugerido</Text>
                <View className="gap-3">
                    {[
                        { id: 'beginner', label: 'Iniciante', desc: 'Aprendendo as regras e movimentos básicos.' },
                        { id: 'intermediate', label: 'Intermediário', desc: 'Já joga com consistência e controle.' },
                        { id: 'advanced', label: 'Avançado', desc: 'Domina técnica e estratégia de jogo.' }
                    ].map((level) => {
                        const isSelected = skillLevel === level.id;
                        return (
                            <Pressable
                                key={level.id}
                                onPress={() => setSkillLevel(level.id)}
                                className={`p-4 rounded-2xl border-2 flex-row items-center gap-4 ${isSelected ? 'border-[#1E293B] bg-slate-50' : 'border-slate-100 bg-white'}`}
                            >
                                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${isSelected ? 'border-[#1E293B]' : 'border-slate-300'}`}>
                                    {isSelected && <View className="w-2.5 h-2.5 rounded-full bg-[#1E293B]" />}
                                </View>
                                <View className="flex-1">
                                    <Text className="font-bold text-slate-900">{level.label}</Text>
                                    <Text className="text-slate-500 text-xs mt-0.5">{level.desc}</Text>
                                </View>
                            </Pressable>
                        )
                    })}
                </View>
            </View>

            {/* Visibility */}
            <View>
                <Text className="font-bold text-base mb-4">Privacidade</Text>
                <View className="flex-row gap-4">
                    <Pressable
                        onPress={() => setIsPublic(true)}
                        className={`flex-1 p-4 rounded-2xl border-2 items-center gap-2 ${isPublic ? 'border-[#1E293B] bg-[#1E293B]' : 'border-slate-200 bg-white'}`}
                    >
                        <Globe size={24} color={isPublic ? '#FFF' : '#1E293B'} />
                        <Text className={`font-bold ${isPublic ? 'text-white' : 'text-slate-900'}`}>Pública</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setIsPublic(false)}
                        className={`flex-1 p-4 rounded-2xl border-2 items-center gap-2 ${!isPublic ? 'border-[#1E293B] bg-[#1E293B]' : 'border-slate-200 bg-white'}`}
                    >
                        <Lock size={24} color={!isPublic ? '#FFF' : '#1E293B'} />
                        <Text className={`font-bold ${!isPublic ? 'text-white' : 'text-slate-900'}`}>Privada</Text>
                    </Pressable>
                </View>
            </View>

        </Animated.View>
    );

    const renderStep5_Review = () => (
        <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Text className="text-xl font-bold text-slate-900 mb-6">Tudo pronto?</Text>

            <View className="bg-white border boundary-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <Image
                    source={{ uri: selectedCourt?.images?.[0] || 'https://images.unsplash.com/photo-1552668693-b0c79f050ce9' }}
                    className="w-full h-48 bg-slate-200"
                />
                <View className="p-5">
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-2xl font-bold text-slate-900">{selectedCourt?.name}</Text>
                        {matchType === 'ranked' && (
                            <View className="bg-[#1E293B] px-2 py-1 h-6 rounded flex-row items-center">
                                <Trophy size={12} color="#FACC15" />
                                <Text className="text-white text-[10px] font-bold ml-1">RANKED</Text>
                            </View>
                        )}
                    </View>
                    <Text className="text-slate-500 mb-6">{SPORTS.find(s => s.id === selectedSport)?.name.toUpperCase()} • {format(selectedDate, "d 'de' MMM")} às {selectedTime}</Text>

                    <View className="gap-4">
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                                <Globe size={20} color="#1E293B" />
                            </View>
                            <View>
                                <Text className="font-bold text-slate-900">{isPublic ? 'Partida Pública' : 'Partida Privada'}</Text>
                                <Text className="text-xs text-slate-500">Qualquer um pode ver e solicitar participar.</Text>
                            </View>
                        </View>
                        <View className="flex-row items-center gap-3">
                            <View className="w-10 h-10 rounded-full bg-slate-100 items-center justify-center">
                                <Plus size={20} color="#1E293B" />
                            </View>
                            <View>
                                <Text className="font-bold text-slate-900">{maxPlayers} Jogadores</Text>
                                <Text className="text-xs text-slate-500">Nível {skillLevel === 'beginner' ? 'Iniciante' : skillLevel === 'intermediate' ? 'Intermediário' : 'Avançado'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <View className="mt-8 bg-slate-50 p-4 rounded-xl flex-row gap-3">
                <Check size={20} color="#22C55E" />
                <Text className="text-slate-600 text-sm flex-1">
                    Ao confirmar, você concorda com as regras de convivência e política de cancelamento do Kourt.
                </Text>
            </View>
        </Animated.View>
    );

    return (
        <View className="flex-1 bg-white">
            <SafeAreaView className="flex-1" edges={['top']}>
                {/* Header */}
                <View className="px-5 py-4 flex-row items-center justify-between">
                    <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center -ml-2 rounded-full active:bg-slate-100/50">
                        {currentStep === 0 ? <X size={24} color="#1E293B" /> : <ChevronLeft size={24} color="#1E293B" />}
                    </Pressable>
                    <View className="flex-1 mx-4 h-1 bg-slate-100 rounded-full overflow-hidden">
                        <Animated.View
                            className="h-full bg-green-500 rounded-full transition-all duration-500"
                            style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
                        />
                    </View>
                    {/* Placeholder for symmetry */}
                    <View className="w-10" />
                </View>

                {/* Content */}
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1"
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 120, paddingTop: 10 }}
                    showsVerticalScrollIndicator={false}
                >
                    {currentStep === 0 && renderStep1_Sport()}
                    {currentStep === 1 && renderStep2_Location()}
                    {currentStep === 2 && renderStep3_DateTime()}
                    {currentStep === 3 && renderStep4_Details()}
                    {currentStep === 4 && renderStep5_Review()}
                </ScrollView>

                {/* Sticky Footer */}
                <View
                    className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-slate-100 pb-10 shadow-lg"
                    style={{ shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 5 }}
                >
                    <View className="flex-row items-center justify-between">
                        <Pressable onPress={handleBack} disabled={currentStep === 0}>
                            <Text className={`font-bold text-base underline ${currentStep === 0 ? 'text-transparent' : 'text-slate-900'}`}>Voltar</Text>
                        </Pressable>

                        <Pressable
                            onPress={handleNext}
                            disabled={loading}
                            className={`px-8 h-14 rounded-xl flex-row items-center justify-center gap-2 ${loading ? 'bg-slate-100' : 'bg-green-500'}`}
                            style={{ minWidth: 160 }}
                        >
                            {loading ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <>
                                    <Text className="text-white font-bold text-lg">
                                        {currentStep === STEPS.length - 1 ? 'Criar Jogo' : 'Continuar'}
                                    </Text>
                                    {currentStep < STEPS.length - 1 && <ChevronRight size={20} color="#FFF" strokeWidth={2.5} />}
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
