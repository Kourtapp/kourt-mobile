import { View, Text, ScrollView, Pressable, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { useMatchStore } from '@/stores/useMatchStore';
import { useCourts } from '@/hooks/useCourts';
import { createMatch } from '@/services/matches';

const sports = [
    { id: 'beach-tennis', name: 'Beach Tennis', icon: 'sports-tennis' },
    { id: 'padel', name: 'Padel', icon: 'sports-tennis' },
    { id: 'football', name: 'Futebol', icon: 'sports-soccer' },
    { id: 'tennis', name: 'Tênis', icon: 'sports-tennis' },
    { id: 'basketball', name: 'Basquete', icon: 'sports-basketball' },
    { id: 'volleyball', name: 'Vôlei', icon: 'sports-volleyball' },
];

export default function CreateMatchScreen() {
    const { bookingId } = useLocalSearchParams();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const { courts } = useCourts();

    const {
        selectedSport,
        selectedCourt,
        selectedDate,
        selectedTime,
        isPublic,
        maxPlayers,
        skillLevel,
        title,
        description,
        setSport,
        setCourt,
        setDate,
        setTime,
        setIsPublic,
        setMaxPlayers,
        setSkillLevel,
        setTitle,
        setDescription,
        resetMatch,
    } = useMatchStore();

    const handleNext = () => {
        if (step < 4) {
            setStep(step + 1);
        } else {
            handleCreate();
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            router.back();
        }
    };

    const handleCreate = async () => {
        setLoading(true);

        try {
            // Mock creation for now
            const mockMatch = {
                id: `match-${Date.now()}`,
                sport: selectedSport,
                court_id: selectedCourt?.id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                start_time: selectedTime,
                is_public: isPublic,
                max_players: maxPlayers,
                skill_level: skillLevel,
                title: title || `${selectedSport} - ${format(selectedDate, 'dd/MM')}`,
                description,
                status: 'open',
                created_by: 'mock-user-id',
            };

            // const match = await createMatch(mockMatch);

            Alert.alert(
                'Partida Criada!',
                'Sua partida foi criada com sucesso.',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            resetMatch();
                            router.replace('/(tabs)');
                        }
                    }
                ]
            );
        } catch (error: any) {
            Alert.alert('Erro', error.message || 'Erro ao criar partida');
        } finally {
            setLoading(false);
        }
    };

    const canProceed = () => {
        switch (step) {
            case 1: return !!selectedSport;
            case 2: return !!selectedCourt && !!selectedTime;
            case 3: return maxPlayers >= 2;
            case 4: return true;
            default: return false;
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* Header */}
            <View className="px-5 pt-14 pb-4 flex-row items-center justify-between border-b border-neutral-100">
                <Pressable onPress={handleBack} className="w-10 h-10 items-center justify-center">
                    <MaterialIcons name="arrow-back" size={24} color="#000" />
                </Pressable>
                <Text className="text-lg font-bold text-black">Criar Partida</Text>
                <Text className="text-sm text-neutral-500">{step}/4</Text>
            </View>

            {/* Progress Bar */}
            <View className="px-5 py-3">
                <View className="h-1 bg-neutral-200 rounded-full overflow-hidden">
                    <View
                        className="h-full bg-black rounded-full"
                        style={{ width: `${(step / 4) * 100}%` }}
                    />
                </View>
            </View>

            <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
                {/* Step 1: Esporte */}
                {step === 1 && (
                    <View>
                        <Text className="text-xl font-bold text-black mb-6">
                            Qual esporte?
                        </Text>
                        <View className="flex-row flex-wrap gap-3">
                            {sports.map((sport) => (
                                <Pressable
                                    key={sport.id}
                                    onPress={() => setSport(sport.id)}
                                    className={`w-[48%] p-4 rounded-2xl border-2 ${selectedSport === sport.id
                                        ? 'bg-black border-black'
                                        : 'bg-white border-neutral-200'
                                        }`}
                                >
                                    <MaterialIcons
                                        name={sport.icon as any}
                                        size={32}
                                        color={selectedSport === sport.id ? '#FFF' : '#000'}
                                    />
                                    <Text
                                        className={`mt-2 font-semibold ${selectedSport === sport.id ? 'text-white' : 'text-black'
                                            }`}
                                    >
                                        {sport.name}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 2: Local e Data */}
                {step === 2 && (
                    <View>
                        <Text className="text-xl font-bold text-black mb-6">
                            Onde e quando?
                        </Text>

                        {/* Busca de quadra */}
                        <Pressable
                            onPress={() => Alert.alert('Em breve', 'Busca de quadras em desenvolvimento')}
                            className="flex-row items-center bg-neutral-100 rounded-xl px-4 py-3.5 mb-4"
                        >
                            <MaterialIcons name="search" size={20} color="#737373" />
                            <Text className="ml-2 text-neutral-500">Buscar quadra</Text>
                        </Pressable>

                        {/* Lista de quadras sugeridas */}
                        <Text className="text-sm text-neutral-500 mb-3">Ou selecione:</Text>
                        {courts.slice(0, 3).map((court: any) => (
                            <Pressable
                                key={court.id}
                                onPress={() => setCourt(court as any)}
                                className={`flex-row items-center p-3 rounded-xl mb-2 border ${selectedCourt?.id === court.id
                                    ? 'bg-neutral-50 border-black'
                                    : 'bg-white border-neutral-200'
                                    }`}
                            >
                                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${selectedCourt?.id === court.id ? 'border-black' : 'border-neutral-300'
                                    }`}>
                                    {selectedCourt?.id === court.id && (
                                        <View className="w-3 h-3 rounded-full bg-black" />
                                    )}
                                </View>
                                <View className="flex-1 ml-3">
                                    <Text className="font-semibold text-black">{court.name}</Text>
                                    <Text className="text-xs text-neutral-500">
                                        {court.distance} · {court.price ? `R$ ${court.price}/h` : 'Gratuita'}
                                    </Text>
                                </View>
                            </Pressable>
                        ))}

                        {/* Data */}
                        <Text className="text-base font-bold text-black mt-6 mb-3">Data</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
                                const date = addDays(new Date(), offset);
                                const isSelected = format(selectedDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
                                return (
                                    <Pressable
                                        key={offset}
                                        onPress={() => setDate(date)}
                                        className={`px-4 py-3 rounded-xl mr-2 ${isSelected ? 'bg-black' : 'bg-neutral-100'
                                            }`}
                                    >
                                        <Text className={`text-xs ${isSelected ? 'text-white/70' : 'text-neutral-500'}`}>
                                            {offset === 0 ? 'Hoje' : offset === 1 ? 'Amanhã' : format(date, 'EEE', { locale: ptBR })}
                                        </Text>
                                        <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-black'}`}>
                                            {format(date, 'd')}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        {/* Horário */}
                        <Text className="text-base font-bold text-black mt-6 mb-3">Horário</Text>
                        <View className="flex-row flex-wrap gap-2">
                            {['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'].map((time) => (
                                <Pressable
                                    key={time}
                                    onPress={() => setTime(time)}
                                    className={`px-4 py-3 rounded-xl ${selectedTime === time ? 'bg-black' : 'bg-neutral-100'
                                        }`}
                                >
                                    <Text className={`text-sm font-medium ${selectedTime === time ? 'text-white' : 'text-black'
                                        }`}>
                                        {time}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 3: Jogadores */}
                {step === 3 && (
                    <View>
                        <Text className="text-xl font-bold text-black mb-6">
                            Quantos jogadores?
                        </Text>

                        {/* Tipo de partida */}
                        <Text className="text-base font-bold text-black mb-3">Tipo de partida</Text>
                        <View className="flex-row gap-3 mb-6">
                            <Pressable
                                onPress={() => setIsPublic(true)}
                                className={`flex-1 p-4 rounded-2xl border-2 ${isPublic ? 'bg-black border-black' : 'bg-white border-neutral-200'
                                    }`}
                            >
                                <MaterialIcons name="public" size={24} color={isPublic ? '#FFF' : '#000'} />
                                <Text className={`mt-2 font-semibold ${isPublic ? 'text-white' : 'text-black'}`}>
                                    Pública
                                </Text>
                                <Text className={`text-xs mt-1 ${isPublic ? 'text-white/70' : 'text-neutral-500'}`}>
                                    Qualquer um pode entrar
                                </Text>
                            </Pressable>

                            <Pressable
                                onPress={() => setIsPublic(false)}
                                className={`flex-1 p-4 rounded-2xl border-2 ${!isPublic ? 'bg-black border-black' : 'bg-white border-neutral-200'
                                    }`}
                            >
                                <MaterialIcons name="lock" size={24} color={!isPublic ? '#FFF' : '#000'} />
                                <Text className={`mt-2 font-semibold ${!isPublic ? 'text-white' : 'text-black'}`}>
                                    Privada
                                </Text>
                                <Text className={`text-xs mt-1 ${!isPublic ? 'text-white/70' : 'text-neutral-500'}`}>
                                    Apenas convidados
                                </Text>
                            </Pressable>
                        </View>

                        {/* Número de jogadores */}
                        <Text className="text-base font-bold text-black mb-3">Número de jogadores</Text>
                        <View className="flex-row gap-2 mb-6">
                            {[2, 4, 6, 8, 10].map((num) => (
                                <Pressable
                                    key={num}
                                    onPress={() => setMaxPlayers(num)}
                                    className={`w-12 h-12 rounded-xl items-center justify-center ${maxPlayers === num ? 'bg-black' : 'bg-neutral-100'
                                        }`}
                                >
                                    <Text className={`font-bold ${maxPlayers === num ? 'text-white' : 'text-black'}`}>
                                        {num}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        {/* Nível de habilidade */}
                        <Text className="text-base font-bold text-black mb-3">Nível de habilidade</Text>
                        <View className="flex-row gap-2 flex-wrap">
                            {[
                                { id: 'all', label: 'Todos' },
                                { id: 'beginner', label: 'Iniciante' },
                                { id: 'intermediate', label: 'Intermed.' },
                                { id: 'advanced', label: 'Avançado' },
                            ].map((level) => (
                                <Pressable
                                    key={level.id}
                                    onPress={() => setSkillLevel(level.id)}
                                    className={`px-4 py-2.5 rounded-full ${skillLevel === level.id ? 'bg-black' : 'bg-neutral-100'
                                        }`}
                                >
                                    <Text className={`text-sm font-medium ${skillLevel === level.id ? 'text-white' : 'text-black'
                                        }`}>
                                        {level.label}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                )}

                {/* Step 4: Confirmar */}
                {step === 4 && (
                    <View>
                        <Text className="text-xl font-bold text-black mb-6">
                            Confirme os detalhes
                        </Text>

                        {/* Resumo */}
                        <View className="bg-neutral-50 border border-neutral-200 rounded-2xl p-4 mb-6">
                            <View className="flex-row items-center gap-2 mb-3">
                                <MaterialIcons name="sports-tennis" size={20} color="#000" />
                                <Text className="font-bold text-black">
                                    {sports.find(s => s.id === selectedSport)?.name}
                                </Text>
                            </View>

                            <View className="space-y-2">
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="location-on" size={16} color="#737373" />
                                    <Text className="text-sm text-neutral-600">{selectedCourt?.name}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="event" size={16} color="#737373" />
                                    <Text className="text-sm text-neutral-600">
                                        {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
                                    </Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="schedule" size={16} color="#737373" />
                                    <Text className="text-sm text-neutral-600">{selectedTime}</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name="group" size={16} color="#737373" />
                                    <Text className="text-sm text-neutral-600">{maxPlayers} jogadores (1/{maxPlayers})</Text>
                                </View>
                                <View className="flex-row items-center gap-2">
                                    <MaterialIcons name={isPublic ? "public" : "lock"} size={16} color="#737373" />
                                    <Text className="text-sm text-neutral-600">
                                        Partida {isPublic ? 'pública' : 'privada'}
                                    </Text>
                                </View>
                            </View>
                        </View>

                        {/* Título */}
                        <Text className="text-sm font-medium text-neutral-500 mb-2">
                            Título (opcional)
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Ex: Beach Tennis com amigos"
                            className="bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black mb-4"
                            placeholderTextColor="#A3A3A3"
                        />

                        {/* Descrição */}
                        <Text className="text-sm font-medium text-neutral-500 mb-2">
                            Descrição (opcional)
                        </Text>
                        <TextInput
                            value={description}
                            onChangeText={setDescription}
                            placeholder="Adicione mais detalhes sobre a partida..."
                            multiline
                            numberOfLines={3}
                            className="bg-neutral-100 rounded-xl px-4 py-3.5 text-sm text-black"
                            placeholderTextColor="#A3A3A3"
                            style={{ textAlignVertical: 'top' }}
                        />
                    </View>
                )}

                <View className="h-24" />
            </ScrollView>

            {/* Footer */}
            <View className="px-5 py-4 pb-8 border-t border-neutral-100">
                <Pressable
                    onPress={handleNext}
                    disabled={!canProceed() || loading}
                    className={`w-full py-4 rounded-2xl flex-row items-center justify-center gap-2 ${canProceed() && !loading ? 'bg-black' : 'bg-neutral-300'
                        }`}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFF" />
                    ) : (
                        <>
                            {step === 4 ? (
                                <>
                                    <MaterialIcons name="sports-tennis" size={20} color="#FFF" />
                                    <Text className="text-white font-semibold text-[15px]">
                                        Criar Partida
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Text className="text-white font-semibold text-[15px]">
                                        Continuar
                                    </Text>
                                    <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
                                </>
                            )}
                        </>
                    )}
                </Pressable>
            </View>
        </View>
    );
}
